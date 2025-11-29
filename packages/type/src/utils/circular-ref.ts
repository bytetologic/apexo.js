export interface CircularResult {
    hasCircular: boolean;
    path: string | null;
}

export const hasCircularReference = (obj: unknown): CircularResult => {
    const seen = new WeakMap<object, string>(); // Track visited references

    const detect = (value: unknown, path: string): CircularResult => {
        if (value === null || typeof value !== "object") {
            return { hasCircular: false, path: null };
        }

        // Already seen → circular reference detected
        if (seen.has(value)) {
            return {
                hasCircular: true,
                path: `${seen.get(value)} -> ${path}`,
            };
        }

        // Mark as seen
        seen.set(value, path);

        // --------------------------
        // ARRAY
        // --------------------------
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                const result = detect(value[i], `${path}[${i}]`);
                if (result.hasCircular) return result;
            }
            return { hasCircular: false, path: null };
        }

        // --------------------------
        // MAP
        // --------------------------
        if (value instanceof Map) {
            let index = 0;
            for (const [key, val] of value) {
                const keyPath = `${path}.<MapKey#${index}>`;
                const valPath = `${path}.<MapValue#${index}>`;

                let res = detect(key, keyPath);
                if (res.hasCircular) return res;

                res = detect(val, valPath);
                if (res.hasCircular) return res;

                index++;
            }
            return { hasCircular: false, path: null };
        }

        // --------------------------
        // SET
        // --------------------------
        if (value instanceof Set) {
            let index = 0;
            for (const item of value) {
                const result = detect(item, `${path}.<Set#${index}>`);
                if (result.hasCircular) return result;
                index++;
            }
            return { hasCircular: false, path: null };
        }

        // --------------------------
        // TYPED ARRAYS
        // --------------------------
        if (ArrayBuffer.isView(value)) {
            // Typed arrays cannot have circular references in their primitive elements
            return { hasCircular: false, path: null };
        }

        // --------------------------
        // NORMAL OBJECT
        // --------------------------
        const keys = [
            ...Object.keys(value),
            ...Object.getOwnPropertySymbols(value).map((s) => s.toString()),
        ];

        for (const key of keys) {
            // Use safe access
            let nextValue: unknown;
            try {
                nextValue = (value as any)[key];
            } catch {
                continue; // Skip getters that throw
            }

            const result = detect(nextValue, `${path}.${String(key)}`);
            if (result.hasCircular) return result;
        }

        return { hasCircular: false, path: null };
    };

    return detect(obj, "root");
};
