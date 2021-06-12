(function () {
  let canvas = document.getElementById("main-canvas");
  let gl = canvas.getContext("webgl2");

  let programScene = webglUtils.createProgramFromSources(gl, [
    vsSkybox,
    fsSkybox,
  ]);

  gl.useProgram(programScene);
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let apositionLocation = gl.getAttribLocation(programScene, "a_position");
  let normalLocation = gl.getAttribLocation(programScene, "a_normal");
  let modelLocation = gl.getUniformLocation(programScene, "u_modelMatrix");
  
  let cameraLocation = gl.getUniformLocation(programScene, "cameraPosition");
  
  let invTransposeModelLocation = gl.getUniformLocation(
    programScene,
    "u_invTransposeNormal"
  );
  let VPuniformLocation = gl.getUniformLocation(programScene, "u_VPmatrix");

  let lightDirectionLocation = gl.getUniformLocation(
    programScene,
    "lightDirection"
  );

  let emissionLocation = gl.getUniformLocation(programScene, "emission");
  
  let materialAmbientLocation = gl.getUniformLocation(programScene,"materialAmbient");

  let materialDiffuseLocation = gl.getUniformLocation(
    programScene,
    "materialDiffuse"
  );
  let materialSpecularLocation = gl.getUniformLocation(
    programScene,
    "materialSpecular"
  );
  let shininessLocation = gl.getUniformLocation(programScene, "shininess");

  let ambiemtLightLocation = gl.getUniformLocation(
    programScene,
    "ambientLight"
  );

  let diffuseLightLocation = gl.getUniformLocation(
    programScene,
    "diffuseLight"
  );

  let specularLightLocation = gl.getUniformLocation(
    programScene,
    "specularLight"
  );

  // light

  const light = {
    ambient: [1.0, 1.0, 1.0],
    diffuse: [1.0, 0.6, 0.6],
    specular: [0.8, 1.0, 1.0],
  };

  gl.uniform3fv(ambiemtLightLocation, light.ambient);
  gl.uniform3fv(diffuseLightLocation, light.diffuse);
  gl.uniform3fv(specularLightLocation, light.specular);

  // -----------------------------------

  let material = {
    emission: [0.2, 1.0, 1.0],
    ambient: [0.2, 0.2, 0.2],
    diffuse: [1.0, 0.6, 0.6],
    specular: [1.0, 1.0, 1.0],
    shininess: 100,
  };

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(apositionLocation);
  gl.vertexAttribPointer(apositionLocation, 3, gl.FLOAT, false, 0, 0);

  let normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(normalLocation);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

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

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

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

    gl.bindVertexArray(vao);

    let camera = m4.yRotation(cameraAngle);
    let cameraPosition = [...modelTranslation];
    cameraPosition = [
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2] + 7.5,
    ];
    camera = m4.translate(camera, ...cameraPosition);

    gl.uniform3fv(cameraLocation, [...cameraPosition]);

    gl.uniform3fv(lightDirectionLocation, [20, 20, 20]);

    let viewMatrix = m4.inverse(camera);

    let fov = Math.PI / 3.0;
    let aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let projectionMatrix = m4.perspective(fov, aspectRatio, 0.1, 1000);

    projectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.uniformMatrix4fv(VPuniformLocation, false, projectionMatrix);

    // ===================================================================

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
    let invModel = m4.inverse(modelMatrix);

    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);

    material = {
      emission: [0.2, 1.0, 1.0],
      ambient: [0.2, 0.2, 0.2],
      diffuse: [1.0, 0.6, 0.6],
      specular: [1.0, 1.0, 1.0],
      shininess: 100,
    };

    gl.uniform3fv(emissionLocation, material.emission);
    gl.uniform3fv(materialAmbientLocation, material.ambient);
    gl.uniform3fv(materialDiffuseLocation, material.diffuse);
    gl.uniform3fv(materialSpecularLocation, material.specular);
    gl.uniform1f(shininessLocation, material.shininess);

    gl.uniformMatrix4fv(invTransposeModelLocation, true, invModel);

    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    // =================================================================================

    parameters = {
      index: 1,
      rotation: 0.0,
      scale: { x: 1.0, y: 0.4, z: 0.3 },
      translate: { x: 2.0, y: 1.0, z: -2.0 },
    };

    modelMatrix = generateModel(parameters);
    invModel = m4.inverse(modelMatrix);

    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
    gl.uniformMatrix4fv(invTransposeModelLocation, true, invModel);

    material = {
      emission: [0.2, 1.0, 1.0],
      ambient: [0.2, 0.2, 0.2],
      diffuse: [1.0, 0.6, 0.6],
      specular: [1.0, 1.0, 1.0],
      shininess: 100,
    };

    gl.uniform3fv(emissionLocation, material.emission);
    gl.uniform3fv(materialAmbientLocation, material.ambient);
    gl.uniform3fv(materialDiffuseLocation, material.diffuse);
    gl.uniform3fv(materialSpecularLocation, material.specular);
    gl.uniform1f(shininessLocation, material.shininess);

    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    // ====================================================================================
    parameters = {
      index: 2,
      rotation: 0.0,
      scale: { x: 0.5, y: 1.5, z: 1.3 },
      translate: { x: -2.5, y: 0.0, y: 0.0, z: -1.0 },
    };

    modelMatrix = generateModel(parameters);
    invModel = m4.inverse(modelMatrix);

    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
    gl.uniformMatrix4fv(invTransposeModelLocation, true, invModel);

    material = {
      emission: [0.2, 1.0, 1.0],
      ambient: [0.2, 0.2, 0.2],
      diffuse: [1.0, 0.6, 0.6],
      specular: [1.0, 1.0, 1.0],
      shininess: 100,
    };

    gl.uniform3fv(emissionLocation, material.emission);
    gl.uniform3fv(materialAmbientLocation, material.ambient);
    gl.uniform3fv(materialDiffuseLocation, material.diffuse);
    gl.uniform3fv(materialSpecularLocation, material.specular);
    gl.uniform1f(shininessLocation, material.shininess);

    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    window.requestAnimationFrame(draw);
  }

  draw();
  window.requestAnimationFrame(draw);
})();
