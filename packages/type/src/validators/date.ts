export interface TimeOffset {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}


// Time multipliers
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;


// 1. Is a Date object (not checking validity)
export const isDate = (value: unknown): value is Date =>
    value instanceof Date;


// 2. Is a valid Date object (real date, not invalid)
export const isValidDate = (value: unknown): value is Date =>
    value instanceof Date && !isNaN(value.getTime());


// 3. Is ISO-8601 formatted date string
export const isISODateString = (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    const isoRegex =
        /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/;
    return isoRegex.test(value);
};


// 4. Is timestamp (number or numeric string)
export const isTimestamp = (value: unknown): boolean => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0;
};


// 5. Can be converted to a valid Date (string, number, date, etc.)
export const isDateLike = (value: unknown): boolean => {
    const d = new Date(value as any);
    return !isNaN(d.getTime());
};


// 6. Is strict valid Date only (best option for real date check)
export const isStrictDate = (value: unknown): value is Date =>
    value instanceof Date && !isNaN(value.getTime());


// 7. Check if value is today (date object only)
export const isToday = (date: unknown): boolean => {
    if (!isValidDate(date)) return false;
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};


// 8. Check if date is in the future
export const isFutureDate = (date: unknown): boolean =>
    isValidDate(date) && date.getTime() > Date.now();


// 9. Check if date is in the past
export const isPastDate = (date: unknown): boolean =>
    isValidDate(date) && date.getTime() < Date.now();


// 10. Compare dates (YYYY-MM-DD) ignoring time
export const isSameDay = (a: unknown, b: unknown): boolean => {
    if (!isValidDate(a) || !isValidDate(b)) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
};


// 11. Check if a year is leap year
export const isLeapYear = (year: unknown): year is number =>
    typeof year === "number" &&
    ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);


// 12. Validate simple date-only string: YYYY-MM-DD
export const isValidISODateOnly = (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) return false;
    const d = new Date(value);
    return !isNaN(d.getTime());
};


// 13. Validate time string HH:mm or HH:mm:ss
export const isValidTimeString = (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
};


// 14. Validate full datetime (date + time)
export const isDateTimeString = (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    const regex =
        /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
    return regex.test(value);
};


// ------------------------------------------------------
// Convert offset to milliseconds
// ------------------------------------------------------
const getOffsetMs = (opts?: TimeOffset): number => {
    if (!opts) return 0;
    const {
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
        milliseconds = 0,
    } = opts;

    return (
        days * MS_PER_DAY +
        hours * MS_PER_HOUR +
        minutes * MS_PER_MINUTE +
        seconds * MS_PER_SECOND +
        milliseconds
    );
};


// ------------------------------------------------------
// MAIN: Check Forward (date > now + offset)
// ------------------------------------------------------
export const isForwardTime = (date: unknown, offset?: TimeOffset): boolean => {
    if (!isValidDate(date)) return false;

    const threshold = Date.now() + getOffsetMs(offset);
    return date.getTime() > threshold;
};


// ------------------------------------------------------
// MAIN: Check Backward (date < now - offset)
// ------------------------------------------------------
export const isBackwardTime = (date: unknown, offset?: TimeOffset): boolean => {
    if (!isValidDate(date)) return false;

    const threshold = Date.now() - getOffsetMs(offset);
    return date.getTime() < threshold;
};
