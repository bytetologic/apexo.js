export type SchemaId = number;

export interface SchemaRegistry {
    // Flat list of all schema nodes, indexed by ID.
    nodes: Record<SchemaId, IRNode>;
    // entry point(s)
    root: SchemaId;
}

export type IRNode =
    | IRStringNode
    | IRNumberNode
    | IRBooleanNode
    | IRObjectNode
    | IRArrayNode
    | IRRefNode;

export interface IROptionality {
    optional?: boolean;
    nullable?: boolean;
}

export interface IRStringNode extends IROptionality {
    type: 'string';
    checks: StringOp[];
}

export interface IRNumberNode extends IROptionality {
    type: 'number';
    checks: NumberOp[];
}

export interface IRBooleanNode extends IROptionality {
    type: 'boolean';
}

export interface IRObjectNode extends IROptionality {
    type: 'object';
    // Flat map of property name -> SchemaId
    shape: Record<string, SchemaId>;
    // Bitmask of required fields (for optimization, placeholder)
    reqMask: number;
}

export interface IRArrayNode extends IROptionality {
    type: 'array';
    item: SchemaId;
}

export interface IRRefNode extends IROptionality {
    type: 'ref';
    target: SchemaId;
}

// OpCodes for localized checks
export type StringOp =
    | { kind: 'min', val: number }
    | { kind: 'max', val: number }
    | { kind: 'regex', pattern: string, flags: string };

export type NumberOp =
    | { kind: 'min', val: number }
    | { kind: 'max', val: number }
    | { kind: 'int' };
