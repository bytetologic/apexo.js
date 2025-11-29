import { createValidator } from "./common-validators";
import type { NamingConvention } from "./conventions.interface";




export const regexCamelCase = /^[a-z][a-zA-Z0-9]*$/;
export const regexPascalCase = /^[A-Z][a-zA-Z0-9]*$/;
export const regexSnakeCase = /^[a-z][a-z0-9_]*$/;
export const regexKebabCase = /^[a-z][a-z0-9-]*$/;
export const regexScreamingSnakeCase = /^[A-Z][A-Z0-9_]*$/;
export const regexBEM = /^[a-z0-9]+(?:__[a-z0-9]+)?(?:--[a-z0-9]+)?$/;
export const regexCobolCase = /^[A-Z][A-Z0-9-]*$/;

// Additional regex patterns
export const regexUpperCase = /^[A-Z]+$/;
export const regexLowerCase = /^[a-z]+$/;
export const regexDotCase = /^[a-z]+(?:\.[a-z0-9]+)*$/;
export const regexSpaceCase = /^[A-Za-z]+(?:\s[A-Za-z0-9]+)*$/;
export const regexTitleCase = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/;
export const regexTrainCase = /^[A-Z][a-zA-Z0-9]*(?:-[A-Z][a-zA-Z0-9]*)*$/;
export const regexCamelSnakeCase = /^[a-z]+(?:_[A-Za-z0-9]+)*$/;
export const regexHungarian = /^(str|num|arr|fn|obj|is|has|set|get)[A-Z][A-Za-z0-9]*$/;
export const regexNamespace = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/;
export const regexCssVariable = /^--[a-z0-9-]+$/;
export const regexEnvVar = /^[A-Z][A-Z0-9_]*$/;
export const regexHex = /^[a-fA-F0-9]+$/;
export const regexUUIDv4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const regexSqlTableCase = /^[a-z][a-z0-9_]*$/;
export const regexNoCase = /^[A-Za-z0-9.\-_ ]+$/;
export const regexSqlCase = /^[a-z][a-z0-9_]*$/;





export const isCamelCase = createValidator(regexCamelCase);
export const isPascalCase = createValidator(regexPascalCase);
export const isSnakeCase = createValidator(regexSnakeCase);
export const isKebabCase = createValidator(regexKebabCase);
export const isScreamingSnakeCase = createValidator(regexScreamingSnakeCase);
export const isCobolCase = createValidator(regexCobolCase);
export const isBEM = createValidator(regexBEM);

export const isUpperCase = createValidator(regexUpperCase);
export const isLowerCase = createValidator(regexLowerCase);
export const isDotCase = createValidator(regexDotCase);
export const isSpaceCase = createValidator(regexSpaceCase);
export const isTitleCase = createValidator(regexTitleCase);
export const isTrainCase = createValidator(regexTrainCase);
export const isCamelSnakeCase = createValidator(regexCamelSnakeCase);
export const isHungarian = createValidator(regexHungarian);
export const isNamespace = createValidator(regexNamespace);
export const isCssVariable = createValidator(regexCssVariable);
export const isEnvVar = createValidator(regexEnvVar);
export const isHex = createValidator(regexHex);
export const isUUIDv4 = createValidator(regexUUIDv4);
export const isSqlCase = createValidator(regexSqlCase);
export const isNoCase = createValidator(regexNoCase);
export const isStartedWith = (value: string, prefix: string): boolean => {
    return value.startsWith(prefix);
}
export const isEndedWith = (value: string, suffix: string): boolean => {
    return value.endsWith(suffix);
}
export const detectNamingConvention = (value: string): NamingConvention => {
    if (regexCamelCase.test(value)) return "camelCase";
    if (regexPascalCase.test(value)) return "PascalCase";
    if (regexSnakeCase.test(value)) return "snake_case";
    if (regexKebabCase.test(value)) return "kebab-case";
    if (regexScreamingSnakeCase.test(value)) return "SCREAMING_SNAKE_CASE";
    if (regexCobolCase.test(value)) return "COBOL-CASE";
    if (regexBEM.test(value)) return "BEM";

    if (regexUpperCase.test(value)) return "UPPERCASE";
    if (regexLowerCase.test(value)) return "lowercase";
    if (regexDotCase.test(value)) return "dot.case";
    if (regexSpaceCase.test(value)) return "space case";
    if (regexTitleCase.test(value)) return "Title Case";
    if (regexTrainCase.test(value)) return "Train-Case";
    if (regexCamelSnakeCase.test(value)) return "camel_snake_case";
    if (regexHungarian.test(value)) return "Hungarian";
    if (regexNamespace.test(value)) return "namespace";
    if (regexCssVariable.test(value)) return "css-variable";
    if (regexEnvVar.test(value)) return "env_variable";
    if (regexHex.test(value)) return "hex";
    if (regexUUIDv4.test(value)) return "uuid_v4";
    if (regexSqlCase.test(value)) return "sql_case";
    if (regexNoCase.test(value)) return "noCase";

    return "unknown";
};