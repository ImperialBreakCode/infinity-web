import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

import { EffectComposer } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132/examples/jsm/controls/OrbitControls.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.132/examples/jsm/shaders/FXAAShader.js';

import { createLightsaberHilt } from './lightsaber_hilt.js';
import { RoomEnvironment } from './room_env.js';

let scene, camera, renderer, composer, finalComposer;
let geometry, material;
let hilt, blade, plane;
let saberLight, light2, light3;
let width, height;
let controls;

const darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
var materials = [];
var bloomMesh = [];
export var retracted = true;
var bladeIsChanging = false;
export var bladeFlashing = false;
var lightColor = new THREE.Color(0xff0f0f);
var bladeColor = new THREE.Color(0xff1313);
var flashBladeColor = new THREE.Color(0xff1f2f);

const colorsLight = {
    red: 0xff0f0f,
    blue: 0x0f0fff,
    cyan: 0x00ffff,
    green: 0x0fff0f,
    purple: 0xaf00ff,
    yellow: 0xffff00
};

const colorsBlade = {
    red: 0xff0f0f,
    blue: 0x1534dd,
    cyan: 0x00ffff,
    green: 0x00ef00,
    purple: 0x661aff,
    yellow: 0xcfcf00
};

const colorsFlash = {
    red: 0xff1f2f,
    blue: 0x101fff,
    cyan: 0x009999,
    green: 0x0faf0f,
    purple: 0xaf2aff,
    yellow: 0x909010
};

function updateProgress(percent) {

    document.querySelector('.prep-panel h1').textContent = percent + '%';
    document.querySelector('.load-progress div').style.width = percent + '%';

    if (percent == 100){
        setTimeout(() => {
            $('.prep-panel').remove();
        }, 2000);
    }
}

let frameIndFlash = 0;
let animation = () => {

    if (bladeIsChanging) {

        if (retracted) {
            blade.scale.y += 0.1;
            blade.position.y += 25;
            saberLight.distance += 50;

            if (blade.scale.y >= 1) {
                blade.scale.y = 1;
                bladeIsChanging = false;
                retracted = false;
                saberLight.distance = 500;
                light2.intensity = 3;
                light3.intensity = 1;
            }
        }
        else{
            blade.scale.y -= 0.1;
            blade.position.y -= 25;
            saberLight.distance -= 25;

            if (blade.scale.y <= 0) {
                blade.scale.y = 0;
                bladeIsChanging = false;
                retracted = true;
                saberLight.distance = 1;
                light2.intensity = 0;
                light3.intensity = 0;
            }
        }
    }

    if (bladeFlashing) {

        var color;

        if (frameIndFlash <= 3) {
            color = new THREE.Color(0xffffff);
        }
        else if(frameIndFlash <= 6){
            color = flashBladeColor;
        }
        else if(frameIndFlash > 6){
            color = flashBladeColor;
            frameIndFlash = 0;
        }
        
        saberLight.color = color;
        blade.material.color = color;
        light2.color = color;
        light3.color = color;

        frameIndFlash += 1;
    }

    controls.update();

    render();
}

init();
updateProgress(100);

$(window).resize(function(){
    width = window.innerWidth;
    height = window.innerHeight;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    controls.update();
});


function init(){

    //textures
    const textureLoad = new THREE.TextureLoader();
    const heightMap = textureLoad.load('/static/solaris/javascript/lightsaber/textures/heightMap.png');

    // init width and height
    width = window.innerWidth;
    height = window.innerHeight;

    // createing scene
    scene = new THREE.Scene();
    scene.children.langht = 0;
    scene.fog = new THREE.Fog( 0x0a0a1a, 300, 2500 );

    // creating camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.x = 0
    camera.position.z = 141;
    camera.position.y = 21;
    camera.rotation.x = -0.15;

    // creating lightsaber
    hilt = createLightsaberHilt();

    geometry = new THREE.CylinderGeometry( 5, 6, 500, 64 );
    material = new THREE.MeshBasicMaterial();
    material.color = bladeColor;
    blade = new THREE.Mesh(geometry, material);

    geometry = new THREE.SphereGeometry( 5, 64, 64 );
    let bladeTop = new THREE.Mesh(geometry, material);
    bladeTop.position.set(0, 250, 0);
    blade.add(bladeTop);
    blade.position.set(0, 320, 0);
    hilt.add(blade);

    hilt.rotation.x = -0.5;
    hilt.rotation.y = -0.06;
    hilt.rotation.z = 1.3;

    hilt.position.x = 50;
    hilt.position.y = -20;

    bloomMesh.push(blade.uuid);
    bloomMesh.push(bladeTop.uuid);

    blade.position.y -= 275;
    blade.scale.y = 0;

    scene.add( hilt );

    // creating background
    geometry = new THREE.PlaneGeometry( 4000, 4000, 64, 64 );
    material = new THREE.MeshPhongMaterial({
        color: 0x090909,
        shininess: 20,
        displacementMap: heightMap,
        displacementScale: 300,
        alphaMap: heightMap,
        transparent: true,
        flatShading: true
    });
    plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = THREE.Math.degToRad(-90);
    plane.position.y = -600;

    scene.add( plane );


    // creating lights

    const ambLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambLight );

    const light1 = new THREE.PointLight( 0x0f0f0f, 1, 0 );
	light1.position.set( 0, 300, 0 );
	scene.add( light1 );

	light2 = new THREE.PointLight( 0xff0f0f, 1, 0 );
    light2.color = new THREE.Color(colorsLight.red);
	light2.position.set( 200, 300, 200 );
    light2.intensity = 0;
	scene.add( light2 );

	light3 = new THREE.PointLight( 0xff0f0f, 1, 0 );
    light3.color = new THREE.Color(colorsLight.red);
	light3.position.set( - 200, - 300, - 200 );
    light3.intensity = 0;
	scene.add( light3 );

    saberLight = new THREE.PointLight( 0xff0000, 10, 500, 0.7 );
    saberLight.color = new THREE.Color(colorsBlade.red);
    saberLight.position.set( 0, 170, 0 );
    saberLight.distance = 1;
    hilt.add( saberLight );


    // creating renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize( width, height );
    renderer.setClearColor(0x0a0a1a, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.setAnimationLoop(animation);
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;


    //
    //postprocessing
    composer = new EffectComposer(renderer);
    composer.renderToScreen = false;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const paramsBloom = {
        exposure: 1,
        bloomStrength: 1,
        bloomThreshold: 0.2,
        bloomRadius: 0
    };

    const bloom = new UnrealBloomPass({x: width, y:height}, 1, 0.0, 0.30);
    bloom.threshold = paramsBloom.bloomThreshold;
	bloom.strength = paramsBloom.bloomStrength;
	bloom.radius = paramsBloom.bloomRadius;
    composer.addPass(bloom);

    const finalPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: composer.renderTarget2.texture }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            defines: {}
        } ), 'baseTexture'
    );
    finalPass.needsSwap = true;

    const pixelRatio = renderer.getPixelRatio();
    var fxaaPass = new ShaderPass( FXAAShader );
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( width * pixelRatio );
	fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( height * pixelRatio );

    finalComposer = new EffectComposer(renderer);
    finalComposer.setPixelRatio( 1 );
    finalComposer.addPass(renderPass);
    finalComposer.addPass(finalPass);
    finalComposer.addPass(fxaaPass);
        
    // orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 700;

    document.getElementById("rend").appendChild( renderer.domElement );
}

function render() {
    scene.traverse( darkenNonBloomed );
	composer.render();

	scene.traverse( restoreMaterial );
    finalComposer.render();
}

export function toggleBlade() {
    bladeIsChanging = true;

    if(bladeFlashing){
        toggleFlash();
    }
}

export function toggleFlash(){
    if (!retracted) {
        bladeFlashing = !bladeFlashing;
    }
    
    if (!bladeFlashing) {
        blade.material.color = bladeColor;
        saberLight.color = bladeColor;
        light2.color = lightColor;
        light3.color = lightColor;
    }
}

export function changeBladeColor(colorOption){

    colorOption = colorOption.split('-')[1];
    switch (colorOption) {
        case 'red':
            lightColor = new THREE.Color(colorsLight.red);
            bladeColor = new THREE.Color(colorsBlade.red);
            flashBladeColor = new THREE.Color(colorsFlash.red);

            initColors();

            break;

        case 'blue':
            lightColor = new THREE.Color(colorsLight.blue);
            bladeColor = new THREE.Color(colorsBlade.blue);
            flashBladeColor = new THREE.Color(colorsFlash.blue);

            initColors();

            break;

        case 'cyan':
            lightColor = new THREE.Color(colorsLight.cyan);
            bladeColor = new THREE.Color(colorsBlade.cyan);
            flashBladeColor = new THREE.Color(colorsFlash.cyan);

            initColors();

            break;

        case 'green':
            lightColor = new THREE.Color(colorsLight.green);
            bladeColor = new THREE.Color(colorsBlade.green);
            flashBladeColor = new THREE.Color(colorsFlash.green);
    
            initColors();
    
            break;

        case 'green':
            lightColor = new THREE.Color(colorsLight.green);
            bladeColor = new THREE.Color(colorsBlade.green);
            flashBladeColor = new THREE.Color(colorsFlash.green);
        
            initColors();
        
            break;

        case 'purple':
            lightColor = new THREE.Color(colorsLight.purple);
            bladeColor = new THREE.Color(colorsBlade.purple);
            flashBladeColor = new THREE.Color(colorsFlash.purple);
            
            initColors();
            
            break;

        case 'yellow':
            lightColor = new THREE.Color(colorsLight.yellow);
            bladeColor = new THREE.Color(colorsBlade.yellow);
            flashBladeColor = new THREE.Color(colorsFlash.yellow);
            
            initColors();
            
            break;

        default:
            break;
    }
}

function initColors(){
    light2.color = lightColor;
    light3.color = lightColor;
    saberLight.color = bladeColor;
    blade.material.color = bladeColor;
}

function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomMesh[0] != obj.uuid && bloomMesh[1] != obj.uuid) {
        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;
    }

}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }

}

