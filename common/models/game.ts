import { ITop3 } from "./top3";

export interface IGame {
    name: string;
    imageURL: string;
    solo: ITop3;
    multi: ITop3;
}

export interface ISolo {

    name: string;
    originalImage: File;
    modifiedImage: File;
}