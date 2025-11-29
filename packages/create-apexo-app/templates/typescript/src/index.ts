import { isString, isNumber, isObject, isEmpty } from '@apexo/type';

console.log('🚀 Welcome to Apexo with TypeScript!\n');

// Example 1: Basic type validation with type guards
console.log('Example 1: Type Guards');
console.log('---------------------');

function processValue(value: unknown): string {
    if (isString(value)) {
        // TypeScript knows value is a string here
        return `String: ${value.toUpperCase()}`;
    }

    if (isNumber(value)) {
        // TypeScript knows value is a number here
        return `Number: ${value.toFixed(2)}`;
    }

    return 'Unknown type';
}

console.log(processValue('hello')); // String: HELLO
console.log(processValue(42.567)); // Number: 42.57
console.log(processValue(true)); // Unknown type
console.log('');

// Example 2: Type-safe object validation
console.log('Example 2: Type-Safe Object Validation');
console.log('---------------------------------------');

interface User {
    name: string;
    age: number;
    email: string;
}

interface ValidationResult<T> {
    valid: boolean;
    data?: T;
    error?: string;
}

function validateUser(data: unknown): ValidationResult<User> {
    if (!isObject(data)) {
        return { valid: false, error: 'Data must be an object' };
    }

    const { name, age, email } = data;

    if (!isString(name) || isEmpty(name)) {
        return { valid: false, error: 'Name must be a non-empty string' };
    }

    if (!isNumber(age) || age < 0) {
        return { valid: false, error: 'Age must be a positive number' };
    }

    if (!isString(email) || isEmpty(email)) {
        return { valid: false, error: 'Email must be a non-empty string' };
    }

    return {
        valid: true,
        data: { name, age, email }
    };
}

const validUserData = { name: 'Alice', age: 25, email: 'alice@example.com' };
const invalidUserData = { name: '', age: -5, email: 'invalid' };

const result1 = validateUser(validUserData);
const result2 = validateUser(invalidUserData);

console.log('Valid user result:', result1);
console.log('Invalid user result:', result2);
console.log('');

// Example 3: Using validated data with type safety
console.log('Example 3: Type-Safe Data Usage');
console.log('--------------------------------');

function greetUser(data: unknown): void {
    const validation = validateUser(data);

    if (validation.valid && validation.data) {
        // TypeScript knows validation.data is User type
        const { name, age } = validation.data;
        console.log(`Hello, ${name}! You are ${age} years old.`);
    } else {
        console.log(`Validation failed: ${validation.error}`);
    }
}

greetUser(validUserData);
greetUser(invalidUserData);
console.log('');

console.log('✨ Check out the Apexo documentation for more examples!');
