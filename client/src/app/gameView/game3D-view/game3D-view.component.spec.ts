import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Game3DViewComponent } from "./game3D-view.component";
import { IndexService } from "src/app/services/index.service";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "src/app/app-routing.module";

describe("Game3DViewComponent", () => {
  let component: Game3DViewComponent;
  let fixture: ComponentFixture<Game3DViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game3DViewComponent],
      imports: [ RouterTestingModule, HttpClientModule ],
      providers: [ IndexService, AppRoutingModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game3DViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
