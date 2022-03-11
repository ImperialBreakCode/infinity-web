import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

let geometry, material;
let hilt;


function bottomShape(radius, cylHeight) {
    var depth = 0.1;
    var wide = 3;
    var h = 12;

    let shape = new THREE.Shape();
    shape.moveTo(-wide, -radius - depth);
    shape.lineTo(wide, -radius - depth);
    shape.lineTo(radius + depth, -wide);
    shape.lineTo(radius + depth, wide);
    shape.lineTo(wide, radius + depth);
    shape.lineTo(-wide, radius + depth);
    shape.lineTo(-radius - depth, wide);
    shape.lineTo(-radius - depth, -wide);
    shape.lineTo(-wide, -radius - depth);

    const extrudeSettings = {
        steps: 2,
        depth: h,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 5
    };

    geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    material = new THREE.MeshPhysicalMaterial({
        color: 0x2f2f2f,
        reflectivity: 0.1,
        metalness: 0.8,
        roughness: 0.2
    });
    let bottom = new THREE.Mesh(geometry, material);
    bottom.position.set(0, -cylHeight/2, 0);
    bottom.rotation.x = THREE.Math.degToRad(90);

    return bottom
}

function sideParts(radius, cylHeight) {

    radius *= 2;
    cylHeight /= 2;
    var depth = 1;

    let shape = new THREE.Shape();
    shape.moveTo(radius/4, 0);
    shape.quadraticCurveTo(radius/4, cylHeight/4, radius - radius / 8, cylHeight/4);
    shape.lineTo(radius - radius / 8, cylHeight/2);
    shape.quadraticCurveTo(radius - radius / 8, cylHeight - 8, 0, cylHeight);
    shape.lineTo(0, 0);
    shape.lineTo(radius/4, 0);

    let edgeBladeShape = new THREE.Shape();
    edgeBladeShape.moveTo(0, 0);
    edgeBladeShape.lineTo(0, depth);
    edgeBladeShape.lineTo(radius / 8, depth/2);
    edgeBladeShape.lineTo(0, 0);

    let curveOfEdgeBlade = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3( -radius + radius / 8, cylHeight/2, 0.001),
        new THREE.Vector3( -radius + radius / 8, cylHeight - 8, 0 ),
        new THREE.Vector3( 0, cylHeight, 0 )
    );

    // main shape settings
    const extrudeSettings = {
        curveSegments: 64,
        steps: 1,
        depth: depth,
        bevelEnabled: false
    };

    // the blade consists of two parts - upper curved part and lower straight part
    // curved part
    const extrudeSettingsBlade = {
        steps: 64,
        bevelEnabled: false,
        extrudePath: curveOfEdgeBlade
    };
    // straight part
    const extrudeSettingsBlade2 = {
        steps: 64,
        depth: cylHeight/4,
        bevelEnabled: false
    };

    // curved part
    geometry = new THREE.ExtrudeGeometry(edgeBladeShape, extrudeSettingsBlade);
    material = new THREE.MeshPhysicalMaterial({
        color: 0x2f2f2f,
        metalness: 1,
        reflectivity: 0.9,
        roughness: 0,
        clearcoat: 0.5,
        clearcoatRoughness: 0
    });
    let bladeMesh = new THREE.Mesh(geometry, material);
    bladeMesh.rotation.y = THREE.Math.degToRad(180);
    bladeMesh.position.z = 1;

    // creating the straight part and adding it to the curved part making the whole blade
    geometry = new THREE.ExtrudeGeometry(edgeBladeShape, extrudeSettingsBlade2);
    let bladeMeshSecond = new THREE.Mesh(geometry, material);
    bladeMeshSecond.position.set(-radius + radius/8, cylHeight/4, 0);
    bladeMeshSecond.rotation.x = THREE.Math.degToRad(90);
    bladeMeshSecond.rotation.y = THREE.Math.degToRad(180);
    bladeMesh.add(bladeMeshSecond);

    // creating the main side part and adding the blade to it
    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    material = new THREE.MeshPhysicalMaterial({
        color: 0x2f2f2f,
        metalness: 1,
        reflectivity: 0.9,
        roughness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0
    });
    let sidePart = new THREE.Mesh(geometry, material);
    sidePart.position.set( radius/2 + 0.5, cylHeight/1.4, 0);
    sidePart.add(bladeMesh);

    // cloning the whole object and adding it to the first
    let sidePartSecond = sidePart.clone();
    sidePartSecond.position.set(-radius - 1, 0, 0)
    sidePartSecond.rotation.y = THREE.Math.degToRad(180);
    sidePart.add(sidePartSecond);

    return sidePart;
}

function createRims(radius, cylHeight) {

    const rimsGroup =  new THREE.Group();
    let rim;
    let secondRadius;

    secondRadius = radius - 0.5;
    let shapeTopRing = new THREE.Shape();
    shapeTopRing.arc(0, 0, secondRadius, 0, 2 * Math.PI ); 
    
    let shapeHole = new THREE.Shape();
    shapeHole.arc(0, 0, secondRadius - 1, 0, 2 * Math.PI );
    shapeTopRing.holes.push(shapeHole);

    let shapeMiddle = new THREE.Shape();
    shapeMiddle.arc(0, 0, secondRadius, 0, 2 * Math.PI );
    shapeHole = new THREE.Shape();
    shapeHole.arc(0, 0, secondRadius - 5, 0, 2 * Math.PI );
    shapeMiddle.holes.push(shapeHole);
    
    // first small
    secondRadius = radius - radius/4;
    geometry = new THREE.CylinderGeometry(secondRadius, secondRadius, 10, 64);
    material = new THREE.MeshPhysicalMaterial({
        color: 0x040404,
        reflectivity: 0.5,
        metalness: 1,
        roughness: 0.4
    });
    rim = new THREE.Mesh(geometry, material);
    rim.position.set(0, cylHeight/2, 0);
    rimsGroup.add(rim);

    // second
    geometry = new THREE.ExtrudeGeometry(shapeMiddle, {
        steps: 5,
        depth: 2,
        bevelEnabled: false,
        curveSegments: 100
    });
    material = new THREE.MeshPhysicalMaterial({
        color: 0x2f2f2f,
        metalness: 1,
        reflectivity: 0.9,
        roughness: 0.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0
    });
    rim = new THREE.Mesh(geometry, material);
    rim.rotation.x = THREE.Math.degToRad(90);
    rim.position.set(0, cylHeight/2 + 6, 0);
    rimsGroup.add(rim);

    // last top
    secondRadius = radius;
    geometry = new THREE.ExtrudeGeometry(shapeTopRing, {
        steps: 5,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 1,
        curveSegments: 100
    });
    material = new THREE.MeshPhysicalMaterial({
        color: 0x040404,
        reflectivity: 0.5,
        metalness: 1,
        roughness: 0.4
    });
    rim = new THREE.Mesh(geometry, material);
    rim.position.set(0, cylHeight, 0);

    // for seamless arc
    let rimSec = rim.clone();
    rimSec.position.set(0, 0, 0)
    rimSec.rotation.z = THREE.Math.degToRad(90);
    rim.add(rimSec);

    rim.rotation.x = THREE.Math.degToRad(90);
    rim.position.set(0, cylHeight/ 2 + 8, 0);
    rimsGroup.add(rim);

    return rimsGroup;
}

function createMiddle(radius, cylHeight) {
    let midMainShape = new THREE.Shape();
    midMainShape.arc(0, 0, radius, 0, 2 * Math.PI);

    geometry = new THREE.ExtrudeGeometry(midMainShape, {
        steps: 5,
        depth: cylHeight/8,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1,
        curveSegments: 200
    });
    material = new THREE.MeshPhysicalMaterial({
        color: 0x2f2f2f,
        metalness: 1,
        reflectivity: 0.5,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 1
    });
    let midMain = new THREE.Mesh(geometry, material);
    let midSec = midMain.clone();
    midSec.rotation.z = THREE.Math.degToRad(90);
    midMain.add(midSec);
    midMain.rotation.x = THREE.Math.degToRad(90);
    midMain.position.set(0, cylHeight/2, 0);

    geometry = new THREE.CylinderGeometry(2, 2, 3, 64);
    material = new THREE.MeshPhysicalMaterial({
        color: 0x2f0000,
        metalness: 0.5,
        reflectivity: 0.3,
        roughness: 0.8,
        clearcoat: 0.1,
        clearcoatRoughness: 1
    });
    let button = new THREE.Mesh(geometry, material);
    button.position.set(0, radius, cylHeight/8 - 6);
    midMain.add(button);

    return midMain;
}

export function createLightsaberHilt() {
    var radius = 8;
    var cylHeight = 124;
    geometry = new THREE.CylinderGeometry(radius, radius, cylHeight, 64, 100);
    material = new THREE.MeshPhysicalMaterial({
        color: 0x040404,
        reflectivity: 0.5,
        metalness: 1,
        roughness: 0.3,
    });
    hilt = new THREE.Mesh( geometry, material );

    let bottom = bottomShape(radius, cylHeight);
    hilt.add(bottom);

    let sidePart = sideParts(radius, cylHeight);
    hilt.add(sidePart);

    let rims = createRims(radius, cylHeight);
    hilt.add(rims);

    let middle = createMiddle(radius, cylHeight);
    hilt.add(middle);

    return hilt;
}