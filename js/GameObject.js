"use strict"
let GameObject = function(mesh) {
  this.mesh = mesh;

  this.orientation = 0;
  this.rotation = 0;
  this.position = new Vec3(0, 0, 0);
  this.faceDirection = new Vec3(0, 0, .05);
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
  if (this.parent === null) {
      this.modelMatrix.set().rotate(this.orientation, new Vec3(0, 1, 0)).rotate(this.rotation, new Vec3(1, 0, 0))
                            .scale(this.scale).translate(this.position);
  } else {
    this.modelMatrix.set().rotate(this.orientation, new Vec3(0, 1, 0)).rotate(this.rotation, new Vec3(1, 0, 0))
                          .scale(this.scale).translate(this.position)
                          .rotate(this.parent.orientation, new Vec3(0, 1, 0)).scale(this.parent.scale).translate(this.parent.position);
  }
};

GameObject.prototype.draw = function(camera, lightSource){
  this.updateModelMatrix();
  //camera.updateViewProjMatrix();
  //this.mesh.setUniform("modelViewProjMatrix", (new Mat4()).mul(this.modelMatrix).mul(camera.viewProjMatrix));
  Material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  Material.modelMatrix.set(this.modelMatrix);
  Material.modelMatrixInverse.set(this.modelMatrix).invert();
  // for (var i=0;i<lightSource.length;i++) {
  //   this.lightPos.push(lightSource[i].lightPos);
  //   this.lightPowerDensity.push(lightSource[i].lightPowerDensity);
  // }

  Material.lightPos.set(lightSource.lightPos);
  Material.lightPowerDensity.set(lightSource.lightPowerDensity);
  this.mesh.draw();
};

GameObject.prototype.drawShadow = function(camera, lightSource) {
  this.scale = new Vec3(1, 0, 1);
  this.color = new Vec4(0, 0, 0, 1);
  this.mesh.drawShadow();
};
