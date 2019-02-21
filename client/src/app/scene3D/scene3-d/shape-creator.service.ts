import { Injectable } from "@angular/core";
import { Objet3D, INITIAL_OBJECT_SIZE } from "../../../../../common/models/objet3D";
import * as THREE from "three";

@Injectable()
export class ShapeCreatorService {

  private map: Map<string, THREE.Mesh>;

  public readonly NB_SEGMENTS: number = 50; // to have circular originalObjects

  public constructor() {
    this.generateMap();
  }
  private generateMap(): void {
    this.map = new Map();
    this.createCube();
    this.createCone();
    this.createSphere();
    this.createCylindre();
    this.createTetrahedron();
  }

  public createShape(obj: Objet3D): THREE.Mesh {

    const shape: THREE.Mesh = this.map.get(obj.type).clone();

    shape.position.x = obj.position.x;
    shape.position.y = obj.position.y;
    shape.position.z = obj.position.z;
    shape.scale.set(obj.size, obj.size, obj.size);
    shape.rotation.x = obj.rotation.x;
    shape.rotation.y = obj.rotation.y;
    shape.rotation.z = obj.rotation.z;
    shape.material = new THREE.MeshPhongMaterial({color: obj.color });

    return shape;
  }

  public createCube(): void {

    const geometry: THREE.Geometry = new THREE.BoxGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE);

    const cube: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cube", cube);
  }

  public createCylindre(): void {

    const geometry: THREE.Geometry = new THREE.CylinderGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE
                                                              , this.NB_SEGMENTS);

    const cylindre: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cylinder", cylindre);
  }
  public createTetrahedron(): void {

    const geometry: THREE.Geometry = new THREE.TetrahedronGeometry(INITIAL_OBJECT_SIZE);

    const tetrahedron: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("tetrahedron", tetrahedron);
  }
  public createSphere(): void {

    const geometry: THREE.Geometry = new THREE.SphereGeometry(INITIAL_OBJECT_SIZE, this.NB_SEGMENTS, this.NB_SEGMENTS);

    const sphere: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("sphere", sphere);
  }
  public createCone(): void {

    const geometry: THREE.Geometry = new THREE.ConeGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, this.NB_SEGMENTS);

    const cone: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cone", cone);
  }

}