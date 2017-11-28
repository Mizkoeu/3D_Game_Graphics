"use strict";
let Scene = function(gl) {
  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(
  gl.ONE,
  gl.ONE_MINUS_SRC_ALPHA);

  //time
  this.timeAtLastFrame = new Date().getTime();

  //shader & programs
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.vsSky = new Shader(gl, gl.VERTEX_SHADER, "sky_vs.essl");

  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.fsShiny = new Shader(gl, gl.FRAGMENT_SHADER, "shiny_fs.essl");
  this.fsShadow = new Shader(gl, gl.FRAGMENT_SHADER, "shadow_fs.essl");
  this.fsWood = new Shader(gl, gl.FRAGMENT_SHADER, "wood_fs.essl");
  this.fsMirror = new Shader(gl, gl.FRAGMENT_SHADER, "mirror_fs.essl");
  this.fsSky = new Shader(gl, gl.FRAGMENT_SHADER, "sky_fs.essl");

  this.solidProgram = new TextureProgram(gl, this.vsIdle, this.fsSolid);
  this.shinyProgram = new TextureProgram(gl, this.vsIdle, this.fsShiny);
  this.shadowProgram = new TextureProgram(gl, this.vsIdle, this.fsShadow);
  this.woodProgram = new TextureProgram(gl, this.vsIdle, this.fsWood);
  this.mirrorProgram = new TextureProgram(gl, this.vsIdle, this.fsMirror);
  this.skyProgram = new TextureProgram(gl, this.vsSky, this.fsSky);

  //geometries
  this.textureGeometry = new TexturedIndexedTrianglesGeometry(gl, "./Slowpoke.json");
  this.quadGeometry = new TexturedQuadGeometry(gl);
  this.skyGeometry = new QuadGeometry(gl);

  //materials
  this.mirrorMaterial = new Material(gl, this.mirrorProgram);
  this.mirrorTexture = new Texture2D(gl, "../probe.png");
  this.skyTexture = new Texture2D(gl, "./sky.jpg");
  this.mirrorMaterial.probeTexture.set(this.mirrorTexture.glTexture);
  this.shadowMaterial = new Material(gl, this.shadowProgram);
  this.shinyMaterial = new Material(gl, this.shinyProgram);
  this.woodMaterial = new Material(gl, this.woodProgram);
  this.bodyMaterial = new Material(gl, this.solidProgram);
  this.eyeMaterial = new Material(gl, this.solidProgram);
  this.landMaterial = new Material(gl, this.solidProgram);
  this.skyMaterial = new Material(gl, this.skyProgram);
  //texture binding
  this.texture = new Texture2D(gl, "./Slowpoke/YadonDh.png");
  this.texture2 = new Texture2D(gl, "./Slowpoke/YadonEyeDh.png");
  //this.shadowTexture = new Texture2D(gl, "./shadow.png");
  this.landTexture = new Texture2D(gl, "./grass.png");
  //this.shinyMaterial.colorTexture.set(this.shadowTexture.glTexture);
  this.bodyMaterial.colorTexture.set(this.texture.glTexture);
  this.eyeMaterial.colorTexture.set(this.texture2.glTexture);
  this.landMaterial.colorTexture.set(this.landTexture.glTexture);
  this.skyMaterial.probeTexture.set(this.skyTexture.glTexture);

  //Array of Light sources
  this.lightSource = new lightSource();
  this.lightSource.lightPos = new Vec4Array(2);
  this.lightSource.lightPowerDensity = new Vec4Array(2);
  this.lightSource.mainDir = new Vec4Array(2);
  this.lightSource.lightPos.at(0).set(-1, 1, -1, 0);
  this.lightSource.lightPowerDensity.at(0).set(4, 4, 4, 0);
  //this.lightSource.lightPos.at(1).set(-.2, 10, 5, 1);
  this.lightSource.lightPowerDensity.at(1).set(5, 5, 5, 0);
  this.lightSource.mainDir.at(0).set(-1, -1, -1, 0);
  //this.lightSource.mainDir.at(1).set(0, -1, 5, 0);
  this.spotLight;

  //Create a camera
  this.camera = new PerspectiveCamera();

  this.gameObjects = [];
  //Create Skydome
  this.sky = new GameObject(new Mesh(this.skyGeometry, this.skyMaterial));
  var quadrix = new ClippedQuadric();
  var meh = new ClippedQuadric();
  var king = new ClippedQuadric();
  king.setParaboloid();
  king.transform(new Vec3(0, -1, 0), new Vec3(.3, .1, .3));
  quadrix.setUnitSphere();
  meh.setUnitCylinder();
  meh.transform(new Vec3(0, 2, 0), new Vec3(.5, 3, .5));
  this.sky.quadricSet.push(quadrix);
  this.sky.quadricSet.push(meh);
  //this.sky.quadricSet.push(king);
  this.gameObjects.push(this.sky);

  //Create the land Scene
  this.land = new GameObject(new Mesh(this.quadGeometry, this.landMaterial));
  this.land.position = new Vec3(0.8, -.18, -1.5);
  this.land.scale = 10;
  this.land.isGround = true;
  this.gameObjects.push(this.land);

  //Create object array
  this.mesh = new Mesh(this.textureGeometry, this.material);
  this.renderObject = new GameObject(new MultiMesh(gl, "./Slowpoke/Slowpoke.json", [this.mirrorMaterial, this.eyeMaterial]));
  this.renderObject.position = new Vec3(0.8, -.18, -1.5);
  //this.renderObject.orientation = .2;
  this.renderObject.scale = .06;
  this.gameObjects.push(this.renderObject);

  this.carTexture = new Texture2D(gl, "./json/chevy/chevy.png");
  this.carMat = new Material(gl, this.shinyProgram);
  this.carMat.colorTexture.set(this.carTexture.glTexture);
  this.car = new GameObject(new MultiMesh(gl, "./json/chevy/chassis.json", [this.mirrorMaterial]));
  this.car.position = new Vec3(0.0, .1, -7.5);
  this.car.scale = .03;
  this.car.acceleration = new Vec2(.02, -.08);
  this.gameObjects.push(this.car);

  //wheels
  this.wheelTexture = new Texture2D(gl, "./json/chevy/chevy.png");
  this.wheelMat = new Material(gl, this.solidProgram);
  this.wheelMat.colorTexture.set(this.wheelTexture.glTexture);
  var wheel1 = new GameObject(new MultiMesh(gl, "./json/chevy/wheel.json", [this.wheelMat]));
  var wheel2 = new GameObject(new MultiMesh(gl, "./json/chevy/wheel.json", [this.wheelMat]));
  var wheel3 = new GameObject(new MultiMesh(gl, "./json/chevy/wheel.json", [this.wheelMat]));
  var wheel4 = new GameObject(new MultiMesh(gl, "./json/chevy/wheel.json", [this.wheelMat]));
  wheel1.position = new Vec3(-7, -3, -11);
  wheel2.position = new Vec3(7, -3, -11);
  wheel3.position = new Vec3(-7, -3, 14);
  wheel4.position = new Vec3(7, -3, 14);
  this.wheels = [];
  this.wheels.push(wheel1, wheel2, wheel3, wheel4);
  let theScene = this;
  this.wheels.forEach(function(o) {
    o.parent = theScene.car;
    theScene.gameObjects.push(o);
  })

  //Rotor
  this.rotorTexture = new Texture2D(gl, "./json/heli/heli.png");
  this.rotorMat = new Material(gl, this.solidProgram);
  this.rotorMat.colorTexture.set(this.rotorTexture.glTexture);
  this.rotor = new GameObject(new MultiMesh(gl, "./json/heli/mainrotor.json", [this.rotorMat, this.rotorMat]));
  this.rotor.position = new Vec3(0, 7, 0);
  this.rotor.parent = this.car;
  this.gameObjects.push(this.rotor);

  this.creatures = [];
  for (var i=0;i<30;i++) {
    if (Math.random() < .5) {
      var newPoke = new GameObject(new MultiMesh(gl, "./Slowpoke/Slowpoke.json", [this.woodMaterial, this.eyeMaterial]));
    } else { var newPoke = new GameObject(new MultiMesh(gl, "./Slowpoke/Slowpoke.json", [this.bodyMaterial, this.eyeMaterial]));}
    newPoke.position = new Vec3(Math.random() * 50 - 25, -.17, Math.random() * 50 - 25);
    newPoke.scale = .06 + .02 * Math.random();
    newPoke.orientation = Math.random() * Math.PI * 2;
    var rotateMat = (new Mat4()).rotate(newPoke.orientation, new Vec3(0, 1, 0));
    newPoke.faceDirection.set((new Vec4(newPoke.faceDirection, 0)).mul(rotateMat));
    this.creatures.push(newPoke);
    this.gameObjects.push(newPoke);
  }


  //Ballons
  this.balloonTexture = new Texture2D(gl, "./json/balloon.png");
  this.balloonMat = new Material(gl, this.shinyProgram);
  this.balloonMat.colorTexture.set(this.balloonTexture.glTexture);
  this.balloons = [];
  for (var i=0;i<30;i++) {
    var balloon = new GameObject(new MultiMesh(gl, "./json/balloon.json", [this.balloonMat]));
    balloon.position = new Vec3(Math.random() * 70 - 35, 3, Math.random() * 70 - 35);
    balloon.scale = .04 + .01 * Math.random();
    this.balloons.push(balloon);
    this.gameObjects.push(balloon);
  }

  //Trees
  this.treeTexture = new Texture2D(gl, "./json/tree.png");
  this.treeMat = new Material(gl, this.shinyProgram);
  this.treeMat.colorTexture.set(this.treeTexture.glTexture);
  this.trees = [];
  for (var i=0;i<100;i++) {
    var tree = new GameObject(new MultiMesh(gl, "./json/tree.json", [this.treeMat]));
    tree.position = new Vec3(Math.random() * 80 - 40, -.1, Math.random() * 80 - 40);
    tree.orientation = Math.random() * Math.PI * 2;
    tree.scale = .025 + .01 * Math.random();
    this.gameObjects.push(tree);
  }
};

Scene.prototype.createObject = function(gl, name, texture, mesh) {
  var json = JSON.parse(mesh);
  let numMesh = json.children.length;
  let texture2D = new Texture2D(gl, texture);
  var materialArray = [];
  var material = new Material(gl, this.solidProgram);
  material.colorTexture.set(texture2D.glTexture);
  for (var i=0;i<numMesh;i++) {
    materialArray.push(material);
  }
  this[name] = new GameObject(new MultiMesh(gl, mesh, materialArray));
  this[name].scale = .08;
  this.gameObjects.push(this[name]);
}

Scene.prototype.update = function(gl, keysPressed) {
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();
  Material.rayDirMatrix.set(this.camera.rayDirMatrix);

  //move Slowpoke
  var rotateMat = (new Mat4()).rotate(.1, new Vec3(0, 1, 0));//.rotate(.1, new Vec3(1, 0, 0));
  var rotateBack = (new Mat4()).rotate(-.1, new Vec3(0, 1, 0));
  this.renderObject.faceDirection.set((new Vec4(this.renderObject.faceDirection, 0)).mul(rotateMat));
  this.renderObject.position.add(this.renderObject.faceDirection.times(1.0));
  this.renderObject.orientation += .1;

  for (var i=0; i<10; i++) {
    var o = this.creatures[i];
    if (i%2 === 0) {
      o.faceDirection.set((new Vec4(o.faceDirection, 0)).mul(rotateMat));
      o.orientation += .1;
      o.position.add(o.faceDirection.times(3.2));
    } else {
      o.faceDirection.set((new Vec4(o.faceDirection, 0)).mul(rotateBack));
      o.orientation -= .1;
      o.position.add(o.faceDirection.times(2.2));
    }

  }
  //this.renderObject.pitch -= .1;
  //console.log(this.renderObject.faceDirection);
  //this.renderObject.tilt += .1;
  // this.renderObject.position.x = Math.sin(timeAtThisFrame/350.0) * .8 + .6;
  // this.renderObject.tilt = Math.cos(timeAtThisFrame/350.0) * .8;
  // //this.renderObject.position.y = Math.cos(timeAtThisFrame/250.0) * 1.2 + 1.33;
  // //this.renderObject.pitch = - Math.sin(timeAtThisFrame/250.0) * 1.2;
  // this.renderObject.position.z = Math.cos(timeAtThisFrame/450.0) * 1.8 - 1.2;
  // this.renderObject.orientation = - Math.sin(timeAtThisFrame/250.0) * 1.2;

  // this.heli.orientation += .05;
  // this.heli.position.x = Math.sin(timeAtThisFrame/450.0) * 5 + .6;
  // this.heli.position.z = Math.cos(timeAtThisFrame/450.0) * 5 - 1.2;

  for (var i=0;i<this.balloons.length;i++) {
    this.balloons[i].position.y = Math.cos(timeAtThisFrame/300.0 + i) * .2 + 1.2;
  }

  //objects in the scene move according to hotkeys
  let theScene = this;
  let front = this.car.faceDirection;
  this.rotor.orientation += 2 * dt;
  var dx = new Vec3(0, 0, 0);
  var elevation = new Vec3(0, 0, 0);

  if (keysPressed.UP === true) {
    this.sky.quadricSet[1].transform(new Vec3(0, dt, 0), 1.0);
  }
  if (keysPressed.DOWN === true) {
    this.sky.quadricSet[1].transform(new Vec3(0, -dt, 0), 1.0);
  }
  if (keysPressed.LEFT === true) {
    this.sky.quadricSet[1].transform(new Vec3(dt, 0, 0), 1.0);
  }
  if (keysPressed.RIGHT === true) {
    this.sky.quadricSet[1].transform(new Vec3(-dt, 0, 0), 1.0);
  }
  if (keysPressed.Z === true) {
    this.sky.quadricSet[1].transform(new Vec3(0, 0, -dt), 1.0);
  }
  if (keysPressed.X === true) {
    this.sky.quadricSet[1].transform(new Vec3(0, 0, dt), 1.0);
  }

  dx = front.times(this.car.speed.x);
  this.car.position.add(dx).add(elevation);
  this.camera.position.add(dx).add(elevation);

  //Focus shot
  if (keysPressed.F === true) {
    this.camera.track(this.car);
  }

  //Tracking shot
  if (keysPressed.T === true) {
    // let t = timeAtThisFrame/1000.0;
    this.camera.path(Math.PI/100.0);
  }

  //move camera based on hotkeys
  this.camera.move(dt, keysPressed);

  this.spotLight = new Vec4(this.car.position.plus(new Vec3(0, .8, 0)).plus(front.times(1)), 1);
  this.lightSource.mainDir.at(1).set(new Vec4(front.times(50).plus(new Vec3(0, -1, 0))), 1);
  this.lightSource.lightPos.at(1).set(this.spotLight);
  //drawing the shapes!!!

  // this.gameObjects.forEach(function(object) {
  //   object.draw(theScene.camera, theScene.lightSource);
  //   object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
  // });

  // this.car.draw(this.camera, this.lightSource);
  // this.wheels.forEach(function(o) {
  //   o.draw(theScene.camera, theScene.lightSource);
  // })
  this.sky.draw(this.camera, this.lightSource);
  // this.car.drawShadow(this.camera, this.lightSource, this.shadowMaterial);

  // this.gameObjects.forEach(function(object) {
  //
  //   object.drawShadow(theScene.camera, theScene.lightSource);
  // });

//The rest is from the first 2 weeks of practicals!

//--> Using MATERIAL to SET MATRIX <---
  // this.material.modelViewProjMatrix.set().rotate(this.triangleRotation)
  //                                .translate(this.trianglePosition)
  //                                .scale(this.triangleScale);
  // this.material.commit();
  // this.triangleGeometry.draw();


//--> REALLY LOW LEVEL CODES, GO FIGURE IT OUT <---
  // var modelMatrixUniformLocation = gl.getUniformLocation(this.solidProgram.glProgram, "modelMatrix");
  // if (modelMatrixUniformLocation < 0)
  //   console.log("Could not find uniform modelMatrixUniformLocation.");
  // else {
  //   var modelMatrix = new Mat4().rotate(this.triangleRotation)
  //                               .translate(this.trianglePosition)
  //                               .scale(this.triangleScale);
  //   modelMatrix.commit(gl, modelMatrixUniformLocation);
  // }
  //
  // this.triangleGeometry.draw();
  //
  // var modelMatrixUniformLocation = gl.getUniformLocation(this.solidProgram.glProgram, "modelMatrix");
  // if (modelMatrixUniformLocation < 0)
  //   console.log("Could not find uniform modelMatrixUniformLocation.");
  // else {
  //   var modelMatrix = new Mat4().translate(new Vec3(2, 0, 0))
  //                               .rotate(this.triangleRotation2)
  //                               .translate(this.trianglePosition)
  //                               .scale(this.triangleScale);
  //   modelMatrix.commit(gl, modelMatrixUniformLocation);
  // }
  //
  // this.triangleGeometry.draw();
};
