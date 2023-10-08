import {
    Project,
    Block,
    Script,
    Object_,
} from "../mod.ts"
import * as cg from "./codegen.ts"
import {
    Expression,
} from "./codegen.ts"

export const projectToJs =
    (project: Project) =>
        project.objects.map(
            objectToExpressions
        ).join("\n")

export const objectToExpressions =
    ({script, id}: Object_) =>
    scriptToExpressions(script).join("\n").replaceAll(`$obj$`, id)

export const scriptToExpressions =
    (script: Script) =>
    script  .map(eventHandlerToFunction)
            .filter((x): x is Expression => !!x)

export const paramsToExpressions =
    (params: (string | number | Block | null)[]) =>
    params
        .filter((x): x is Block | number | string => !!x)
        .map(blockToExpression)

export const eventHandlerToFunction =
    ([event, ...rest]: Block[]) => {
        if (event?.type?.startsWith("when_")) {
            return cg.call(
                "Entry." + event.type as Expression,
                [
                    ...paramsToExpressions(event.params),
                    blockGroupToArrow(rest)
                ]
            )
        }
    }

export const blockGroupToArrow =
    (blockGroup: Block[]) =>
        cg.arrow(
            [],
            blockGroup.map(
                blockToExpression
            )
        )

export const blockToExpression =
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
            "Entry." + block.type as Expression,
            [
                ...paramsToExpressions(block.params),
                ...block.statements
                    .map(blockGroup => blockGroupToArrow(blockGroup)),
                `"$obj$"` as Expression
            ]
        )
    }