import {
    isString,
    isNumber,
    isBoolean,
    isNil,
    isUndefined,
    isNull,
    isSymbol,
    isBigInt,
    isPrimitive,
} from "../src/index";

describe("Basic Type Checks", () => {
    test("isString", () => {
        expect(isString("hello")).toBe(true);
        expect(isString("")).toBe(true);
        expect(isString(123)).toBe(false);
        expect(isString(null)).toBe(false);
    });

    test("isNumber", () => {
        expect(isNumber(123)).toBe(true);
        expect(isNumber(0)).toBe(true);
        expect(isNumber(-1.5)).toBe(true);
        expect(isNumber("123")).toBe(false);
        expect(isNumber(NaN)).toBe(false); // Assuming isNumber checks for valid number
    });

    test("isBoolean", () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);
        expect(isBoolean(0)).toBe(false);
        expect(isBoolean("true")).toBe(false);
    });

    test("isNil", () => {
        expect(isNil(null)).toBe(true);
        expect(isNil(undefined)).toBe(true);
        expect(isNil(0)).toBe(false);
        expect(isNil("")).toBe(false);
        expect(isNil(false)).toBe(false);
    });

    test("isUndefined", () => {
        expect(isUndefined(undefined)).toBe(true);
        expect(isUndefined(null)).toBe(false);
        expect(isUndefined(0)).toBe(false);
    });

    test("isNull", () => {
        expect(isNull(null)).toBe(true);
        expect(isNull(undefined)).toBe(false);
        expect(isNull(0)).toBe(false);
    });

    test("isSymbol", () => {
        expect(isSymbol(Symbol("foo"))).toBe(true);
        expect(isSymbol("foo")).toBe(false);
    });

    test("isBigInt", () => {
        expect(isBigInt(BigInt(123))).toBe(true);
        expect(isBigInt(123)).toBe(false);
    });

    test("isPrimitive", () => {
        expect(isPrimitive("string")).toBe(true);
        expect(isPrimitive(123)).toBe(true);
        expect(isPrimitive(true)).toBe(true);
        expect(isPrimitive(null)).toBe(true);
        expect(isPrimitive(undefined)).toBe(true);
        expect(isPrimitive(Symbol("s"))).toBe(true);
        expect(isPrimitive(BigInt(1))).toBe(true);
        expect(isPrimitive({})).toBe(false);
        expect(isPrimitive([])).toBe(false);
        expect(isPrimitive(() => { })).toBe(false);
    });
});
