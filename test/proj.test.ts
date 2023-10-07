import {
    parseProject,
    projectToJs,
} from "../mod.ts"

import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts"

const proj2js =
    async (name: string) =>
    projectToJs(
        parseProject(
            await Deno.readTextFile(`test/${name}.json`)
        )
    )

Deno.test("proj1", async () => {
    assertEquals(
        await proj2js("proj1"),
        await Deno.readTextFile(`test/proj1.js`)
    )
})
