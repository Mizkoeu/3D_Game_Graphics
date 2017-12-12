"use strict"

// let ClippedQuadric = function(surfaceCoeffMatrix, clipperCoeffMatrix) {
//   this.surfaceCoeffMatrix = surfaceCoeffMatrix;
//   this.clipperCoeffMatrix = clipperCoeffMatrix;
// };
let ClippedQuadric = function() {
  this.surfaceCoeffMatrix = new Mat4();
  this.clipperCoeffMatrix = new Mat4();
};

ClippedQuadric.prototype.setInfinitePlane = function(){
  this.surfaceCoeffMatrix.set(	0, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, -1);
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

ClippedQuadric.prototype.setBishopSphere = function(){
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 1, 0,
                            		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	-1, 0, 0, 0,
                            		0, -1, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, 1);
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

ClippedQuadric.prototype.setHollowCylinder = function() {
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 1, 0,
                            		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	-2, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, -2, 0,
                            		0, 0, 0, 1);
};

ClippedQuadric.prototype.setParaboloid = function() {
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 1, 0,
                            		0, -1, 0, 0);
  this.clipperCoeffMatrix.set(	0, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, -200);
};

ClippedQuadric.prototype.setCone = function() {
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, -1, 0, 0,
                            		0, 0, 1, 0,
                            		0, 0, 0, 0);
  this.clipperCoeffMatrix.set(	0, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, -200);
};

ClippedQuadric.prototype.setHyperboloid = function() {
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, -1, 0, 0,
                            		0, 0, 1, 0,
                            		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	0, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 0, -200);
};

ClippedQuadric.prototype.setBulge = function() {
  this.surfaceCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 0, 0, 0,
                            		0, 0, 1, 0,
                            		0, -1, 0, 0);
  this.clipperCoeffMatrix.set(	1, 0, 0, 0,
                            		0, 1, 0, 0,
                            		0, 0, 1, 0,
                            		0, 0, 0, -8);
};


ClippedQuadric.prototype.transform = function (matT) {
  // let afterMat = (new Mat4()).scale(scale).translate(translate).invert().transpose();
  // let preMat = (new Mat4()).scale(scale).translate(translate).invert();
  // this.surfaceCoeffMatrix.premul(preMat).mul(afterMat);
  // this.clipperCoeffMatrix.premul(preMat).mul(afterMat);
  this.transformSurface(matT);
  this.transformClipping(matT);
};

ClippedQuadric.prototype.transformSurface = function(matT) {
  let preMat = (new Mat4()).mul(matT).invert();
  let afterMat = (new Mat4()).mul(matT).invert().transpose();
  this.surfaceCoeffMatrix.premul(preMat).mul(afterMat);
}

ClippedQuadric.prototype.transformClipping = function (matT) {
  let preMat = (new Mat4()).mul(matT).invert();
  let afterMat = (new Mat4()).mul(matT).invert().transpose();
  this.clipperCoeffMatrix.premul(preMat).mul(afterMat);
};
