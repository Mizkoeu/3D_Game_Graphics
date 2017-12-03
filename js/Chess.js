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
    case Chess.types.ROOK:
      this.makeRook(this.side);
      break;
    case Chess.types.PAWN:
      this.makePawn(this.side);
      break;
    default:
      break;
  }
  this.transform((new Mat4()).translate((4.5-col)*Chess.cellWidth, 0, (4.5-row)*Chess.cellWidth));
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
  for(var i=0;i<this.quadrics.length;i++) {
    this.quadrics[i].transform(matT);
  }
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
  side.transform((new Mat4()).scale(.06, .18, .015).rotate(Math.PI/2, 0, 0).translate(0, -.95, 0));
  this.quadrics.push(king);
  this.quadrics.push(stick);
  this.quadrics.push(top);
  this.quadrics.push(side);
  if (this.side === 1) {
    this.materials.push(new Vec4(.7, .2, .15, 300));
    this.materials.push(new Vec4(.7, .2, .15, 300));
    this.materials.push(new Vec4(.5, .2, .1, 300));
    this.materials.push(new Vec4(.6, .15, .18, 300));
  } else {
    // this.materials.push(new Vec4(.25, .3, .8, 140));
    // this.materials.push(new Vec4(.25, .3, .8, 140));
    // this.materials.push(new Vec4(.1, .2, .5, 180));
    // this.materials.push(new Vec4(.3, .15, .75, 160));
    this.materials.push(new Vec4(1, 1, 1, 300));
    this.materials.push(new Vec4(1, 1, 1, 300));
    this.materials.push(new Vec4(1, 1, 1, 300));
    this.materials.push(new Vec4(1, 1, 1, 300));
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
    // this.materials.push(new Vec4(.7, .2, .15, 140));
    // this.materials.push(new Vec4(.7, .2, .15, 140));
    // this.materials.push(new Vec4(.5, .2, .1, 180));
    // this.materials.push(new Vec4(.6, .15, .18, 160));
    this.materials.push(new Vec4(1, .5, .4, 110));
    this.materials.push(new Vec4(1, 1, 1, 210));
    this.materials.push(new Vec4(1, 1, 1, 210));
    this.materials.push(new Vec4(1, 1, 1, 210));
  } else {
    // this.materials.push(new Vec4(.25, .3, .8, 140));
    // this.materials.push(new Vec4(.25, .3, .8, 140));
    // this.materials.push(new Vec4(.1, .2, .5, 180));
    // this.materials.push(new Vec4(.3, .15, .75, 160));
    this.materials.push(new Vec4(.4, .5, 1, 110));
    this.materials.push(new Vec4(1, 1, 1, 210));
    this.materials.push(new Vec4(1, 1, 1, 210));
    this.materials.push(new Vec4(1, 1, 1, 210));
  }
};

Chess.prototype.makeBishop = function(side) {
  var main = new ClippedQuadric();
  // var stick = new ClippedQuadric();
  // var bulge = new ClippedQuadric();
  var head = new ClippedQuadric();
  var dot = new ClippedQuadric();
  main.setHyperboloid();
  main.transformClipping((new Mat4()).scale(1, .1, 1).translate(0, -1, 0));
  main.transform((new Mat4()).scale(.15, .3, .15).translate(0, -1.7, 0));
  // stick.setHyperboloid();
  // stick.transformClipping((new Mat4()).scale(1, .15, 1).translate(0, -1.5, 0));
  // stick.transform((new Mat4()).scale(.07, .06, .07).translate(0, -1.35, 0));
  // bulge.setBulge();
  // bulge.transform((new Mat4()).scale(.2, .2, .2).translate(0, -1.58, 0));
  head.setBishopSphere();
  head.transformClipping((new Mat4()).scale(.12, .75, .15).rotate(.45, 0, 0).translate(-.28, .65, 0));
  head.transform((new Mat4()).scale(.26, .35, .26).translate(0, -1.35, 0));

  dot.setUnitSphere();
  dot.transform((new Mat4()).scale(.08, .08, .08).translate(0, -.95, 0));
  this.quadrics.push(main);
  // this.quadrics.push(stick);
  // this.quadrics.push(bulge);
  this.quadrics.push(head);
  this.quadrics.push(dot);
  if (this.side === 1) {
    this.materials.push(new Vec4(.7, .2, .15, 140));
    this.materials.push(new Vec4(.6, .2, .1, 180));
    this.materials.push(new Vec4(.7, .2, .1, 180));
    // this.materials.push(new Vec4(1, 1, 1, 210));
    // this.materials.push(new Vec4(1, 1, 1, 210));
    // this.materials.push(new Vec4(1, 1, 1, 210));
  } else {
    this.materials.push(new Vec4(.6, .6, 1, 340));
    // this.materials.push(new Vec4(.25, .3, .8, 140));
    // this.materials.push(new Vec4(.1, .2, .5, 180));
    this.materials.push(new Vec4(.3, .15, .8, 160));
    this.materials.push(new Vec4(.3, .15, .78, 160));
  }
};

Chess.prototype.makeRook = function(side) {
  var main = new ClippedQuadric();
  // var stick = new ClippedQuadric();
  // var bulge = new ClippedQuadric();
  var head = new ClippedQuadric();
  var dot = new ClippedQuadric();
  main.setHyperboloid();
  main.transformClipping((new Mat4()).scale(1, .1, 1).translate(0, -.45, 0));
  main.transform((new Mat4()).scale(.2, .35, .2).translate(0, -1.75, 0));
  head.setHollowCylinder();
  head.transform((new Mat4()).scale(.28, .28, .28).translate(0, -1.45, 0));

  dot.setUnitSphere();
  dot.transform((new Mat4()).scale(.08, .08, .08).translate(0, -.95, 0));
  this.quadrics.push(main);
  this.quadrics.push(head);
  if (this.side === 1) {
    this.materials.push(new Vec4(.7, .2, .15, 110));
    this.materials.push(new Vec4(.8, .15, .18, 10));
  } else {
    this.materials.push(new Vec4(.25, .3, .8, 110));
    this.materials.push(new Vec4(.3, .15, .75, 10));
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
