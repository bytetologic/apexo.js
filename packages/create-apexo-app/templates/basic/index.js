const { isString, isNumber, isEmail, isObject, isEmpty } = require('@apexo/type');

console.log('🚀 Welcome to Apexo!\n');

// Example 1: Basic type validation
console.log('Example 1: Basic Type Validation');
console.log('----------------------------------');

const testString = 'Hello, Apexo!';
const testNumber = 42;
const testInvalid = null;

console.log(`isString("${testString}"):`, isString(testString)); // true
console.log(`isNumber(${testNumber}):`, isNumber(testNumber)); // true
console.log(`isString(${testInvalid}):`, isString(testInvalid)); // false
console.log('');

// Example 2: Object validation
console.log('Example 2: Object Validation');
console.log('----------------------------');

const user = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
};

console.log('User object:', user);
console.log('isObject(user):', isObject(user)); // true
console.log('isEmpty(user):', isEmpty(user)); // false
console.log('');

// Example 3: Validating user input
console.log('Example 3: Validating User Input');
console.log('---------------------------------');

function validateUser(data) {
    if (!isObject(data)) {
        return { valid: false, error: 'Data must be an object' };
    }

    if (!isString(data.name) || isEmpty(data.name)) {
        return { valid: false, error: 'Name must be a non-empty string' };
    }

    if (!isNumber(data.age) || data.age < 0) {
        return { valid: false, error: 'Age must be a positive number' };
    }

    return { valid: true };
}

const validUser = { name: 'Alice', age: 25 };
const invalidUser = { name: '', age: -5 };

console.log('Validating valid user:', validateUser(validUser));
console.log('Validating invalid user:', validateUser(invalidUser));
console.log('');

console.log('✨ Check out the Apexo documentation for more examples!');
