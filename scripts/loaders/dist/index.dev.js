"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

(function _callee() {
  var canvas, gl, program, positionLocation, modelMatrixLocation, viewProjectionLocation, scaleLocation, _ref, geometries, minMax, minValue, maxValue, range, maxSideLength, offSet, vao, cameraAngle, modelAngle, distanceScale, cameraMatrix, draw;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          draw = function _ref2() {
            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.clearColor(0.5, 0.5, 0.5, 0.5);
            modelAngle += 0.1;
            var modelMatrix = m4.yRotation(cameraAngle);
            gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            var fov = Math.PI / 180 * 60;
            var projectionMatrix = m4.perspective(fov, aspect, 0.1, 1000);
            gl.uniform1f(scaleLocation, 0.5);
            var vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
            gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
            var positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            geometries.forEach(function (geometry) {
              var localPosition = geometry.attributes.position;
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_toConsumableArray(localPosition)), gl.STATIC_DRAW);
              gl.enableVertexAttribArray(positionLocation);
              gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
              gl.drawArrays(gl.TRIANGLES, 0, localPosition.length / 3);
              window.requestAnimationFrame(draw);
            });
          };

          canvas = document.getElementById("main-canvas");
          gl = canvas.getContext("webgl2");

          if (gl) {
            _context.next = 6;
            break;
          }

          console.log("context couldnot be generated");
          return _context.abrupt("return");

        case 6:
          program = webglUtils.createProgramFromSources(gl, [loader_VS, loader_FS]);
          gl.useProgram(program);
          positionLocation = gl.getAttribLocation(program, "a_position");
          modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
          viewProjectionLocation = gl.getUniformLocation(program, "u_vpMatrix");
          scaleLocation = gl.getUniformLocation(program, "u_scale"); // find the range and extend of an object to calculate the offset to properly view the object

          _context.next = 14;
          return regeneratorRuntime.awrap(objLoader());

        case 14:
          _ref = _context.sent;
          geometries = _ref.geometries;
          minMax = _ref.minMax;
          minValue = minMax.min, maxValue = minMax.max;
          range = m4.subtractVectors(maxValue, minValue);
          maxSideLength = m4.length(range);
          console.log(maxSideLength);
          offSet = m4.scaleVector(m4.addVectors(minValue, m4.scaleVector(range, 0.5)), -1.0); // -----------------------------------------------

          vao = gl.createVertexArray();
          gl.bindVertexArray(vao);
          cameraAngle = 0.0;
          modelAngle = 0.0;
          distanceScale = 1.3;
          cameraMatrix = m4.yRotation(cameraAngle);
          cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, maxSideLength * distanceScale);
          cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
          cameraMatrix = m4.lookAt(cameraPosition, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
          viewMatrix = m4.inverse(cameraMatrix);
          window.requestAnimationFrame(draw);

        case 33:
        case "end":
          return _context.stop();
      }
    }
  });
})();
//# sourceMappingURL=index.dev.js.map
