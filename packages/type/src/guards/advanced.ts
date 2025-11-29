import { isString } from "./primitives";

export const isPromise = <T = any>(value: unknown): value is Promise<T> => {
    return value instanceof Promise;
};

export const isJson = (value: unknown): value is string => {
    if (!isString(value)) return false;
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
};
export const isNodeBuffer = (value: unknown): value is any => {
    const B = (globalThis as any).Buffer;

    // No Buffer in browser without polyfills
    if (!B || typeof B.isBuffer !== "function") return false;

    // Some browser polyfills produce Uint8Array subclass — check constructor name
    if (typeof B !== "function" || B.name !== "Buffer") return false;

    return B.isBuffer(value);
};

export const isBrowserBuffer = (value: unknown): value is ArrayBuffer | ArrayBufferView => {
    return (
        value instanceof ArrayBuffer ||
        ArrayBuffer.isView(value) // Uint8Array, Float32Array, DataView, etc.
    );
};

export const isBuffer = (value: unknown): value is ArrayBuffer | ArrayBufferView | any => {
    return isNodeBuffer(value) || isBrowserBuffer(value);
};


export const isMap = (value: unknown): value is Map<any, any> => { return value instanceof Map; }

export const isSet = (value: unknown): value is Set<any> => { return value instanceof Set; }

export const isWeakMap = (value: unknown): value is WeakMap<object, any> => { return value instanceof WeakMap; }

export const isWeakSet = (value: unknown): value is WeakSet<object> => { return value instanceof WeakSet; }

export const isRegExp = (value: unknown): value is RegExp => { return value instanceof RegExp; }

