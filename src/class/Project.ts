import { Object_ } from "./Object_.ts"

export interface Project {
    speed: number;
    objects: Object_[];
    variables: Variable[];
    messages: Message[];
    functions: Function_[];
    scenes: Scene[];
}
export class Project {
    constructor(obj: Project) {
        Object.assign(this, obj)
    }
}

export interface Variable {
    name: string;
    variableType: string;
    id: string;
    value: string;
    minValue: number;
    maxValue: number;
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    isCloud: boolean;
    object: string | null;
    array: { data: string }[];
}
export class Variable {
    constructor(obj: Variable) {
        Object.assign(this, obj)
    }
}

export interface Message {
    name: string;
    id: string;
}
export class Message {
    constructor(obj: Message) {
        Object.assign(this, obj)
    }
}

export interface Function_ {
    id: string;
    block: string;
    content: string;
}
export class Function_ {
    constructor(obj: Function_) {
        Object.assign(this, obj)
    }
}

export interface Scene {
    name: string;
    id: string;
}
export class Scene {
    constructor(obj: Scene) {
        Object.assign(this, obj)
    }
}