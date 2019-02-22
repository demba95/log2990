import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AppRoutingModule } from "src/app/app-routing.module";
import { FreeGeneratorComponent } from "./free-generator.component";
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { SimpleGeneratorComponent } from "../simple-generator/simple-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ModalService } from "src/app/services/modal.service";
import { GameViewComponent } from "src/app/gameView/game-view/game-view.component";
import { Scene3DComponent } from "src/app/scene3D/scene3-d/scene3-d.component";

describe("FreeGeneratorComponent", () => {
  let component: FreeGeneratorComponent;
  let fixture: ComponentFixture<FreeGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FreeGeneratorComponent,
        AdminMenuComponent,
        SimpleGeneratorComponent,
        InitialComponent,
        ListViewComponent,
        GameViewComponent,
        Scene3DComponent
      ],
      imports: [AppRoutingModule, FormsModule, HttpClientModule],
      providers: [ModalService]
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Test for the function hasModification", () => {
    it("hasModifications should return false if no modification selected", () => {
      expect(component.hasModifications()).toEqual(false);
    });
    it("hasModifications should return true if a modification is selected", () => {
      component["modification"][0] = true;
      expect(component.hasModifications()).toEqual(true);
    });
  });
  describe("Test for the function changeModif", () => {
    it("changeModif should not modifiy an modification if index out of bounds", () => {
      const oldModi: boolean[] = component["modification"];
      component.changeModif(-1);
      component.changeModif(component.nbModification);
      expect(oldModi).toEqual(component["modification"]);
    });
    it("changeModif should modify the slectd modification if index is valid", () => {
      component.changeModif(0);
      expect(component["modification"][0]).toEqual(true);
    });
  });
  describe("Test for the function changetype", () => {
    it("changetype should modify the selectedtype", () => {
      component.changeType("newType");
      expect(component["selectedType"]).toEqual("newType");
    });
  });

});
