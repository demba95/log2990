import { injectable } from "inversify";
import { INITIAL_MODEL_SIZE, INITIAL_OBJECT_SIZE, IObjet3D, } from "../../../common/models/objet3D";
import { Shapes, SHAPES_SIZE } from "../../../common/models/shapes";
import { MODELS, TEXTURES } from "../../../common/models/textures";

@injectable()
export class ObjectGeneratorService {

    private readonly MIN_SCALE: number = 0.5;
    private readonly MAX_SCALE: number = 1.5;
    private readonly WHITE: number = 0x000000;
    private readonly BLACK: number = 0xFFFFFF;
    private readonly B0X_LENGHT: number = 58;
    private readonly MAX_ROTATION: number = 360;

    private readonly TRAIL_NEG_COORD: number = -15;
    private readonly TRAIL_POS_COORD: number = 5;

    /* the following constants define composition of the medieval forest, expressed in % */
    private readonly MAX_DRAGONS: number = 0.1;
    private readonly MAX_ROCKS: number = 0.2;
    private readonly MAX_FOUNTAINS: number = 0.1;
    private readonly MAX_HORSES: number = 0.2;
    private readonly MAX_BARREL: number = 0.1;
    private readonly MAX_CHEST: number = 0.1;
    private SCENE_COMPOSITION: Map<string, number> = new Map([
        ["dragon", this.MAX_DRAGONS], ["rock", this.MAX_ROCKS], ["fountain", this.MAX_FOUNTAINS],
        ["horse", this.MAX_HORSES], ["barrel", this.MAX_BARREL], ["chest", this.MAX_CHEST],
    ]);

    public generateRandomGeometricObject(objects: IObjet3D[]): IObjet3D {
        return {
            type: this.randomShape(),
            color: this.randomInt(this.WHITE, this.BLACK),
            name: "", // will be choosen by the game generator
            position: this.generatePosition(objects, false),
            size: this.random1Interval(this.MIN_SCALE, this.MAX_SCALE), // scale between 50% and 150% of a reference size
            rotation: {
                x: this.randomInt(0, this.MAX_ROTATION),
                y: this.randomInt(0, this.MAX_ROTATION),
                z: this.randomInt(0, this.MAX_ROTATION),
            },
        };
    }
    public addThematicObjects(type: string, totalQty: number, objects: IObjet3D[]): IObjet3D[] {
        let qty: number = 0;
        const lastLenght: number = objects.length;
        // tslint:disable-next-line:no-non-null-assertion
        this.SCENE_COMPOSITION.get(type) !== undefined ? qty = this.randomInt(0, this.SCENE_COMPOSITION!.get(type)! * totalQty)
         : qty = totalQty - objects.length;

        for (let i: number = 0; i < qty; i++) {
            const obj: IObjet3D = {
                name: (lastLenght + i).toString(), // object index in array
                type: type,
                position: this.generatePosition(objects, true),
                size: this.random1Interval(this.MIN_SCALE, this.MAX_SCALE), // scale between 50% and 150% of a reference size (= 1 * scale)
                rotation: {
                    x: 0,
                    y: this.randomInt(0, this.MAX_ROTATION),
                    z: 0,
                },
            };
            objects.push(obj);
        }

        return objects;
    }

    public randomTexture(): string {
        return TEXTURES[this.randomInt(0, TEXTURES.length - 1)];
    }
    public randomModels(): string {
        return MODELS[this.randomInt(0, MODELS.length - 1)];
    }
    public generatePosition(objects: IObjet3D[], isThematic: boolean): {x: number, y: number, z: number} {
        let position: {x: number, y: number, z: number};
        let valid: boolean;
        do {
            position = {
                x: this.randomInt(-this.B0X_LENGHT, this.B0X_LENGHT),
                y: isThematic ? 0 : this.randomInt(-this.B0X_LENGHT, this.B0X_LENGHT),
                z: this.randomInt(-this.B0X_LENGHT, this.B0X_LENGHT),
            };
            valid = true;
            if (isThematic) {
                valid = ! (this.isColisionWithTrail(position.x) ||
                this.isColisionWithModels(position.x, position.y, position.z, objects));
            } else {
                valid = !this.isColisionWithShapes(position.x, position.y, position.z, objects);
            }
        } while (!valid);

        return position;

    }
    private isColisionWithTrail(positionX: number): boolean {
        return positionX > this.TRAIL_NEG_COORD && positionX < this.TRAIL_POS_COORD;
    }

    private isColisionWithModels(positionX: number, positionY: number, positionZ: number, objects: IObjet3D[]): boolean {
        for (const obj of objects) {
            if (Math.pow(obj.position.x - positionX, 2) + Math.pow(positionZ - obj.position.z, 2)
            < Math.pow( INITIAL_MODEL_SIZE * this.MAX_SCALE, 2)) {
            return true;
            }
        }

        return false;
    }
    private isColisionWithShapes(positionX: number, positionY: number, positionZ: number, objects: IObjet3D[]): boolean {
        for (const obj of objects) {
            if (Math.pow(obj.position.x - positionX, 2) + Math.pow(positionY - obj.position.y, 2)
            + Math.pow(positionZ - obj.position.z, 2)
            < Math.pow( INITIAL_OBJECT_SIZE * this.MAX_SCALE, 2)) {
            return true;
            }
        }

        return false;
    }
    private randomShape(): string {
        const index: number = this.randomInt(0, SHAPES_SIZE - 1);

        return Shapes[index];
    }

    public randomInt(min: number, max: number): number {
        return Math.floor(this.randomNumber(min, max));
    }

    private random1Interval(min: number, max: number): number {

        return Math.random() + min;
    }

    private randomNumber(min: number, max: number): number {

        return Math.random() * (max - min + 1) + min;
    }
}
