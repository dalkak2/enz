type Brand<K, T> = K & { __brand: T }
export type Expression = Brand<string, "Expression">
export type Statement = Brand<string, "Statement"> | Expression

export const call =
    (callee: Expression, params: Expression[]) =>
    `${callee}(${params.join(", ")})` as Expression

export const arrow =
    (params: Expression[], statements: Statement[]) =>
    `(${params.join(", ")}) => {${statements.join("; ")}}` as Expression