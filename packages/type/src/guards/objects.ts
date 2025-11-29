import { isNil } from "./primitives";

export const isFunction = (value: unknown): value is (...args: any[]) => any => {
    return typeof value === 'function';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && !Array.isArray(value) && !isNil(value);
};

export const isArray = (value: unknown): value is any[] => {
    return Array.isArray(value);
};


export const isArrayLike = (value: unknown): value is { length: number } => {
    return (
        value != null &&
        typeof value !== "function" &&
        typeof (value as any).length === "number" &&
        (value as any).length >= 0 &&
        Number.isFinite((value as any).length)
    );
};

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (typeof value !== "object" || value === null) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
};

// Class (Improved check combining constructor structure and the 'class' keyword)
export const isClass = (value: unknown): value is new (...args: any[]) => any => {
    if (typeof value !== "function" || value === null) return false;

    // A quick heuristic: ES6 classes have their prototype linked to Function.prototype,
    // but we primarily look for the 'class' keyword string representation.
    const stringValue = Function.prototype.toString.call(value);

    // Check for the 'class' keyword at the start
    if (/^class\s/.test(stringValue)) {
        return true;
    }

    // Check for built-in constructors which are technically functions but often not what we mean by 'class'
    // (e.g., Array, String, etc. are simple functions without the 'class' keyword string)
    const prototype = Object.getPrototypeOf(value);
    if (prototype === Function.prototype) {
        // It's a regular function or a non-ES6 constructor; we exclude it unless the regex passed.
        return false;
    }

    // Final check: if it has a prototype and that prototype's constructor points back to the value (common for class instances)
    return !!value.prototype && value.prototype.constructor === value;
};

export const isIterable = (value: unknown): value is Iterable<any> => {
    return value != null && typeof (value as any)[Symbol.iterator] === "function";
};

export const isAsyncIterable = (value: unknown): value is AsyncIterable<any> => {
    return value != null && typeof (value as any)[Symbol.asyncIterator] === "function";
};

export const isGeneratorFunction = (value: unknown): value is GeneratorFunction => {
    return typeof value === "function" && value.constructor?.name === "GeneratorFunction";
};
