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
  // this.mirrorMaterial = new Material(gl, this.mirrorProgram);
  // this.mirrorTexture = new Texture2D(gl, "../probe.png");
  // this.mirrorMaterial.probeTexture.set(this.mirrorTexture.glTexture);
  // this.shadowMaterial = new Material(gl, this.shadowProgram);
  // this.shinyMaterial = new Material(gl, this.shinyProgram);
  // this.woodMaterial = new Material(gl, this.woodProgram);
  // this.bodyMaterial = new Material(gl, this.solidProgram);
  // this.eyeMaterial = new Material(gl, this.solidProgram);
  // this.landMaterial = new Material(gl, this.solidProgram);
  this.skyTexture = new Texture2D(gl, "./city.jpg");
  this.skyMaterial = new Material(gl, this.skyProgram);
  this.skyMaterial.probeTexture.set(this.skyTexture.glTexture);
  //texture binding
  // this.texture = new Texture2D(gl, "./Slowpoke/YadonDh.png");
  // this.texture2 = new Texture2D(gl, "./Slowpoke/YadonEyeDh.png");
  // //this.shadowTexture = new Texture2D(gl, "./shadow.png");
  // this.landTexture = new Texture2D(gl, "./grass.png");
  // //this.shinyMaterial.colorTexture.set(this.shadowTexture.glTexture);
  // this.bodyMaterial.colorTexture.set(this.texture.glTexture);
  // this.eyeMaterial.colorTexture.set(this.texture2.glTexture);
  // this.landMaterial.colorTexture.set(this.landTexture.glTexture);

  //Array of Light sources
  this.lightSource = new lightSource();
  this.lightSource.lightPos = new Vec4Array(3);
  this.lightSource.lightPowerDensity = new Vec4Array(3);
  this.lightSource.mainDir = new Vec4Array(3);
  this.lightSource.lightPos.at(0).set(-1, 1, -1, 0);
  this.lightSource.lightPowerDensity.at(0).set(4, 4, 4, 0);
  this.lightSource.lightPowerDensity.at(1).set(2, 2, 15, 0);
  this.lightSource.lightPowerDensity.at(2).set(3, 6, 13, 0);
  //this.lightSource.mainDir.at(0).set(-1, -1, -1, 0);
  this.lightSource.mainDir.at(1).set(0, -1, 0, 1);
  this.lightSource.mainDir.at(2).set(0, -1, 0, 1);

  //Create a camera
  this.camera = new PerspectiveCamera();

  // this.gameObjects = [];
  //Create Skydome
  this.sky = new GameObject(new Mesh(this.skyGeometry, this.skyMaterial));
  this.chessPieces = [];
  var kingPiece = new Chess(Chess.types.KING, 1, 1, 5);
  var kingPiece2 = new Chess(Chess.types.KING, 2, 8, 5);
  this.chessPieces.push(kingPiece2);
  this.chessPieces.push(kingPiece);
  var queenPiece1 = new Chess(Chess.types.QUEEN, 1, 1, 4);
  var queenPiece2 = new Chess(Chess.types.QUEEN, 2, 8, 4);
  this.chessPieces.push(queenPiece2);
  this.chessPieces.push(queenPiece1);
  this.chessPieces.push(new Chess(Chess.types.ROOK, 1, 1, 8));
  this.chessPieces.push(new Chess(Chess.types.ROOK, 1, 1, 1));
  this.chessPieces.push(new Chess(Chess.types.ROOK, 2, 8, 8));
  this.chessPieces.push(new Chess(Chess.types.ROOK, 2, 8, 1));
  this.chessPieces.push(new Chess(Chess.types.BISHOP, 1, 1, 3));
  this.chessPieces.push(new Chess(Chess.types.BISHOP, 1, 1, 6));
  this.chessPieces.push(new Chess(Chess.types.BISHOP, 2, 8, 3));
  this.chessPieces.push(new Chess(Chess.types.BISHOP, 2, 8, 6));


  var chessBoard = new ClippedQuadric();
  chessBoard.setInfinitePlane();
  // chessBoard.setUnitCylinder();
  chessBoard.transform((new Mat4()).scale(7, .15, 7).translate(0, -2.5, 0));
  this.sky.quadricSet.push(chessBoard);
  this.sky.materialSet.push(new Vec4(.3, .3, .3, 200));

  //initialize light positions
  this.lightSource.lightPos.at(2).set((4.5-queenPiece1.col)*Chess.cellWidth, 1.2, (4.5-queenPiece1.row)*Chess.cellWidth, 1);
  this.lightSource.lightPos.at(1).set((4.5-queenPiece2.col)*Chess.cellWidth, 1.2, (4.5-queenPiece2.row)*Chess.cellWidth, 1);

  for (var i=1;i<=8;i++) {
    this.chessPieces.push(new Chess(Chess.types.PAWN, 1, 2, i));
    this.chessPieces.push(new Chess(Chess.types.PAWN, 2, 7, i));
  }

  for (var i=0;i<this.chessPieces.length;i++) {
    let piece = this.chessPieces[i];
    for (var j=0;j<piece.quadrics.length;j++) {
      this.sky.quadricSet.push(piece.quadrics[j]);
      this.sky.materialSet.push(piece.materials[j]);
    }
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
  //move camera based on hotkeys
  this.camera.move(dt, keysPressed);

  if (keysPressed.UP === true) {
    this.chessPieces[0].transform((new Mat4()).translate(0, 0, dt));
    this.lightSource.lightPos.at(1).add(0, 0, dt, 0);
  }
  if (keysPressed.DOWN === true) {
    this.chessPieces[0].transform((new Mat4()).translate(0, 0, -dt));
    this.lightSource.lightPos.at(1).add(0, 0, -dt, 0);
  }
  if (keysPressed.LEFT === true) {
    this.chessPieces[0].transform((new Mat4()).translate(dt, 0, 0));
    this.lightSource.lightPos.at(1).add(dt, 0, 0, 0);
  }
  if (keysPressed.RIGHT === true) {
    this.chessPieces[0].transform((new Mat4()).translate(-dt, 0, 0));
    this.lightSource.lightPos.at(1).add(-dt, 0, 0, 0);
  }
  if (keysPressed.Z === true) {
    this.chessPieces[0].transform((new Mat4()).translate(0, dt, 0));
    this.lightSource.lightPos.at(1).add(0, dt, 0, 0);
  }
  if (keysPressed.X === true) {
    this.chessPieces[0].transform((new Mat4()).translate(0, -dt, 0));
    this.lightSource.lightPos.at(1).add(0, -dt, 0, 0);
  }

  //Focus shot
  if (keysPressed.F === true) {
    this.chessPieces[0].transform((new Mat4()).translate(0, dt, 0));
    this.lightSource.lightPos.at(1).add(0, dt, 0, 0);
  }

  //Tracking shot
  if (keysPressed.G === true) {
    this.chessPieces[0].transform((new Mat4()).translate(0, -dt, 0));
    this.lightSource.lightPos.at(1).add(0, -dt, 0, 0);
  }

  this.sky.draw(this.camera, this.lightSource);

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
