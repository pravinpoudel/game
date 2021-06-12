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

  let globalRotationValue = [];

  function generateModel({ index, rotation, scale, translate }) {
    if (globalRotationValue[index] == undefined) {
      globalRotationValue[index] = 0;
    }
    globalRotationValue[index] = rotation;
    let modelMatrix;
    modelMatrix = m4.identity(modelMatrix);
    m4.translate(
      modelMatrix,
      translate.x,
      translate.y,
      translate.z,
      modelMatrix
    );
    m4.yRotate(modelMatrix, globalRotationValue[index], modelMatrix);
    m4.translate(modelMatrix, -scale.x / 2, -scale.y / 2, -scale.z / 2);
    m4.scale(modelMatrix, scale.x, scale.y, scale.z, modelMatrix);

    return modelMatrix;
  }

  let cameraAngle = 0;
  let modelAngle = 0.1;
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

    let parameters = {
      index: 0,
      rotation: modelDegree,
      scale: { x: 0.5, y: 1.0, z: 1.0 },
      translate: {
        x: modelTranslation[0],
        y: modelTranslation[1],
        z: modelTranslation[2],
      },
    };

    let modelMatrix = generateModel(parameters);
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);

    let camera = m4.yRotation(cameraAngle);
    let cameraPosition = [...modelTranslation];
    cameraPosition = [
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2] + 7.5,
    ];
    camera = m4.translate(camera, ...cameraPosition);
    let viewMatrix = m4.inverse(camera);

    let fov = Math.PI / 3.0;
    let aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let projectionMatrix = m4.perspective(fov, aspectRatio, 0.1, 1000);

    projectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.uniformMatrix4fv(VPuniformLocation, false, projectionMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cubePosition.length / 3);

    parameters = {
      index: 1,
      rotation: 0.0,
      scale: { x: 1.0, y: 0.4, z: 0.3 },
      translate: { x: 2.0, y: 1.0, z: -2.0 },
    };

    modelMatrix = generateModel(parameters);
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cubePosition.length / 3);

    parameters = {
      index: 2,
      rotation: 0.0,
      scale: { x: 0.5, y: 1.5, z: 1.3 },
      translate: { x: -2.5, y: 0.0, y: 0.0, z: -1.0 },
    };

    modelMatrix = generateModel(parameters);
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cubePosition.length / 3);

    window.requestAnimationFrame(draw);
  }

  draw();
  window.requestAnimationFrame(draw);
})();
