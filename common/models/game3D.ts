import {Objet3D} from "./objet3D";
import { ITop3 } from "./top3";

export interface Game3D{

    name: string,
    id: number,
    numObj: number,
    objects: Objet3D[]
    backColor: number,
    solo: ITop3,
    multi: ITop3

}