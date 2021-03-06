import { TestBed, async, inject } from "@angular/core/testing";
import { ShapeCreatorService } from "./shape-creator.service";
import { IObjet3D } from "../../../../../common/models/objet3D";
import * as THREE from "three";

const cube: IObjet3D = {
  name: "",
  type: "cube",
  color: 0,
  texture: "",
  position: { x: 0, y: 0, z: 0},
  size: 0.7,
  rotation: {x: 0, y: 0, z: 0},
};

describe("ShapeCreatorService", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      providers: [ ShapeCreatorService ],
    })
    .compileComponents().then(() => { }, (error: Error) => {});
  }));
  it("should be created", inject([ShapeCreatorService], (service: ShapeCreatorService) => {
    expect(service).toBeTruthy();
  }));
  it("The correct type of mesh should be created", inject([ShapeCreatorService], (service: ShapeCreatorService) => {
    expect(typeof(service.createShape(cube))).toEqual(typeof( new THREE.BoxGeometry()));
  }));

});
