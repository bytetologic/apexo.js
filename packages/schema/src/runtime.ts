import {
    isString, isNumber, isBoolean, isObject, isArray, isNil, isUndefined
} from '@apexo/type';
import { SchemaRegistry, IRNode, SchemaId } from './ir';

export interface ValidationError {
    path: string;
    message: string;
}

export interface ValidationSuccess<T = any> {
    success: true;
    data: T;
}

export interface ValidationFailure {
    success: false;
    errors: ValidationError[];
}

export type ValidationResult<T = any> = ValidationSuccess<T> | ValidationFailure;

export class ApexoValidator {
    constructor(private registry: SchemaRegistry) { }

    validate(data: any): ValidationResult {
        const errors: ValidationError[] = [];
        this.walk(this.registry.root, data, '', errors);

        if (errors.length > 0) {
            return { success: false, errors };
        }

        return { success: true, data };
    }

    private walk(id: SchemaId, value: any, path: string, errors: ValidationError[]) {
        const node = this.registry.nodes[id];
        if (!node) {
            throw new Error(`Critical: IR Node ${id} not found in registry.`);
        }

        // 1. Optionality/Nullability Check
        if (value === undefined) {
            if (!node.optional) {
                errors.push({ path, message: 'is required' });
            }
            return;
        }

        if (value === null) {
            if (!node.nullable) {
                errors.push({ path, message: 'cannot be null' });
            }
            return;
        }

        // 2. Type-specific validation
        switch (node.type) {
            case 'string': {
                if (!isString(value)) {
                    errors.push({ path, message: 'must be a string' });
                    return;
                }
                for (const check of node.checks) {
                    if (check.kind === 'min' && value.length < check.val) {
                        errors.push({ path, message: `must be at least ${check.val} characters` });
                    } else if (check.kind === 'max' && value.length > check.val) {
                        errors.push({ path, message: `must be at most ${check.val} characters` });
                    } else if (check.kind === 'regex') {
                        const re = new RegExp(check.pattern, check.flags);
                        if (!re.test(value)) {
                            errors.push({ path, message: 'invalid format' });
                        }
                    }
                }
                break;
            }
            case 'number': {
                if (!isNumber(value)) {
                    errors.push({ path, message: 'must be a number' });
                    return;
                }
                for (const check of node.checks) {
                    if (check.kind === 'min' && value < check.val) {
                        errors.push({ path, message: `must be at least ${check.val}` });
                    } else if (check.kind === 'max' && value > check.val) {
                        errors.push({ path, message: `must be at most ${check.val}` });
                    } else if (check.kind === 'int' && !Number.isInteger(value)) {
                        errors.push({ path, message: 'must be an integer' });
                    }
                }
                break;
            }
            case 'boolean': {
                if (!isBoolean(value)) {
                    errors.push({ path, message: 'must be a boolean' });
                }
                break;
            }
            case 'object': {
                if (!isObject(value)) {
                    errors.push({ path, message: 'must be an object' });
                    return;
                }

                const shape = node.shape;
                const keys = Object.keys(shape);

                // Bitmask optimization (Up to 31 keys)
                if (keys.length <= 31 && node.reqMask !== 0) {
                    let presentMask = 0;
                    for (let i = 0; i < keys.length; i++) {
                        if (value[keys[i]] !== undefined) {
                            presentMask |= (1 << i);
                        }
                    }
                    if ((presentMask & node.reqMask) !== node.reqMask) {
                        // Some required fields are missing. 
                        // We continue to identify WHICH ones for detailed errors.
                    }
                }

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const nextPath = path ? `${path}.${key}` : key;
                    this.walk(shape[key], value[key], nextPath, errors);
                }
                break;
            }
            case 'array': {
                if (!isArray(value)) {
                    errors.push({ path, message: 'must be an array' });
                    return;
                }
                for (let i = 0; i < value.length; i++) {
                    const nextPath = `${path}[${i}]`;
                    this.walk(node.item, value[i], nextPath, errors);
                }
                break;
            }
            case 'ref': {
                this.walk(node.target, value, path, errors);
                break;
            }
        }
    }
}

export function createValidator(registry: SchemaRegistry): ApexoValidator {
    return new ApexoValidator(registry);
}
