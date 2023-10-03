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
            if (Array.isArray(value)) {
                return value.map(
                    x => new ({
                        pictures: Picture,
                        sounds: Sound,
                        objects: Object_,
                        variables: Variable,
                        messages: Message,
                        functions: Function_,
                        scenes: Scene,
                    }[key] as any)(x)
                )
            }
            return value
        }
    )