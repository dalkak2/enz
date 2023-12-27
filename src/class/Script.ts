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

export type Script = Block[][]