import {
    SchemaDefinition,
    StringSchema,
    NumberSchema,
    BooleanSchema,
    ObjectSchema,
    ArraySchema,
    RefSchema
} from './types';

export type Infer<T> = T extends Builder<any, infer O> ? O : never;

export class Builder<T extends SchemaDefinition, TInternal = any> {
    readonly _type!: TInternal;
    protected schema: T;

    constructor(schema: T) {
        this.schema = schema;
    }

    optional(): Builder<T, TInternal | undefined> {
        this.schema.optional = true;
        return this as any;
    }

    nullable(): Builder<T, TInternal | null> {
        this.schema.nullable = true;
        return this as any;
    }

    build(): T {
        if (!this.schema || !this.schema.type) {
            throw new Error('Invalid schema state: Every schema must have a type.');
        }
        return this.schema;
    }
}

export class StringBuilder extends Builder<StringSchema, string> {
    constructor() {
        super({ type: 'string' });
    }

    min(length: number): this {
        this.schema.minLength = length;
        return this;
    }

    max(length: number): this {
        this.schema.maxLength = length;
        return this;
    }

    regex(pattern: RegExp): this {
        this.schema.pattern = pattern;
        return this;
    }
}

export class NumberBuilder extends Builder<NumberSchema, number> {
    constructor() {
        super({ type: 'number' });
    }

    min(value: number): this {
        this.schema.min = value;
        return this;
    }

    max(value: number): this {
        this.schema.max = value;
        return this;
    }

    int(): this {
        this.schema.integer = true;
        return this;
    }
}

export class BooleanBuilder extends Builder<BooleanSchema, boolean> {
    constructor() {
        super({ type: 'boolean' });
    }
}

type RequiredKeys<T> = { [K in keyof T]: T[K] extends Builder<any, infer O> ? (undefined extends O ? never : K) : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]: T[K] extends Builder<any, infer O> ? (undefined extends O ? K : never) : never }[keyof T];

type InferObject<T extends Record<string, any>> =
    { [K in RequiredKeys<T>]: T[K] extends Builder<any, infer O> ? O : any } &
    { [K in OptionalKeys<T>]?: T[K] extends Builder<any, infer O> ? O : any };

export class ObjectBuilder<T_Props extends Record<string, any>, T_Output = InferObject<T_Props>> extends Builder<ObjectSchema, T_Output> {
    constructor(properties: T_Props) {
        super({ type: 'object', properties: {} } as any);
        this.addProperties(properties as any);
    }

    private addProperties(properties: Record<string, SchemaDefinition | Builder<any>>) {
        for (const [key, value] of Object.entries(properties)) {
            this.schema.properties[key] = value instanceof Builder ? value.build() : value;
        }
    }

    /**
     * Embeds another object schema's properties into this one.
     */
    embed(other: ObjectSchema | ObjectBuilder<any, any>): this {
        const otherSchema = other instanceof Builder ? other.build() : other;
        if (otherSchema.type !== 'object') {
            throw new Error('Can only embed object schemas');
        }
        // Deep merge or shallow merge? Usually shallow for properties is sufficient for embeddings.
        // We copy properties.
        this.addProperties(otherSchema.properties);
        return this;
    }

    /**
     * Extends this schema with new properties, returning a NEW builder (clone).
     */
    extend<T_NewProps extends Record<string, any>>(properties: T_NewProps): ObjectBuilder<T_Props & T_NewProps> {
        // Clone current properties
        const newProps: any = { ...this.schema.properties };
        // Create new builder with cloned props
        const builder = new ObjectBuilder(newProps as any);
        // Add new properties
        builder.addProperties(properties as any);
        return builder as any;
    }
}

export class ArrayBuilder<T_ItemBuilder extends Builder<any, any>, T_Output = (Infer<T_ItemBuilder>)[]> extends Builder<ArraySchema, T_Output> {
    constructor(items: T_ItemBuilder) {
        super({
            type: 'array',
            items: items.build()
        } as any);
    }
}

export class RefBuilder<T_Output = any> extends Builder<RefSchema, T_Output> {
    constructor(target: () => SchemaDefinition) {
        super({ type: 'ref', target });
    }
}

export const s = {
    string: () => new StringBuilder(),
    number: () => new NumberBuilder(),
    boolean: () => new BooleanBuilder(),
    object: <T extends Record<string, any>>(props: T) => new ObjectBuilder<T>(props),
    array: <T extends Builder<any, any>>(items: T) => new ArrayBuilder<T>(items),
    selfRef: <T = any>(target: () => SchemaDefinition) => new RefBuilder<T>(target),
};
