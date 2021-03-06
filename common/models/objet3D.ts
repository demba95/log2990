export interface IObjet3D {
    type: string;
    color?: number;
    texture?: string;
    position: { x: number; y: number; z: number};
    size: number;
    rotation: {x: number; y: number; z: number};
    name: string;
}

export const INITIAL_OBJECT_SIZE: number = 4;
export const MAX_COLOR: number = 0xFFFFFF;