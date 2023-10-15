import {
    Project,
    Block,
    Script,
    Object_,
    Function_,
} from "../mod.ts"
import * as cg from "./codegen.ts"
import {
    Expression,
} from "./codegen.ts"

import JSON5 from "https://esm.sh/json5@2.2.3"

export class Visitor {
    visitProject(project: Project) {
        return [
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
            ),
            "",
            project.functions.map(
                this.visitFunction.bind(this)
            ).join("\n"),
            "",
            project.objects.map(
                this.visitObject.bind(this)
            ).join("\n"),
        ].join("\n")
    }

    visitObject(object: Object_) {
        return this.objectToExpressions(object).join("\n")
    }

    visitFunction({id, content, localVariables}: Function_) {
        const expr = this.functionToArrow(
            content[0][0],
            localVariables.map(
                ({id}) => `let v_${id}` as Expression
            )
        )
        return `Entry.func_${id} = ${expr}`
    }

    objectToExpressions({script, id}: Object_) {
        return this.scriptToExpressions(script)
            .map(expr => expr.replaceAll("$obj$", id) as Expression)
    }

    scriptToExpressions(script: Script) {
        return script
            .map(this.eventHandlerToFunction.bind(this))
            .filter((x): x is Expression => !!x)
    }

    paramsToExpressions(params: (string | number | Block | null)[]) {
        return params
            .filter((x): x is Block | number | string => !!x)
            .map(this.blockToExpression.bind(this))
    }

    eventHandlerToFunction([event, ...rest]: Block[]) {
        if (event?.type?.startsWith("when_")) {
            return cg.call(
                "Entry." + event.type as Expression,
                [
                    ...this.paramsToExpressions(event.params),
                    this.blockGroupToArrow(rest)
                ]
            )
        }
    }

    getFunctionArgs(param: Block | null | undefined): Expression[] {
        if (!param) return []

        const {type, params} = param

        if (type == "function_field_label") {
            return this.getFunctionArgs(params[1] as Block)
        }
        if (
            type == "function_field_string"
            || type == "function_field_boolean"
        ) {
            return [
                (params[0] as Block).type as Expression,
                ...this.getFunctionArgs(params[1] as Block),
            ]
        }
        throw "You can't reach here"
    }

    functionToArrow(
        {params, statements}: Block,
        injectBefore: Expression[] = [],
    ) {
        return cg.arrow(
            [
                ...this.getFunctionArgs(params[0] as Block),
                "obj" as Expression,
            ],
            [
                ...injectBefore,
                ...statements[0].map(
                    this.blockToExpression.bind(this)
                ),
                ...(
                    params[3]
                        ? ["return " + this.blockToExpression(params[3]) as Expression]
                        : []
                )
            ]
        )
        .replaceAll(`"$obj$"`, "obj") as Expression
    }

    blockGroupToArrow(blockGroup: Block[]) {
        return cg.arrow(
            [],
            blockGroup.map(
                this.blockToExpression.bind(this)
            )
        )
    }

    blockToExpression(block: Block | number | string): Expression {
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
        
        if (block.type == "set_func_variable")
            return `v_${
                block.params[0]
            } = ${
                this.blockToExpression(block.params[1]!)
            }` as Expression
        
        if (block.type == "get_func_variable")
            return `v_${block.params[0]}` as Expression

        return this.normalBlockToExpression(block)
    }
    normalBlockToExpression(block: Block) {
        return cg.call(
            "Entry." + block.type as Expression,
            [
                ...this.paramsToExpressions(block.params),
                ...block.statements
                    .map(blockGroup => this.blockGroupToArrow.bind(this)(blockGroup)),
                `"$obj$"` as Expression
            ]
        )
    }
}