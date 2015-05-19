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
  controls.noPan = true;
  controls.noZoom = true;
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

detector_description = {
  "CSC3D_V1": {name: "Cathode Strip Chambers", style: {color: [0.6, 0.7, 0.1], opacity: 0.5, linewidth: 1}},
  "DTs3D_V1": {name: "Drift Tubes", style: {color: [0.8, 0.4, 0], opacity: 0.5, linewidth: 1}}
}

function draw() {
  for ( var key in detector_description ) {
    var data = detector.Collections[key];
    var descr = detector_description[key];

    var color = new THREE.Color();
    color.setRGB(descr.style.color[0], descr.style.color[1], descr.style.color[2]);

    var transp = false;
    if ( descr.style.opacity < 1.0 ) {
      transp = true;
    }

    var material = new THREE.MeshBasicMaterial({color:color,
                                                transparent: transp,
                                                linewidth: descr.style.linewidth,
                                                opacity:descr.style.opacity});
    material.side = THREE.DoubleSide;

    var boxes = new THREE.Geometry();

    for ( var i = 0; i < data.length; i++ ) {
      boxes.merge(box(data[i],1));
    }

    var meshes = new THREE.Mesh(boxes, material);
    meshes.name = name;
    meshes.visible = true;

    scene.add(meshes);
  }

  console.log(scene);
}

function box(data, ci) {
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
