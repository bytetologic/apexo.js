export const whatTypeOf = (value: unknown): string => {
    // null
    if (value === null) return "null";

    // undefined
    if (value === undefined) return "undefined";

    // primitives
    const type = typeof value;
    if (type === "string") return "string";
    if (type === "number") return "number";
    if (type === "boolean") return "boolean";
    if (type === "bigint") return "bigint";
    if (type === "symbol") return "symbol";

    // function types
    if (type === "function") {
        const fn = value as Function;
        const src = Function.prototype.toString.call(fn).trim();

        if (src.startsWith("class")) return "class";
        if (fn.constructor?.name === "GeneratorFunction") return "generator";
        if (fn.constructor?.name === "AsyncFunction") return "async-function";

        return "function";
    }

    // arrays
    if (Array.isArray(value)) return "array";

    // Promise
    if (
        typeof (value as any)?.then === "function" &&
        typeof (value as any)?.catch === "function"
    ) {
        return "promise";
    }

    // Date
    if (value instanceof Date) return "date";

    // RegExp
    if (value instanceof RegExp) return "regexp";

    // Map / Set / WeakMap / WeakSet
    if (value instanceof Map) return "map";
    if (value instanceof Set) return "set";
    if (value instanceof WeakMap) return "weakmap";
    if (value instanceof WeakSet) return "weakset";

    // Typed arrays (ArrayBuffer views)
    if (ArrayBuffer.isView(value)) return "typed-array";

    // ArrayBuffer
    if (value instanceof ArrayBuffer) return "arraybuffer";

    // Error
    if (value instanceof Error) return "error";

    // Buffer (Node.js only)
    const B = (globalThis as any).Buffer;
    if (B && typeof B.isBuffer === "function" && B.isBuffer(value)) {
        return "buffer";
    }

    // iterable
    if (typeof (value as any)[Symbol.iterator] === "function") {
        return "iterable";
    }

    // plain object
    if (Object.getPrototypeOf(value) === Object.prototype) return "object";

    // class instance
    if (typeof value === "object") {
        return value.constructor?.name || "object-instance";
    }

    // fallback
    return "unknown";
};
