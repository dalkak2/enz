import {
    Project,
    Block,
    Script,
} from "../mod.ts"
import * as cg from "./codegen.ts"
import {
    Expression,
    Statement,
} from "./codegen.ts"

export const projectToJs =
    (project: Project) =>
        project.objects.map(
            ({script}) =>
                scriptToJs(script)
        ).join("\n")

const scriptToJs =
    (script: Script) =>
    script.map(
        x => blockGroupToStatements(x)
            .join("\n")
    ).join("\n")

const blockGroupToStatements =
    (blockGroup: Block[]): Statement[] => {
        if (blockGroup[0]?.type?.startsWith("when_")) {
            const [event, ...rest] = blockGroup
            return [cg.call(
                event.type as Expression,
                [cg.arrow(
                    [],
                    blockGroupToStatements(rest),
                )]
            )]
        }
        return blockGroup.map(
            blockToExpression
        )
    }

const blockToExpression =
    (block: Block | number | string): Expression => {
        if (typeof block == "number")
            return block.toString() as Expression

        if (typeof block == "string")
            return `"${block}"` as Expression
        
        if (!block)
            return "" as Expression

        if (block.type == "number")
            return block.params[0]!.toString() as Expression

        if (block.type == "text")
            return `"${block.params[0]}"` as Expression

        return cg.call(
            block.type as Expression,
            [
                ...block.params
                    .filter((x): x is Block | number | string => !!x)
                    .map(blockToExpression),
                ...block.statements
                    .map(blockGroup => cg.arrow([], blockGroupToStatements(blockGroup)))
            ]
        )
    }