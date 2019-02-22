import { readFileSync } from "fs";
import { inject, injectable } from "inversify";
import { BASE_ID, ERROR_ID, Message, Point } from "../../../common/communication/message";
import { TYPES } from "../types";
import { ConvertImage, ImageBMP } from "./convertImage.service";
import { IdentificationService } from "./identification.service";

interface IDictionary {
    [index: string]: IdentificationService;
}

@injectable()
export class IdentificationServiceManager {

    public static readonly IDENTIFICATION_SERVICE_NOT_FOUND: string = "Le service d'identification pour ce jeu n'est pas instancié";
    public static readonly NO_DIFFERENCE_FOUND: string = "Aucune différence trouvée";
    public static readonly GAMEROOMID_ALREADY_EXISTS: string = "Le service pour ce game room existe deja";

    private identificationServices: IDictionary;
    private bmpBufferFormat: Buffer;

    public constructor(@inject(TYPES.ConvertImage) private convertImage: ConvertImage) {
        this.identificationServices = {} as IDictionary;
    }

    public getDifference(gameRoomId: string, point: Point): Message {
        if (this.identificationServices[gameRoomId] === undefined) {
            return {
                title: ERROR_ID,
                body: `${IdentificationServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND}, Game room: ${gameRoomId}`,
            };
        }
        const image: ImageBMP | null = this.identificationServices[gameRoomId].getDifference(point);
        if (image === null) {
            return {
                title: ERROR_ID,
                body: IdentificationServiceManager.NO_DIFFERENCE_FOUND,
            };
        }

        return {
            title: BASE_ID,
            body: this.imageToString64(this.convertImage.imageBMPtoBuffer(image, this.bmpBufferFormat)),
        };
    }

    public startNewService(gameRoomId: string, originalImagePath: string, modifiedImagePath: string, differenceImagePath: string): Message {
        if (this.identificationServices[gameRoomId] !== undefined) {
            return {
                title: ERROR_ID,
                body: `${IdentificationServiceManager.GAMEROOMID_ALREADY_EXISTS}, Game room:${gameRoomId}`,
            };
        }

        const originalBuffer: Buffer = readFileSync(originalImagePath);
        if (this.bmpBufferFormat === undefined) {
            this.bmpBufferFormat = originalBuffer;
        }
        const originalImage: ImageBMP = this.convertImage.bufferToImageBMP(originalBuffer);
        const modifiedImage: ImageBMP = this.convertImage.bufferToImageBMP(readFileSync(modifiedImagePath));
        const differenceImage: ImageBMP = this.convertImage.bufferToImageBMP(readFileSync(differenceImagePath));
        this.identificationServices[gameRoomId] = new IdentificationService(originalImage, modifiedImage, differenceImage);

        return {
            title: BASE_ID,
            body: gameRoomId,
        };
    }

    public deleteService(gameRoomId: string): Message {
        if (this.identificationServices[gameRoomId] === undefined) {
            return {
                title: ERROR_ID,
                body: `${IdentificationServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND}, Game room: ${gameRoomId}`,
            };
        }
        delete this.identificationServices[gameRoomId];

        return {
            title: BASE_ID,
            body: `Service for ${gameRoomId} deleted`,
        };
    }

    private imageToString64(buffer: Buffer): string {
        return "data:image/bmp;base64," + buffer.toString("base64");
    }
}
