# @apexo/schema (BETA)

> **⚠️ WARNING: UNSTABLE VERSION**  
> This package is currently in **Beta** and under active development. APIs are subject to change without notice. Not recommended for production use yet.

Ever felt like **Zod** or **Joi** are slowing down your application's cold start? Or maybe you're tired of shipping massive validation trees that bloat your bundle and hog memory?

**@apexo/schema** is a next-generation, zero-dependency schema validation library designed for extreme performance. Unlike traditional libraries that interpret schemas at runtime, Apexo uses an **Ahead-Of-Time (AOT) Compiler** to generate a highly optimized Intermediate Representation (IR) that makes validation lightning-fast and memory-efficient.

## Why Apexo Schema?

Validation in JavaScript traditionally happens in two ways:
1.  **Interpreted (Zod/Joi)**: Easy to use, but slow at scale and memory-heavy because they build massive object trees at runtime.
2.  **Code Gen (Ajv)**: Fast, but requires `eval()` or complex build steps, often making them a nightmare for Edge functions or restricted environments.

**@apexo/schema** gives you the best of both:
- **🚀 Extreme Speed**: Up to **23x faster** validation than Zod.
- **📦 Tiny Footprint**: Uses **~97% less memory** for complex schemas.
- **🛡️ Secure & Portable**: No `eval()` or `new Function()`. Runs anywhere—Edge, Browser, or Server.

## How it works?

Instead of interpreting a deep object tree every time you validate, Apexo compiles your schema into a **Flat Validation Plan** (IR) at build-time.

```typescript
import { s, buildSchema, createValidator } from '@apexo/schema';

// 1. Define once (Compiler flattens and deduplicates this)
const UserSchema = s.object({
  id: s.number().int(),
  name: s.string().min(2),
  tags: s.array(s.string())
});

// 2. Compile to IR (Paid once at build/load time)
const registry = buildSchema(UserSchema);

// 3. High-speed validator (Zero-allocation happy path)
const validator = createValidator(registry);
```

## Why would I want that?

- **Near Zero Startup**: While Zod takes ~120ms to build a heavy 10,000-field schema, Apexo is ready in ~12ms. In production, this IR is constant-folded by your bundler, making it effectively **0ms** at runtime.
- **Memory Efficiency**: Where Zod takes ~160MB to store a complex enterprise schema, Apexo's flat registry takes just **4MB**.
- **CPU-Level Bitmasks**: We use 32-bit integers to validate required fields in objects. If your object has < 31 properties, checking "Required" status happens in a single CPU cycle.

## How do I install it?

```bash
pnpm add @apexo/schema
```

## How do I use it?

### Basic Validation

```typescript
import { s, buildSchema, createValidator } from '@apexo/schema';

const schema = s.object({
  username: s.string().min(3).max(20),
  age: s.number().min(18),
  isActive: s.boolean()
});

const validator = createValidator(buildSchema(schema));

const result = validator.validate({
  username: "apexo",
  age: 25,
  isActive: true
});

if (!result.success) {
  console.log(result.errors); // [{ path: "username", message: "..." }]
}
```

### Type Inference (Like Zod)

Apexo is first-class TypeScript. You don't need to write types twice.

```typescript
import { s, Infer } from '@apexo/schema';

const ProductSchema = s.object({
  id: s.string(),
  price: s.number(),
  metadata: s.object({
    isNew: s.boolean().optional()
  })
});

type Product = Infer<typeof ProductSchema>;

// Inferred Type:
// {
//   id: string;
//   price: number;
//   metadata: {
//     isNew?: boolean | undefined;
//   }
// }
```

### Recursive Schemas

Handling linked lists or category trees is easy with `selfRef`:

```typescript
interface Category {
  name: string;
  subcategories?: Category[];
}

const CategorySchema: any = s.object({
  name: s.string(),
  subcategories: s.array(s.selfRef<Category>(() => CategorySchema)).optional()
});
```

## Performance Comparison (10,000 Fields)

| Metric | @apexo/schema | Joi | Zod |
| :--- | :--- | :--- | :--- |
| **Validation Speed** | **0.5 ms** | **3.5 ms** | **11.5 ms** |
| **Build/Init Time** | **12 ms** | **90 ms** | **120 ms** |
| **Heap Memory** | **3.8 MB** | **27 MB** | **163 MB** |

## API Reference

- `s.string()` - String builder with `.min()`, `.max()`, `.regex()`
- `s.number()` - Number builder with `.min()`, `.max()`, `.int()`
- `s.boolean()` - Boolean builder
- `s.object({...})` - Object builder with `.embed()`, `.extend()`
- `s.array(item)` - Array builder
- `s.selfRef(() => schema)` - Lazy reference for recursion
- `.optional()` - Mark field as optional
- `.nullable()` - Mark field as nullable

## License

[MIT](https://github.com/bytetologic/apexo.js?tab=MIT-1-ov-file)

## Repository

[https://github.com/bytetologic/apexo.js/tree/main/packages/schema](https://github.com/bytetologic/apexo.js/tree/main/packages/schema)
