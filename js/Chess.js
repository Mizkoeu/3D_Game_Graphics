"use strict"
let Chess = function(type, side, row, col) {
  this.type = type;
  this.side = side;
  this.row = row;
  this.col = col;
  this.quadrics = [];
  this.materials = [];

  switch (this.type) {
    case Chess.types.KING:
      this.makeKing(this.side);
      break;
    case Chess.types.QUEEN:
      this.makeQueen(this.side);
      break;
    case Chess.types.BISHOP:
      this.makeBishop(this.side);
      break;
    case Chess.types.PAWN:
      this.makePawn(this.side);
      break;
    default:
      break;
  }
  this.transform((new Mat4()).translate((4.5-row)*Chess.cellWidth, 0, (4.5-col)*Chess.cellWidth));
};

Chess.types = Object.freeze({
  KING: 1,
  QUEEN: 2,
  BISHOP: 3,
  ROOK: 4,
  KNIGHT: 5,
  PAWN: 6
});

Chess.cellWidth = 1.30;

Chess.prototype.transform = function(matT) {
  this.quadrics.forEach(function (o) {
    o.transform(matT);
  });
}

Chess.prototype.makeKing = function(side) {
  var king = new ClippedQuadric();
  var stick = new ClippedQuadric();
  var top = new ClippedQuadric();
  var side = new ClippedQuadric();
  king.setHyperboloid();
  king.transformClipping((new Mat4()).scale(1, .1, 1).translate(0, -1, 0));
  king.transform((new Mat4()).scale(.15, .4, .15).translate(0, -1.45, 0));
  stick.setHyperboloid();
  stick.transformClipping((new Mat4()).scale(1, .15, 1).translate(0, -1.5, 0));
  stick.transform((new Mat4()).scale(.06, .16, .06).translate(0, -.9, 0));
  top.setParaboloid();
  top.transform((new Mat4()).scale(.07, .04, .07).translate(0, -1.65, 0));
  side.setUnitCylinder();
  side.transform((new Mat4()).scale(.015, .18, .06).rotate(Math.PI/2, new Vec3(1, 0, 0)).translate(0, -.95, 0));
  this.quadrics.push(king);
  this.quadrics.push(stick);
  this.quadrics.push(top);
  this.quadrics.push(side);
  if (this.side === 1) {
    this.materials.push(new Vec4(.7, .2, .15, 140));
    this.materials.push(new Vec4(.7, .2, .15, 140));
    this.materials.push(new Vec4(.5, .2, .1, 180));
    this.materials.push(new Vec4(.6, .15, .18, 160));
  } else {
    this.materials.push(new Vec4(.25, .3, .8, 140));
    this.materials.push(new Vec4(.25, .3, .8, 140));
    this.materials.push(new Vec4(.1, .2, .5, 180));
    this.materials.push(new Vec4(.3, .15, .75, 160));
  }
};

Chess.prototype.makeQueen = function(side) {
  var main = new ClippedQuadric();
  var stick = new ClippedQuadric();
  var bulge = new ClippedQuadric();
  var side = new ClippedQuadric();
  main.setHyperboloid();
  main.transformClipping((new Mat4()).scale(1, .1, 1).translate(0, -1, 0));
  main.transform((new Mat4()).scale(.15, .3, .15).translate(0, -1.7, 0));
  stick.setHyperboloid();
  stick.transformClipping((new Mat4()).scale(1, .15, 1).translate(0, -1.5, 0));
  stick.transform((new Mat4()).scale(.07, .06, .07).translate(0, -1.35, 0));
  bulge.setBulge();
  bulge.transform((new Mat4()).scale(.2, .2, .2).translate(0, -1.58, 0));
  side.setUnitSphere();
  side.transform((new Mat4()).scale(.08, .08, .08).translate(0, -.95, 0));
  this.quadrics.push(main);
  this.quadrics.push(stick);
  this.quadrics.push(bulge);
  this.quadrics.push(side);
  if (this.side === 1) {
    this.materials.push(new Vec4(.7, .2, .15, 140));
    this.materials.push(new Vec4(.7, .2, .15, 140));
    this.materials.push(new Vec4(.5, .2, .1, 180));
    this.materials.push(new Vec4(.6, .15, .18, 160));
  } else {
    this.materials.push(new Vec4(.25, .3, .8, 140));
    this.materials.push(new Vec4(.25, .3, .8, 140));
    this.materials.push(new Vec4(.1, .2, .5, 180));
    this.materials.push(new Vec4(.3, .15, .75, 160));
  }
};

Chess.prototype.makePawn = function(side) {
  var king = new ClippedQuadric();
  var top = new ClippedQuadric();
  var side = new ClippedQuadric();
  king.setHyperboloid();
  king.transformClipping((new Mat4()).scale(1, .15, 1).translate(0, -1, 0));
  king.transform((new Mat4()).scale(.13, .22, .13).translate(0, -1.8, 0));
  top.setParaboloid();
  top.transform((new Mat4()).scale(.075, .015, .075).rotate(Math.PI, 0, 0).translate(0, -1.55, 0));
  side.setUnitSphere();
  side.transform((new Mat4()).scale(.25, .25, .25).translate(0, -1.5, 0));
  this.quadrics.push(king);
  this.quadrics.push(top);
  this.quadrics.push(side);
  if (this.side === 1) {
    this.materials.push(new Vec4(.7, .2, .15, 140));
    this.materials.push(new Vec4(.5, .2, .1, 180));
    this.materials.push(new Vec4(.6, .15, .18, 160));
  } else {
    this.materials.push(new Vec4(.25, .3, .8, 140));
    this.materials.push(new Vec4(.1, .2, .5, 180));
    this.materials.push(new Vec4(.3, .15, .75, 160));
  }
};
