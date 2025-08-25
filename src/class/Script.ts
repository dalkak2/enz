export interface Block {
    id: string
    x: number
    y: number
    type: string
    params: (Block | number | string | null)[]
    statements?: (Block[] | undefined)[]
    movable: null
    deletable: 1
    emphasized: boolean
    readOnly: null
    copyable: boolean
    assemble: boolean
    extensions: []
}

interface Comment {
    id: string
    x: number
    y: number
    width: number
    height: number
    value: string
    readOnly: boolean
    visible: boolean
    display: boolean
    movable: boolean
    isOpened: boolean
    deletable: 1
    type: "comment"
}

export type Script = (Block | Comment)[][]