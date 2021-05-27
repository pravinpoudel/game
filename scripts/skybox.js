(function () {
  let canvas = document.getElementById("main-canvas");
  let gl = canvas.getContext("webgl2");

  let programSkybox = webglUtils.createProgramFromSources(gl, [
    vsSkybox,
    fsSkybox,
  ]);

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let apositionLocation = gl.getAttribLocation(programSkybox, "a_position");
  let modelLocation = gl.getUniformLocation(programSkybox, "u_modelMatrix");
  let VPuniformLocation = gl.getUniformLocation(programSkybox, "u_VPmatrix");

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cubePosition),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(apositionLocation);
  gl.vertexAttribPointer(apositionLocation, 3, gl.FLOAT, false, 0, 0);

  let cameraAngle = 0;

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

    let modelAngle = 0;
    let modelMatrix = m4.yRotation(modelAngle);
    modelMatrix = m4.translate(modelMatrix, 0.5, 0.0, 0.0);
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);

    cameraAngle += 0.01;
    let camera = m4.yRotation(cameraAngle);
    camera = m4.translate(camera, 0.0, 0.0, 4.5);
    let viewMatrix = m4.inverse(camera);

    let fov = Math.PI / 3.0;
    let aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let projectionMatrix = m4.perspective(fov, aspectRatio, 0.1, 1000);

    projectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // let indicesBuffer = gl.createBuffer();
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
