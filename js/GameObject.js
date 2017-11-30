"use strict"
let GameObject = function(mesh) {
  this.quadricSet = [];
  this.materialSet = [];

  this.mesh = mesh;
  this.isGround = false;

  this.orientation = 0;
  this.tilt = 0;
  this.pitch = 0;
  this.rotation = 0;
  this.position = new Vec3(0, 0, 0);
  this.faceDirection = new Vec3(0, 0, .05);
  this.sideDirection = new Vec3(1, 0, 0);
  this.speed = new Vec2(0, 0);
  this.acceleration = new Vec2(0, 0);

  this.scale = new Vec3(1, 1, 1);
  this.color = new Vec4(0, 0, 0, 0);
  this.parent = null;
  //this.isRotate = false;
  this.modelMatrix = new Mat4();
};

GameObject.prototype.updateModelMatrix = function(){
  // TODO: set the model matrix according to the position, orientation, and scale
  this.sideDirection.setVectorProduct((new Vec3(0, 1, 0)), this.faceDirection).normalize();
  if (this.parent === null) {
      this.modelMatrix.set().rotate(this.orientation, new Vec3(0, 1, 0)).rotate(this.pitch, this.sideDirection)
                            .rotate(this.tilt, this.faceDirection)
                            .scale(this.scale).translate(this.position);
  } else {
    this.modelMatrix.set().rotate(this.orientation, new Vec3(0, 1, 0)).rotate(this.rotation, new Vec3(1, 0, 0))
                          .scale(this.scale).translate(this.position)
                          .rotate(this.parent.orientation, new Vec3(0, 1, 0))
                          .rotate(this.parent.pitch, this.parent.sideDirection)
                          .scale(this.parent.scale).translate(this.parent.position);
  }
};

GameObject.prototype.draw = function(camera, lightSource){
  this.updateModelMatrix();
  //camera.updateViewProjMatrix();
  //this.mesh.setUniform("modelViewProjMatrix", (new Mat4()).mul(this.modelMatrix).mul(camera.viewProjMatrix));
  Material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  Material.modelMatrix.set(this.modelMatrix);
  Material.modelMatrixInverse.set(this.modelMatrix).invert();
  Material.lightPos.set(lightSource.lightPos);
  Material.lightPowerDensity.set(lightSource.lightPowerDensity);
  Material.mainDir.set(lightSource.mainDir);
  Material.cameraPos.set(camera.position);

  for (var i=0;i<this.quadricSet.length;i++){
    Material.quadrics.at(i*2).set(this.quadricSet[i].surfaceCoeffMatrix);
    Material.quadrics.at(i*2+1).set(this.quadricSet[i].clipperCoeffMatrix);
    Material.brdfs.at(i).set(this.materialSet[i]);
  };

  this.mesh.draw();
};

GameObject.prototype.drawShadow = function(camera, lightSource, shadowMaterial) {
  if (this.isGround === false) {
    this.updateModelMatrix();
    let height;
    if (this.parent !== null) {
      Material.objectPosition.set(this.parent.position);
      height = (this.parent.position.y - .1)*.1;
    } else {
      Material.objectPosition.set(this.position);
      height = (this.position.y - .1)*.1;
    }
    //this.modelMatrix.scale(new Vec3(1, 0, 1));
    let light = lightSource.lightPos.at(0);
    Material.modelMatrix.scale(new Vec3(1, 0, 1)).
                         translate(new Vec3(0, -.175, 0)).translate(new Vec3(-height, 0, -height));
    Material.modelMatrixInverse.set(Material.modelMatrix).invert();
    Material.modelViewProjMatrix.set(Material.modelMatrix).mul(camera.viewProjMatrix);
    this.mesh.drawShadow(shadowMaterial);
  }
};
