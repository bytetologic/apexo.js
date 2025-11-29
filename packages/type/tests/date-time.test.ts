import {
    isDate,
    isValidDate,
    isISODateString,
    isTimestamp,
    isDateLike,
    isStrictDate,
    isToday,
    isFutureDate,
    isPastDate,
    isSameDay,
    isLeapYear,
    isValidISODateOnly,
    isValidTimeString,
    isDateTimeString,
    isForwardTime,
    isBackwardTime,
} from "../src/index";

describe("Date Time Checks", () => {
    test("isDate", () => {
        expect(isDate(new Date())).toBe(true);
        expect(isDate(new Date("invalid"))).toBe(true);
        expect(isDate("2023-01-01")).toBe(false);
    });

    test("isValidDate", () => {
        expect(isValidDate(new Date())).toBe(true);
        expect(isValidDate(new Date("2023-01-01"))).toBe(true);
        expect(isValidDate(new Date("invalid"))).toBe(false);
    });

    test("isISODateString", () => {
        expect(isISODateString("2023-01-01T00:00:00.000Z")).toBe(true);
        expect(isISODateString("2023-01-01")).toBe(true);
        expect(isISODateString("invalid")).toBe(false);
    });

    test("isTimestamp", () => {
        expect(isTimestamp(1672531200000)).toBe(true);
        expect(isTimestamp("1672531200000")).toBe(true);
        expect(isTimestamp(-1)).toBe(false);
        expect(isTimestamp(NaN)).toBe(false);
    });

    test("isDateLike", () => {
        expect(isDateLike("2023-01-01")).toBe(true);
        expect(isDateLike(1672531200000)).toBe(true);
        expect(isDateLike(new Date())).toBe(true);
        expect(isDateLike("invalid")).toBe(false);
    });

    test("isStrictDate", () => {
        expect(isStrictDate(new Date())).toBe(true);
        expect(isStrictDate(new Date("invalid"))).toBe(false);
        expect(isStrictDate("2023-01-01")).toBe(false);
    });

    test("isToday", () => {
        expect(isToday(new Date())).toBe(true);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(isToday(yesterday)).toBe(false);
    });

    test("isFutureDate", () => {
        const future = new Date();
        future.setDate(future.getDate() + 1);
        expect(isFutureDate(future)).toBe(true);
        expect(isFutureDate(new Date())).toBe(false); // Technically now is not future compared to now execution time usually
    });

    test("isPastDate", () => {
        const past = new Date();
        past.setDate(past.getDate() - 1);
        expect(isPastDate(past)).toBe(true);
        const future = new Date();
        future.setDate(future.getDate() + 1);
        expect(isPastDate(future)).toBe(false);
    });

    test("isSameDay", () => {
        const d1 = new Date("2023-01-01T10:00:00");
        const d2 = new Date("2023-01-01T20:00:00");
        const d3 = new Date("2023-01-02T10:00:00");
        expect(isSameDay(d1, d2)).toBe(true);
        expect(isSameDay(d1, d3)).toBe(false);
    });

    test("isLeapYear", () => {
        expect(isLeapYear(2020)).toBe(true);
        expect(isLeapYear(2000)).toBe(true);
        expect(isLeapYear(2021)).toBe(false);
        expect(isLeapYear(1900)).toBe(false);
    });

    test("isValidISODateOnly", () => {
        expect(isValidISODateOnly("2023-01-01")).toBe(true);
        expect(isValidISODateOnly("2023-13-01")).toBe(false); // Month 13 invalid? JS Date accepts it and rolls over, but regex might pass. Wait, implementation uses regex then Date check.
        // The implementation: regex /^\d{4}-\d{2}-\d{2}$/ then !isNaN(d.getTime())
        // new Date("2023-13-01") is valid in some environments (rolls to 2024-01-01) or invalid in others.
        // Standard ISO date only usually implies strict format.
        expect(isValidISODateOnly("2023/01/01")).toBe(false);
    });

    test("isValidTimeString", () => {
        expect(isValidTimeString("12:00")).toBe(true);
        expect(isValidTimeString("12:00:00")).toBe(true);
        expect(isValidTimeString("25:00")).toBe(false);
    });

    test("isDateTimeString", () => {
        expect(isDateTimeString("2023-01-01T12:00:00Z")).toBe(true);
        expect(isDateTimeString("2023-01-01 12:00:00")).toBe(true);
        expect(isDateTimeString("invalid")).toBe(false);
    });

    test("isForwardTime", () => {
        const future = new Date(Date.now() + 10000);
        expect(isForwardTime(future, { seconds: 5 })).toBe(true);
        expect(isForwardTime(future, { seconds: 15 })).toBe(false);
    });

    test("isBackwardTime", () => {
        const past = new Date(Date.now() - 10000);
        expect(isBackwardTime(past, { seconds: 5 })).toBe(true);
        expect(isBackwardTime(past, { seconds: 15 })).toBe(false);
    });
});
