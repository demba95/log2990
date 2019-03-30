import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IObjet3D } from "../../../../../common/models/objet3D";
import GLTFLoader from "three-gltf-loader";
import { IDifference } from "../../../../../common/models/game3D";

@Injectable()
export class MedievalObjectsCreatorService {

  private castleWorld: IObjet3D;
  private readonly NB_FACES_SKYBOX: number = 6;

  private modelsLoader: GLTFLoader = new GLTFLoader();
  private  loadedModels: Map<string, THREE.Object3D>;

  private skyBoxLoader: THREE.TextureLoader = new THREE.TextureLoader();
  private readonly SKY_BOX_SIZE: number = 600;
  private readonly SKY_BOX_URLS: string[] = [
    "assets/clouds/right.png",
    "assets/clouds/left.png",
    "assets/clouds/top.png",
    "assets/clouds/bottom.png",
    "assets/clouds/back.png",
    "assets/clouds/front.png",
  ];

  public constructor() {
    this.loadedModels = new Map();
    this.castleWorld = {
      name: "castle",
      type: "castleWorld",
      position: { x: 0, y: 0, z: 0 },
      size: 1,
      rotation: { x: 0, y: 0, z: 0 },
    };
  }

  public async createMedievalScene(objects: IObjet3D[], uniqueObject: IDifference[]): Promise<THREE.Mesh[]> {

    const objectsTHREE: THREE.Mesh[] = [];
    let toReload: boolean = false;

    objectsTHREE.push(await this.createSkyBox());
    objectsTHREE.push(await this.createObject(this.castleWorld, false));

    for (const obj of objects) {
      toReload = uniqueObject.findIndex((diff: IDifference) => diff.name === obj.name) !== -1;
      objectsTHREE.push(await this.createObject(obj, toReload));
    }

    return objectsTHREE;
  }

  public async createObject(object: IObjet3D, toReload: boolean): Promise<THREE.Mesh> {

    return new Promise<THREE.Mesh>((resolve) => {
      if (toReload || !this.loadedModels.get(object.type)) {
      this.modelsLoader.load("../../assets/" + object.type + "/" + object.type + ".gltf",
                             (gltf) => {
          if (!toReload) {
            this.loadedModels.set(object.type, gltf.scene);
          }
          resolve(this.setPositionParameters(gltf.scene.clone(), object));
        }
      );
      } else {
        resolve(this.setPositionParameters(this.loadedModels.get(object.type).clone(), object));
      }
    });
  }
  private async createSkyBox(): Promise<THREE.Mesh> {
    return new Promise<THREE.Mesh>((resolve) => {
      this.skyBoxLoader = new THREE.TextureLoader();
      const materialArray: THREE.MeshBasicMaterial[] = [];
      for (let i: number = 0; i < this.NB_FACES_SKYBOX; i++) {
        materialArray[i] = new THREE.MeshBasicMaterial({
          map: this.skyBoxLoader.load(this.SKY_BOX_URLS[i], () => {
            if (i === this.NB_FACES_SKYBOX - 1) { // loading is now done for the whole box
              const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.SKY_BOX_SIZE, this.SKY_BOX_SIZE, this.SKY_BOX_SIZE);
              const skyBox: THREE.Mesh = new THREE.Mesh(skyGeometry, materialArray);
              resolve(skyBox);
            }
          }),
          side: THREE.BackSide
        });
      }
    });
  }

  private setPositionParameters(object: THREE.Object3D, parameters: IObjet3D): THREE.Mesh {

    object.scale.set(parameters.size, parameters.size, parameters.size);

    object.position.setX(parameters.position.x);
    object.position.setY(parameters.position.y);
    object.position.setZ(parameters.position.z);

    object.rotateX(parameters.rotation.x);
    object.rotateY(parameters.rotation.y);
    object.rotateZ(parameters.rotation.z);

    object.name = parameters.name;

    return object as THREE.Mesh;

  }

}