var scene, camera, renderer, controls;
var detector = {'Collections':{}};
var objloader = new THREE.OBJLoader();
var mtlloader = new THREE.MTLLoader();
var jsonloader = new THREE.JSONLoader();

var event_style = {
  'EBRecHits_V2': {
    color:  'rgb(10%, 100%, 10%)', opacity: 0.5
  },
  'EERecHits_V2': {
    color: 'rgb(10%, 100%, 10%)', opacity: 0.5
  },
  'HBRecHits_V2': {
    color: 'rgb(20%, 70%, 100%)', opacity: 0.5
  },
  'HERecHits_V2': {
    color: 'rgb(20%, 70%, 100%)', opacity: 0.5
  },
  'Tracks_V3': {
    color: 'rgb(100%, 100%, 0%)', opacity: 0.9
  }
};

function importOBJ(name, obj, type) {
  objloader.load(obj, function(object){
    object.name = name;
    object.visible = false;

    var style = event_style[name];
    var material;

    if ( type === 'box' ) {
      material = new THREE.MeshBasicMaterial({color:style.color});
      material.transparent = true;
      material.opacity = 0.5;
      material.side = THREE.DoubleSide;
    }

    if ( type === 'line' ) {
      material = new THREE.LineBasicMaterial({color:style.color});
    }

    object.children.forEach(function(c) {
      c.material = material;
    });

    scene.add(object);
  });
}


function importOBJMTL(obj, name) {

    objloader.load(obj, function(object) {

        object.name = name;
        object.visible = true;

        object.children.forEach(function(c) {

          c.material.transparent = true;
          c.material.shininess = 30;
          c.material.side = THREE.DoubleSide;

          if ( name === 'EB' ) {
            c.material.color = new THREE.Color(0.0,0.0,0.0);
            c.material.emissive = new THREE.Color(0.5,0.8,1.0);
            c.material.specular = new THREE.Color(0.3,0.3,0.3);
            c.material.opacity = 0.5;
          } else if ( name === 'BeamPipe') {
              c.material.color = new THREE.Color(0.0,0.0,0.0);
              c.material.emissive = new THREE.Color(0.3,0.3,0.3);
              c.material.specular = new THREE.Color(0.3,0.3,0.3);
              c.material.opacity = 0.75;
          }

        })

        scene.add(object);

      });
}

function showEvent() {
  scene.getObjectByName('BeamPipe').visible = false;
  scene.getObjectByName('EB').visible = false;

  scene.getObjectByName('EBRecHits_V2').visible = true;
  scene.getObjectByName('EERecHits_V2').visible = true;
  scene.getObjectByName('HBRecHits_V2').visible = true;
  scene.getObjectByName('HERecHits_V2').visible = true;
  scene.getObjectByName('Tracks_V3').visible = true;
}

function hideEvent() {
  scene.getObjectByName('BeamPipe').visible = true;
  scene.getObjectByName('EB').visible = true;

  scene.getObjectByName('EBRecHits_V2').visible = false;
  scene.getObjectByName('EERecHits_V2').visible = false;
  scene.getObjectByName('HBRecHits_V2').visible = false;
  scene.getObjectByName('HERecHits_V2').visible = false;
  scene.getObjectByName('Tracks_V3').visible = false;
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);

  camera.position.set(10, 0, 20);
  //camera.position.set(3, 0, 1);
  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,0));
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setClearColor(0x000000,1);

  element = renderer.domElement;
  container = document.getElementById('cms');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  importOBJ('EBRecHits_V2', './data/EBRecHits_V2.obj', 'box');
  importOBJ('EERecHits_V2', './data/EERecHits_V2.obj', 'box');
  importOBJ('HBRecHits_V2', './data/HBRecHits_V2.obj', 'box');
  importOBJ('HERecHits_V2', './data/HERecHits_V2.obj', 'box');
  importOBJ('Tracks_V3', './data/Tracks_V3.obj', 'line');

  importOBJMTL('./geometry/beampipe.obj', 'BeamPipe');
  importOBJMTL('./geometry/EB.obj', 'EB');

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
      showEvent();
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
      hideEvent();
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

var tracker_style = {
  color: "rgb(30%, 30%, 30%)",
  emissive: "rgb(75%, 75%, 0%)",
  specular: "rgb(30%, 30%, 30%)",
  opacity: 0.5,
  linewidth: 1
};

var detector_description = {

/*
  "SiStripTECMinus3D_V1": {
    name: "Tracker", methodA: solidFace, methodB: wireframeFace, style: tracker_style
  },

  "SiStripTECPlus3D_V1": {
    name: "Tracker", methodA: solidFace, methodB: wireframeFace, style: tracker_style
  },

  "SiStripTOB3D_V1": {
    name: "Tracker", methodA: solidFace, methodB: wireframeFace, style: tracker_style
  },
*/
  "CSC3D_V1": {
    name: "CSC", methodA: solidBox, methodB: wireframeBox,
    style: {color: "rgb(30%, 30%, 30%)", emissive: "rgb(50%, 50%, 50%)", specular: "rgb(30%, 30%, 30%)", opacity: 0.5, linewidth: 1}
  },

  "DTs3D_V1": {
    name: "DT", methodA: solidBox, methodB: wireframeBox,
    style: {color: "rgb(30%, 30%, 30%)", emissive: "rgb(75%, 0%, 0%)", specular: "rgb(30%, 30%, 30%)", opacity: 0.5, linewidth: 1}
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
    var lines = new THREE.Geometry();

    var emissive = new THREE.Color(descr.style.emissive);
    var specular = new THREE.Color(descr.style.specular);

    var material = new THREE.MeshPhongMaterial({
      color:color,
      emissive:emissive,
      shininess: 30,
      transparent: transp,
      opacity:descr.style.opacity});
    material.side = THREE.DoubleSide;

    for ( var i = 0; i < data.length; i++ ) {
      geometry.merge(descr.methodA(data[i],1));
      lines.merge(descr.methodB(data[i],1));
    }

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = descr.name;
    mesh.visible = true;
    scene.add(mesh);

    var line_material = new THREE.LineBasicMaterial({
      color:color,
      transparent: transp,
      linewidth:descr.style.linewidth,
      depthWrite: false,
      opacity:descr.style.opacity
    });

    var line_mesh = new THREE.LineSegments(lines, line_material);
    line_mesh.name = descr.name;
    line_mesh.visible = true;
    scene.add(line_mesh);

  }
}
