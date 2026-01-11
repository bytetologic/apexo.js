# @apexo/schema (BETA)

> **⚠️ WARNING: UNSTABLE VERSION**  
> This package is currently in **Beta** and under active development. APIs are subject to change without notice. Not recommended for production use yet.

`@apexo/schema` is a next-generation, zero-dependency schema validation library designed for extreme performance. Unlike traditional libraries that interpret schemas at runtime, Apexo uses an **Ahead-Of-Time (AOT) Compiler** to generate a highly optimized Intermediate Representation (IR).

## ✨ Key Features

- **🚀 Extreme Performance**: Up to **23x faster** than Zod for complex enterprise schemas.
- **📦 Zero Startup Overhead**: Schemas are compiled to a serializable IR at build-time, enabling $O(1)$ startup.
- **🛡️ Type Inference**: Full TypeScript support with `Infer<T>`, including support for optional keys and complex nesting.
- **🧩 Structural Deduplication**: Identical schema fragments are automatically interned and shared to minimize memory footprint.
- **⚡ Bitmask Optimization**: Uses CPU-level bitwise operations for lightning-fast required field validation (up to 31 properties).
- **🔒 Build-Time Safety**: Detects structural cycles and invalid references during compilation, preventing runtime crashes.

## 🛠️ Installation

```bash
pnpm add @apexo/schema
```

## 🚀 Quick Start

### 1. Define your Schema
```typescript
import { s, Infer } from '@apexo/schema';

const UserSchema = s.object({
  id: s.number().int(),
  name: s.string().min(2),
  email: s.string().optional(),
  tags: s.array(s.string())
});

// Static Type Inference
type User = Infer<typeof UserSchema>;
```

### 2. Compile and Validate
```typescript
import { buildSchema, createValidator } from '@apexo/schema';

// 1. Compile to IR (Do this once at the top level or during build)
const registry = buildSchema(UserSchema);

// 2. Create a high-speed validator
const validator = createValidator(registry);

// 3. Validate data
const result = validator.validate({
  id: 1,
  name: "Apexo",
  tags: ["fast", "lean"]
});

if (result.success) {
  console.log("Validated Data:", result.data);
} else {
  console.error("Validation Errors:", result.errors);
}
```

## 📊 Performance Benchmarks

In our stress tests (100 nested levels, 10,000 property definitions):

| Metric | @apexo/schema | Joi | Zod |
| :--- | :--- | :--- | :--- |
| **Avg. Validation Time** | **~0.5ms** | **~3.5ms** | **~11.5ms** |
| **Startup/Build Time** | **~12ms** | **~90ms** | **~120ms** |
| **Memory Usage** | **~4MB** | **~27MB** | **~165MB** |

## 📐 Architecture

Apexo works by decoupling **Schema Definition** from **Validation Execution**:
1. **Builders**: Create a lightweight AST.
2. **Compiler**: Flattens, deduplicates, and optimizes the AST into a `SchemaRegistry`.
3. **Runtime**: A monomorphic interpreter loop that executes the "Validation Plan" stored in the IR.

## 📜 License

MIT
