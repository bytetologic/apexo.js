import {
    isFiniteNumber,
    isOdd,
    isEven,
    isPrime,
    isInRange,
    isBetween,
    isPositive,
    isNegative,
    isZero,
    isInteger,
    isFloat,
    isSafeInteger,
} from "../src/index";

describe("Number Checks", () => {
    test("isFiniteNumber", () => {
        expect(isFiniteNumber(123)).toBe(true);
        expect(isFiniteNumber(0)).toBe(true);
        expect(isFiniteNumber(-123)).toBe(true);
        expect(isFiniteNumber(Infinity)).toBe(false);
        expect(isFiniteNumber(-Infinity)).toBe(false);
        expect(isFiniteNumber(NaN)).toBe(false);
        expect(isFiniteNumber("123")).toBe(false);
    });

    test("isOdd", () => {
        expect(isOdd(1)).toBe(true);
        expect(isOdd(3)).toBe(true);
        expect(isOdd(-1)).toBe(true);
        expect(isOdd(2)).toBe(false);
        expect(isOdd(0)).toBe(false);
    });

    test("isEven", () => {
        expect(isEven(2)).toBe(true);
        expect(isEven(0)).toBe(true);
        expect(isEven(-2)).toBe(true);
        expect(isEven(1)).toBe(false);
    });

    test("isPrime", () => {
        expect(isPrime(2)).toBe(true);
        expect(isPrime(3)).toBe(true);
        expect(isPrime(5)).toBe(true);
        expect(isPrime(7)).toBe(true);
        expect(isPrime(11)).toBe(true);
        expect(isPrime(4)).toBe(false);
        expect(isPrime(1)).toBe(false);
        expect(isPrime(0)).toBe(false);
        expect(isPrime(-5)).toBe(false);
        expect(isPrime(2.5)).toBe(false);
    });

    test("isInRange", () => {
        expect(isInRange(5, 1, 10)).toBe(true);
        expect(isInRange(1, 1, 10)).toBe(true);
        expect(isInRange(10, 1, 10)).toBe(true);
        expect(isInRange(0, 1, 10)).toBe(false);
        expect(isInRange(11, 1, 10)).toBe(false);
    });

    test("isBetween", () => {
        expect(isBetween(5, 1, 10)).toBe(true);
        expect(isBetween(1, 1, 10)).toBe(false);
        expect(isBetween(10, 1, 10)).toBe(false);
    });

    test("isPositive", () => {
        expect(isPositive(1)).toBe(true);
        expect(isPositive(0.1)).toBe(true);
        expect(isPositive(0)).toBe(false);
        expect(isPositive(-1)).toBe(false);
    });

    test("isNegative", () => {
        expect(isNegative(-1)).toBe(true);
        expect(isNegative(-0.1)).toBe(true);
        expect(isNegative(0)).toBe(false);
        expect(isNegative(1)).toBe(false);
    });

    test("isZero", () => {
        expect(isZero(0)).toBe(true);
        expect(isZero(1)).toBe(false);
        expect(isZero("0")).toBe(false);
    });

    test("isInteger", () => {
        expect(isInteger(1)).toBe(true);
        expect(isInteger(0)).toBe(true);
        expect(isInteger(-1)).toBe(true);
        expect(isInteger(1.5)).toBe(false);
    });

    test("isFloat", () => {
        expect(isFloat(1.5)).toBe(true);
        expect(isFloat(-0.1)).toBe(true);
        expect(isFloat(1)).toBe(false);
        expect(isFloat(0)).toBe(false);
    });

    test("isSafeInteger", () => {
        expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
        expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
        expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    });
});
