"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

"use strict";

(function () {
  var canvas = document.querySelector("#main-canvas");
  var gl = canvas.getContext("webgl2");

  if (!gl) {
    console.log("webgl2 not found");
    return;
  }

  var ext = gl.getExtension("OES_element_index_uint");
  var program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  var programTriangle = webglUtils.createProgramFromSources(gl, [vsTriangle, fsTriangle]);
  var programSkybox = webglUtils.createProgramFromSources(gl, [vsSkybox, fs]);
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var sphereTextLocation = gl.getUniformLocation(program, "u_sphereText");
  var modelMatrixLocation = gl.getUniformLocation(program, "u_ModelMatrix");
  var viewProjectionLocation = gl.getUniformLocation(program, "u_wvProjectionMatrix");
  console.log(gl.getUniformLocation(programTriangle, "u_vpMatrix"));
  var triangleAttributeLocs = {
    position: gl.getAttribLocation(programTriangle, "a_position"),
    modelMatrixLocation: gl.getUniformLocation(programTriangle, "u_vpMatrix")
  };
  var sphere = sphereVertIndices();
  var positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_toConsumableArray(sphere[0])), gl.STATIC_DRAW);
  var posTriangleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posTriangleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionTriangle), gl.STATIC_DRAW);
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

  var cameraDegree = 0;

  function drawScene() {
    var _m;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 1.0, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE); // gl.cullFace(gl.CULL_FACE);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform1i(sphereTextLocation, 1); // cameraDegree += 0.4;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    var modelRadian = degToRadian(modelDegree);
    var cameraRadian = degToRadian(cameraDegree); // -------------------------------------------------------------------

    var modelMatrix = m4.yRotation(0);

    var translationMatrix = (_m = m4).translate.apply(_m, [modelMatrix].concat(_toConsumableArray(modelTranslation)));

    console.log(translationMatrix);
    m4.multiply(modelMatrix, translationMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix); // --------------------------------------------------------------------

    var cameraMatrix = m4.yRotation(cameraRadian);
    cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, cameraYposition);
    cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
    cameraPosition = [0.0, 1.0, 0.0];
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
    gl.drawElements(gl.TRIANGLES, sphere[1].length, gl.UNSIGNED_SHORT, 0); // -------------------triangle draw ---------------------

    gl.bindBuffer(gl.ARRAY_BUFFER, posTriangleBuffer);
    gl.enableVertexAttribArray(triangleAttributeLocs.position);
    gl.vertexAttribPointer(triangleAttributeLocs.position, 3, gl.FLOAT, false, 0, 0);
    gl.useProgram(programTriangle);
    gl.uniformMatrix4fv(triangleAttributeLocs.modelMatrixLocation, false, vProjectionMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    window.requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
})();
//# sourceMappingURL=main.dev.js.map
