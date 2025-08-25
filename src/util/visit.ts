import {
    Project,
    Block,
    Script,
    Object_,
    Function_,
} from "../mod.ts"
import * as cg from "./codegen.ts"
import type {
    Expression,
} from "./codegen.ts"

import JSON5 from "https://esm.sh/json5@2.2.3"

export const stringExpr =
    (str: string) => 
    `"` + str.replaceAll(`"`, `\\"`) + `"` as Expression

export const idCheck =
    (id: string) => {
        if (/[^a-zA-Z0-9_]/.test(id)) {
            throw new Error(`ID '${id}' is not safe!`)
        }
        return id
    }

export class Visitor {
    visitProject(project: Project) {
        return [
            cg.call(
                "init" as Expression,
                [JSON5.stringify(this.getInitData(project)) as Expression]
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

    getInitData(project: Project) {
        return {
            ...project,
            objects: project.objects.map(
                ({script: _, ...rest}) => rest
            ),
            functions: project.functions.map(
                ({content: _, ...rest}) => rest
            ),
        }
    }

    visitObject(object: Object_) {
        return this.objectToExpressions(object).join("\n")
    }

    visitFunction({id, content, localVariables}: Function_) {
        const funcHead = content.find(([head]) =>
            head.type == "function_create"
            || head.type == "function_create_value"
        )?.[0] as Block | undefined
            

        if (!funcHead) {
            throw new Error(`"function_create" or "function_create_value" is not exist in function "${id}"`)
        }

        const expr = this.functionToArrow(
            funcHead,
            localVariables?.map(
                ({id}) => `let v_${idCheck(id)}` as Expression
            )
        )
        return `Entry.func_${idCheck(id)} = ${expr}`
    }

    objectToExpressions({script, id}: Object_) {
        return this.scriptToExpressions(script)
            .map(expr => expr.replaceAll("$obj$", idCheck(id)) as Expression)
    }

    scriptToExpressions(script: Script) {
        return script
            .map(blocks => this.eventHandlerToFunction(
                blocks.filter(x => x.type != "comment") as Block[]
            ))
            .filter((x): x is Expression => !!x)
    }

    paramsToExpressions(params: (string | number | Block | null)[]) {
        return params
            .filter((x): x is Block | number | string => x == 0 || x == "" || !!x)
            .map(this.blockToExpression.bind(this))
    }

    eventHandlerToFunction([event, ...rest]: Block[]) {
        if (
            event?.type?.startsWith("when_")
            || [
                "mouse_clicked",
                "mouse_click_cancled",
            ].includes(event?.type)
        ) {
            return cg.call(
                "Entry." + event.type as Expression,
                [
                    ...this.paramsToExpressions(event.params),
                    this.blockGroupToArrow(rest),
                    stringExpr("$obj$"),
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
                ...statements?.[0]?.map(
                    this.blockToExpression.bind(this)
                ) || [],
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
    
        if (!Number.isNaN(Number(block)))
            return Number(block).toString() as Expression

        if (typeof block == "string")
            return stringExpr(block)
        
        if (!block)
            return "" as Expression

        if (block.type == "number" || block.type == "text")
            return this.blockToExpression(block.params[0]!)

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
                ...(block.statements || [])
                    .map(blockGroup => this.blockGroupToArrow.bind(this)(blockGroup || [])),
                stringExpr("$obj$"),
            ]
        )
    }
}