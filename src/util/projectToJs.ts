import { Project } from "../mod.ts"

export const projectToJs =
    (project: Project) => {
        project.objects.map(
            object => {
                console.log(object.script)
            }
        )
    }