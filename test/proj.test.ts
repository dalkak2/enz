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
        `Entry.when_run_button_click(() => {Entry.if_else(Entry.boolean_basic_operator(Entry.calc_basic(10, "PLUS", 10, "$obj$"), "LESS", "2", "$obj$"), () => {Entry.dialog("안녕!", "speak", "$obj$"); Entry.change_to_some_shape(Entry.get_pictures("4t48", "$obj$"), "$obj$")}, () => {Entry.move_x(10, "$obj$")}, "$obj$")})\nEntry.when_some_key_pressed(() => {Entry.locate_object_time(2, "mouse", "$obj$")})`
    )
})
