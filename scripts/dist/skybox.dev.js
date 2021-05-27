"use strict";

(function () {
  var canvas = document.getElementById("main-canvas");
  var gl = canvas.getContext("webgl2");
  var programSkybox = webglUtils.createProgramFromSources(gl, [vsSkybox, fsSkybox]);
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var apositionLocation = gl.getAttribLocation(programSkybox, "a_position");
  var modelLocation = gl.getUniformLocation(programSkybox, "u_modelMatrix");
  var VPuniformLocation = gl.getUniformLocation(programSkybox, "u_VPmatrix");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePosition), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(apositionLocation);
  gl.vertexAttribPointer(apositionLocation, 3, gl.FLOAT, false, 0, 0);
  var cameraAngle = 0;

  function draw() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(programSkybox);
    gl.bindVertexArray(vao);
    var modelAngle = 0;
    var modelMatrix = m4.yRotation(modelAngle);
    modelMatrix = m4.translate(modelMatrix, 0.5, 0.0, 0.0);
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
    cameraAngle += 0.01;
    var camera = m4.yRotation(cameraAngle);
    camera = m4.translate(camera, 0.0, 0.0, 4.5);
    var viewMatrix = m4.inverse(camera);
    var fov = Math.PI / 3.0;
    var aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fov, aspectRatio, 0.1, 1000);
    projectionMatrix = m4.multiply(projectionMatrix, viewMatrix); // let indicesBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    // gl.bufferData(
    //   gl.ELEMENT_ARRAY_BUFFER,
    //   new Uint8Array(indexArray),
    //   gl.STATIC_DRAW
    // );

    gl.uniformMatrix4fv(VPuniformLocation, false, projectionMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cubePosition.length / 3);
    window.requestAnimationFrame(draw);
  }

  draw();
  window.requestAnimationFrame(draw);
})();
//# sourceMappingURL=skybox.dev.js.map
