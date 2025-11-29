// Errors
export const isError = (err: unknown): err is Error => {
    return err instanceof Error;
}

export const isTypeError = (err: unknown): err is TypeError => {
    return err instanceof TypeError;
}

export const isReferenceError = (err: unknown): err is ReferenceError => {
    return err instanceof ReferenceError;
}

export const isSyntaxError = (err: unknown): err is SyntaxError => {
    return err instanceof SyntaxError;
}

export const isRangeError = (err: unknown): err is RangeError => {
    return err instanceof RangeError;
}

export const isURIError = (err: unknown): err is URIError => {
    return err instanceof URIError;
}

export const isEvalError = (err: unknown): err is EvalError => {
    return err instanceof EvalError;
}

export const isAggregateError = (err: unknown): err is AggregateError => {
    return typeof AggregateError !== "undefined" && err instanceof AggregateError;
}
