import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ListViewComponent } from "./list-view.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "../app-routing.module";
import { AdminMenuComponent } from "../adminView/admin-menu/admin-menu.component";
import { InitialComponent } from "../initial/initial.component";
import { Game2DViewComponent } from "../gameView/game2D-view/game2D-view.component";
import { SimpleGeneratorComponent } from "../adminView/simple-generator/simple-generator.component";
import { FreeGeneratorComponent } from "../adminView/free-generator/free-generator.component";
import { FormsModule } from "@angular/forms";
import { IGame } from "../../../../common/models/game";
import { IGame3D, IDifference } from "../../../../common/models/game3D";
import { Game3DViewComponent } from "../gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "../gameView/error-popup/error-popup.component";
import { IObjet3D } from "../../../../common/models/objet3D";
import { IScore } from "../../../../common/models/top3";
import { RenderService } from "../scene3D/scene3-d/render.service";
import { GamecardComponent } from "../gamecard/gamecard.component";
const mockSimple: IGame = {
  id: "idSimple",
  name: "nameSimple",
  originalImage: "",
  solo: [],
  multi: [],
};
const mockGame3D: IGame3D = {
  name: "mock3DName",
  id: "",
  originalScene: [] as IObjet3D[],
  solo: [] as IScore[],
  multi: [] as IScore[],
  differences: [] as IDifference[],
  isThematic: false,
  backColor: 0,
};

describe("ListViewComponent", () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        MatProgressSpinnerModule
      ],
      declarations: [
        ListViewComponent,
        AdminMenuComponent,
        InitialComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        SimpleGeneratorComponent,
        FreeGeneratorComponent,
        Game3DViewComponent,
        ErrorPopupComponent,
        GamecardComponent
      ],
      providers: [RenderService],
    })
      .compileComponents().then(() => { }, (error: Error) => { });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should route to game Play with the proper iD", () => {
    const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
    const game: IGame = {
      id: "",
      name: "string",
      originalImage: "string",
      solo: [],
      multi: [],
    };
    component.playSelectedSimpleGame(game);
    expect(routeSpy).toHaveBeenCalledWith(["simple-game/" + game.id]);
  });

  describe("Delete functions", () => {
    it("Deleting an existing simple games should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteSimpleGame").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component.simpleGames = [];
      component.simpleGames.push(mockSimple);
      component.deleteSimpleGames(mockSimple);
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("Deleting a non existing simple games should not call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteSimpleGame").and.returnValue({subscribe: () => []});
      component.simpleGames = [];
      component.deleteSimpleGames(mockSimple);
      expect(gameServiceSpy).toHaveBeenCalledTimes(0);
    });
    it("Deleting an existing free games should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteFreeGame").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component.freeGames = [];
      component.freeGames.push(mockGame3D);
      component.deleteFreeGames(mockGame3D);
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("Deleting a non existing free games should not call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteFreeGame").and.returnValue({subscribe: () => []});
      component.freeGames = [];
      component.deleteFreeGames(mockGame3D);
      expect(gameServiceSpy).toHaveBeenCalledTimes(0);
    });
  });
  describe("Adding games", () => {
    it("Adding a simple games should change the simple games array", () => {
      component.simpleGames = [];
      component.addSimpleGame(mockSimple);
      expect(component.simpleGames.length).toEqual(1);
    });
    it("Adding a free games should change the simple games array", () => {
      component.freeGames = [];
      component.addFreeGame(mockGame3D);
      expect(component.freeGames.length).toEqual(1);
    });
  });
  describe("Removing games", () => {
    it("Deleting a simple games should change the simple games array", () => {
      component.simpleGames = [mockSimple];
      component.removeSimpleGame(mockSimple.id);
      expect(component.simpleGames.length).toEqual(0);
    });
    it("Adding a free games should change the simple games array", () => {
      component.freeGames = [mockGame3D];
      component.removeFreeGame(mockGame3D.id);
      expect(component.freeGames.length).toEqual(0);
    });
  });

});
