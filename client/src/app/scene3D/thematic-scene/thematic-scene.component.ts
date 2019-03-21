import { Component, Input, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import "src/js/three";
import "node_modules/three/examples/js/controls/OrbitControls";
import * as THREE from "three";
import { MAX_COLOR } from "../../../../../common/models/objet3D";
import { MedievalForestService } from "./medieval-forest/medieval-forest.service";
import { MOCK_THEMED_GAME, IScene3D } from "../../../../../common/models/game3D";
import { CLICK, KEYS } from "src/app/global/constants";

@Component({
  selector: "app-thematic-scene",
  templateUrl: "./thematic-scene.component.html",
  styleUrls: ["./thematic-scene.component.css"]
})
export class ThematicSceneComponent implements AfterViewInit {

  @Input() public isCardMode: boolean;
  @Input() public iScene: IScene3D = MOCK_THEMED_GAME.originalScene;
  @Input() public isLoaded: boolean;
  public imageBase64: string;

  @ViewChild("containerO")
  private containerORef: ElementRef;

  private camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer;

  private readonly SENSITIVITY: number = 0.002;
  private press: boolean;
  private movementSpeed: number = 3;

  private scene: THREE.Scene;

  private zLight: number = -0.5;
  private xLight: number = 1;

  private cameraZ: number = -20;
  private cameraX: number = 5;
  private cameraY: number = 5;

  private light: THREE.Light;

  private fieldOfView: number = 90;

  private nearClippingPane: number = 0.1;

  private farClippingPane: number = 1000;

  private skyLight: number = 0xFFFFFF;

  private groundLight: number = 0x404040;

  public constructor(private forestService: MedievalForestService) {
    this.isCardMode = false;
    this.isLoaded = false;
  }
  private get containerO(): HTMLDivElement {
    return this.containerORef.nativeElement;
  }

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public ngAfterViewInit(): void {
    if ( this.iScene !== undefined ) {
      this.initialize();
    }
    this.containerO.style.display = this.isCardMode ? "none" : "block";
  }
  private initialize(): void {
    this.createScene();
    this.forestService.resetPromises();
    Promise.all(this.forestService.createForest(this.scene, this.iScene)).then(
      (objects: THREE.Object3D[]) => {
        for (const obj of objects) {
          this.scene.add(obj);
        }
        this.createCamera();
        this.startRenderingLoop();
        this.imageBase64 = ((this.containerO).children[0] as HTMLCanvasElement).toDataURL();
        this.isLoaded = true;
        });
  }

  private createScene(): void {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(MAX_COLOR);

    this.scene.add(new THREE.HemisphereLight(this.skyLight, this.groundLight));
    this.light = new THREE.DirectionalLight(MAX_COLOR);
    this.light.position.set(this.xLight, 0, this.zLight);
    this.scene.add(this.light);
  }

  private createCamera(): void {
    /* Camera */
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;
    this.scene.add(this.camera);
  }

  private getAspectRatio(): number {
    return window.innerWidth / window.innerHeight;
  }

  private startRenderingLoop(): void {

    document.addEventListener( "keydown", this.onKeyDown, false );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.domElement.addEventListener( "mousemove", this.onMouseMove, false );
    this.renderer.domElement.addEventListener( "contextmenu", (event: MouseEvent) => { event.preventDefault(); }, false );
    this.renderer.domElement.addEventListener("mousedown", this.onMouseDown, false);
    this.renderer.domElement.addEventListener("mouseup", this.onMouseUp, false);

    this.containerO.appendChild(this.renderer.domElement);
    this.render();
  }

  private render(): void {
    requestAnimationFrame(() => this.render());
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.render(this.scene, this.camera);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode ) {
      case KEYS["S"]: // up
      this.camera.translateZ(this.movementSpeed);
      break;
      case KEYS["W"]: // down
      this.camera.translateZ(-this.movementSpeed);
      break;
      case KEYS["D"]: // up
      this.camera.translateX(this.movementSpeed);
      break;
      case KEYS["A"]: // down
      this.camera.translateX(-this.movementSpeed);
      break;
      default: break;
    }
  }
  private onMouseMove = (event: MouseEvent) => {
    if (!this.press) { return; }

    // TODO: fix rotation after moving
    this.camera.rotation.y -= event.movementX * this.SENSITIVITY;
    this.camera.rotation.x -= event.movementY * this.SENSITIVITY;
  }
  private onMouseUp = (event: MouseEvent) => {
    if (event.button === CLICK.right) {
      this.press = false;
    }
  }
  private onMouseDown = (event: MouseEvent) => {
    if (event.button === CLICK.right) {
      this.press = true;
    }
  }

}