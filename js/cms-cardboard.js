var scene, camera, renderer, controls;
var detector = {'Collections':{}};
var loader = new THREE.OBJMTLLoader();

function importOBJMTL(name, obj, mtl) {
  loader.load(obj, mtl, function(object){
    object.name = name;
    object.visible = true;

    object.children.forEach(function(c) {
      c.material.transparent = true;
      c.material.opacity = 0.75;
    });

    scene.add(object);
  });
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);

  camera.position.set(10, 0, 20);
  //camera.position.set(3, 0, 0);
  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,0));
  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  element = renderer.domElement;
  container = document.getElementById('cms');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  controls = new THREE.OrbitControls(camera, element);
  controls.enablePan = false;
  controls.enableZoom = false;

  var intensity = 1.0;
  var length = 15.0;

  var light1 = new THREE.DirectionalLight(0xcccccc, intensity);
  light1.position.set(-length, length, length);
  scene.add(light1);

  var light2 = new THREE.DirectionalLight(0xcccccc, intensity);
  light2.position.set(length, -length, -length);
  scene.add(light2);

  var bgeometry = new THREE.SphereGeometry(0.1,32,32);
  var bmaterial = new THREE.MeshBasicMaterial({color: 0xffff00});

  var bunch1 = new THREE.Mesh(bgeometry, bmaterial);
  bunch1.position.x = 0;
  bunch1.position.y = 0;
  bunch1.position.z = 200;
  bunch1.name = 'bunch1';
  bunch1.visible = true;

  var bunch2 = new THREE.Mesh(bgeometry, bmaterial);
  bunch2.position.x = 0;
  bunch2.position.y = 0;
  bunch2.position.z = -200;
  bunch2.name = 'bunch2';
  bunch2.visible = true;

  scene.add(bunch1);
  scene.add(bunch2);

  var cgeometry = new THREE.SphereGeometry(0.01, 32, 32);

  var cmaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.75,
    color: 0xffff00
  });
  cmaterial.depthWrite = false;

  var collision = new THREE.Mesh(cgeometry, cmaterial);
  collision.position.set(0,0,0);
  collision.name = 'Collision';
  collision.visible = true;

  scene.add(collision);
  var scale = 500;
  var ctime = 250;

  var c1 = new TWEEN.Tween(collision.scale)
    .to({x: scale, y: scale, z: scale}, ctime)
    .onStart(function(){
    })
    .onComplete(function(){
      collision.scale.set(1/scale, 1/scale, 1/scale);
    });

  var t1 = new TWEEN.Tween(bunch1.position)
    .to({z:0.0}, 2500)
    .onComplete(function(){
      c1.start();
    })
    .easing(TWEEN.Easing.Back.In);

  var t2 = new TWEEN.Tween(bunch2.position)
    .to({z:0.0}, 2500)
    .onComplete(function(){
    })
    .easing(TWEEN.Easing.Back.In);

  var t3 = new TWEEN.Tween(bunch1.position)
    .to({z:-200}, 2500)
    .onStart(function(){
    })
    .onComplete(function(){
      bunch1.position.z = 200;
    }).easing(TWEEN.Easing.Back.Out);

  var t4 = new TWEEN.Tween(bunch2.position)
    .to({z:200}, 2500)
    .onComplete(function(){
      bunch2.position.z = -200;
    }).easing(TWEEN.Easing.Back.Out);

  t1.chain(t3);
  t3.chain(t1);

  t2.chain(t4);
  t4.chain(t2);

  t1.start();
  t2.start();
}

function run() {
  requestAnimationFrame(run);

  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  effect.setSize(width, height);

  camera.updateProjectionMatrix();

  controls.update();
  effect.render(scene, camera);

  TWEEN.update();
}

//--
// This is right from https://github.com/sitepoint-editors/VRWeatherParticles
function setOrientationControls(e) {
  if ( !e.alpha ) {
    return;
  }

  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();
  element.addEventListener('click', fullscreen, false);
  window.removeEventListener('deviceorientation', setOrientationControls, true);
}

window.addEventListener('deviceorientation', setOrientationControls, true);

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
    }
}
//--

var WIREFRAME = 0;
var SOLID = 1;

var tracker_style = {color: "rgb(30%, 30%, 30%)", emissive: "rgb(100%, 100%, 0%)", specular: "rgb(100%, 100%, 0%)", opacity: 0.75, linewidth: 1};

var detector_description = {

  /*
  "SiStripTECMinus3D_V1": {
    name: "Tracker Endcap (-)", type: SOLID, method: solidBox, style: tracker_style
  },
  "SiStripTECPlus3D_V1": {
    name: "Tracker Endcap (+)", type: SOLID, method: solidBox, style: tracker_style
  },
  "SiStripTIDMinus3D_V1": {
    name: "Tracker Inner Detector (-)", type: SOLID, method: solidBox, style: tracker_style
  },
  "SiStripTIDPlus3D_V1": {
    name: "Tracker Inner Detector (+)", type: SOLID, method: solidBox, style: tracker_style
  },
  "SiStripTOB3D_V1": {
    name: "Tracker Outer Barrel", type: SOLID, method: solidBox, style: tracker_style
  },
  "SiStripTIB3D_V1": {
    name: "Tracker Inner Barrel", type: SOLID, method: solidBox, style: tracker_style
  },
  "PixelEndcapMinus3D_V1": {
    name: "Pixel Endcap (-)", type: SOLID, method: solidBox, style: tracker_style
  },
  "PixelEndcapPlus3D_V1": {
    name: "Pixel Endcap (+)", type: SOLID, method: solidBox, style: tracker_style
  },
  "PixelBarrel3D_V1": {
    name: "Pixel Barrel", type: SOLID, method: solidBox, style: tracker_style
  },
  */
  "CSC3D_V1": {
    name: "Cathode Strip Chambers", type: SOLID, method: solidBox,
    style: {color: "rgb(30%, 30%, 30%)", emissive: "rgb(60%, 70%, 10%)", specular: "rgb(60%, 70%, 10%)", opacity: 0.75, linewidth: 1}
  },
  "DTs3D_V1": {
    name: "Drift Tubes", type: SOLID, method: solidBox,
    style: {color: "rgb(30%, 30%, 30%)", emissive: "rgb(80%, 40%, 0%)", specular: "rgb(80%, 40%, 0%)", opacity: 0.75, linewidth: 1}
  }

};

function wireframeFace(data, ci) {
  var f1 = new THREE.Vector3(data[ci][0],   data[ci][1],   data[ci][2]);
  var f2 = new THREE.Vector3(data[ci+1][0], data[ci+1][1], data[ci+1][2]);
  var f3 = new THREE.Vector3(data[ci+2][0], data[ci+2][1], data[ci+2][2]);
  var f4 = new THREE.Vector3(data[ci+3][0], data[ci+3][1], data[ci+3][2]);

  var face = new THREE.Geometry();
  face.vertices.push(f1,f2);
  face.vertices.push(f2,f3);
  face.vertices.push(f3,f4);
  face.vertices.push(f4,f1);

  return face;
};

function solidFace(data, ci) {
  var f1 = new THREE.Vector3(data[ci][0],   data[ci][1],   data[ci][2]);
  var f2 = new THREE.Vector3(data[ci+1][0], data[ci+1][1], data[ci+1][2]);
  var f3 = new THREE.Vector3(data[ci+2][0], data[ci+2][1], data[ci+2][2]);
  var f4 = new THREE.Vector3(data[ci+3][0], data[ci+3][1], data[ci+3][2]);

  var face = new THREE.Geometry();
  face.vertices = [f1,f2,f3,f4];
  face.faces.push(new THREE.Face3(0,1,2));
  face.faces.push(new THREE.Face3(0,2,3));

  return face;
};

function wireframeBox(data, ci) {
  var f1 = new THREE.Vector3(data[ci][0],   data[ci][1],   data[ci][2]);
  var f2 = new THREE.Vector3(data[ci+1][0], data[ci+1][1], data[ci+1][2]);
  var f3 = new THREE.Vector3(data[ci+2][0], data[ci+2][1], data[ci+2][2]);
  var f4 = new THREE.Vector3(data[ci+3][0], data[ci+3][1], data[ci+3][2]);

  var b1 = new THREE.Vector3(data[ci+4][0], data[ci+4][1], data[ci+4][2]);
  var b2 = new THREE.Vector3(data[ci+5][0], data[ci+5][1], data[ci+5][2]);
  var b3 = new THREE.Vector3(data[ci+6][0], data[ci+6][1], data[ci+6][2]);
  var b4 = new THREE.Vector3(data[ci+7][0], data[ci+7][1], data[ci+7][2]);

  var box = new THREE.Geometry();
  box.vertices.push(f1,f2);
  box.vertices.push(f2,f3);
  box.vertices.push(f3,f4);
  box.vertices.push(f4,f1);

  box.vertices.push(b1,b2);
  box.vertices.push(b2,b3);
  box.vertices.push(b3,b4);
  box.vertices.push(b4,b1);

  box.vertices.push(b1,f1);
  box.vertices.push(b3,f3);
  box.vertices.push(b2,f2);
  box.vertices.push(b4,f4);

  return box;
}

function solidBox(data, ci) {
  var f1 = new THREE.Vector3(data[ci][0],   data[ci][1],   data[ci][2]);
  var f2 = new THREE.Vector3(data[ci+1][0], data[ci+1][1], data[ci+1][2]);
  var f3 = new THREE.Vector3(data[ci+2][0], data[ci+2][1], data[ci+2][2]);
  var f4 = new THREE.Vector3(data[ci+3][0], data[ci+3][1], data[ci+3][2]);

  var b1 = new THREE.Vector3(data[ci+4][0], data[ci+4][1], data[ci+4][2]);
  var b2 = new THREE.Vector3(data[ci+5][0], data[ci+5][1], data[ci+5][2]);
  var b3 = new THREE.Vector3(data[ci+6][0], data[ci+6][1], data[ci+6][2]);
  var b4 = new THREE.Vector3(data[ci+7][0], data[ci+7][1], data[ci+7][2]);

  var box = new THREE.Geometry();
  box.vertices = [f1,f2,f3,f4,b1,b2,b3,b4];

  // front
  box.faces.push(new THREE.Face3(0,1,2));
  box.faces.push(new THREE.Face3(0,2,3));

  // back
  box.faces.push(new THREE.Face3(4,5,6));
  box.faces.push(new THREE.Face3(4,6,7));

  // top
  box.faces.push(new THREE.Face3(4,5,1));
  box.faces.push(new THREE.Face3(4,1,0));

  // bottom
  box.faces.push(new THREE.Face3(2,6,7));
  box.faces.push(new THREE.Face3(2,3,7));

  // left
  box.faces.push(new THREE.Face3(1,5,7));
  box.faces.push(new THREE.Face3(1,3,7));

  // right
  box.faces.push(new THREE.Face3(4,6,2));
  box.faces.push(new THREE.Face3(4,0,2));

  box.computeFaceNormals();
  box.computeVertexNormals();

  return box;
}

function draw() {
  importOBJMTL('Beam Pipe', './geometry/beampipe.obj', './geometry/beampipe.mtl');
  //importOBJMTL('Muon Endcap (-)', './geometry/muon-endcap-minus.obj', './geometry/muon-endcap-minus.mtl');
  //importOBJMTL('Muon Endcap (+)', './geometry/muon-endcap-plus.obj', './geometry/muon-endcap-plus.mtl');

  for ( var key in detector_description ) {

    var data = detector.Collections[key];

    if ( ! data || data.length === 0 ) {
      console.log(key);
      continue;
    }

    var descr = detector_description[key];
    var color = new THREE.Color(descr.style.color);

    var transp = false;
    if ( descr.style.opacity < 1.0 ) {
      transp = true;
    }

    var geometry = new THREE.Geometry();

    switch(descr.type) {
      case WIREFRAME:
        var material = new THREE.LineBasicMaterial({
          color:color,
          transparent: transp,
          linewidth:descr.style.linewidth, depthWrite: false,
          opacity:descr.style.opacity});

        for ( var i = 0; i < data.length; i++ ) {
          geometry.merge(descr.method(data[i],1));
        }

        var mesh = new THREE.LineSegments(geometry, material);
        mesh.name = descr.name;
        mesh.visible = true;
        scene.add(mesh);

        break;

      case SOLID:
        var emissive = new THREE.Color(descr.style.emissive);
        var specular = new THREE.Color(descr.style.specular);

        var material = new THREE.MeshPhongMaterial({
          color:color,
          emissive:emissive,
          specular:specular,
          shininess: 0,
          transparent: transp,
          opacity:descr.style.opacity});
        material.side = THREE.DoubleSide;

        for ( var i = 0; i < data.length; i++ ) {
          geometry.merge(descr.method(data[i],1));
        }

        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = descr.name;
        mesh.visible = true;
        scene.add(mesh);

        break;
      }
    }
}
