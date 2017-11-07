"use strict";
let Scene = function(gl) {
  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);

  //time
  this.timeAtLastFrame = new Date().getTime();

  //shader & programs
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.fsShiny = new Shader(gl, gl.FRAGMENT_SHADER, "shiny_fs.essl");
  this.fsShadow = new Shader(gl, gl.FRAGMENT_SHADER, "shadow_fs.essl");
  this.fsWood = new Shader(gl, gl.FRAGMENT_SHADER, "wood_fs.essl");
  this.solidProgram = new TextureProgram(gl, this.vsIdle, this.fsSolid);
  this.shinyProgram = new TextureProgram(gl, this.vsIdle, this.fsShiny);
  this.shadowProgram = new TextureProgram(gl, this.vsIdle, this.fsShadow);
  this.woodProgram = new TextureProgram(gl, this.vsIdle, this.fsWood);

  //geometries
  this.textureGeometry = new TexturedIndexedTrianglesGeometry(gl, "./Slowpoke.json");
  this.quadGeometry = new TexturedQuadGeometry(gl);

  //materials
  this.shadowMaterial = new Material(gl, this.shadowProgram);
  this.shinyMaterial = new Material(gl, this.shinyProgram);
  this.bodyMaterial = new Material(gl, this.woodProgram);
  this.eyeMaterial = new Material(gl, this.solidProgram);
  this.landMaterial = new Material(gl, this.solidProgram);
  //texture binding
  this.texture = new Texture2D(gl, "./Slowpoke/YadonDh.png");
  this.texture2 = new Texture2D(gl, "./Slowpoke/YadonEyeDh.png");
  //this.shadowTexture = new Texture2D(gl, "./shadow.png");
  this.landTexture = new Texture2D(gl, "./grass.png");
  //this.shinyMaterial.colorTexture.set(this.shadowTexture.glTexture);
  this.bodyMaterial.colorTexture.set(this.texture.glTexture);
  this.eyeMaterial.colorTexture.set(this.texture2.glTexture);
  this.landMaterial.colorTexture.set(this.landTexture.glTexture);
  //Create a camera
  this.camera = new PerspectiveCamera();

  //Array of Light sources
  this.lightSource = new lightSource();
  this.lightSource.lightPos = new Vec4Array(2);
  this.lightSource.lightPowerDensity = new Vec4Array(2);
  this.lightSource.mainDir = new Vec4Array(2);
  this.lightSource.lightPos.at(0).set(1, 1, 1, 0);
  this.lightSource.lightPowerDensity.at(0).set(3, 3, 3, 0);
  //this.lightSource.lightPos.at(1).set(-.2, 10, 5, 1);
  this.lightSource.lightPowerDensity.at(1).set(5, 5, 5, 0);
  this.lightSource.mainDir.at(0).set(-1, -1, -1, 0);
  //this.lightSource.mainDir.at(1).set(0, -1, 5, 0);
  this.spotLight;

  console.log(this.lightSource.lightPos.at(0));
  console.log(this.lightSource.lightPowerDensity.at(0));
  //this.lightSource.push(new Vec4Array[(new Vec4(1, 1.5, 1, 1))], new Vec4Array[(new Vec4(0, -1, -1, 0))]);

  //this.bodyMaterial.lightPos.set(this.lightSource);

  this.gameObjects = [];
  //Create the land Scene
  this.land = new GameObject(new Mesh(this.quadGeometry, this.landMaterial));
  this.land.position = new Vec3(0.8, -.18, -1.5);
  this.land.scale = 10;
  this.land.isGround = true;
  this.gameObjects.push(this.land);

  //Create object array
  this.mesh = new Mesh(this.textureGeometry, this.material);
  this.materials = [];
  this.materials.push(this.bodyMaterial);
  this.materials.push(this.eyeMaterial);
  this.renderObject = new GameObject(new MultiMesh(gl, "./Slowpoke/Slowpoke.json", this.materials));
  this.renderObject.position = new Vec3(0.8, -.18, -1.5);
  //this.renderObject.orientation = .2;
  this.renderObject.scale = .06;
  this.gameObjects.push(this.renderObject);

  this.carTexture = new Texture2D(gl, "./json/chevy/chevy.png");
  this.carMat = new Material(gl, this.shinyProgram);
  this.carMat.colorTexture.set(this.carTexture.glTexture);
  this.car = new GameObject(new MultiMesh(gl, "./json/chevy/chassis.json", [this.carMat]));
  this.car.position = new Vec3(-.2, .1, -1.5);
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

  this.newPoke = new GameObject(new MultiMesh(gl, "./Slowpoke/Slowpoke.json", this.materials));
  this.newPoke.position = new Vec3(-1.2, .2, -1.2);
  this.newPoke.scale = 0.03;
  this.newPoke.orientation = 3.14;
  this.gameObjects.push(this.newPoke);

  //Ballons
  this.balloonTexture = new Texture2D(gl, "./json/balloon.png");
  this.balloonMat = new Material(gl, this.shinyProgram);
  this.balloonMat.colorTexture.set(this.balloonTexture.glTexture);
  this.balloons = [];
  for (var i=0;i<30;i++) {
    var balloon = new GameObject(new MultiMesh(gl, "./json/balloon.json", [this.balloonMat]));
    balloon.position = new Vec3(Math.random() * 50 - 25, 2, Math.random() * 50 - 25);
    balloon.scale = .04 + .01 * Math.random();
    this.balloons.push(balloon);
    this.gameObjects.push(balloon);
  }

  //Thunderbolt
  // this.createObject(gl, "heli", "./json/heli/heliait.png", "./json/heli/heli1.json");
  // //this.createObject(gl, "heliRotor", "./json/heli/heli.png", "./json/heli/mainrotor.json");
  // this.heli.orientation = -Math.PI/2.0;
  // this.heli.position = new Vec3(0, 1, 0);
  //this.heliRotor.parent = this.heli;

  //Trees
  this.treeTexture = new Texture2D(gl, "./json/tree.png");
  this.treeMat = new Material(gl, this.shinyProgram);
  this.treeMat.colorTexture.set(this.treeTexture.glTexture);
  this.trees = [];
  for (var i=0;i<100;i++) {
    var tree = new GameObject(new MultiMesh(gl, "./json/tree.json", [this.treeMat]));
    tree.position = new Vec3(Math.random() * 50 - 25, -.1, Math.random() * 50 - 25);
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

  //move Slowpoke
  this.renderObject.position.x = Math.sin(timeAtThisFrame/150.0) * .2 + .6;
  this.renderObject.position.z = Math.cos(timeAtThisFrame/150.0) * .2 - 1.2;
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

  if (keysPressed.SPACE === true) {
    this.rotor.orientation += 15 * dt;
    this.car.speed.y = 1.8
    elevation = new Vec3(0, this.car.speed.y * dt, 0);
  } else {
    if (this.car.position.y <= 0) {
      this.car.speed.y = 0;
      this.car.position.y = 0;
    } else {
      this.car.speed.y += this.car.acceleration.y;
      elevation = new Vec3(0, this.car.speed.y * dt, 0);
    }
  }
  if (keysPressed.UP === true) {
    this.car.speed.x += this.car.acceleration.x;
    this.wheels.forEach(function(wheel) {
      wheel.rotation += .5;
    });
  } else if (keysPressed.DOWN === true) {
    this.car.speed.x -= this.car.acceleration.x;
    this.wheels.forEach(function(wheel) {
      wheel.rotation -= .5;
    });
    //QUESTION!!!!! WHY can't I changed the front value without changing the faceDirection???
  } else {
    //decelerate if no key is pressed.
    if (this.car.speed.x <= .03 && this.car.speed.x >= -.03) {
      this.car.speed.x = 0;
    } else if (this.car.speed.x > .03) {
      this.car.speed.x -= .03;
    } else {
      this.car.speed.x += .03;
    }
  }
  if (keysPressed.LEFT === true) {
    this.car.orientation += .05;
    var rotateMat = (new Mat4()).rotate(.05, new Vec3(0, 1, 0));
    this.car.faceDirection.set((new Vec4(front, 0)).mul(rotateMat));
    console.log(this.car.faceDirection);
  }
  if (keysPressed.RIGHT === true) {
    this.car.orientation -= .05;
    var rotateMat = (new Mat4()).rotate(-.05, new Vec3(0, 1, 0));
    this.car.faceDirection.set((new Vec4(front, 0)).mul(rotateMat));
  }
  dx = front.times(this.car.speed.x);
  this.car.position.add(dx).add(elevation);
  this.camera.position.add(dx).add(elevation);

  //Tracking shot
  if (keysPressed.F === true) {
    this.camera.track(this.car);
  }

  //move camera based on hotkeys
  this.camera.move(dt, keysPressed);

  this.spotLight = new Vec4(this.car.position.plus(new Vec3(0, .8, 0)).plus(front.times(1)), 1);
  this.lightSource.mainDir.at(1).set(new Vec4(front.times(50).plus(new Vec3(0, -1, 0))), 1);
  this.lightSource.lightPos.at(1).set(this.spotLight);
  //drawing the shapes!!!
  // this.renderObject.draw(this.camera, this.lightSource);
  // this.newPoke.draw(this.camera, this.lightSource);
  // this.car.draw(this.camera, this.lightSource);
  // this.land.draw(this.camera, this.lightSource);
  this.gameObjects.forEach(function(object) {
    object.draw(theScene.camera, theScene.lightSource);
    object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
  });
  // this.car.draw(this.camera, this.lightSource);
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
