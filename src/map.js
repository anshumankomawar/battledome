import * as THREE from "three";

export default class Map {
  constructor(colorMap, bumpMap, specularMap) {
    this.mesh = this.earthMesh(colorMap, bumpMap, specularMap);
    this.axes = {x : new THREE.Vector3(1, 0, 0), y : new THREE.Vector3(0, 1, 0), fwd : new THREE.Vector3(0, 0, 1)};
    this.ANGULAR_SPEED = 0.1;
    this.updates = {
      'w': new THREE.Quaternion().setFromAxisAngle(this.axes.x, THREE.MathUtils.degToRad(this.ANGULAR_SPEED )),
      's': new THREE.Quaternion().setFromAxisAngle(this.axes.x, THREE.MathUtils.degToRad(-this.ANGULAR_SPEED )),
      'a': new THREE.Quaternion().setFromAxisAngle(this.axes.y, THREE.MathUtils.degToRad(this.ANGULAR_SPEED )),
      'd': new THREE.Quaternion().setFromAxisAngle(this.axes.y, THREE.MathUtils.degToRad(-this.ANGULAR_SPEED )),
    }
  }

  earthMesh(colorMap, bumpMap, specularMap) {
    var geometry = new THREE.SphereGeometry(10, 200, 100);
    var material = new THREE.MeshPhongMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    material.map = new THREE.TextureLoader().load(colorMap);
    material.bumpMap = new THREE.TextureLoader().load(bumpMap);
    material.bumpScale = 0.1;
    material.specularMap = new THREE.TextureLoader().load(specularMap);
    material.specular = new THREE.Color('darkgrey');
    material.shininess = 10;
    return mesh;
  }

  rotation() {
    return new THREE.Quaternion().setFromUnitVectors(this.axes.fwd, new THREE.Vector3().crossVectors(this.axes.x, this.axes.y));
  }

  update(key) {
    this.rotateEarth(this.updates[key]);
    this.updateAxes(this.updates[key]);
  }

  rotateEarth(q) {
    this.mesh.applyQuaternion(q);
  }

  updateAxes(q) {
    this.axes.x.applyQuaternion(q);
    this.axes.y.applyQuaternion(q);
    this.axes.x.normalize();
    this.axes.y.normalize();
    console.log(this.axes);
  }
}

