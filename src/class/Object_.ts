import { Script } from "./Script.ts"

interface Picture_ {
    id: string;
    name: string;
    dimension: {
        width: number;
        height: number;
        scaleX: number;
        scaleY: number;
    };
    scale: {
        type: number;
        default: number;
    };
    imageType: string
}
export interface Picture extends Picture_ {
    fileurl: string;
}
export interface Picture extends Picture_ {
    filename: string;
}
export class Picture {
    constructor(obj: Picture) {
        Object.assign(this, obj)
    }
}

export interface Sound {
    id: string;
    name: string;
    fileurl: string;
    duration: number;
}
export class Sound {
    constructor(obj: Sound) {
        Object.assign(this, obj)
    }
}

export interface Object_ {
    id: string;
    name: string;
    text: string;
    order: number;
    objectType: string;
    scene: string;
    active: boolean;
    lock: boolean;
    rotateMethod: string;
    entity: {
        rotation: number;
        direction: number;
        x: number;
        y: number;
        regX: number;
        regY: number;
        scaleX: number;
        scaleY: number;
        width: number;
        height: number;
        imageIndex: number;
        visible: boolean;
        colour: string;
        font: string;
        bgColor: string;
        textAlign: number;
        lineBreak: boolean;
        underLine: boolean;
        strike: boolean;
    };
    script: Script;
    sprite: {
        name: string;
        pictures: Picture[];
        sounds: Sound[];
    };
    selectedPictureId: string;
    selectedSoundId: string;
}
export class Object_ {
    constructor(obj: Object_) {
        Object.assign(this, obj)
    }
}
