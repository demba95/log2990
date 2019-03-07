import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, Input } from "@angular/core";
import { RenderService } from "./render.service";
import { IScene3D } from "../../../../../common/models/game3D";
import { IObjet3D } from "../../../../../common/models/objet3D";

@Component({
  selector: "app-scene3-d-component",
  templateUrl: "./scene3-d.component.html",
  styleUrls: ["./scene3-d.component.css"],
})

export class Scene3DComponent implements AfterViewInit {

  @Input() public game: IScene3D;
  @Input() public isCardMode: boolean;
  public imageBase64: string;
  private readonly RENDERERING_DELAY: number = 5;
  private obj3D: IObjet3D = {
    type: "cube",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 4,
    rotation: {x: 50, y: 50, z: 50},
  };

  private mockScene: IScene3D = {
    modified: false,
    backColor: 0x00000,
    objects: [this.obj3D],
    numObj: 1
  };

  public constructor(private renderService: RenderService) {
    this.isCardMode = false;
    this.game = this.mockScene;
  }

  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild("container")
  private containerRef: ElementRef;

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }

  public ngAfterViewInit(): void {
    if ( this.game !== undefined) {
      this.renderService.initialize(this.container, this.game);
      setTimeout(() => {
        this.imageBase64 = ((this.container).children[0] as HTMLCanvasElement).toDataURL();
      },         this.RENDERERING_DELAY); // make sure scene is rendered before
    }
    this.container.style.display = this.isCardMode ? "none" : "block";
  }

}
