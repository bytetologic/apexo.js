import {
    isCamelCase,
    isPascalCase,
    isSnakeCase,
    isKebabCase,
    isScreamingSnakeCase,
    isCobolCase,
    isBEM,
    isUpperCase,
    isLowerCase,
    isDotCase,
    isSpaceCase,
    isTitleCase,
    isTrainCase,
    isCamelSnakeCase,
    isHungarian,
    isNamespace,
    isCssVariable,
    isEnvVar,
    isHex,
    isUUIDv4,
    isSqlCase,
    isNoCase,
    isStartedWith,
    isEndedWith,
    detectNamingConvention,
} from "../src/conventions";

describe("Convention Validators", () => {
    test("isCamelCase", () => {
        expect(isCamelCase("camelCase")).toBe(true);
        expect(isCamelCase("PascalCase")).toBe(false);
    });

    test("isPascalCase", () => {
        expect(isPascalCase("PascalCase")).toBe(true);
        expect(isPascalCase("camelCase")).toBe(false);
    });

    test("isSnakeCase", () => {
        expect(isSnakeCase("snake_case")).toBe(true);
        expect(isSnakeCase("camelCase")).toBe(false);
    });

    test("isKebabCase", () => {
        expect(isKebabCase("kebab-case")).toBe(true);
        expect(isKebabCase("camelCase")).toBe(false);
    });

    test("isScreamingSnakeCase", () => {
        expect(isScreamingSnakeCase("SCREAMING_SNAKE_CASE")).toBe(true);
        expect(isScreamingSnakeCase("snake_case")).toBe(false);
    });

    test("isCobolCase", () => {
        expect(isCobolCase("COBOL-CASE")).toBe(true);
        expect(isCobolCase("kebab-case")).toBe(false);
    });

    test("isBEM", () => {
        expect(isBEM("block__element--modifier")).toBe(true);
        expect(isBEM("block")).toBe(true);
        expect(isBEM("Invalid")).toBe(false);
    });

    test("isUpperCase", () => {
        expect(isUpperCase("UPPERCASE")).toBe(true);
        expect(isUpperCase("lowercase")).toBe(false);
    });

    test("isLowerCase", () => {
        expect(isLowerCase("lowercase")).toBe(true);
        expect(isLowerCase("UPPERCASE")).toBe(false);
    });

    test("isDotCase", () => {
        expect(isDotCase("dot.case")).toBe(true);
        expect(isDotCase("dot case")).toBe(false);
    });

    test("isSpaceCase", () => {
        expect(isSpaceCase("Space Case")).toBe(true);
        expect(isSpaceCase("123")).toBe(false);
    });

    test("isTitleCase", () => {
        expect(isTitleCase("Title Case")).toBe(true);
        expect(isTitleCase("title case")).toBe(false);
    });

    test("isTrainCase", () => {
        expect(isTrainCase("Train-Case")).toBe(true);
        expect(isTrainCase("train-case")).toBe(false);
    });

    test("isCamelSnakeCase", () => {
        expect(isCamelSnakeCase("camel_snake_case")).toBe(true);
        expect(isCamelSnakeCase("camelSnakeCase")).toBe(false);
    });

    test("isHungarian", () => {
        expect(isHungarian("strString")).toBe(true);
        expect(isHungarian("numNumber")).toBe(true);
        expect(isHungarian("String")).toBe(false);
    });

    test("isNamespace", () => {
        expect(isNamespace("Name.Space")).toBe(true);
        expect(isNamespace("NameSpace")).toBe(true); // Regex allows no dots too? /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/
        // "NameSpace" matches the first part.
        expect(isNamespace("123")).toBe(false);
    });

    test("isCssVariable", () => {
        expect(isCssVariable("--variable")).toBe(true);
        expect(isCssVariable("variable")).toBe(false);
    });

    test("isEnvVar", () => {
        expect(isEnvVar("ENV_VAR")).toBe(true);
        expect(isEnvVar("env_var")).toBe(false);
    });

    test("isHex", () => {
        expect(isHex("fff")).toBe(true);
        expect(isHex("123")).toBe(true);
        expect(isHex("zzz")).toBe(false);
    });

    test("isUUIDv4", () => {
        expect(isUUIDv4("123e4567-e89b-42d3-a456-426614174000")).toBe(true);
        expect(isUUIDv4("invalid")).toBe(false);
    });

    test("isSqlCase", () => {
        expect(isSqlCase("sql_case")).toBe(true); // regexSqlCase = /^[a-z][a-z0-9_]*$/
        expect(isSqlCase("SQL_CASE")).toBe(false);
    });

    test("isNoCase", () => {
        expect(isNoCase("no case")).toBe(true);
        expect(isNoCase("no.case")).toBe(true);
    });

    test("isStartedWith", () => {
        expect(isStartedWith("hello world", "hello")).toBe(true);
        expect(isStartedWith("hello world", "world")).toBe(false);
    });

    test("isEndedWith", () => {
        expect(isEndedWith("hello world", "world")).toBe(true);
        expect(isEndedWith("hello world", "hello")).toBe(false);
    });

    test("detectNamingConvention", () => {
        expect(detectNamingConvention("camelCase")).toBe("camelCase");
        expect(detectNamingConvention("PascalCase")).toBe("PascalCase");
        expect(detectNamingConvention("snake_case")).toBe("snake_case");
        expect(detectNamingConvention("kebab-case")).toBe("kebab-case");
        expect(detectNamingConvention("SCREAMING_SNAKE_CASE")).toBe("SCREAMING_SNAKE_CASE");
    });
});
