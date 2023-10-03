export interface Block {
    id: string
    x: number
    y: number
    type: string
    params: (Block | number | null)[]
    statements: Block[][]
    movable: null
    deletable: 1
    emphasized: boolean
    readOnly: null
    copyable: boolean
    assemble: boolean
    extensions: []
}

export type Script = Block[][]