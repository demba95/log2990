import {Objet3D} from "./objet3D";
import { ITop3 } from "./top3";

export interface Game3D{

    name: string,
    id: string,
    originalScene: Scene3D,
    modifiedScene: Scene3D,
    solo: ITop3,
    multi: ITop3

}

export interface Scene3D{
    modified: boolean,
    numObj: number,
    objects: Objet3D[],
    backColor: number
}
export const GEOMETRIC_TYPE_NAME: string = "geometric";
export const THEMATIC_TYPE_NAME: string = "thematic";
export const NO_MIN_OBJECTS: number = 10;
export const NO_MAX_OBJECTS: number = 200;