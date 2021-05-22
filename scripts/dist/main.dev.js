"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

"use strict";

var cubePosition = [1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0];
var up = [0, 1, 0];
var vs = "#version 300 es\n    in vec3 a_position;\n    in float a_textureCordinate;\n    \n    uniform mat4 u_ModelMatrix;\n    uniform mat4 u_wvProjectionMatrix;\n\n    out vec3 vertexCordinate;\n\n    void main(){\n        // gl_Position =  u_wvProjectionMatrix* vec4((2.0*a_position)- vec3(1.0, 1.0, 1.0), 1.0);\n        gl_Position =  u_wvProjectionMatrix* u_ModelMatrix* vec4(a_position, 1.0);\n        // gl_Position =  u_wvProjectionMatrix* vec4(a_position, 1.0);\n \n        vertexCordinate = a_position;   \n    }\n";
var fs = "#version 300 es\n\n    #define M_PI 3.1415926535897932384626433832795\n\n    precision mediump float;\n\n    in vec3 vertexCordinate;\n    uniform sampler2D u_sphereText;\n\n    out vec4 outColor;\n\n    void main(){\n     \n        //  generation of UV cordinate\n        vec3 vertDirection = normalize(vertexCordinate - vec3(0.0, 0.0, 0.0));\n        float u = atan(vertDirection.x, vertDirection.z)/(2.0*M_PI) + 0.5;\n        float v = 0.5-vertDirection.y ;\n    \n        outColor = texture(u_sphereText, vec2(u,v));\n        // outColor = vec4(1.0, 0.8,  0.0, 1.0);\n    }\n\n";

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
  var sphereTextLocation = gl.getUniformLocation(program, "u_sphereText");
  var viewProjectionLocation = gl.getUniformLocation(program, "u_wvProjectionMatrix");
  var modelMatrixLocation = gl.getUniformLocation(program, "u_ModelMatrix");
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var sphere = sphereVertIndices();
  var positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_toConsumableArray(sphere[0])), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  var ballTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, ballTexture);
  var level = 0;
  var internallFormat = gl.RGBA;
  var width = 1;
  var height = 1;
  var border = 0;
  var srcFormat = gl.RGBA;
  var srcType = gl.UNSIGNED_BYTE;
  var pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, level, internallFormat, width, height, border, srcFormat, srcType, pixel);
  var ballImage = new Image();
  ballImage.crossOrigin = "";
  ballImage.src = "http://localhost/game/images/texture/ball.jpg";

  ballImage.onload = function () {
    console.log("i am loaded");
    gl.texImage2D(gl.TEXTURE_2D, level, internallFormat, srcFormat, srcType, ballImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  };

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
  var modelDegree = 0;

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
    gl.uniform1i(sphereTextLocation, 1); // cameraDegree += 0.4;

    modelDegree += 1.0;
    var modelRadian = degToRadian(modelDegree);
    var cameraRadian = degToRadian(cameraDegree); // -------------------------------------------------------------------

    var modelMatrix = m4.yRotation(modelRadian);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix); // --------------------------------------------------------------------

    var cameraMatrix = m4.yRotation(cameraRadian);
    cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, 1.5);
    cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]; // cameraPosition = [0.0, 1.0, 1.5];

    cameraMatrix = initialCameraSetup(cameraPosition, up);
    viewMatrix = m4.inverse(cameraMatrix);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var fieldofView = degToRadian(90);
    var projectionMatrix = m4.perspective(fieldofView, aspect, 0.01, 1000);
    var indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_toConsumableArray(sphere[1])), gl.STATIC_DRAW);
    var vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
    gl.drawElements(gl.TRIANGLES, sphere[1].length, gl.UNSIGNED_SHORT, 0);
    window.requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
})();
//# sourceMappingURL=main.dev.js.map
