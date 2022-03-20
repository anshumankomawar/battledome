import * as THREE from "three";
import earthmap1k from "../assets/earthmap1k.jpeg";
import earthbumps from "../assets/8081_earthbump10k.jpg";
import earthspecular from "../assets/8081_earthspec10k.jpg";
//import { World, Body, Vec3, Box} from "cannon-es";

let container;
let camera, scene, renderer;

const initThree = () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0001, 2000);
  camera.position.z = 10;


  var geometry = new THREE.SphereGeometry(5, 200, 100);
  var material = new THREE.MeshPhongMaterial();
  var earthMesh = new THREE.Mesh(geometry, material);
  earthMesh.receiveShadow = true;
  material.map = new THREE.TextureLoader().load(earthmap1k);
  material.bumpMap = new THREE.TextureLoader().load(earthbumps);
  material.bumpScale = 0.1;
  material.specularMap = new THREE.TextureLoader().load(earthspecular);
  material.specular = new THREE.Color('darkgrey');
  material.shininess = 10;
  scene.add(earthMesh);

  geometry = new THREE.BoxGeometry(0.025, 0.025, 0.025);
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cubeMesh = new THREE.Mesh(geometry, material);
  cubeMesh.castShadow = true; //default is false
  cubeMesh.position.z = 6;
  scene.add(cubeMesh);

  var cubeMesh1 = new THREE.Mesh(geometry, material);
  cubeMesh1.castShadow = true; //default is false
  cubeMesh1.position.z = 5.1;

  var pivot = new THREE.Group();
  scene.add(pivot);
  pivot.add(cubeMesh1);

  const directionalLight = new THREE.DirectionalLight(0xADD8E6, 0.4, 2);
  directionalLight.position.set(0.5, 0.5, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xADD8E6, 0.2, 2);
  directionalLight2.position.set(5, 5, 100);
  directionalLight2.castShadow = false;
  scene.add(directionalLight2);

  //var light = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.3);
  //scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const ANGULAR_SPEED = 0.15;
  var AXES = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
  }

  function updateX(q) {
    AXES.x = AXES.x.applyQuaternion(q);
    AXES.y = AXES.y.applyQuaternion(q);
    AXES.x.normalize();
    AXES.y.normalize();
    console.log("right", AXES.x);
    console.log("up", AXES.y);
  }

  function updateY(q) {
    AXES.x = AXES.x.applyQuaternion(q);
    AXES.y = AXES.y.applyQuaternion(q);
    AXES.x.normalize();
    AXES.y.normalize();
    //AXES.y.rotateOnWorldAxis();
    console.log("right", AXES.x);
    console.log("up", AXES.y);
  }

  const AXESUPDATES = {
    ArrowUp: new THREE.Quaternion().setFromAxisAngle(AXES.x, THREE.MathUtils.degToRad(-ANGULAR_SPEED * 6)),
    ArrowDown: new THREE.Quaternion().setFromAxisAngle(AXES.x, THREE.MathUtils.degToRad(ANGULAR_SPEED * 6)),
    ArrowLeft: new THREE.Quaternion().setFromAxisAngle(AXES.y, THREE.MathUtils.degToRad(-ANGULAR_SPEED * 6)),
    ArrowRight: new THREE.Quaternion().setFromAxisAngle(AXES.y, THREE.MathUtils.degToRad(ANGULAR_SPEED * 6)),
  }

  const MOVEMENTS = {
    ArrowUp: new THREE.Quaternion().setFromAxisAngle(AXES.x, THREE.MathUtils.degToRad(ANGULAR_SPEED * 6)),
    ArrowDown: new THREE.Quaternion().setFromAxisAngle(AXES.x, THREE.MathUtils.degToRad(-ANGULAR_SPEED * 6)),
    ArrowLeft: new THREE.Quaternion().setFromAxisAngle(AXES.y, THREE.MathUtils.degToRad(ANGULAR_SPEED * 6)),
    ArrowRight: new THREE.Quaternion().setFromAxisAngle(AXES.y, THREE.MathUtils.degToRad(-ANGULAR_SPEED * 6)),
  }

  function rotateEarth(q) {
    earthMesh.applyQuaternion(q);
    console.log(earthMesh.quaternion);
  }

  window.addEventListener('keydown', keydown);
  //Attach listeners to functions
  window.addEventListener('keyup', keyup);

  function keydown(e) { keys[e.key] = true; }
  function keyup(e) { keys[e.key] = false; }

  let keys = {};

  window.addEventListener("resize", onWindowResize, false);
  const clock = new THREE.Clock();
  let delta;
  const render = (timestamp, frame) => {
    if (keys['w']) {
      rotateEarth(MOVEMENTS.ArrowUp);
      updateX(AXESUPDATES.ArrowDown);
    }
    if (keys['s']) {
      rotateEarth(MOVEMENTS.ArrowDown);
      updateX(AXESUPDATES.ArrowUp);
    }
    if (keys['a']) {
      rotateEarth(MOVEMENTS.ArrowLeft);
      updateY(AXESUPDATES.ArrowRight);
    }
    if (keys['d']) {
      rotateEarth(MOVEMENTS.ArrowRight);
      updateY(AXESUPDATES.ArrowLeft);
    }

    pivot.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3().crossVectors(AXES.x, AXES.y)));
    renderer.render(scene, camera);
  };

  const animate = () => {
    renderer.setAnimationLoop(render);
  };
  animate();
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

export { initThree };
