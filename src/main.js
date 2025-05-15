import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'; // Ensure EXRLoader is imported// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import "./style.css";
import gsap from "gsap";

// Scene setup
const scene = new THREE.Scene();

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Create background sphere with stars
const starsTexture = textureLoader.load('/stars.jpg');
starsTexture.colorSpace = THREE.SRGBColorSpace;

const backgroundGeometry = new THREE.SphereGeometry(50, 32, 32);
const backgroundMaterial = new THREE.MeshBasicMaterial({
    map: starsTexture,
    side: THREE.BackSide  // Render the inside of the sphere
});
const backgroundSphere = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
scene.add(backgroundSphere);

// Load planet textures
const planetTextures = [
 '/earth/map.jpg',       // Changed from './public/earth/map.jpg'
  '/venus/map.jpg',       // Changed from './public/venus/map.jpg'
  '/volcanic/color.png',  // Changed from './public/volcanic/color.png'
  '/csilla/color.png',    // Changed from './public/csilla/color.png'
];

// Camera setup
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 9;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#app'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Load HDRI environment map
new EXRLoader()
  .setPath('https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/')
  .load('golden_gate_hills_1k.exr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
  });

const radius = 1;
const segments=64;
const orbitRadius = 4;
const spheres = new THREE.Group();
const sphereMesh=[];
for(let i=0;i<4;i++){
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const texture = textureLoader.load(planetTextures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({ 
    map: texture,
    metalness: 0.2,
    roughness: 0.8
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphereMesh.push(sphere);
  const angle = (i /4) * Math.PI * 2;
  sphere.position.x=orbitRadius * Math.cos(angle);
  sphere.position.z=orbitRadius* Math.sin(angle);
  spheres.add(sphere);
}
spheres.rotation.x=0.15;
spheres.rotation.y=-0.15;
scene.add(spheres);
// OrbitControls setup
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// Add a simple cube to the scene

// Studio Lighting Setup
// Key Light - Main illumination



// Handle window resize
window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// setInterval(()=>{
//   gsap.to(spheres.rotation,{
//     y:`+=${1.5708}`,
//     duration:2,
//     ease:"expo.easeOut",
    
   
//   })
// },2500)
// Animation loop
let lastScrollTime = 0;
const scrollThrottleDelay = 2000; // 2 seconds
const scrollcount=0
window.addEventListener('wheel', (event) => {
  const currentTime = Date.now();
  
  if (currentTime - lastScrollTime >= scrollThrottleDelay) {
    // scrollcount=(scrollcount+1)%4;
   
    const headings=document.querySelectorAll('.heading');
    gsap.to(headings,{
      duration:1,
      y:`-=${100}%`,
      ease:"power2.inOut"
    })
    // if(scrollcount===0){
    //   gsap.to(headings,{
    //     duration:1,
    //     y: 0,
    //     ease:"power2.inOut"
    //   })
    // }

    gsap.to(spheres.rotation, {
      y:`-=${Math.PI/2}%`,
      duration: 2,
      ease: "expo.easeOut"
    });
    
    lastScrollTime = currentTime;
  }
});

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  // controls.update();

  // Rotate cube
 for(let i=0;i<sphereMesh.length;i++){
  gsap.to(sphereMesh[i].rotation,{
    y:`+=${0.0005}`,
    duration:0.01,
    ease:"linear"
  })
 }


  renderer.render(scene, camera);
}

animate();
animate();