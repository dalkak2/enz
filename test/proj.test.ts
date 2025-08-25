import {
    parseProject,
    Visitor,
} from "../mod.ts"

import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts"

const proj2js =
    async (name: string) =>
    (new Visitor).visitProject(
        parseProject(
            await Deno.readTextFile(`test/${name}.json`)
        )
    )

const projTest = (name: string) => 
    Deno.test(name, async () => {
        assertEquals(
            (await proj2js(name))
                .replaceAll("\r\n", "\n"),
            (await Deno.readTextFile(`test/${name}.js`))
                .replaceAll("\r\n", "\n"),
        )
    })

projTest("proj1")
projTest("proj2")
projTest("fib")
projTest("memoInFun")
