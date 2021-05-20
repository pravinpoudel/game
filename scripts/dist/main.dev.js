"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

"use strict";

var cubePosition = [1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0];
var up = [0, 1, 0];
var vs = "#version 300 es\n    in vec3 a_position;\n    in float a_textureCordinate;\n    \n    uniform mat4 u_wvProjectionMatrix;\n\n    out vec4 fragmentColor;\n\n    void main(){\n        // gl_Position =  u_wvProjectionMatrix* vec4((2.0*a_position)- vec3(1.0, 1.0, 1.0), 1.0);\n        gl_Position =  u_wvProjectionMatrix* vec4(a_position, 1.0);\n \n        fragmentColor = gl_Position;   \n    }\n";
var fs = "#version 300 es\n        precision highp float;\n\n        in vec4 fragmentColor;\n\n        out vec4 outColor;\n\n        void main(){\n            // outColor = fragmentColor;\n            outColor = vec4(1.0, 0.0, 0.5, 1.0);\n        }\n\n";

(function () {
  var canvas = document.querySelector("#main-canvas");
  var gl = canvas.getContext("webgl2");

  if (!gl) {
    console.log("webgl2 not found");
    return;
  }

  var ext = gl.getExtension("OES_element_index_uint");
  var program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var viewProjectionLocation = gl.getUniformLocation(program, "u_wvProjectionMatrix");
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var sphere = sphereVertIndices();
  var positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(_toConsumableArray(sphere[0])), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0); // let ballTexture = gl.createTexture();
  // gl.bindTexture(gl.TEXTURE_2D, ballTexture);
  // gl.textImage2D(gl.TEXTURE_2D, 0, gl.RGBA);
  // put color as a texture at first
  // load an image as a texture
  // revolve an object around x axis

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
    cameraDegree += 0.4;
    var cameraRadian = degToRadian(cameraDegree);
    var cameraMatrix = m4.yRotation(cameraRadian);
    cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, 1.5);
    cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]; // cameraPosition = [0.5, 2.0, 1.5];

    cameraMatrix = initialCameraSetup(cameraPosition, up);
    viewMatrix = m4.inverse(cameraMatrix);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var fieldofView = degToRadian(60);
    var projectionMatrix = m4.perspective(fieldofView, aspect, 0.01, 1000);
    var indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(_toConsumableArray(sphere[1])), gl.STATIC_DRAW);
    var vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
    gl.drawElements(gl.TRIANGLES, sphere[1].length, gl.UNSIGNED_INT, 0);
    window.requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
})();
//# sourceMappingURL=main.dev.js.map
