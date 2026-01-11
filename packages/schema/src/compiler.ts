import { SchemaDefinition } from './types';
import { SchemaRegistry, SchemaId, IRNode, StringOp, NumberOp } from './ir';
import { Interner } from './compiler/interner';

export function compile(schema: SchemaDefinition): SchemaRegistry {
    const interner = new Interner();
    const visited = new Map<SchemaDefinition, SchemaId>();
    const stack = new Set<SchemaDefinition>(); // For detecting structural cycles
    const MAX_DEPTH = 100;

    function visit(def: SchemaDefinition, depth = 0, viaRef = false): SchemaId {
        if (depth > MAX_DEPTH) {
            throw new Error(`Max compilation depth exceeded (${MAX_DEPTH}). Possible infinite recursion.`);
        }

        // 1. Detect Structural Cycles (Recursion without a 'ref' wrapper)
        if (stack.has(def) && !viaRef) {
            throw new Error(`Detected structural cycle in schema definition at depth ${depth}. Use s.selfRef() for intentional recursion.`);
        }

        // 2. Reuse Shared/Interned nodes (by reference)
        if (visited.has(def)) {
            return visited.get(def)!;
        }

        stack.add(def);
        try {
            // 3. Identify and handle nodes
            // For primitives, we can just intern them immediately after conversion.

            if (def.type === 'object' || def.type === 'array') {
                const id = interner.reserve();
                visited.set(def, id);
                const node = convert(def, depth + 1);
                interner.bind(id, node);
                return id;
            } else {
                const node = convert(def, depth + 1);
                const id = interner.intern(node);
                visited.set(def, id);
                return id;
            }
        } finally {
            stack.delete(def);
        }
    }

    function visitRef(targetFn: () => SchemaDefinition, depth: number): SchemaId {
        // Resolve the target
        let def: any = targetFn();

        // Handle Builder instances being returned
        if (def && typeof def.build === 'function') {
            def = def.build();
        }

        if (!def || typeof def.type === 'undefined') {
            throw new Error(`Invalid schema definition returned from ref: ${JSON.stringify(def)}`);
        }

        // Visit the resolved definition - IMPORTANT: pass viaRef = true
        return visit(def, depth, true);
    }

    function convert(def: SchemaDefinition, depth: number): IRNode {
        const optional = def.optional;
        const nullable = def.nullable;
        const common = { optional, nullable };

        switch (def.type) {
            case 'string': {
                const checks: StringOp[] = [];
                if (def.minLength !== undefined) checks.push({ kind: 'min', val: def.minLength });
                if (def.maxLength !== undefined) checks.push({ kind: 'max', val: def.maxLength });
                if (def.pattern !== undefined) checks.push({ kind: 'regex', pattern: def.pattern.source, flags: def.pattern.flags });
                return { type: 'string', checks, ...common };
            }
            case 'number': {
                const checks: NumberOp[] = [];
                if (def.min !== undefined) checks.push({ kind: 'min', val: def.min });
                if (def.max !== undefined) checks.push({ kind: 'max', val: def.max });
                if (def.integer) checks.push({ kind: 'int' });
                return { type: 'number', checks, ...common };
            }
            case 'boolean': {
                return { type: 'boolean', ...common };
            }
            case 'object': {
                const shape: Record<string, SchemaId> = {};
                let reqMask = 0;
                let idx = 0;

                // Sort keys for deterministic output
                const keys = Object.keys(def.properties).sort();

                for (const key of keys) {
                    const propDef = def.properties[key];
                    const propId = visit(propDef, depth);
                    shape[key] = propId;

                    // Bitmask calculation: if not optional, set bit
                    if (!propDef.optional) {
                        // Limit to 31 bits for safe bitwise ops in JS
                        if (idx < 31) {
                            reqMask |= (1 << idx);
                        }
                    }
                    idx++;
                }
                return { type: 'object', shape, reqMask, ...common };
            }
            case 'array': {
                const itemId = visit(def.items, depth);
                return { type: 'array', item: itemId, ...common };
            }
            case 'ref': {
                // For a RefSchema, we want to point to the implementation.
                // However, strictly speaking, IRRefNode points to another ID.
                // In our model, we can simply return a 'ref' node pointing to the target ID.
                // Or we can just inline the ID if we want transparent refs.
                // But the prompt says "References for nested schemas".
                // Let's emit an explicit recursive Reference node for clarity,
                // allows the runtime to know "this is a jump".
                const targetId = visitRef(def.target, depth);
                return { type: 'ref', target: targetId, ...common };
            }
            default:
                throw new Error(`Unknown schema type: ${(def as any).type}`);
        }
    }

    const rootId = visit(schema);
    const registry = interner.getRegistry();
    registry.root = rootId;
    return registry;
}
