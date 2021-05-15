import {EffectComposer} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/UnrealBloomPass.js';


let camera, scene, renderer;
let geometry, material;
let width, height;
let cube, stars;
var composer;

var mouseY = 0;
var mouseX = 0;


const alphamap = new THREE.TextureLoader().load( '../static/main_site/render/alpha_inf_iverted.jpg' );
const normalmap = new THREE.TextureLoader().load('../static/main_site/render/NormalMap.png');
normalmap.wrapS = THREE.RepeatWrapping;
normalmap.wrapT = THREE.RepeatWrapping;
normalmap.repeat.set( 4, 4 );

const starmap = new THREE.TextureLoader().load('../static/main_site/render/star3.png');


init();


$(window).resize(function(){

    width = window.innerWidth;
    height = window.innerHeight;

    renderer.setSize( width, height );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


$(window).mousemove( function (event){
	mouseY = event.clientY;
	mouseX = event.clientX;
} );


$(window).scroll( function (){
	stars.position.z = window.scrollY / 50;
});


function createParticles(){

	const partGeo = new THREE.BufferGeometry;
	const partMaterial = new THREE.PointsMaterial({
		size: 0.03,
		map: starmap,
		transparent: true,
		color: 0xff005f,
	})
	const partCount = 15000;

	const posArray = new Float32Array(partCount * 3);

	for (let i = 0; i < partCount * 3; i++){

		posArray[i] = Math.random() * 30;
		posArray[i] -= 15;

	}

	partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

	const particles = new THREE.Points(partGeo, partMaterial);

	return particles;

}


function createCube(){

		geometry = new THREE.BoxGeometry( 2, 2, 2 );

		material = new THREE.MeshPhysicalMaterial({
			color: 0x824343,
			roughness: 0.2,
			metalness: 1,
			reflectivity: 1,
			normalMap: normalmap,
			transparent: true,
		})

		let meshcube = new THREE.Mesh( geometry, material );
		meshcube.castShadow = true;
		meshcube.receiveShadow = true;

		const distant = new THREE.MeshDistanceMaterial( {
			alphaMap: alphamap,
		});
		meshcube.customDistanceMaterial = distant;

		geometry = new THREE.BoxGeometry(2.01, 2.01, 2.01);
		material = new THREE.MeshBasicMaterial({
			color: 0xff3e3e,
			alphaMap: alphamap,
			transparent: true,
		});
		material.color.multiplyScalar( 1.5 );

		let meshcube2 = new THREE.Mesh(geometry, material);
		meshcube2.castShadow = true;
		meshcube2.receiveShadow = true;

		meshcube.add(meshcube2);

		return meshcube

	}


function init() {

    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();


	//camera

	camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 50 );
	camera.position.z = 5;
	camera.position.y = 0.7;


	//lights

	const rectLight1 = new THREE.RectAreaLight(0x0000ff, 10, 5, 5);
	rectLight1.position.set( 4, 5, 4);
	rectLight1.lookAt( 0, 0, 0 );
	scene.add( rectLight1 );

	const rectLight2 = new THREE.RectAreaLight(0xff0000, 10, 5, 5);
	rectLight2.position.set( -4, 5, 4);
	rectLight2.lookAt( 0, 0, 0 );
	scene.add( rectLight2 );


	const ptlight = new THREE.PointLight(0x0000ff, 20 , 10);
	ptlight.position.set(-3.4, -1.29 , 3.1);
	scene.add(ptlight);

	const ptlight2 = new THREE.PointLight(0xff0000, 20 , 10);
	ptlight2.position.set(3.4, -1.29 , 3.1);
	scene.add(ptlight2);


	//mesh

	cube = createCube();
	scene.add(cube);

	stars = createParticles();
	scene.add(stars);



	//renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( width, height );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	renderer.setClearColor(new THREE.Color('#040010'), 1);
	renderer.setAnimationLoop( animation );


	//post process
	composer = new EffectComposer( renderer );

	const renderPass = new RenderPass( scene, camera );
	composer.addPass( renderPass );
	const bloom = new UnrealBloomPass({x:width, y:height}, 1, 0.0, 0.30);
	composer.addPass(bloom);


    $('.render').append(renderer.domElement)

}

function animation( time ) {

	cube.rotation.x = time / 5000;
	cube.rotation.y = time / 5000;

	cube.rotation.x += (mouseY - cube.rotation.y) / 1000;
	cube.rotation.y -= (mouseX - cube.rotation.x) / 1000;

	stars.position.x = -mouseX / 500;
	stars.position.y = mouseY / 500;

	composer.render();

}

