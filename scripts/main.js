`use strict`;

const cubePosition = [
  1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0,
  0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0,
];
const up = [0, 1, 0];

const vs = `#version 300 es
    in vec3 a_position;
    in float a_textureCordinate;
    
    uniform mat4 u_wvProjectionMatrix;

    void main(){
        gl_Position =  u_wvProjectionMatrix* vec4(a_position, 1.0);
       
    }
`;

const fs = `#version 300 es
        precision highp float;

        out vec4 outColor;

        void main(){
            outColor = vec4(0.0, 0.8, 0.0, 0.8);
        }

`;

(function () {
  const canvas = document.querySelector("#main-canvas");
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    console.log("webgl2 not found");
    return;
  }

  let program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  let positionLocation = gl.getAttribLocation(program, "a_position");
  let viewProjectionLocation = gl.getUniformLocation(
    program,
    "u_wvProjectionMatrix"
  );

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cubePosition),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  function degToRadian(deg) {
    return (Math.PI / 180) * deg;
  }

  function radToDegree(rad) {
    return (180 / Math.PI) * rad;
  }

  function initialCameraSetup(cameraPosition, up) {
    let cameraMatrix = m4.lookAt(cameraPosition, [1, 0, 0], up);
    return cameraMatrix;
  }

  let cameraRadian = degToRadian(0);
  let cameraMatrix = m4.yRotation(cameraRadian);
  cameraMatrix = m4.translate(cameraMatrix, 0.5, 0.5, 1.5);

  cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
  cameraPosition = [0.5, -1.0, 1.5];
  cameraMatrix = initialCameraSetup(cameraPosition, up);
  viewMatrix = m4.inverse(cameraMatrix);

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

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let fieldofView = degToRadian(60);
    let projectionMatrix = m4.perspective(fieldofView, aspect, 0.01, 1000);

    let vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, cubePosition.length / 3);
  }

  drawScene();
})();
