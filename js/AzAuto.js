"use strict"
let AzAuto = function(car, wheels) {
  this.body = car;
  this.wheel1 = wheels[0];
  this.wheel2 = wheels[1];
  this.pos = this.body.position;
  this.wheel1.position = this.pos.add(new Vec3(.2, -.1, -.3));
  this.wheel2.position = this.pos.add(new Vec3(-.2, -.1, -.3));

}

AzAuto.prototype.draw = function(camera, lightSource) {
  this.body.draw(camera, lightSource);
  this.wheel1.draw(camera, lightSource);
  this.wheel2.draw(camera, lightSource);
}
