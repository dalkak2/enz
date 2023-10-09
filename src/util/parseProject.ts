import {
    Picture,
    Sound,
    Object_,
    Variable,
    Message,
    Function_,
    Scene,
    Project
} from "../mod.ts";

export const parseProject =
    (s: string): Project =>
    JSON.parse(
        s,
        (key, value) => {
            if (key == "script") {
                return JSON.parse(value)
            }
            return value
        }
    )