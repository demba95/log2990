import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { InitialComponent } from "./initial.component";
import {FormsModule} from "@angular/forms";
import {IndexService} from "../services/index.service";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "../app-routing.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable, of } from "rxjs";
import { Message, ERROR_ID, BASE_ID } from "../../../../common/communication/message";
import { RenderService } from "../scene3D/render.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("InitialComponent", () => {
  let component: InitialComponent;
  let fixture: ComponentFixture<InitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialComponent ],
      imports: [ FormsModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule ],
      providers: [ IndexService, AppRoutingModule, RenderService ],
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("test for the function connect", () => {
    it("should change view if response is valid", () => {
      spyOn(component["indexService"], "connect").and.callFake((username: string): Observable<Message> => {
        return of({title: BASE_ID, body: "test-message"});
      });
      // tslint:disable-next-line:no-any
      const navigateSpy: jasmine.Spy = spyOn((component as any).router, "navigate").and.returnValue(Promise.resolve());
      component.connect("test123");
      expect(navigateSpy).toHaveBeenCalledWith(["games"]);
    });

    it("should not change view if reponse is not valid", () => {
      spyOn(component["indexService"], "connect").and.callFake((username: string): Observable<Message> => {
        return of({title: ERROR_ID, body: "test-message"});
      });
      // tslint:disable-next-line:no-any
      const navigateSpy: jasmine.Spy = spyOn((component as any).router, "navigate").and.returnValue(Promise.resolve());
      component.connect("test123");
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });
    it("Should return a list of errors if the name is not valid", () => {
      component.connect("test fail *");
      // tslint:disable-next-line:no-magic-numbers
      expect(component["errors"].length).toEqual(2);
    });
  });
});
