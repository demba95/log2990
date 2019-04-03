import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IGame3D, IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../common/models/game3D";
import { SceneGeneratorService } from "./scene-generator.service";
import { AXIS } from "../global/constants";

@Injectable()
export class RenderService {
  private readonly FLASH_TIME: number = 150;
  private readonly GAMMA_FACTOR: number = 2.2;
  private readonly SENSITIVITY: number = 0.002;
  private readonly COLLISION_DISTANCE: number = 4;

  private containerOriginal: HTMLDivElement;
  private containerModif: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster;
  private isThematic: boolean;
  private rendererO: THREE.WebGLRenderer;
  private rendererM: THREE.WebGLRenderer;
  private sceneOriginal: THREE.Scene;
  private sceneModif: THREE.Scene;

  private cameraZ: number = 20;
  private cameraY: number = 5;

  private fieldOfView: number = 75;
  private nearClippingPane: number = 1;
  private farClippingPane: number = 3000;

  private differences: IDifference[];
  private timeOutDiff: NodeJS.Timeout;
  private diffAreVisible: boolean;

  public constructor(private sceneGenerator: SceneGeneratorService) {
  }

  public async initialize(containerO: HTMLDivElement, containerM: HTMLDivElement, game: IGame3D): Promise<void> {
    THREE.Cache.enabled = true;
    clearInterval(this.timeOutDiff);
    this.containerOriginal = containerO;
    this.isThematic = game.isThematic;
    this.differences = game.differences;
    this.diffAreVisible = true;
    this.sceneOriginal = await this.sceneGenerator.createScene(game.originalScene, game.backColor, this.isThematic, this.differences);
    this.containerModif = containerM;
    this.sceneModif = this.isThematic ? await this.sceneGenerator.createScene(
      game.originalScene, game.backColor, this.isThematic, this.differences) :
        await this.sceneGenerator.modifyScene(this.sceneOriginal.clone(true), game.differences);
    if (this.isThematic ) {
      this.sceneModif = await this.sceneGenerator.modifyScene(this.sceneModif, game.differences);
    }
    this.createCamera();
    this.rendererO = this.createRenderer(this.containerOriginal);
    this.rendererM = this.createRenderer(this.containerModif);
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.rendererO.setSize(this.containerOriginal.clientWidth, this.containerOriginal.clientHeight);
  }

  public async getImageURL(game: IGame3D): Promise<string> {
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      this.fieldOfView, window.innerWidth / window.innerHeight, this.nearClippingPane, this.farClippingPane);
    camera.position.z = this.cameraZ;
    camera.position.y = this.cameraY;
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.hidden = true;
    const scene: THREE.Scene = await this.sceneGenerator.createScene(game.originalScene, game.backColor, game.isThematic, game.differences);
    renderer.render(scene, camera);

    return renderer.domElement.toDataURL();
  }
  private createCamera(): void {
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
      );
    this.camera.rotation.order = "YXZ";
    this.camera.position.z = this.cameraZ;
    this.camera.position.y = this.cameraY;
    this.sceneOriginal.add(this.camera);
    this.sceneModif.add(this.camera);
  }

  private getAspectRatio(): number {
    return this.containerOriginal.clientWidth / this.containerOriginal.clientHeight;
  }

  public startRenderingLoop(): void {
    this.raycaster = new THREE.Raycaster();
    this.setDiffObjs();
    this.render();
  }
  private setDiffObjs(): void {
    const array1: THREE.Object3D[] = [];
    const array2: THREE.Object3D[] = [];
    console.log(this.sceneModif.children)
    console.log(this.differences)
    for (const diff of this.differences) {
      if (diff.type !== ADD_TYPE) {
        array1.push(this.getObject(this.sceneOriginal, diff.name));
      }
      array2.push(this.getObject(this.sceneModif, diff.name));
    }
    console.log(array1)
    console.log(array2)
  }
  private createRenderer(container: HTMLDivElement): THREE.WebGLRenderer {
    const renderer: THREE.WebGLRenderer = this.initializeRenderer(container);
    container.appendChild(renderer.domElement);

    return renderer;
  }
  public addListener(command: string, func: EventListenerOrEventListenerObject): void {
    this.rendererO = this.addListenToRender(this.rendererO, command, func);
    this.rendererM = this.addListenToRender(this.rendererM, command, func);
  }

  private addListenToRender(renderer: THREE.WebGLRenderer, command: string, func: EventListenerOrEventListenerObject): THREE.WebGLRenderer {
    renderer.domElement.addEventListener(command, func, false);

    return renderer;
  }

  private initializeRenderer(container: HTMLDivElement): THREE.WebGLRenderer {
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.gammaFactor = this.GAMMA_FACTOR;
    renderer.gammaOutput = true;

    return renderer;
  }

  private render(): void {
    requestAnimationFrame(() => this.render());
    this.rendererO.render(this.sceneOriginal, this.camera);
    this.rendererM.render(this.sceneModif, this.camera);
  }
  public rotateCam(angle: number, mouvement: number): void {
    switch (angle) {
      case AXIS.X: this.camera.rotation.x -= mouvement * this.SENSITIVITY;
                   break;
      case AXIS.Y: this.camera.rotation.y -= mouvement * this.SENSITIVITY;
                   break;
      default: break;
    }
  }
  public moveCam(axis: number, mouvement: number): void {

    switch (axis) {
      case AXIS.X:  if (!this.detectCollision(new THREE.Vector3(mouvement, 0, 0))) {
                  this.camera.translateX(mouvement);
                  }
                    break;
      case AXIS.Z: if (!this.detectCollision(new THREE.Vector3(0, 0, mouvement))) {
                  this.camera.translateZ(mouvement);
                }
                   break;
      default: break;
    }
  }
  private detectCollision(direction: THREE.Vector3): boolean {
    const pos: THREE.Vector3 = this.camera.position.clone();
    direction.applyQuaternion(this.camera.quaternion);
    this.raycaster.set(pos, direction.normalize());
    const intersects: THREE.Intersection[] = this.raycaster.intersectObjects(this.sceneModif.children.concat(this.sceneOriginal.children),
                                                                             true);

    return intersects.length > 0 && intersects[0].distance < this.COLLISION_DISTANCE;
  }

  public identifyDiff(event: MouseEvent): THREE.Object3D {
    this.changeVisibilityOfDifferencesObjects(true);
    if ( event.clientX < this.containerModif.offsetLeft) {
      this.calculateMouse(event, this.containerOriginal);
    } else {
      this.calculateMouse(event, this.containerModif);
    }
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects: THREE.Intersection[] = this.raycaster.intersectObjects( this.sceneModif.children.concat(this.sceneOriginal.children),
                                                                              true);
    if (intersects.length > 0) {
      let objet: THREE.Object3D = intersects[0].object;
      while (!this.isObjet(objet.name)) {
        objet = objet.parent;
      }

      return objet;
    } else {

      return null;
    }

  }
  private isObjet(name: string): boolean {
    return +name >= 0;
  }
  private getObject(scene: THREE.Scene, objName: string): THREE.Object3D {
    return scene.getObjectByName(objName);
  }

  public removeDiff(objName: string, type: string): void {

    switch (type) {
      case ADD_TYPE: this.sceneModif.remove(this.getObject(this.sceneModif, objName));
                     break;
      case MODIFICATION_TYPE: this.changeVisibilityOfDifferencesObjects(true);
                              this.removeModif(objName);
                              break;
      case DELETE_TYPE: this.changeVisibilityOfDifferencesObjects(true);
                        this.getObject(this.sceneModif, objName).visible = true;
                        break;
      default: return;
    }
    this.soustractDiff(objName);
  }
  private removeModif(objName: string): void {
    if (this.isThematic) {
      this.sceneModif.remove(this.getObject(this.sceneModif, objName));
      this.sceneModif.add(this.getObject(this.sceneOriginal, objName).clone());
    } else {
      (this.getObject(this.sceneModif, objName) as THREE.Mesh).material
        = (this.getObject(this.sceneOriginal, objName) as THREE.Mesh).material;
    }
  }
  private soustractDiff(objName: string): void {
    for (let i: number = 0; this.differences.length; i++ ) {
      if (this.differences[i].name === objName) {
        this.differences.splice(i, 1);

        return;
      }
    }
  }
  private calculateMouse(event: MouseEvent, container: HTMLDivElement): void {
    const MULTI: number = 2;
    this.mouse.x = (event.offsetX  / container.offsetWidth) * MULTI - 1;
    this.mouse.y = -(event.offsetY / container.offsetHeight) * MULTI + 1;
  }
  public startCheatMode(): void {
    this.timeOutDiff = setInterval(this.flashObjects.bind(this), this.FLASH_TIME);
  }
  public stopCheatMode(): void {
    clearInterval(this.timeOutDiff);
    this.changeVisibilityOfDifferencesObjects(true);
  }
  private flashObjects(): void {
   this.diffAreVisible = !this.diffAreVisible;
   this.changeVisibilityOfDifferencesObjects(this.diffAreVisible);
  }
  private changeVisibilityOfDifferencesObjects(visible: boolean): void {
    for (const diff of this.differences) {
      if (diff.type !== ADD_TYPE) {
        this.setVisibilty(this.sceneOriginal, diff.name, visible);
      }
      if (diff.type !== DELETE_TYPE) {
        this.setVisibilty(this.sceneModif, diff.name, visible);
      }
    }
  }
  private setVisibilty(scene: THREE.Scene, name: string, visible: boolean): void {
    const obj: THREE.Mesh = this.getObject(scene, name) as THREE.Mesh;
    if (obj.isMesh) {
      (obj.material as THREE.Material).visible = visible;
    } else {
      obj.visible = visible;
    }
  }
}
