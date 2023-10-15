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
import { parseProject } from "./parseProject.ts"
import {
    functionToArrow,
    objectToExpressions,
} from "./projectToJs.ts"

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
        return objectToExpressions(object).join("\n")
    }
    visitFunction({id, content, localVariables}: Function_) {
        const expr = functionToArrow(
            content[0][0],
            localVariables.map(
                ({id}) => `let v_${id}` as Expression
            )
        )
        return `Entry.func_${id} = ${expr}`
    }
}

/*
const visitor = new Visitor()
console.log(
    visitor.visitProject(
        parseProject(
            await Deno.readTextFile("test/proj1.json")
        )
    )
)
*/