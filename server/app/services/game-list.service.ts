import Axios, { AxiosResponse } from "axios";
import FormData = require("form-data");
import { inject, injectable } from "inversify";
import { Collection, DeleteWriteOpResultObject, ObjectID } from "mongodb";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { IFullGame, IGame, IGame3DForm, ISimpleForm } from "../../../common/models/game";
import { Game3D } from "../../../common/models/game3D";
import { ITop3 } from "../../../common/models/top3";
import { FREEGAMES } from "../mock-games";
import { SocketServerManager } from "../socket/socketServerManager";
import { TYPES } from "../types";
import { DatabaseService } from "./database.service";
import { Game3DGeneratorService } from "./game3DGenerator.service";

@injectable()
export class GameListService {
    public static readonly MIN_TIME_TOP_3: number = 500;
    public static readonly MAX_TIME_TOP_3: number = 1000;
    public static readonly SIMPLE_COLLECTION: string =  "simple-games";
    public static readonly IMAGES_COLLECTION: string =  "images";
    public static readonly BMP_S64_HEADER: string = "data:image/bmp;base64,";
    private _simpleCollection: Collection;

    public constructor( @inject(TYPES.SocketServerManager) private socketController: SocketServerManager,
                        @inject(TYPES.Game3DGeneratorService) private game3DGenerator: Game3DGeneratorService,
                        @inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
    }

    public async getSimpleGames(): Promise<IGame[]> {
         return this.simpleCollection.find({}).map((x: IFullGame) => x.card).toArray();
    }

    public async getFreeGames(): Promise<Game3D[]> {
        return FREEGAMES;
    }

    public async deleteSimpleGame(id: string): Promise<Message> {
       return this.simpleCollection.deleteOne({"card.id": id}).then( (res: DeleteWriteOpResultObject) => {
            if ( res.deletedCount === 1 ) {
               this.socketController.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);

               return { title: BASE_ID, body: `Le jeu ${id} a été supprimé!` };
           } else {

               return { title: BASE_ID, body: `Le jeu ${id} n'existe pas!` };
           }
        }).catch();
    }

    public async deleteFreeGame(gameName: string): Promise<Message> {
        const index: number = FREEGAMES.findIndex((x: Game3D) => x.name === gameName);
        if (index === -1) {
            return { title: ERROR_ID, body: `Le jeu ${gameName} n'existe pas!` };
        }
        FREEGAMES.splice(index, 1);
        this.socketController.emitEvent(SocketsEvents.UPDATE_FREE_GAMES);

        return { title: BASE_ID, body: `Le jeu ${gameName} a été supprimé` };
    }

    public async addSimpleGame(newGame: ISimpleForm, originalImage: MulterFile, modifiedImage: MulterFile): Promise<Message> {
        const form: FormData = new FormData();
        form.append("name", newGame.name);
        form.append("originalImage", originalImage.buffer, originalImage.fileName);
        form.append("modifiedImage", modifiedImage.buffer, modifiedImage.fileName);
        const response: AxiosResponse<Message> = await Axios.post("http://localhost:3000/api/image/generation", form, {
            headers: form.getHeaders(),
        });

        const message: Message = response.data;

        // for mock-data, will be changed when database is implemented
        if (message.title !== ERROR_ID) {
            // for mock-data, will be changed when database is implemented
            const imagesArray: string[] = message.body.split(GameListService.BMP_S64_HEADER);
            this.simpleCollection.insertOne(
                {card: {
                    id: (new ObjectID()).toHexString(),
                    name: newGame.name,
                    originalImageURL: GameListService.BMP_S64_HEADER + imagesArray[1],
                    solo: this.top3RandomOrder(),
                    multi: this.top3RandomOrder(),
            },
                 modifiedImage: GameListService.BMP_S64_HEADER + imagesArray[2] ,
                 differenceImage: GameListService.BMP_S64_HEADER + imagesArray[3] }).then(
                                        () => { this.socketController.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES); },
                                    ).catch();
        }

        return (message);
    }

    public async addFreeGame(newGame: IGame3DForm): Promise<Message> {

        try {
            this.socketController.emitEvent(SocketsEvents.UPDATE_FREE_GAMES);
            FREEGAMES.push(this.game3DGenerator.createRandom3DGame(newGame)); // for now. to be added to database

            return {title: " The 3D form sent was correct. ", body: "The 3D game will be created shortly. "};
        } catch (error) {
                return {title: ERROR_ID, body: error.message};
        }
    }

    public top3RandomOrder(): ITop3 {
        const scores: number[] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push(this.randomNumberGenerator(GameListService.MIN_TIME_TOP_3, GameListService.MAX_TIME_TOP_3));
        }
        scores.sort();

        return { first: {name: "GoodComputer", score:scores[0]}, 
                 second: {name: "MediumComputer", score:scores[1]}, 
                 third: {name: "BadComputer", score:scores[2]}
                };
    }

    public randomNumberGenerator(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    private get simpleCollection(): Collection {
        if ( this._simpleCollection == null ) {
            this._simpleCollection = this.databaseService.db.collection(GameListService.SIMPLE_COLLECTION);
        }

        return this._simpleCollection;
    }
}

export interface MulterFile {
    buffer: Buffer;
    fileName: string;
}
