"use strict";

function degToRadian(deg) {
  return Math.PI / 180 * deg;
}

function radToDegree(rad) {
  return 180 / Math.PI * rad;
}

function initialCameraSetup(cameraPosition, up) {
  var cameraMatrix = m4.lookAt(cameraPosition, [1, 0, 0], up);
  return cameraMatrix;
}
//# sourceMappingURL=helper.dev.js.map
