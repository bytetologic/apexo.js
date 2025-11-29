# @apexo/type

Ever spent hours writing validation code, only to realize you're doing the same thing in every function? Or maybe you've let AI generate it for you, and now your bundle is bloated with duplicate boilerplate?

**@apexo/type** is a small library that does all your type checking for you. Why do you need it? Because JavaScript's type checking is weird:

- `typeof null` says it's an `"object"` (but it's not!)
- `typeof []` says it's an `"object"` (arrays need different checks)
- `typeof NaN` says it's a `"number"` (even though NaN means "Not a Number")
- No easy way to check for empty values or loops in objects

You could write all the checks yourself:

```javascript
function processUser(data) {
    if (data === null || data === undefined) {
        throw new Error('Data is required');
    }
    if (typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Data must be an object');
    }
    if (typeof data.name !== 'string' || data.name.trim() === '') {
        throw new Error('Name must be a non-empty string');
    }
    if (typeof data.age !== 'number' || isNaN(data.age) || data.age < 0) {
        throw new Error('Age must be a positive number');
    }
    // Finally, your actual logic...
}
```

Or you could use **@apexo/type** and get it done in 3 lines:

```javascript
import { isObject, isNotEmpty, isPositive } from '@apexo/type';

function processUser(data) {
    if (!isObject(data)) throw new Error('Data must be an object');
    if (!isNotEmpty(data.name)) throw new Error('Name is required');
    if (!isPositive(data.age)) throw new Error('Age must be positive');
    // Your actual logic, front and center
}
```

## Why would I want that?

JavaScript's `typeof` operator falls short in many real-world scenarios:
- `typeof null === 'object'` (it's not!)
- `typeof [] === 'object'` (arrays need special handling)
- No way to check for `NaN`, empty values, or validate complex structures

**@apexo/type** solves these problems by providing:

- **Runtime Safety**: Validate data from APIs, user input, or any untrusted source before processing
- **TypeScript Integration**: Type guards automatically narrow types in your code, giving you full IntelliSense support
- **Readable Code**: Replace verbose checks like `if (value !== null && value !== undefined && typeof value === 'string' && value.trim() !== '')` with `if (isNotEmpty(value))`
- **Edge Case Handling**: Correctly handles tricky JavaScript edge cases (`null`, `undefined`, `NaN`, `Symbol`, `BigInt`, circular references)

## How little is it?

- **~12KB minified** (entire library)
- **Tree-shakeable**: Only bundle what you use. Import just `isString`? Your bundle won't include date validators or circular reference detection
- **Zero dependencies**: No bloat from external packages
- **Side-effect free**: Marked as `"sideEffects": false` for optimal tree-shaking

## How do I install it?

```bash
npm install @apexo/type
```

Or with your preferred package manager:

```bash
pnpm add @apexo/type
yarn add @apexo/type
```

## How do I use it?

### Basic Type Guards

Type guards return a boolean and automatically narrow TypeScript types:

```typescript
import { isString, isNumber, isArray } from '@apexo/type';

function process(input: unknown) {
    if (isString(input)) {
        // TypeScript knows input is string here
        console.log(input.toUpperCase());
    }
    
    if (isArray(input)) {
        // TypeScript knows input is any[] here
        console.log(input.length);
    }
}
```

### Validating Values

Beyond type checking, validate specific properties:

```typescript
import { isPositive, isEven, isFutureDate, isEmpty } from '@apexo/type';

isPositive(10);  // true
isEven(7);       // false
isEmpty('   ');  // true
isFutureDate(new Date('2050-01-01')); // true
```

### Advanced Utilities

```typescript
import { whatTypeOf, hasCircularReference } from '@apexo/type';

whatTypeOf(null);        // "null" (not "object"!)
whatTypeOf([]);          // "array"
whatTypeOf(new Date());  // "date"

const obj: any = {};
obj.self = obj;
hasCircularReference(obj); // { hasCircular: true, path: "root.self -> root" }
```

## Loading the library

### ES Modules (Recommended)

```typescript
import { isString, isObject } from '@apexo/type';
```

### CommonJS

```javascript
const { isString, isObject } = require('@apexo/type');
```

### TypeScript

The library is written in TypeScript and includes full type definitions out of the box.

## Are there TypeScript definitions?

Yes! The library is **TypeScript-first** and includes complete type definitions. All type guards use TypeScript's type predicate syntax (`value is Type`), providing automatic type narrowing:

```typescript
function example(input: unknown) {
    if (isString(input)) {
        // input is automatically typed as 'string'
        input.toLowerCase(); // ✅ TypeScript knows this is safe
    }
}
```

## Where can I use it?

**Everywhere JavaScript runs:**

- ✅ **Node.js** (v14+)
- ✅ **Browsers** (Modern browsers, IE11+ with polyfills)
- ✅ **Deno**
- ✅ **Bun**
- ✅ **Edge Functions** (Vercel, Cloudflare Workers, etc.)
- ✅ **React Native**

The library has zero dependencies and uses only standard JavaScript features, making it universally compatible.

---

## API Reference

### Primitives

- `isString(value)` - Checks if value is a string
- `isNumber(value)` - Checks if value is a number (and not NaN)
- `isNumberStr(value)` - Checks if value is a number or numeric string
- `isBoolean(value)` - Checks if value is a boolean
- `isNil(value)` - Checks if value is `null` or `undefined`
- `isNull(value)` - Checks if value is `null`
- `isUndefined(value)` - Checks if value is `undefined`
- `isBigInt(value)` - Checks if value is a BigInt
- `isSymbol(value)` - Checks if value is a Symbol
- `isPrimitive(value)` - Checks if value is a primitive type

### Objects & Structures

- `isObject(value)` - Checks if value is a non-null object (excluding arrays)
- `isPlainObject(value)` - Checks if value is a plain object (`{}` or `new Object()`)
- `isArray(value)` - Checks if value is an array
- `isArrayLike(value)` - Checks if value is array-like (has length property)
- `isFunction(value)` - Checks if value is a function
- `isClass(value)` - Checks if value is a class constructor
- `isIterable(value)` - Checks if value is iterable
- `isAsyncIterable(value)` - Checks if value is async iterable
- `isGeneratorFunction(value)` - Checks if value is a generator function

### Advanced Types

- `isPromise(value)` - Checks if value is a Promise
- `isMap(value)` - Checks if value is a Map
- `isSet(value)` - Checks if value is a Set
- `isWeakMap(value)` - Checks if value is a WeakMap
- `isWeakSet(value)` - Checks if value is a WeakSet
- `isRegExp(value)` - Checks if value is a RegExp
- `isDate(value)` - Checks if value is a Date object
- `isError(value)` - Checks if value is an Error
- `isTypeError(value)` - Checks if value is a TypeError
- `isReferenceError(value)` - Checks if value is a ReferenceError
- `isSyntaxError(value)` - Checks if value is a SyntaxError
- `isRangeError(value)` - Checks if value is a RangeError
- `isURIError(value)` - Checks if value is a URIError
- `isEvalError(value)` - Checks if value is an EvalError
- `isAggregateError(value)` - Checks if value is an AggregateError
- `isBuffer(value)` - Checks if value is a Buffer (Node.js) or ArrayBuffer/View
- `isJson(value)` - Checks if value is a valid JSON string

### Empty Checks

- `isEmpty(value)` - Checks if value is empty (null, undefined, empty string/array/object)
- `isNotEmpty(value)` - Inverse of `isEmpty`
- `isEmptyStr(value)` - Checks if value is an empty string (or whitespace only)
- `isEmptyArr(value)` - Checks if value is an empty array
- `isEmptyObj(value)` - Checks if value is an empty object

### Number Validators

- `isFiniteNumber(value)` - Checks if value is a finite number
- `isInteger(value)` - Checks if value is an integer
- `isFloat(value)` - Checks if value is a float
- `isSafeInteger(value)` - Checks if value is a safe integer
- `isPositive(value)` - Checks if value is > 0
- `isNegative(value)` - Checks if value is < 0
- `isZero(value)` - Checks if value is 0
- `isEven(value)` - Checks if value is even
- `isOdd(value)` - Checks if value is odd
- `isPrime(value)` - Checks if value is a prime number
- `isInRange(value, min, max)` - Checks if value is within [min, max]
- `isBetween(value, min, max)` - Checks if value is strictly between (min, max)

### Date Validators

- `isValidDate(value)` - Checks if value is a valid Date (not Invalid Date)
- `isStrictDate(value)` - Alias for `isValidDate`
- `isFutureDate(date)` - Checks if date is in the future
- `isPastDate(date)` - Checks if date is in the past
- `isToday(date)` - Checks if date is today
- `isSameDay(a, b)` - Checks if two dates are on the same day
- `isLeapYear(year)` - Checks if year is a leap year
- `isISODateString(value)` - Checks if value is an ISO 8601 date string
- `isValidISODateOnly(value)` - Checks if value is a valid YYYY-MM-DD string
- `isValidTimeString(value)` - Checks if value is a valid time string (HH:mm)
- `isDateTimeString(value)` - Checks if value is a valid datetime string
- `isTimestamp(value)` - Checks if value is a valid timestamp
- `isDateLike(value)` - Checks if value can be converted to a valid Date
- `isForwardTime(date, offset?)` - Checks if date is after now + offset
- `isBackwardTime(date, offset?)` - Checks if date is before now - offset

### Utilities

- `whatTypeOf(value)` - Returns a specific type string (e.g., "array", "date", "null")
- `hasCircularReference(obj)` - Detects circular references in objects/arrays

---

## Architecture

The library is organized for maximum tree-shaking efficiency:

```
src/
├── guards/          # Type guards (value is Type)
│   ├── primitives.ts   # Basic types
│   ├── objects.ts      # Object structures
│   ├── advanced.ts     # Promises, Maps, Sets
│   ├── errors.ts       # Error types
│   └── empty.ts        # Empty checks
├── validators/      # Value validators (boolean)
│   ├── number.ts       # Numeric validations
│   └── date.ts         # Date validations
└── utils/           # Helper utilities
    ├── type-of.ts      # Enhanced typeof
    └── circular-ref.ts # Circular reference detection
```

This structure allows bundlers to eliminate entire categories of checks if you don't use them.

---

## License

ISC

## Repository

[https://github.com/bytetologic/apexo.js/tree/main/packages/type](https://github.com/bytetologic/apexo.js/tree/main/packages/type)
