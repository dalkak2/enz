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

import JSON5 from "https://esm.sh/json5@2.2.3"

export const projectToJs =
    (project: Project) =>
        cg.call(
            "init" as Expression,
            [JSON5.stringify({
                ...project,
                objects: project.objects.map(
                    ({script: _, ...rest}) => rest
                ),
                functions: project.functions.map(
                    ({content: _, ...rest}) => rest
                ),
            }) as Expression]
        )
        + "\n\n"
        + project.functions.map(
                ({id, content}) => {
                    console.log(content)
                    const expr = scriptToExpressions(content)
                    return `Entry.func_${id} = ${expr}`
                }
            ).join("\n")
        + "\n\n"
        + project.objects.map(
            objectToExpressions
        ).flat().join("\n")
    
        

export const objectToExpressions =
    ({script, id}: Object_) =>
        scriptToExpressions(script)
        .map(expression => expression.replaceAll(`$obj$`, id) as Expression)

export const scriptToExpressions =
    (script: Script) =>
        script
            .map(eventHandlerToFunction)
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
        if (event?.type == "function_create") {
            return functionToArrow(event)
        }
    }

export const getFunctionArgs =
    (param: Block | null | undefined): Expression[] => {
        if (!param) return []

        const {type, params} = param

        if (type == "function_field_label") {
            return getFunctionArgs(params[1] as Block)
        }
        if (
            type == "function_field_string"
            || type == "function_field_boolean"
        ) {
            return [
                (params[0] as Block).type as Expression,
                ...getFunctionArgs(params[1] as Block),
            ]
        }
        throw "You can't reach here"
    }

export const functionToArrow =
    ({params, statements}: Block) => 
        cg.arrow(
            getFunctionArgs(params[0] as Block),
            statements[0].map(
                blockToExpression
            )
        )
        .replaceAll(`, "$obj$"`, "")
        .replaceAll(`"$obj$"`, "") as Expression

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

        if (
            block.type.startsWith("stringParam_")
            || block.type.startsWith("booleanParam_")
        )
            return block.type as Expression

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