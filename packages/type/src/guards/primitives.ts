export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
    return typeof value === 'number' && !isNaN(Number(value));
};

export const isNumberStr = (value: unknown): value is number => {
    return !isNaN(Number(value));
};

export const isBoolean = (value: unknown): value is boolean => {
    return typeof value === 'boolean';
};

export const isNil = (value: unknown): value is null | undefined => {
    return isNull(value) || isUndefined(value);
};

export const isBigInt = (value: unknown): value is bigint => {
    return typeof value === "bigint";
};

export const isUndefined = (value: unknown): value is undefined => {
    return typeof value === "undefined";
};

export const isNull = (value: unknown): value is null => {
    return value === null;
};

export const isSymbol = (value: unknown): value is symbol => {
    return typeof value === "symbol";
};

export const isPrimitive = (
    value: unknown
): value is string | number | boolean | bigint | symbol | null | undefined => {
    return (
        value === null ||
        (typeof value !== "object" && typeof value !== "function")
    );
};
