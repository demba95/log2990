import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, Input } from '@angular/core';
import {RenderService} from './render.service';
import { Scene3D } from "../../../../../common/models/game3D";

@Component({
  selector: 'app-scene3-d-component',
  templateUrl: './scene3-d.component.html',
  styleUrls: ['./scene3-d.component.css'],
})

export class Scene3DComponent implements AfterViewInit {

  @Input() game: Scene3D;
  @Input() isCardMode: boolean;
  public imageBase64: string;

  public constructor(private renderService: RenderService) {
    this.isCardMode = false;
  };


  private get container(): HTMLDivElement {
      return this.containerRef.nativeElement;
  }

  @ViewChild('container')
  private containerRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderService.onResize();
  }

  public ngAfterViewInit() {
    this.renderService.initialize(this.container, this.game);
    this.imageBase64 = ((this.container as any).children[0] as HTMLCanvasElement).toDataURL();
    if(this.isCardMode){
      this.container.style.display = "none";
    } else {
      this.container.style.display = "block";
    }
  }

}
