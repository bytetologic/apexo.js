import { IRNode, SchemaId, SchemaRegistry, StringOp, NumberOp } from '../ir';

export class Interner {
    private nodes: Record<SchemaId, IRNode> = {};
    private hashes = new Map<string, SchemaId>();
    private nextId: SchemaId = 1;

    getRegistry(): SchemaRegistry {
        // Return a copy of the registry (or the live one)
        // Root not set here, caller sets it.
        return {
            nodes: this.nodes,
            root: 0
        };
    }

    intern(node: IRNode, preferredId?: SchemaId): SchemaId {
        const hash = this.computeHash(node);
        if (this.hashes.has(hash)) {
            return this.hashes.get(hash)!;
        }

        const id = preferredId ?? this.nextId++;
        this.nodes[id] = node;
        this.hashes.set(hash, id);
        return id;
    }

    // A pointer is a reservation for a node that will be defined later (recursion)
    reserve(): SchemaId {
        return this.nextId++;
    }

    // Bind a reserved ID to a concrete node and intern it structuraly
    bind(id: SchemaId, node: IRNode) {
        this.nodes[id] = node;
        const hash = this.computeHash(node);
        if (!this.hashes.has(hash)) {
            this.hashes.set(hash, id);
        }
    }

    private computeHash(node: IRNode): string {
        // Simple JSON stringify based hashing
        // keys must be sorted for stability
        return JSON.stringify(node, (key, value) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return Object.keys(value).sort().reduce((sorted, k) => {
                    sorted[k] = value[k];
                    return sorted;
                }, {} as any);
            }
            return value;
        });
    }
}
