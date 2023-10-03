export const call =
    (callee: string, args: string[]) =>
    `${callee}(${args.join(", ")})`

export const arrow =
    (args: string[], statements: string[]) =>
    `(${args.join(",")}) => {${statements.join("; ")}}`