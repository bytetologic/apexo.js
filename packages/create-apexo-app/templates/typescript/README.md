# My Apexo TypeScript App

A new TypeScript project created with [Apexo](https://github.com/bytetologic/apexojs) - TypeScript-first schema validation with seamless static type inference.

## Getting Started

This project uses Apexo for runtime type validation with full TypeScript support.

### Build and Run

```bash
# Build the TypeScript code
npm run build

# Run the compiled code
npm start

# Or watch for changes during development
npm run dev
```

## What is Apexo?

Apexo is a TypeScript-first validation library that lets you:
- ✅ Validate data types at runtime
- ✅ Use type guards for TypeScript type narrowing
- ✅ Build type-safe applications with confidence
- ✅ Infer static types from your schemas

## Available Functions

From `@apexo/type`:
- `isString(value)` - Type guard for strings
- `isNumber(value)` - Type guard for numbers
- `isBoolean(value)` - Type guard for booleans
- `isArray(value)` - Type guard for arrays
- `isObject(value)` - Type guard for objects
- `isFunction(value)` - Type guard for functions
- `isNil(value)` - Type guard for null/undefined
- `isEmpty(value)` - Check if value is empty

## Project Structure

```
src/
  index.ts          # Main entry point with examples
dist/               # Compiled JavaScript (generated)
tsconfig.json       # TypeScript configuration
package.json        # Project dependencies
```

## Learn More

- [Apexo Documentation](https://github.com/bytetologic/apexojs)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

ISC
