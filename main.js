import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
const controls = new OrbitControls(camera, renderer.domElement);

const scene = new THREE.Scene();
const clock = new THREE.Clock()
scene.background = new THREE.Color(0x101010);

// const ambientLight = new THREE.AmbientLight(0x000000);
// scene.add(ambientLight);

const light1 = new THREE.DirectionalLight(0xffffff, 3);
light1.position.set(0, 200, 0);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 3);
light2.position.set(100, 200, 100);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 3);
light3.position.set(- 100, - 200, - 100);
scene.add(light3);

const makeCube = (width, height, depth) => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color: 0xCC2936 });
  return new THREE.Mesh(geometry, material);

}

const segments = 5;
const size = 1 / segments;

//attempt to split the cube into chunks
let cubes = []
for (let x = 0; x < segments; x++) {
  const yCubes = []
  for (let y = 0; y < segments; y++) {
    const zCubes = []
    for (let z = 0; z < segments; z++) {
      const cube = makeCube(size, size, size)
      const pos = new THREE.Vector3((x * size) - size, (y * size) - size, (z * size) - size);
      cube.position.copy(pos)
      scene.add(cube)
      zCubes.push({ initialPosition: pos, data: cube })
    }
    yCubes.push(zCubes)
  }
  cubes.push(yCubes)
}

const scale = 0.3;
function animateCubes(cubes) {
  for (let x = 0; x < cubes.length; x++) {
    for (let y = 0; y < cubes[x].length; y++) {
      for (let z = 0; z < cubes[x][y].length; z++) {
        const initialPos = new THREE.Vector3().copy(cubes[x][y][z].initialPosition)
        const desiredPos = new THREE.Vector3(scale * (x - size), scale * (y - size), scale * (z - size))
        const alpha = (1 + Math.sin(clock.getElapsedTime())) * scale

        cubes[x][y][z].data.position.copy(initialPos.lerp(desiredPos, alpha))
      }
    }
  }
}

function animate() {
  animateCubes(cubes);

  renderer.render(scene, camera);
}

window.addEventListener('resize', function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}, false);


renderer.setAnimationLoop(animate);