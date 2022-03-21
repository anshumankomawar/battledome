import * as THREE from "three";
import earthmap1k from "../assets/earthmap1k.jpeg";
import earthbumps from "../assets/8081_earthbump10k.jpg";
import earthspecular from "../assets/8081_earthspec10k.jpg";
import Map from "./map";
import {io} from "socket.io-client";
//import { World, Body, Vec3, Box} from "cannon-es";

let container;
let camera, scene, renderer;

const initThree = () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  const socket = io()
  socket.on('connect', function () {
      console.log('connect')
  })

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0001, 100);
  camera.position.z = 12;

  var map = new Map(earthmap1k, earthbumps, earthspecular);
  scene.add(map.mesh);

  var geometry = new THREE.BoxGeometry(0.025, 0.025, 0.025);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cubeMesh = new THREE.Mesh(geometry, material);
  cubeMesh.castShadow = true; //default is false
  cubeMesh.position.z = 10.5;
  scene.add(cubeMesh);

  var cubeMesh1 = new THREE.Mesh(geometry, material);
  cubeMesh1.castShadow = true; //default is false
  cubeMesh1.position.z = 10.1;

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

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  let keys = {};

  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);

  function keydown(e) { keys[e.key] = true; }
  function keyup(e) { keys[e.key] = false; }

  window.addEventListener("resize", onWindowResize, false);


  const render = (timestamp, frame) => {
    if (keys['w']) {
      map.update('w');
    }
    if (keys['s']) {
      map.update('s');
    }
    if (keys['a']) {
      map.update('a');
    }
    if (keys['d']) {
      map.update('d');
    }
    pivot.setRotationFromQuaternion(map.rotation());
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
