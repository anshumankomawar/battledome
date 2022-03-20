import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as CANNON from "cannon-es";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import spedobj from "../assets/doughboy.obj";
import CannonDebugger from "cannon-es-debugger";
//import { World, Body, Vec3, Box} from "cannon-es";

let container;
let camera, scene, renderer;
let cube;

const initThree = () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  camera.position.z = 10;

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x1cb2f5, side: THREE.DoubleSide});
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(0.5, 5, 0);
  scene.add(cube);

  const geometry2 = new THREE.PlaneGeometry(10, 10);
  const material2 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry2, material2 );
  plane.rotation.x = - Math.PI / 2;
  plane.receiveShadow = true;
  plane.position.y = -1;
  scene.add( plane );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  let keys = [];//Define array

  window.addEventListener('keydown',keydown);
  window.addEventListener('keyup',keyup);
  //Attach listeners to functions

  function keydown(e){ keys[e.key] = true; }

  function keyup(e){ keys[e.key] = false; }

  const controls = new PointerLockControls( camera, renderer.domElement );
  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener( 'click', function () {controls.lock();}, false );

  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const cubeBody = new CANNON.Body({mass: 1});
  cubeBody.addShape(cubeShape);
  cubeBody.position.x = cube.position.x;
  cubeBody.position.y = cube.position.y;
  cubeBody.position.z = cube.position.z;
  world.addBody(cubeBody);

  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body({mass : 0});
  planeBody.addShape(planeShape);
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  planeBody.position.x = plane.position.x;
  planeBody.position.y = plane.position.y;
  planeBody.position.z = plane.position.z;
  world.addBody(planeBody);

  //figure
  let spedMeshes = [];
  let spedBody;
  let loaded = false;

  const objLoader = new OBJLoader();
  objLoader.load(
    spedobj,
    function (object) {
      console.log(object);
      for(var i = 0; i < object.children.length; i++) {
        const tempmesh = object.children[i].clone();
        tempmesh.position.y += 10;
        tempmesh.material = new THREE.MeshNormalMaterial();
        tempmesh.scale.set(0.5, 0.5, 0.5);
        spedMeshes.push(tempmesh);
        scene.add(tempmesh);
      }
      spedBody = new CANNON.Body({ mass : 5 });
      spedBody.addShape(new CANNON.Box(new CANNON.Vec3(0.75, 1.75, 0.75)), new CANNON.Vec3(0, 1.75, 0));
      //spedBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), new CANNON.Vec3(0, 0, 0));
      spedBody.position.x = object.position.x;
      spedBody.position.y = object.position.y + 10;
      spedBody.position.z = object.position.z;
      world.addBody(spedBody);
      loaded = true;
    },
    (error) => {
      console.log("An error occurred:");
      console.log(error);
    }
  )

  const debug = new CannonDebugger(scene, world);;

  let delta;
  const render = (timestamp, frame) => {
    if(keys['w']) controls.moveForward(.1);
    if(keys['s']) controls.moveForward(-.1);
    if(keys['a']) controls.moveRight(-.1);
    if(keys['d']) controls.moveRight(.1);

    delta = Math.min(clock.getDelta(), 0.1);
    world.step(delta);
    debug.update()
    cube.position.set(
      cubeBody.position.x,
      cubeBody.position.y,
      cubeBody.position.z
    )
    cube.quaternion.set(
      cubeBody.quaternion.x,
      cubeBody.quaternion.y,
      cubeBody.quaternion.z,
      cubeBody.quaternion.w,
    )


    if(loaded) {
      for(var i = 0; i < spedMeshes.length; i++) {
        spedMeshes[i].position.x = spedBody.position.x;
        spedMeshes[i].position.y = spedBody.position.y;
        spedMeshes[i].position.z = spedBody.position.z;
        spedMeshes[i].quaternion.x = spedBody.quaternion.x;
        spedMeshes[i].quaternion.y = spedBody.quaternion.y;
        spedMeshes[i].quaternion.z = spedBody.quaternion.z;
        spedMeshes[i].quaternion.w = spedBody.quaternion.w;
      }
    }
    renderer.render(scene, camera);
  };

  const clock = new THREE.Clock();

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
