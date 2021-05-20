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

    out vec4 fragmentColor;

    void main(){
        // gl_Position =  u_wvProjectionMatrix* vec4((2.0*a_position)- vec3(1.0, 1.0, 1.0), 1.0);
        gl_Position =  u_wvProjectionMatrix* vec4(a_position, 1.0);
 
        fragmentColor = gl_Position;   
    }
`;

const fs = `#version 300 es
        precision highp float;

        in vec4 fragmentColor;

        out vec4 outColor;

        void main(){
            // outColor = fragmentColor;
            outColor = vec4(1.0, 0.0, 0.5, 1.0);
        }

`;

(function () {
  const canvas = document.querySelector("#main-canvas");
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    console.log("webgl2 not found");
    return;
  }

  var ext = gl.getExtension("OES_element_index_uint");

  let program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  let positionLocation = gl.getAttribLocation(program, "a_position");
  let viewProjectionLocation = gl.getUniformLocation(
    program,
    "u_wvProjectionMatrix"
  );

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const sphere = sphereVertIndices();

  let positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint16Array([...sphere[0]]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  // let ballTexture = gl.createTexture();
  // gl.bindTexture(gl.TEXTURE_2D, ballTexture);
  // gl.textImage2D(gl.TEXTURE_2D, 0, gl.RGBA);
  // put color as a texture at first
  // load an image as a texture

  // revolve an object around x axis

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

  let cameraDegree = 0;

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
    let cameraRadian = degToRadian(cameraDegree);
    let cameraMatrix = m4.yRotation(cameraRadian);
    cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, 1.5);

    cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
    // cameraPosition = [0.5, 2.0, 1.5];
    cameraMatrix = initialCameraSetup(cameraPosition, up);
    viewMatrix = m4.inverse(cameraMatrix);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let fieldofView = degToRadian(60);
    let projectionMatrix = m4.perspective(fieldofView, aspect, 0.01, 1000);

    let indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint32Array([...sphere[1]]),
      gl.STATIC_DRAW
    );

    let vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
    gl.drawElements(gl.TRIANGLES, sphere[1].length, gl.UNSIGNED_INT, 0);
    window.requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
})();
