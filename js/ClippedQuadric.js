"use strict"

// let ClippedQuadric = function(surfaceCoeffMatrix, clipperCoeffMatrix) {
//   this.surfaceCoeffMatrix = surfaceCoeffMatrix;
//   this.clipperCoeffMatrix = clipperCoeffMatrix;
// };
let ClippedQuadric = function() {
  this.surfaceCoeffMatrix = new Mat4();
  this.clipperCoeffMatrix = new Mat4();
};

ClippedQuadric.prototype.setUnitSphere = function(){
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 1, 0,
                            		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	0, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, -1);
};

ClippedQuadric.prototype.setUnitCylinder = function() {
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 1, 0,
                            		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	0, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, -1);
};

ClippedQuadric.prototype.setParaboloid = function() {
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 1, 0,
                            		0, -1, 0, 0);
  this.clipperCoeffMatrix.set(	0, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, 0);
};

ClippedQuadric.prototype.transform = function (translate, scale) {
  let afterMat = (new Mat4()).scale(scale).translate(translate).invert().transpose();
  let preMat = (new Mat4()).scale(scale).translate(translate).invert();
  this.surfaceCoeffMatrix.premul(preMat).mul(afterMat);
  this.clipperCoeffMatrix.premul(preMat).mul(afterMat);
};

ClippedQuadric.prototype.transformClipping = function () {

};
