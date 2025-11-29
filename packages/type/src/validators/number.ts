
// Basic number check
export const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);


// Odd number
export const isOdd = (value: unknown): boolean =>
    isFiniteNumber(value) && value % 2 !== 0;


// Even number
export const isEven = (value: unknown): boolean =>
    isFiniteNumber(value) && value % 2 === 0;


// Prime number check
export const isPrime = (value: unknown): boolean => {
    if (!isFiniteNumber(value) || value < 2 || value % 1 !== 0) return false;
    if (value === 2) return true;
    if (value % 2 === 0) return false;

    const limit = Math.sqrt(value);
    for (let i = 3; i <= limit; i += 2) {
        if (value % i === 0) return false;
    }
    return true;
};


// Range check (inclusive)
export const isInRange = (
    value: unknown,
    min: number,
    max: number
): boolean =>
    isFiniteNumber(value) && isFiniteNumber(min) && isFiniteNumber(max) && value >= min && value <= max;


// Strict between check (exclusive)
export const isBetween = (
    value: unknown,
    min: number,
    max: number
): boolean =>
    isFiniteNumber(value) && value > min && value < max;


// Positive number
export const isPositive = (value: unknown): boolean =>
    isFiniteNumber(value) && value > 0;


// Negative number
export const isNegative = (value: unknown): boolean =>
    isFiniteNumber(value) && value < 0;


// Zero
export const isZero = (value: unknown): boolean =>
    value === 0;


// Integer
export const isInteger = (value: unknown): value is number =>
    isFiniteNumber(value) && Number.isInteger(value);


// Float (number with decimals)
export const isFloat = (value: unknown): boolean =>
    isFiniteNumber(value) && !Number.isInteger(value);


// Safe integer (per JS spec)
export const isSafeInteger = (value: unknown): boolean =>
    isFiniteNumber(value) && Number.isSafeInteger(value);
