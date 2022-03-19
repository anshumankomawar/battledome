import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let container;
let camera, scene, renderer;
let cube;

const initThree = () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);

  const geometry2 = new THREE.PlaneGeometry(10, 10);
  const material2 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry2, material2 );
  plane.rotation.x = - Math.PI / 2;
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

  const render = (timestamp, frame) => {
    if(keys['w']) controls.moveForward(.1);
    if(keys['s']) controls.moveForward(-.1);
    if(keys['a']) controls.moveRight(-.1);
    if(keys['d']) controls.moveRight(.1);

    renderer.render(scene, camera);
  };

  const animate = () => {
    renderer.setAnimationLoop(render);

    // // if using RequestAnimation()
    //requestAnimationFrame(animate)
    //render()
  };
  animate();
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

export { initThree };
