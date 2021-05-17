"use strict";

"use strict";

var cubePosition = [1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0];
var vs = "#version 300 es\n    in vec3 a_position;\n    in float a_textureCordinate;\n    \n    // create sampler\n    \n    uniform mat4 u_wvProjectionMatrix;\n\n    function main(){\n        vec4 gl_Position = multiply viewMatrix *vec4(a_position, 1.0);\n       \n    }\n";
var fs = "#version 300 es\n        precision highp float;\n\n        out vec4 outColor;\n\n        void main(){\n            outColor = vec3(0.5, 0.8, 1.0, 1.0);\n        }\n\n";

(function () {
  var canvas = document.querySelector("#main-canvas");
  var gl = canvas.getContext("webgl2");

  if (!gl) {
    console.log("webgl2 not found");
    return;
  } // create a program


  var program = webglUtils.createProgramFromSources(gl, [vs, fs]); // find position of all the attribute;

  var positionLocation = webglUtils.getAttributeLocation(program, "a_position");
  var wvProjectionMatrixLocation = webglUtils.getUniformLocation(program, "u_wvProjectionMatrix"); // create a vertex array to store the state of the program

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao); // change the state and input the value of the attributes with Vertex Buffer Object

  var positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePosition), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, 0, false, 0, 0); // calculate and input the uniform value - other than needed in draw scene/updating uniforms
  // create a utility function

  function degToRadian(deg) {
    return Math.PI / 180 * deg;
  }

  function radToDegree(rad) {
    return 180 / Math.PI * rad;
  } // call a function drawscene
  // call drawScene in loop
  // call the draw calls


  function drawScene() {//handle resized canvas
    // set view port
    // clear color, color buffer and depth buffer
    //enable cullface, depth test and blending
    // specify the active program and VAO
    //update the camera position if needed in the shader
    // since there might be changed aspect, calculate the perspective matrix
    // update the  world view matrix
    // call draw call to draw array
  }
})();
//# sourceMappingURL=main.dev.js.map
