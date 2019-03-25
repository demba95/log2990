import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IGame3D, IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../../common/models/game3D";
import { WHITE } from "src/app/global/constants";
import { SceneGeneratorService } from "../scene-generator.service";

@Injectable()
export class RenderService {
  private readonly FLASH_TIME: number = 200;

  private containerOriginal: HTMLDivElement;
  private containerModif: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster;
  private readonly SENSITIVITY: number = 0.002;
  private isThematic: boolean;
  private rendererO: THREE.WebGLRenderer;
  private rendererM: THREE.WebGLRenderer;
  private sceneOriginal: THREE.Scene;
  private sceneModif: THREE.Scene;

  private cameraZ: number = 0;
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

    clearInterval(this.timeOutDiff);
    console.log(game);
    this.containerOriginal = containerO;
    this.isThematic = game.isThematic;
    this.differences = game.differences;
    this.diffAreVisible = true;
    this.sceneOriginal = await this.sceneGenerator.createScene(game.originalScene, game.backColor, this.isThematic);
    this.containerModif = containerM;
    this.sceneModif = this.isThematic ? await this.sceneGenerator.createScene(game.originalScene, game.backColor, this.isThematic) :
     await this.sceneGenerator.modifyScene(this.sceneOriginal.clone(true), game.differences);
    if (this.isThematic ) {
      this.sceneModif = await this.sceneGenerator.modifyScene(this.sceneModif, game.differences);
    }
    console.log(this.sceneOriginal.children);
    console.log(this.sceneModif.children);
    this.createCamera();
    this.rendererO = this.createRenderer(this.containerOriginal);
    this.rendererM = this.createRenderer(this.containerModif);
    for (const diff of this.differences) {
        console.log(((this.sceneOriginal.getObjectByName(diff.name) as THREE.Mesh).children[0] as THREE.Mesh).material);
    }
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
    const scene: THREE.Scene = await this.sceneGenerator.createScene(game.originalScene, game.backColor, game.isThematic);
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

    this.render();
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

    return renderer;
  }

  private render(): void {
    requestAnimationFrame(() => this.render());
    this.rendererO.render(this.sceneOriginal, this.camera);
    this.rendererM.render(this.sceneModif, this.camera);
  }
  public rotateCam(angle: string, mouvement: number): void {
    switch (angle) {
      case "X": this.camera.rotation.x -= mouvement * this.SENSITIVITY;
                break;
      case "Y": this.camera.rotation.y -= mouvement * this.SENSITIVITY;
                break;
      default: break;
    }
  }
  public moveCam(axis: string, mouvement: number): void {
    switch (axis) {
      case "X": this.camera.translateX(mouvement);
                break;
      case "Z": this.camera.translateZ(mouvement);
                break;
      default: break;
    }
  }
  public identifyDiff(event: MouseEvent): THREE.Object3D {
    if ( event.clientX < this.containerModif.offsetLeft) {
      this.calculateMouse(event, this.containerOriginal);
    } else {
      this.calculateMouse(event, this.containerModif);
    }
    this.raycaster.setFromCamera( this.mouse, this.camera );

    const intersects: THREE.Intersection[] = this.raycaster.intersectObjects( this.sceneModif.children.concat(this.sceneOriginal.children));

    return intersects.length > 0 ? intersects[0].object : null;
  }

  public removeDiff(objName: string, type: string): void {

    switch (type) {
      case ADD_TYPE: this.sceneModif.remove(this.sceneModif.getObjectByName(objName));
                     break;
      case MODIFICATION_TYPE: this.stopFlashObject(objName);
                              (this.sceneModif.getObjectByName(objName) as THREE.Mesh).material
        = (this.sceneOriginal.getObjectByName(objName) as THREE.Mesh).material;
                              break;
      case DELETE_TYPE: this.stopFlashObject(objName);
                        this.sceneModif.getObjectByName(objName).visible = true;
                        break;
      default: break;
    }
    this.soustractDiff(objName);
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
        ((this.sceneOriginal.getObjectByName(diff.name) as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive
           = new THREE.Color(visible ? 0 : WHITE);
      }
      if (diff.type !== DELETE_TYPE) {
        ((this.sceneModif.getObjectByName(diff.name) as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive
           = new THREE.Color(visible ? 0 : WHITE);
      }
    }
  }
  private stopFlashObject(name: string): void {
    ((this.sceneOriginal.getObjectByName(name) as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive = new THREE.Color(0);
  }
}
