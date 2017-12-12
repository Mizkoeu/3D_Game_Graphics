"use strict";
let Scene = function(gl) {
  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(
  gl.ONE,
  gl.ONE_MINUS_SRC_ALPHA);

  //time
  this.timeAtLastFrame = new Date().getTime();
  this.timer = 0;
  this.timer2 = 0;
  this.state = 0;
  this.isTracking = 1;
  this.playerHealth = 3;
  this.survivorCount = 0;
  this.totalSurvivor = 15;

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
  this.mirrorTexture = new Texture2D(gl, "./texture/space.png");
  this.skyTexture = new Texture2D(gl, "./texture/space.png");
  this.mirrorMaterial.probeTexture.set(this.mirrorTexture.glTexture);
  this.shadowMaterial = new Material(gl, this.shadowProgram);
  this.shinyMaterial = new Material(gl, this.shinyProgram);
  this.woodMaterial = new Material(gl, this.woodProgram);
  this.bodyMaterial = new Material(gl, this.solidProgram);
  this.eyeMaterial = new Material(gl, this.solidProgram);
  this.landMaterial = new Material(gl, this.solidProgram);
  this.landMaterial2 = new Material(gl, this.shinyProgram);
  this.skyMaterial = new Material(gl, this.skyProgram);

  this.redMetalTexture = new Texture2D(gl, "./texture/metalRed.png");
  this.goldTexture = new Texture2D(gl, "./texture/gold.png");
  this.legoFaceTexture = new Texture2D(gl, "./texture/lego.png");
  this.treeTexture = new Texture2D(gl, "./json/tree.png");
  this.legoRed = new Material(gl, this.shinyProgram);
  this.legoGold = new Material(gl, this.shinyProgram);
  this.legoFace = new Material(gl, this.shinyProgram);
  this.legoRed.colorTexture.set(this.redMetalTexture.glTexture);
  this.legoGold.colorTexture.set(this.goldTexture.glTexture);
  this.legoFace.colorTexture.set(this.legoFaceTexture.glTexture);

  //texture binding
  this.texture = new Texture2D(gl, "./Slowpoke/YadonDh.png");
  this.texture2 = new Texture2D(gl, "./Slowpoke/YadonEyeDh.png");
  this.landTexture = new Texture2D(gl, "./texture/ground.jpg");
  this.landTexture2 = new Texture2D(gl, "./texture/badGround.jpg");
  this.bodyMaterial.colorTexture.set(this.texture.glTexture);
  this.eyeMaterial.colorTexture.set(this.texture2.glTexture);
  this.landMaterial.colorTexture.set(this.landTexture.glTexture);
  this.landMaterial2.colorTexture.set(this.landTexture2.glTexture);
  this.skyMaterial.probeTexture.set(this.skyTexture.glTexture);
  this.treeMat = new Material(gl, this.shinyProgram);
  this.treeMat.colorTexture.set(this.treeTexture.glTexture);
  //Create a camera
  this.camera = new PerspectiveCamera();

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

  //Create Skydome
  this.quadricObjects = [];
  this.sky = new QuadricObject(new Mesh(this.skyGeometry, this.skyMaterial));
  this.skyObjects = [];
  var wormhole = new ClippedQuadric();
  wormhole.setUnitSphere();
  wormhole.transform((new Mat4()).scale(25, 25, 25).translate(30, 20, 180));
  this.skyObjects.push(wormhole);
  this.sky.quadricSet.push(wormhole);
  this.sky.materialSet.push(new Vec4(1, 1, 1, 310));

  this.gameObjects = [];

  //Create the land Scene
  this.land = new GameObject(new Mesh(this.quadGeometry, this.landMaterial));
  this.land.position = new Vec3(0.8, -.18, -1.5);
  this.land.scale = 10;
  this.land.isGround = true;
  this.land2 = new GameObject(new Mesh(this.quadGeometry, this.landMaterial2));
  this.land2.position = new Vec3(0.8, -.18, -1.5);
  this.land2.scale = 10;
  this.land2.isGround = true;

  //Create object array
  // this.mesh = new Mesh(this.textureGeometry, this.material);
  this.rocks = [];
  this.rock = new GameObject(new MultiMesh(gl, "./json/rock.json", [this.legoRed, this.legoGold]));
  this.rock.position = new Vec3(0, 8, 0);
  this.rock.acceleration = new Vec2(0, -.02);
  this.rock.scale = .12;
  this.rocks.push(this.rock);

  this.flyhouseMaterial = [];
  for(var i=0;i<8;i++) {
    this.flyhouseMaterial.push(this.legoGold);
  }
  this.flyhouses = [];
  for (var i=0;i<30;i++) {
    var flyhouse = new GameObject(new MultiMesh(gl, "./json/flyhouse.json", this.flyhouseMaterial));
    flyhouse.radius = 1.6;
    flyhouse.position = new Vec3(Math.random() * 60 - 30, 2, Math.random() * 60 - 30);
    flyhouse.orientation = Math.random() * Math.PI * 2;
    flyhouse.scale = .02 + .005 * Math.random();
    this.flyhouses.push(flyhouse);
  }

  this.legoSurvivors = [];
  this.legoMaterial = [this.legoFace];
  this.legoMaterial.push(this.treeMat)
  for(var i=0;i<8;i++) {
    this.legoMaterial.push(this.legoGold);
  }
  for (var i=0;i<this.totalSurvivor;i++) {
    var lego = new GameObject(new MultiMesh(gl, "./json/lego.json", this.legoMaterial));
    lego.radius = .3;
    lego.position = new Vec3(Math.random()*40-20, -.2, Math.random()*40-20);
    lego.orientation = Math.random() * Math.PI * 2;
    lego.scale = .012;
    this.legoSurvivors.push(lego);
  }

  //mountains
  this.mountainMaterial = [];
  for (var i=0;i<7;i++) {this.mountainMaterial.push(this.legoGold);}
  this.castle = new GameObject(new MultiMesh(gl, "./json/castle.json", this.mountainMaterial));
  this.castle.position = new Vec3(0, 3.05, 30);
  this.castle.orientation = Math.PI;
  this.castle.scale = .05;
  this.gameObjects.push(this.castle);

  //Car
  this.carTexture = new Texture2D(gl, "./json/chevy/chevy.png");
  this.carMat = new Material(gl, this.shinyProgram);
  this.carMat.colorTexture.set(this.carTexture.glTexture);
  this.car = new GameObject(new MultiMesh(gl, "./json/chevy/chassis.json", [this.carMat]));
  this.car.position = new Vec3(0.0, .1, -1.5);
  this.car.scale = .03;
  this.car.acceleration = new Vec2(.03, -.08);
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

  //Creatures!!
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
  }

  //Ballons
  // this.balloonTexture = new Texture2D(gl, "./json/balloon.png");
  // this.balloonMat = new Material(gl, this.shinyProgram);
  // this.balloonMat.colorTexture.set(this.balloonTexture.glTexture);
  // this.balloons = [];
  // for (var i=0;i<30;i++) {
  //   var balloon = new GameObject(new MultiMesh(gl, "./json/balloon.json", [this.balloonMat]));
  //   balloon.position = new Vec3(Math.random() * 70 - 35, 3, Math.random() * 70 - 35);
  //   balloon.scale = .04 + .01 * Math.random();
  //   this.balloons.push(balloon);
  //   this.gameObjects.push(balloon);
  // }

  //Trees
  this.trees = [];
  for (var i=0;i<100;i++) {
    var tree = new GameObject(new MultiMesh(gl, "./json/tree.json", [this.treeMat]));
    tree.position = new Vec3(Math.random() * 120 - 60, -.05, Math.random() * 120 - 60);
    tree.orientation = Math.random() * Math.PI * 2;
    tree.scale = .08 + .015 * Math.random();
    this.trees.push(tree);
    // this.gameObjects.push(tree);
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
  this.timer++;
  this.timer2++;

  // clear the screen
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let curPosX = this.car.position.x - 20;
  let curPosZ = this.car.position.z - 20;

  if (this.timer === 60) {
    for (var i=0;i<25;i++) {
      var rock = new GameObject(new MultiMesh(gl, "./json/rock.json", [this.legoRed, this.legoGold]));
      rock.radius = .8;
      rock.position = new Vec3(Math.random()*40+curPosX, Math.random()*6+13, Math.random()*40+curPosZ);
      rock.faceDirection = (this.car.position.minus(rock.position)).normalize();
      rock.acceleration = new Vec2(.05, -.02);
      rock.scale = Math.random()*.05 + .4;
      this.rocks.push(rock);
    }
    this.timer = 0;
  }

  this.solidProgram.commit();
  Material.rayDirMatrix.set(this.camera.rayDirMatrix);
  this.skyObjects[0].transform((new Mat4()).translate(new Vec3(Math.cos(timeAtThisFrame/500.0)*3, 0, Math.sin(timeAtThisFrame/500.0)*3)));

  //Rock Falling
  for (var i=0;i<this.rocks.length;i++) {
    var rock = this.rocks[i];
    if (this.car.detectCollision(rock)) {
      this.car.position.y = 2;
      this.camera.position.y = 2.6;
      this.rocks.splice(i, 1);
      this.playerHealth--;
    }
    if (rock.position.y <= -.2) {
      rock.speed.y = 0;
      rock.position.y = -.2;
      this.rocks.splice(i, 1);
    } else {
      // rock.speed.x += rock.acceleration.x;
      rock.speed.y += rock.acceleration.y;
      var xDisplacement = rock.faceDirection.x * dt;
      var zDisplacement = rock.faceDirection.z * dt;
      rock.position.add(new Vec3(xDisplacement, rock.speed.y * dt, zDisplacement));
    }
  }
  //Flying house detectCollision
  for (var i=0;i<this.flyhouses.length;i++) {
    var house = this.flyhouses[i];
    if (this.car.detectCollision(house)) {
      this.car.speed.x *= -.1;
      this.car.speed.y *= -.1;
      this.gameObjects.push(house);
      this.flyhouses.splice(i, 1);
      this.playerHealth--;
    }
  }
  //Tree detectCollision
  for(var i=0;i<this.trees.length;i++) {
    var tree = this.trees[i];
    if (this.car.detectCollision(tree)) {
      this.car.speed.x = -.1;
      this.car.scale = .02;
      // this.car.speed.x = 0;
      // this.car.acceleration.x = 0;
      break;
    }
  }
  //Collect legoSurvivors
  for(var i=0;i<this.legoSurvivors.length;i++) {
    var lego = this.legoSurvivors[i];
    if (this.car.detectCollision(lego)) {
      this.car.speed = new Vec2(-.1, 0);
      this.legoSurvivors.splice(i, 1);
      this.survivorCount++;
      // this.car.acceleration.x = 0;
      break;
    }
  }
  //Gain points
  for(var i=0;i<this.creatures.length;i++) {
    var med = this.creatures[i];
    if (this.car.detectCollision(med)) {
      this.car.speed = new Vec2(-.1, 0);
      this.creatures.splice(i, 1);
      this.playerHealth++;
      // this.car.acceleration.x = 0;
      break;
    }
  }

  //move Slowpoke
  var rotateMat = (new Mat4()).rotate(.1, new Vec3(0, 1, 0));//.rotate(.1, new Vec3(1, 0, 0));
  var rotateBack = (new Mat4()).rotate(-.1, new Vec3(0, 1, 0));
  // this.renderObject.faceDirection.set((new Vec4(this.renderObject.faceDirection, 0)).mul(rotateMat));
  // this.renderObject.position.add(this.renderObject.faceDirection.times(1.0));
  // this.renderObject.orientation += .1;

  // for (var i=0; i<10; i++) {
  //   var o = this.creatures[i];
  //   if (i%2 === 0) {
  //     o.faceDirection.set((new Vec4(o.faceDirection, 0)).mul(rotateMat));
  //     o.orientation += .1;
  //     o.position.add(o.faceDirection.times(3.2));
  //   } else {
  //     o.faceDirection.set((new Vec4(o.faceDirection, 0)).mul(rotateBack));
  //     o.orientation -= .1;
  //     o.position.add(o.faceDirection.times(2.2));
  //   }
  // }
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

  // for (var i=0;i<this.balloons.length;i++) {
  //   this.balloons[i].position.y = Math.cos(timeAtThisFrame/300.0 + i) * .2 + 1.2;
  // }

  for (var i=0;i<this.flyhouses.length;i++) {
    this.flyhouses[i].position.y = Math.cos(timeAtThisFrame/300.0 + i) * .8 + 2.3;
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
    this.car.pitch -= .01;
    if (this.car.pitch <= -.12) {
      this.car.pitch = -.12;
    }
    elevation = new Vec3(0, this.car.speed.y * dt, 0);
  } else {
    if (this.car.pitch < 0.0) {
      this.car.pitch +=.02;
    } else {this.car.pitch = 0.0;}
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
    this.car.orientation += .03;
    this.car.tilt -= .01;
    if (this.car.tilt <= -.1) {
      this.car.tilt = -.1;
    }
    var rotateMat = (new Mat4()).rotate(.03, new Vec3(0, 1, 0));
    this.car.faceDirection.set((new Vec4(front, 0)).mul(rotateMat));
    // console.log(this.car.faceDirection);
  } else if (keysPressed.RIGHT === true) {
    this.car.orientation -= .03;
    this.car.tilt += .01;
    if (this.car.tilt >= .1) {
      this.car.tilt = .1;
    }
    var rotateMat = (new Mat4()).rotate(-.03, new Vec3(0, 1, 0));
    this.car.faceDirection.set((new Vec4(front, 0)).mul(rotateMat));
  } else if (keysPressed.Z === true) {
    let left = (new Vec3()).setVectorProduct(this.car.faceDirection, new Vec3(0, -1, 0));
    dx.add(left.times(1.2));
    this.car.tilt -= .3;
  } else if (keysPressed.X === true) {
    let right = (new Vec3()).setVectorProduct(this.car.faceDirection, new Vec3(0, 1, 0));
    dx.add(right.times(1.2));
    this.car.tilt += .3;
  } else {
    if (this.car.tilt <= -.3) {this.car.tilt = 0;}
    else if (this.car.tilt <= -.01) {this.car.tilt += .01;}
    else if (this.car.tilt >= .3) {this.car.tilt = 0;}
    else if (this.car.tilt >= .01) {this.car.tilt -= .01;}
    else {this.car.tilt = 0.0;}
  }

  dx.add(front.times(this.car.speed.x));
  this.car.position.add(dx).add(elevation);
  this.camera.position.add(dx).add(elevation);

  //Tracking shot
  // if (keysPressed.T === true) {
  //   // let t = timeAtThisFrame/1000.0;
  //   this.camera.path(Math.PI/100.0);
  // }

  this.spotLight = new Vec4(this.car.position.plus(new Vec3(0, .8, 0)).plus(front.times(1)), 1);
  this.lightSource.mainDir.at(1).set(new Vec4(front.times(50).plus(new Vec3(0, -1, 0))), 1);
  this.lightSource.lightPos.at(1).set(this.spotLight);

  //If car falls down during mutation land2, reduce playerHealth
  if (this.timer2 > 650 && this.timer2 <= 1000 && this.car.position.y <= .1) {
    this.sky.materialSet[0] = new Vec4(1, 1, 1, 300);
    this.car.orientation += .2;
    var rotateMat = (new Mat4()).rotate(.2, new Vec3(0, 1, 0));
    this.car.faceDirection.set((new Vec4(front, 0)).mul(rotateMat));
  } else if (this.timer2 <= 1){
    this.sky.materialSet[0] = new Vec4(1, 1, 1, 310);
  }

  //Focus shot
  if(keysPressed.C === true) {
    this.isTracking *= -1;
  }
  if (this.isTracking === 1) {
    this.camera.track(this.car);
  }
  //move camera based on hotkeys
  this.camera.move(dt, keysPressed);

  //drawing the shapes!!!
  this.sky.draw(this.camera, this.lightSource);
  if (this.timer2 <= 600) {
    this.land.draw(this.camera, this.lightSource);
  } else if (this.timer2 < 1000) {
    this.land2.draw(this.camera, this.lightSource);
  } else {
    this.land2.draw(this.camera, this.lightSource);
    this.timer2 = 0;
  }
  if (this.playerHealth > 0) {
    this.gameObjects.forEach(function(object) {
      object.draw(theScene.camera, theScene.lightSource);
      object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
    });
    this.trees.forEach(function(object) {
      object.draw(theScene.camera, theScene.lightSource);
      object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
    });
    this.legoSurvivors.forEach(function(object) {
      object.draw(theScene.camera, theScene.lightSource);
      object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
    });
    this.creatures.forEach(function(object) {
      object.draw(theScene.camera, theScene.lightSource);
      object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
    });
    this.rocks.forEach(function(object) {
      object.draw(theScene.camera, theScene.lightSource);
      object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
    });
    this.flyhouses.forEach(function(object) {
      object.draw(theScene.camera, theScene.lightSource);
      object.drawShadow(theScene.camera, theScene.lightSource, theScene.shadowMaterial);
    });
    if (this.survivorCount === this.totalSurvivor) {
      this.state = 1;
    }
  } else {
    // this.skyObjects[0].transform((new Mat4()).scale(1.1, 1.1, 1.1));
    this.state = -1;
  }

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
