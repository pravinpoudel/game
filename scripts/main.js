`use strict`;

const cubePosition = [
  1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0,
  0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0,
];
const up = [0, 1, 0];

const vs = `#version 300 es
    in vec3 a_position;
    in float a_textureCordinate;
    
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_wvProjectionMatrix;

    out vec3 vertexCordinate;

    void main(){
        // gl_Position =  u_wvProjectionMatrix* vec4((2.0*a_position)- vec3(1.0, 1.0, 1.0), 1.0);  
        gl_Position =  u_wvProjectionMatrix* u_ModelMatrix* vec4(a_position, 1.0);
        //gl_Position =  u_wvProjectionMatrix* vec4(a_position, 1.0);
        vertexCordinate = a_position;   
    }
`;

const fs = `#version 300 es

    #define M_PI 3.1415926535897932384626433832795

    precision mediump float;

    in vec3 vertexCordinate;
    uniform sampler2D u_sphereText;

    out vec4 outColor;

    void main(){
     
        //  generation of UV cordinate
        vec3 vertDirection = normalize(vertexCordinate - vec3(0.0, 0.0, 0.0));
        float u = atan(vertDirection.x, vertDirection.z)/(2.0*M_PI) + 0.5;
        float v = 0.5-vertDirection.y ;
    
        outColor = texture(u_sphereText, vec2(u,v));
        // outColor = vec4(1.0, 0.8,  0.0, 1.0);
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
  let sphereTextLocation = gl.getUniformLocation(program, "u_sphereText");
  let viewProjectionLocation = gl.getUniformLocation(
    program,
    "u_wvProjectionMatrix"
  );
  let modelMatrixLocation = gl.getUniformLocation(program, "u_ModelMatrix");

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const sphere = sphereVertIndices();

  let positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([...sphere[0]]),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  let ballTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, ballTexture);

  const level = 0;
  const internallFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internallFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  let ballImage = new Image();
  ballImage.crossOrigin = "";
  ballImage.src = "http://localhost/game/images/texture/ball.jpg";

  ballImage.onload = function () {
    console.log("i am loaded");
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internallFormat,
      srcFormat,
      srcType,
      ballImage
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  };

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
  let modelDegree = 0;

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
    gl.uniform1i(sphereTextLocation, 1);

    // cameraDegree += 0.4;
    modelDegree += 0.2;
    let modelRadian = degToRadian(modelDegree);
    let cameraRadian = degToRadian(cameraDegree);

    // -------------------------------------------------------------------
    let modelMatrix = m4.yRotation(modelRadian);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
    // --------------------------------------------------------------------

    let cameraMatrix = m4.yRotation(cameraRadian);

    cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, 0.0);

    cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
    // cameraPosition = [0.0, 1.0, 1.5];
    cameraMatrix = initialCameraSetup(cameraPosition, up);
    viewMatrix = m4.inverse(cameraMatrix);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let fieldofView = degToRadian(90);
    let projectionMatrix = m4.perspective(fieldofView, aspect, 0.01, 1000);

    let indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([...sphere[1]]),
      gl.STATIC_DRAW
    );

    let vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
    gl.drawElements(gl.TRIANGLES, sphere[1].length, gl.UNSIGNED_SHORT, 0);
    window.requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
})();
