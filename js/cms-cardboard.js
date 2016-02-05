var scene, camera, renderer, controls;
var detector = {'Collections':{}};

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);
  //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(0, 0, 0);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('cms');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  controls = new THREE.OrbitControls(camera, element);
  controls.target.set(
    camera.position.x + 0.15,
    camera.position.y,
    camera.position.z
  );
  controls.enablePan = false;
  controls.enableZoom = false;
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

var detector_description = {
  "SiStripTECMinus3D_V1": {
    name: "Tracker Endcap (-)", type: SOLID, method: solidFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "SiStripTECPlus3D_V1": {
    name: "Tracker Endcap (+)", type: SOLID, method: solidFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "SiStripTIDMinus3D_V1": {
    name: "Tracker Inner Detector (-)", type: WIREFRAME, method: wireframeFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "SiStripTIDPlus3D_V1": {
    name: "Tracker Inner Detector (+)", type: WIREFRAME, method: wireframeFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "SiStripTOB3D_V1": {
    name: "Tracker Outer Barrel", type: WIREFRAME, method: wireframeFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "SiStripTIB3D_V1": {
    name: "Tracker Inner Barrel", type: WIREFRAME, method: wireframeFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "PixelEndcapMinus3D_V1": {
    name: "Pixel Endcap (-)", type: WIREFRAME, method: wireframeFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "PixelEndcapPlus3D_V1": {
    name: "Pixel Endcap (+)", type: WIREFRAME, method: wireframeFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "PixelBarrel3D_V1": {
    name: "Pixel Barrel", type: WIREFRAME, method: wireframeFace,
    style: {color: "rgb(100%, 100%, 0%)", opacity: 0.5, linewidth: 0.5}
  },
  "CSC3D_V1": {
    name: "Cathode Strip Chambers", type: SOLID, method: solidBox,
    style: {color: "rgb(60%, 70%, 10%)", opacity: 0.2, linewidth: 1}
  },
  "DTs3D_V1": {
    name: "Drift Tubes", type: SOLID, method: solidBox,
    style: {color: "rgb(80%, 40%, 0%)", opacity: 0.2, linewidth: 1}
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
        var material = new THREE.MeshBasicMaterial({
          color:color,
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
