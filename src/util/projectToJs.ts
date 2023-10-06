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
                scriptToExpressions(script).join("\n")
        ).join("\n")

const scriptToExpressions =
    (script: Script) =>
    script  .map(eventHandlerToFunction)
            .filter((x): x is Expression => !!x)

const eventHandlerToFunction =
    ([event, ...rest]: Block[]) => {
        if (event?.type?.startsWith("when_")) {
            return cg.call(
                event.type as Expression,
                [blockGroupToArrow(rest)]
            )
        }
    }

const blockGroupToArrow =
    (blockGroup: Block[]) =>
        cg.arrow(
            [],
            blockGroup.map(
                blockToExpression
            )
        )

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
                    .map(blockGroup => blockGroupToArrow(blockGroup))
            ]
        )
    }