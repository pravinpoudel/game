(async function () {
  const canvas = document.getElementById("main-canvas");
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    console.log("context couldnot be generated");
    return;
  }

  let program = webglUtils.createProgramFromSources(gl, [loader_VS, loader_FS]);
  gl.useProgram(program);

  let positionLocation = gl.getAttribLocation(program, "a_position");
  let vertexColorLocation = gl.getAttribLocation(program, "a_color");
  let modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
  let viewProjectionLocation = gl.getUniformLocation(program, "u_vpMatrix");
  let scaleLocation = gl.getUniformLocation(program, "u_scale");

  // find the range and extend of an object to calculate the offset to properly view the object

  let { geometries, material, minMax } = await objFileLoader();
  console.log(material)
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
  let distanceScale = 1.0;

  let bufferLists = geometries.map((geometry) => {
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

    return {
      positionBuffer,
      colorBuffer,
      length: localPosition.length,
    };
  });

  let cameraMatrix = m4.yRotation(cameraAngle);
  cameraMatrix = m4.translate(
    cameraMatrix,
    0.0,
    0.0,
    maxSideLength * distanceScale
  );
  cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
  cameraMatrix = m4.lookAt(cameraPosition, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
  viewMatrix = m4.inverse(cameraMatrix);

  function draw() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.5, 0.5, 0.5, 0.5);

    modelAngle += 0.01;
    let modelMatrix = m4.yRotation(modelAngle);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let fov = (Math.PI / 180) * 60;
    let projectionMatrix = m4.perspective(fov, aspect, 0.1, 1000);

    gl.uniform1f(scaleLocation, 0.5);

    let vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);

    bufferLists.forEach(({ positionBuffer, colorBuffer, length }) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.enableVertexAttribArray(vertexColorLocation);
      gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, length / 3);
    });
    window.requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);
})();
