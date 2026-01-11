# @apexo/schema (BETA)

> **⚠️ WARNING: UNSTABLE VERSION**  
> This package is currently in **Beta** and under active development. APIs are subject to change without notice. Not recommended for production use yet.

Does your application feel slow during cold starts due to complex validation logic? Or maybe you're concerned about large validation trees bloating your bundle and consuming excessive memory?

**@apexo/schema** is a next-generation, zero-dependency schema validation library designed for extreme performance. Unlike traditional libraries that interpret schemas at runtime, Apexo uses an **Ahead-Of-Time (AOT) Compiler** to generate a highly optimized Intermediate Representation (IR) that makes validation lightning-fast and memory-efficient.

## Why Apexo Schema?

Validation in JavaScript traditionally happens in two ways:
1.  **Interpreted**: Easy to use, but can be slow at scale and memory-heavy because they build complex object trees at runtime.
2.  **Code Gen**: Fast, but often requires `eval()` or complex build steps, which can be problematic for Edge functions or restricted environments.

**@apexo/schema** combines the best of both approaches:
- **🚀 Extreme Speed**: Optimized validation throughput designed for high-load systems.
- **📦 Tiny Footprint**: Highly efficient memory usage via structural deduplication.
- **🛡️ Secure & Portable**: No `eval()` or `new Function()`. Runs anywhere—Edge, Browser, or Server.

## How it works?

Instead of interpreting a deep object tree every time you validate, Apexo compiles your schema into a **Flat Validation Plan** (IR) at build-time. This IR is a simple, serializable data structure that the runtime engine executes with minimal overhead.

```typescript
import { s, buildSchema, createValidator } from '@apexo/schema';

// 1. Define your schema
const UserSchema = s.object({
  id: s.number().int(),
  name: s.string().min(2),
  tags: s.array(s.string())
});

// 2. Compile to IR (Done once at build or load time)
const registry = buildSchema(UserSchema);

// 3. High-speed validator
const validator = createValidator(registry);
```

## Core Advantages

- **Near Zero Startup**: By moving structural analysis to "Compile Time," the runtime entry cost is practically eliminated. The generated IR can be constant-folded by modern bundlers.
- **Memory Efficiency**: Aggressive structural interning ensures that even massive enterprise schemas occupy minimal heap space.
- **CPU-Level Bitmasks**: We use 32-bit integers to validate required fields in objects. For objects with up to 31 properties, checking "Required" status happens in a single CPU cycle.

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

### Type Inference

Apexo is first-class TypeScript. You can infer static types directly from your schema definitions.

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

Handling linked lists or category trees is easy with `selfRef`. Note that for recursive types, an explicit interface and type annotation are often required.

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

## Performance Profile (10,000 Fields Stress Test)

| Metric | @apexo/schema Performance |
| :--- | :--- |
| **Validation Speed** | **< 1.0 ms** |
| **Compiler Build Time** | **< 15 ms** |
| **Heap Memory Usage** | **< 5 MB** |

*Stats based on a deeply nested 100x100 property schema.*

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
