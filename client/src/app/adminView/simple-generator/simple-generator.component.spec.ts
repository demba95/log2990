import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SimpleGeneratorComponent } from "./simple-generator.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "../free-generator/free-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ModalService } from "src/app/services/modal.service";
import { FileValidatorService } from "src/app/services/file-validator.service";
import { GameService } from "src/app/services/game.service";
import { By } from "@angular/platform-browser";
import { Game2DViewComponent } from "src/app/gameView/game2D-view/game2D-view.component";
import { Scene3DComponent } from "src/app/scene3D/scene3-d/scene3-d.component";
import { Game3DViewComponent } from "src/app/gameView/game3D-view/game3D-view.component";

describe("SimpleGeneratorComponent", () => {
  const LOADING_FILE_DELAY: number = 50;
  let component: SimpleGeneratorComponent;
  let fixture: ComponentFixture<SimpleGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SimpleGeneratorComponent,
        AdminMenuComponent,
        FreeGeneratorComponent,
        InitialComponent,
        ListViewComponent,
        Game2DViewComponent,
        Scene3DComponent,
        Game3DViewComponent
      ],
      imports: [AppRoutingModule, FormsModule, HttpClientModule],
      providers: [ModalService, FileValidatorService, GameService]
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(SimpleGeneratorComponent);
    component = fixture.componentInstance;
    component.id = "tempId";
    fixture.detectChanges();

  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("file change event should arrive in handler", () => {
    const input: Element = fixture.debugElement.query(By.css("input[type=file]")).nativeElement;

    spyOn(component, "onFileChange");

    input.dispatchEvent(new Event("change"));

    expect(component.onFileChange).toHaveBeenCalled();
  });

  it("On file change with originalImage should return true", (done: DoneFn) => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "originalImage", {
      type: "image/bmp"
    });

    spyOn(component["fileValidator"], "dimensionsAreValid").and.returnValue(true);
    component.onFileChange(mockedFile, "originalFile", "originalFileName");
    setTimeout(
      () => {
        expect(component["originalFileIsOK"]).toEqual(true);
        done();
      },
      LOADING_FILE_DELAY);
  });

  it("On file change with modifiedImage should return true", (done: DoneFn) => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "modifiedImage", {
      type: "image/bmp"
    });

    spyOn(component["fileValidator"], "dimensionsAreValid").and.returnValue(true);
    component.onFileChange(mockedFile, "modifiedFile", "modifiedFileName");
    setTimeout(
      () => {
        expect(component["modifiedFileIsOK"]).toEqual(true);
        done();
      },
      LOADING_FILE_DELAY);
  });

  it("On file change with not bmp file should return false", () => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "originalImage");
    component.onFileChange(mockedFile, "originalFile", "originalFileName");
    expect(component["originalFileIsOK"]).toEqual(false);
  });

  it("On file change with not bmp file should return false", () => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "modifiedImage");
    component.onFileChange(mockedFile, "modifiedFile", "modifiedFileName");
    expect(component["modifiedFileIsOK"]).toEqual(false);
  });
});
