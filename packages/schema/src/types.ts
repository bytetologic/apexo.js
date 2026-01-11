
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'ref';

export interface BaseSchema {
    type: SchemaType;
    optional?: boolean;
    nullable?: boolean;
}

export interface StringSchema extends BaseSchema {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}

export interface NumberSchema extends BaseSchema {
    type: 'number';
    min?: number;
    max?: number;
    integer?: boolean;
}

export interface BooleanSchema extends BaseSchema {
    type: 'boolean';
}

export interface ObjectSchema extends BaseSchema {
    type: 'object';
    properties: Record<string, SchemaDefinition>;
}

export interface ArraySchema extends BaseSchema {
    type: 'array';
    items: SchemaDefinition;
}

export interface RefSchema extends BaseSchema {
    type: 'ref';
    // Function that returns the schema, allowing circular generic references
    target: () => SchemaDefinition;
}

export type SchemaDefinition =
    | StringSchema
    | NumberSchema
    | BooleanSchema
    | ObjectSchema
    | ArraySchema
    | RefSchema;
