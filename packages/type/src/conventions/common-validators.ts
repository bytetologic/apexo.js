export interface LengthOptions {
    min?: number;
    max?: number;
}

// Shared length checker
export const validateLength = (value: string, opts?: LengthOptions): boolean => {
    if (!opts) return true;
    if (opts.min !== undefined && value.length < opts.min) return false;
    if (opts.max !== undefined && value.length > opts.max) return false;
    return true;
};

export const createValidator = (regex: RegExp) => {
    return (value: string, opts?: LengthOptions): boolean => {
        return regex.test(value) && validateLength(value, opts);
    }
}