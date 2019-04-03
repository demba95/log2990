export const BASE_SERVER_PATH: string = "http://localhost:3000/";

export interface KeysMap {
    [key: string]: number;
}

export enum AXIS {X, Y, Z}

export const KEYS: KeysMap = {"A": 65, "D": 68, "S": 83, "W": 87, "T": 84};

export const BLACK: number = 0x000000;
export const WHITE: number = 0xFFFFFF;

export enum CLICK {left, center, right}
