"use strict";
let Material = function(gl, program) {
  this.gl = gl;
  this.program = program;
  let theMaterial = this;
  Object.keys(program.uniforms).forEach(function(uniformName) {
    let uniform = program.uniforms[uniformName];
    let reflectionVariable =
        UniformReflectionFactories.makeVar(gl,
                                uniform.type, uniform.size, uniform.textureUnit);
    if(!Material[uniformName]) {
    Object.defineProperty(theMaterial, uniformName,
				{value: reflectionVariable} );
    }
  });
  return new Proxy(this, {
    get : function(target, name){
      if(!(name in target)){
        console.error("WARNING: Ignoring attempt to access material property '" +
            name + "'. Is '" + name + "' an unused uniform?" );
        return Material.dummy;
      }
      return target[name];
    },
  });
};

Material.modelViewProjMatrix = new Mat4();
Material.modelMatrix = new Mat4();
Material.modelMatrixInverse = new Mat4();
Material.rayDirMatrix = new Mat4();
Material.mainDir = new Vec4Array(2);
Material.lightPos = new Vec4Array(2);
Material.lightPowerDensity = new Vec4Array(2);
Material.cameraPos = new Vec3();
Material.objectPosition = new Vec3();
Material.quadrics = new Mat4Array(200);
Material.brdfs = new Vec4Array(100);


Material.prototype.commit = function() {
  let gl = this.gl;
  this.program.commit();
  let theMaterial = this;
  Object.keys(this.program.uniforms).forEach( function(uniformName) {
    let uniform = theMaterial.program.uniforms[uniformName];
    let reflectionVariable = Material[uniformName] || theMaterial[uniformName];
    reflectionVariable.commit(gl, uniform.location);
  });
};

// absorbs all function calls and property accesses without effect​
Material.dummy = new Proxy(new Function(), {
  get: function(target, name){
    return Material.dummy;
  },
  apply: function(target, thisArg, args){
    return Material.dummy;
  },
});
