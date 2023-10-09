import { Object_ } from "./Object_.ts"

export interface Project {
    speed: number;
    objects: Object_[];
    variables: Variable[];
    messages: Message[];
    functions: Function_[];
    scenes: Scene[];
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

export interface Message {
    name: string;
    id: string;
}

export interface Function_ {
    id: string;
    block: string;
    content: string;
}

export interface Scene {
    name: string;
    id: string;
}