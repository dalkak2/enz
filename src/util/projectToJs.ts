import { Project, Block } from "../mod.ts"
import * as cg from "./codegen.ts"

export const projectToJs =
    (project: Project) =>
        project.objects.map(
            object =>
                object.script.map(
                    x => blockGroupToJs(x)
                        .join("\n")
                ).join("\n")
        ).join("\n")

const blockGroupToJs =
    (blockGroup: Block[]): string[] => {
        if (blockGroup[0]?.type?.startsWith("when_")) {
            const [event, ...rest] = blockGroup
            return [cg.call(
                event.type,
                [cg.arrow(
                    [],
                    blockGroupToJs(rest),
                )]
            )]
        }
        return blockGroup.map(
            blockToJs
        )
    }

const blockToJs =
    (block: Block | number | string): string => {
        if (typeof block == "number")
            return block.toString()
        if (typeof block == "string")
            return `"${block}"`
        if (!block)
            return ""
        if (block.type == "number")
            return block.params[0]!.toString()
        if (block.type == "text")
            return `"${block.params[0]}"`
        return cg.call(
            block.type,
            [
                ...block.params
                    .filter((x): x is Block | number | string => !!x)
                    .map(blockToJs),
                ...block.statements
                    .map(blockGroup => cg.arrow([], blockGroupToJs(blockGroup)))
            ]
        )
    }