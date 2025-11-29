import {
    isError,
    isTypeError,
    isReferenceError,
    isSyntaxError,
    isRangeError,
    isURIError,
    isEvalError,
    isAggregateError,
} from "../src/index";

describe("Error Checks", () => {
    test("isError", () => {
        expect(isError(new Error())).toBe(true);
        expect(isError(new TypeError())).toBe(true);
        expect(isError({ message: "error" })).toBe(false);
    });

    test("isTypeError", () => {
        expect(isTypeError(new TypeError())).toBe(true);
        expect(isTypeError(new Error())).toBe(false);
    });

    test("isReferenceError", () => {
        expect(isReferenceError(new ReferenceError())).toBe(true);
        expect(isReferenceError(new Error())).toBe(false);
    });

    test("isSyntaxError", () => {
        expect(isSyntaxError(new SyntaxError())).toBe(true);
        expect(isSyntaxError(new Error())).toBe(false);
    });

    test("isRangeError", () => {
        expect(isRangeError(new RangeError())).toBe(true);
        expect(isRangeError(new Error())).toBe(false);
    });

    test("isURIError", () => {
        expect(isURIError(new URIError())).toBe(true);
        expect(isURIError(new Error())).toBe(false);
    });

    test("isEvalError", () => {
        expect(isEvalError(new EvalError())).toBe(true);
        expect(isEvalError(new Error())).toBe(false);
    });

    test("isAggregateError", () => {
        if (typeof AggregateError !== "undefined") {
            expect(isAggregateError(new AggregateError([]))).toBe(true);
        }
        expect(isAggregateError(new Error())).toBe(false);
    });
});
