import * as THREE from "three";

import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {Plane} from './planePhy.js' 
import { skybox } from "./skybox";

    
///scene
const scene = new THREE.Scene();
const gui = new dat.GUI();

// GUI   
var options = {
  planeMass : 15410 ,
  fuelMass  : 25082 ,
  massFlowRate : 1 ,
  temperature : 20 ,
  airDencity : 225,
  angleWind : 0 ,
  vilocityWind : 0
 };
//const gui2 = new dat.GUI();
const planee = gui.addFolder('Plane');
//planee.open();
planee.add(options, 'planeMass').name(' plane Mass ').onChange(function(value){
  options.planeMass = value;
  p.planeMass = options.planeMass; });
planee.add(options, 'fuelMass').name(' fuel Mass ').onChange(function(value){
  options.fuelMass = value;
  p.fuelMass = options.fuelMass; });
planee.add(options, 'massFlowRate').name(' Flow Rate Mass ').onChange(function(value){
  options.massFlowRate = value;
  p.massFlowRate = options.massFlowRate; });
const atmospheree = gui.addFolder('Atmosphere');
//atmospheree.open();
atmospheree.add(options,'temperature').name('temperature').max(100).min(0).onChange(function(value){
  options.temperature = value ;
  p.temperature = options.temperature ; });
atmospheree.add(options,'airDencity').name('airDencity').onChange(function(value){
  options.airDencity = value ; });
atmospheree.add(options, 'angleWind').name(' angle wind ').max(360).min(-360).onChange(function(value){
    options.angleWind = value;
    p.angleWind = options.angleWind; });
atmospheree.add(options, 'vilocityWind').name(' vilocity Wind ').max(3600000).min(-360000).onChange(function(value){
      options.vilocityWind = value;
      p.vilocityWind = options.vilocityWind; });



//  LIGHT
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1000, 0);
scene.add(directionalLight);

// CAMERA
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  5,
  2000000
);
camera.position.set( 9000,50,13000);
scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
let controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set(0, 10, 0);
// controls.minDistance = 60.0;
// controls.maxDistance = 5000.0;
controls.update();

//Model
let sky = new skybox();
sky.makeSkybox(scene, renderer, gui);

let keysPressed = {};
document.addEventListener("keydown", event => {
keysPressed[event.key] = true;
if (keysPressed["c"]) {  camState ^= 1;    }
if (keysPressed["o"]) {  p.wind();    }
if (keysPressed["p"]) {  p.fuelMass = 0;   }
if (keysPressed["a"]) {  p.alpha += 0.01;  }
if (keysPressed["d"]) {  p.alpha -= 0.01;  }
if (keysPressed["w"]) {  p.theta += 0.03;  }
if (keysPressed["s"]) {  p.theta -= 0.03;  }
if (keysPressed["z"]) {  p.bita += 0.01;   }
if (keysPressed["x"]) {  p.bita -= 0.01;   }
if (keysPressed["m"]) {  p.exitVelocity += 100; }
if (keysPressed["n"]) {  p.exitVelocity -= 100;}  });
document.addEventListener("keyup", event => {
keysPressed[event.key] = false;  });


  // plane -------------------------------------------------------------------------
  let plane = new THREE.Group();
  let ppppp = new GLTFLoader();
  ppppp.setPath("../modale/aircraft/");
  ppppp.load("scene.gltf", function (gltf) {
      plane = gltf.scene;
      plane.scale.set(75, 75, 75);
      plane.rotation.x = Math.PI/2 ;
      scene.add(plane); });
     plane.position.set(13000, 40, 21000);

     let p = new Plane(
    new THREE.Vector3(
         plane.position.x ,
         plane.position.y , 
         plane.position.z 
     ),
     options.planeMass, //planeMass
     options.fuelMass, //fuelMass
     0,  //massFlowRate
     // 2735 kilo meters 
     0,  //exitVelocity
     options.temperature,   //temperature
     0,   //theta
     0,   //bita
     0,   //alpha
     2,    //dTime
     options.angleWind,
     options.vilocityWind
     );
     let oldVilocity=p.vilocity;
    // camera.lookAt(plane);


  //Hungar 
  let hungar = new THREE.Group();
  let hunn = new GLTFLoader();
  // let wwwww = new 
  hunn.setPath("../modale/aircraft_hangar/");
  hunn.load("scene.gltf", function (gltf) {
      hungar = gltf.scene;
      hungar.scale.set(100, 100, 100);
      hungar.position.set(21700,1,10000);
      hungar.rotation.y = Math.PI/2 ;
      scene.add(hungar); });

        //Tower 
  let tower = new THREE.Group();
  let ttt = new GLTFLoader();
  // let wwwww = new 
  ttt.setPath("../modale/wwii_air_trafic_control_tower(1)/");
  ttt.load("scene.gltf", function (gltf) {
      tower = gltf.scene;
      tower.scale.set(600, 700, 600);
      tower.position.set(8000,1,22000);
      tower.rotation.y = Math.PI/2 ;
      scene.add(tower); });

// const listener = new THREE.AudioListener();
// camera.add(listener);

// sound
const listener = new THREE.AudioListener()
const audioLoader = new THREE.AudioLoader()
const PlaneSound = new THREE.Audio(listener)
audioLoader.load('../src/sound/biplane-flying-01 (copy).mp3', function(buffer) {
  PlaneSound.setBuffer(buffer);
  PlaneSound.setVolume(0.1);
 // PlaneSound.duration = 14;
  //PlaneSound.play();
  
});


/**
 * Display The Values on the Screen
 */
const text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = "100";
text2.style.height = "100";
text2.style.backgroundColor = "white";
text2.style.top = "50" + 'px';
text2.style.left = "50" + 'px';
text2.style.fontSize = "20px";
//text2.hidden = true;
document.body.appendChild(text2);
let generateTextOnScreen = () => {
    let text = 'Plane fuel mass: ' + p.fuelMass.toFixed(2) + '/' + options.fuelMass.toFixed(2).toString();
    text += '<br>';
    text += 'gravity accularation: ' + p.gravity.toFixed(2);
    text += '<br>';
    text += 'Plane speed x: ' + p.vilocity.x.toFixed(2);
    text += '<br>';
    text += 'Plane speed y: ' + p.vilocity.y.toFixed(2);
    text += '<br>';
    text += 'Plane speed z: ' + p.vilocity.z.toFixed(2);
    text += '<br>';
    text += 'Gravity X :' + p.g.x.toFixed(2);
    text += '<br>';
    text +=  'Gravity Y :' + p.g.y.toFixed(2);
    text += '<br>';
    text +=  'Gravity Z :' + p.g.z.toFixed(2);
    text += '<br>';
    text += 'Thrust X :' + p.t.x.toFixed(2);
    text += '<br>';
    text +=  'Thrust Y :' + p.t.y.toFixed(2);
    text += '<br>';
    text +=  'Thrust Z :' + p.t.z.toFixed(2);
    text += '<br>';
    text += 'Drag X :' + p.d.x.toFixed(2);
    text += '<br>';
    text +=  'Drag Y :' + p.d.y.toFixed(2);
    text += '<br>';
    text +=  'Drag Z :' + p.d.z.toFixed(2);
    text += '<br>';
    text += 'Lift X :' + p.l.x.toFixed(2);
    text += '<br>';
    text +=  'Lift Y :' + p.l.y.toFixed(2);
    text += '<br>';
    text +=  'Lift Z : ' + p.l.z.toFixed(2);
    text += '<br>';
    text +=  'Rho ' + p.air_rho();
    text += '<br>';
    text += 'Exit Vilocity: ' + p.exitVelocity;
    text += '<br>';
    text2.innerHTML = text;
}

const text3 = document.createElement('div');
text3.style.position = 'absolute';
text3.style.textAlign = 'center'
text3.style.width = "5000";
text3.style.height = "5000";
text3.style.backgroundColor = "black";
text3.style.top = "0" + 'px';
text3.style.left = "0" + 'px';
text3.style.bottom = "0" + 'px';
text3.style.right = "0" + 'px';
text3.style.fontSize = "90px";
text3.style.color = 'red'
text3.hidden = true;
document.body.appendChild(text3);
let generateTextOnScreen2 = () => {
        let text = '<br>' + '<br>' + '<br>';
        text += 'The End ';
        text += '<br>';
        text3.innerHTML = text;
    }


const tick = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
    controls.update();
    let xx = p.position.x
    let yy = p.position.y
    let zz = p.position.z
    console.log('xx : ',xx);
    console.log('yy : ',yy);
    console.log('zz : ',zz);
    plane.position.set(xx, yy, zz);
    plane.rotation.set(p.theta,p.alpha,p.bita);
    p.update(oldVilocity);
   
    if (p.exitVelocity>0){
   //  PlaneSound.play();
   }    
    oldVilocity  = p.vilocity;
   // plane.add(camera);
    generateTextOnScreen();
   generateTextOnScreen2();

};
tick();
