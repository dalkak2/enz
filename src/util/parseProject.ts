import { Project } from "../mod.ts";

export const parseProject =
    (s: string): Project =>
    JSON.parse(
        s,
        (key, value) => {
            if (
                key == "script"
                || key == "content"
            ) {
                return JSON.parse(value)
            }
            return value
        }
    )