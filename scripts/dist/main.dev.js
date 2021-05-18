"use strict";

"use strict";

var cubePosition = [1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0];
var up = [0, 1, 0];
var vs = "#version 300 es\n    in vec3 a_position;\n    in float a_textureCordinate;\n    \n    uniform mat4 u_wvProjectionMatrix;\n\n    out vec4 fragmentColor;\n\n    void main(){\n        gl_Position =  u_wvProjectionMatrix* vec4((2.0*a_position)- vec3(1.0, 1.0, 1.0), 1.0);\n        fragmentColor = gl_Position;   \n    }\n";
var fs = "#version 300 es\n        precision highp float;\n\n        in vec4 fragmentColor;\n\n        out vec4 outColor;\n\n        void main(){\n            outColor = fragmentColor;\n        }\n\n";

(function () {
  var canvas = document.querySelector("#main-canvas");
  var gl = canvas.getContext("webgl2");

  if (!gl) {
    console.log("webgl2 not found");
    return;
  }

  var program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var viewProjectionLocation = gl.getUniformLocation(program, "u_wvProjectionMatrix");
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePosition), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  function degToRadian(deg) {
    return Math.PI / 180 * deg;
  }

  function radToDegree(rad) {
    return 180 / Math.PI * rad;
  }

  function initialCameraSetup(cameraPosition, up) {
    var cameraMatrix = m4.lookAt(cameraPosition, [1, 0, 0], up);
    return cameraMatrix;
  }

  var cameraDegree = 0;

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    cameraDegree += 5;
    var cameraRadian = degToRadian(cameraDegree);
    var cameraMatrix = m4.yRotation(cameraRadian);
    cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, 1.5);
    cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]; // cameraPosition = [0.5, 2.0, 1.5];

    cameraMatrix = initialCameraSetup(cameraPosition, up);
    viewMatrix = m4.inverse(cameraMatrix);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var fieldofView = degToRadian(60);
    var projectionMatrix = m4.perspective(fieldofView, aspect, 0.01, 1000);
    var vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cubePosition.length / 3);
  }

  requestAnimationFrame(drawScene);
})();
//# sourceMappingURL=main.dev.js.map
