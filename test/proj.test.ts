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
        `when_run_button_click(() => {if_else(boolean_basic_operator(calc_basic(10, "PLUS", 10), "LESS", "2"), () => {dialog("안녕!", "speak"); change_to_some_shape(get_pictures("4t48"))}, () => {move_x(10)})})\nwhen_some_key_pressed(() => {locate_object_time(2, "mouse")})`
    )
})
