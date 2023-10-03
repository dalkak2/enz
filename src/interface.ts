export interface ObjectDimension {
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
}

export interface ObjectScale {
    type: number;
    default: number;
}

export interface ObjectEntity {
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
}

export interface ObjectPicture {
    id: string;
    name: string;
    fileurl: string;
    dimension: ObjectDimension;
    scale: ObjectScale;
}

export interface ObjectSound {
    id: string;
    name: string;
    fileurl: string;
    duration: number;
}

export interface ProjectVariable {
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

export interface ProjectMessage {
    name: string;
    id: string;
}

export interface ProjectFunction {
    id: string;
    block: string;
    content: string;
}

export interface ProjectScene {
    name: string;
    id: string;
}

export interface ProjectObject {
    id: string;
    name: string;
    text: string;
    order: number;
    objectType: string;
    scene: string;
    active: boolean;
    lock: boolean;
    rotateMethod: string;
    entity: ObjectEntity;
    script: string;
    sprite: {
        name: string;
        pictures: ObjectPicture[];
        sounds: ObjectSound[];
    };
    selectedPictureId: string;
    selectedSoundId: string;
}

export interface Project {
    speed: number;
    objects: ProjectObject[];
    variables: ProjectVariable[];
    messages: ProjectMessage[];
    functions: ProjectFunction[];
    scenes: ProjectScene[];
}
