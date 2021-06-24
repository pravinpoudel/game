(async function () {
  const canvas = document.getElementById("main-canvas");
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    console.log("context couldnot be generated");
    return;
  }
  let { geometries, materials, minMax } = await objFileLoader(gl);
  console.log(geometries);

  let program = webglUtils.createProgramFromSources(gl, [loader_VS, loader_FS]);
  gl.useProgram(program);

  let positionLocation = gl.getAttribLocation(program, "a_position");
  let vertexColorLocation = gl.getAttribLocation(program, "a_color");
  let normalLocation = gl.getAttribLocation(program, "a_normal");
  let texCordinateLocation = gl.getAttribLocation(program, "a_texCord");
  let tangentLocation = gl.getAttribLocation(program, "a_tangent");
  let biTangentLocation = gl.getAttribLocation(program, "a_bitangent");

  let modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
  let viewProjectionLocation = gl.getUniformLocation(program, "u_vpMatrix");
  let scaleLocation = gl.getUniformLocation(program, "u_scale");
  let normalMatrixLocation = gl.getUniformLocation(program, "u_worldNormal");
  let cameraLocation = gl.getUniformLocation(program, "u_cameraWorld");
  let lightLocation = gl.getUniformLocation(program, "u_lightDirection");
  let ambientLocation = gl.getUniformLocation(program, "ambient");
  let diffuseLocation = gl.getUniformLocation(program, "diffuse");
  let specularLocation = gl.getUniformLocation(program, "specular");
  let emmisiveLocation = gl.getUniformLocation(program, "emmisive");
  let shininessLocation = gl.getUniformLocation(program, "shininess");
  let opacityLocation = gl.getUniformLocation(program, "opacity");

  let diffuseSamplerLocation = gl.getUniformLocation(program, "diffuseSampler");
  let normalSamplerLocation = gl.getUniformLocation(program, "normalSampler");
  let specularSamplerLocation = gl.getUniformLocation(
    program,
    "specularSampler"
  );

  let hasNormalLocation = gl.getUniformLocation(program, "hasNormal");

  let ambientlightLocation = gl.getUniformLocation(program, "u_ambientLight");

  // find the range and extend of an object to calculate the offset to properly view the object

  let { min: minValue, max: maxValue } = minMax;
  const range = m4.subtractVectors(maxValue, minValue);
  const maxSideLength = m4.length(range);
  const offSet = m4.scaleVector(
    m4.addVectors(minValue, m4.scaleVector(range, 0.5)),
    -1.0
  );

  // -----------------------------------------------
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  let cameraAngle = 0.0;
  let modelAngle = 0.0;
  let distanceScale = 0.1;

  let bufferLists = geometries.map((geometry, index) => {
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let localPosition = geometry.attributes.position;

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([...localPosition]),
      gl.STATIC_DRAW
    );

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let vColor = geometry.attributes.colorValue;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vColor), gl.STATIC_DRAW);

    let normalData = geometry.attributes.normalCord;
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(normalData),
      gl.STATIC_DRAW
    );

    let textureCord = geometry.attributes.textCord;
    let textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCord),
      gl.STATIC_DRAW
    );

    let tangentVector = geometry.tangents;
    let tangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(tangentVector),
      gl.STATIC_DRAW
    );

    let biTangent = geometry.biTangent;
    let biTangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, biTangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(biTangent), gl.STATIC_DRAW);

    let material = geometry.material;
    return {
      positionBuffer,
      colorBuffer,
      normalBuffer,
      textureBuffer,
      tangentBuffer,
      biTangentBuffer,
      length: localPosition.length,
      material: materials[material],
    };
  });

  gl.uniform3fv(lightLocation, [10.0, 10.0, 50.0]);
  gl.uniform3fv(ambientlightLocation, [0.2, 0.2, 0.2]);
  gl.uniform1i(hasNormalLocation, 0);

  function draw() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.clearColor(0.1, 0.1, 0.1, 0.3);

    modelAngle += 0.005;
    let modelMatrix = m4.yRotation(modelAngle);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    let normalInverseMatrix = m4.inverse(modelMatrix);
    gl.uniformMatrix4fv(normalMatrixLocation, true, normalInverseMatrix);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let fov = (Math.PI / 180) * 60;
    let projectionMatrix = m4.perspective(fov, aspect, 0.1, 1000);

    gl.uniform1f(scaleLocation, 0.5);

    cameraAngle += 0.0;
    let cameraMatrix = m4.yRotation(cameraAngle);
    cameraMatrix = m4.translate(
      cameraMatrix,
      0.0,
      0.0,
      maxSideLength * distanceScale
    );
    let cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
    // cameraMatrix = m4.lookAt(cameraPosition, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    viewMatrix = m4.inverse(cameraMatrix);

    gl.uniform3fv(cameraLocation, cameraPosition);

    let vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);

    bufferLists.forEach(
      (
        {
          positionBuffer,
          colorBuffer,
          normalBuffer,
          textureBuffer,
          tangentBuffer,
          biTangentBuffer,
          material,
          length,
        },
        index
      ) => {
        const {
          ambient = [1.0, 1.0, 1.0],
          diffuse = [0.8, 0.87, 0.8],
          opticalDensity = 1.0,
          specular = [0.0, 0.0, 0.0],
          emmisive = [0.0, 0.0, 0.0],
          shininess = 1.0,
          opacity = 1.0,
        } = material;

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.enableVertexAttribArray(vertexColorLocation);
        gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.enableVertexAttribArray(texCordinateLocation);
        gl.vertexAttribPointer(texCordinateLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
        gl.enableVertexAttribArray(tangentLocation);
        gl.vertexAttribPointer(tangentLocation, 3, gl.FLOAT, false, 0, 0);

        // gl.bindBuffer(gl.ARRAY_BUFFER, biTangentBuffer);
        // gl.enableVertexAttribArray(biTangentLocation);
        // gl.vertexAttribPointer(biTangentLocation, 3, gl.FLOAT, false, 0, 0);

        // material value
        gl.uniform3fv(ambientLocation, ambient);
        gl.uniform3fv(diffuseLocation, diffuse);
        // gl.uniform3fv(ambientLocation, opticalDensity);
        gl.uniform3fv(specularLocation, specular);
        gl.uniform3fv(emmisiveLocation, emmisive);
        gl.uniform1f(opacityLocation, parseFloat(opacity));
        gl.uniform1f(shininessLocation, shininess);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, material.normalMap);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, material.diffuseMap);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, material.specularMap);

        // texture mapping
        gl.uniform1i(normalSamplerLocation, 0);
        gl.uniform1i(diffuseSamplerLocation, 1);
        gl.uniform1i(specularSamplerLocation, 2);

        gl.drawArrays(gl.TRIANGLES, 0, length / 3);
      }
    );
    window.requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
})();
