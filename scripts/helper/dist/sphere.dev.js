"use strict";

var numbLatitude = 100;
var numbLongitude = 100;
var radius = 0.5;
var vertices = [];
var indices = [];

function sphereVertIndices() {
  var index = 0;
  var u, v;

  for (var _i = 0; _i <= numbLatitude; _i++) {
    theta = _i * Math.PI / numbLatitude;
    var sintheta = Math.sin(theta);
    var costheta = Math.cos(theta);

    for (var _j = 0; _j <= numbLongitude; _j++) {
      var phi = _j * (2.0 * Math.PI) / numbLongitude;
      var sinphi = Math.sin(phi);
      var cosinephi = Math.cos(phi);
      var x = radius * sintheta * cosinephi;
      var y = radius * costheta;
      var z = radius * sintheta * sinphi;
      vertices[index++] = x;
      vertices[index++] = y;
      vertices[index++] = z;
    }
  }

  console.log("index count1 is ".concat(index));
  index = 0;
  var p0, p1, i, j;

  for (i = 0; i <= numbLatitude - 2; i++) {
    for (j = 0; j <= numbLongitude; j++) {
      p0 = i * (numbLongitude + 1) + j; //remember not j+1;

      p1 = p0 + numbLongitude + 1; //dont forget to add 1;

      indices[index++] = p0;
      indices[index++] = p1;
      indices[index++] = p0 + 1;
      indices[index++] = p1;
      indices[index++] = p1 + 1;
      indices[index++] = p0 + 1;
    }
  }

  for (j = 0; j < numbLongitude; j++) {
    p0 = i * (numbLongitude + 1) + j;
    p1 = p0 + numbLongitude + 1;
    indices[index++] = p0;
    indices[index++] = p1;
    indices[index++] = p0 + 1;
  }

  console.log(p0, p1);
  console.log("index count2 is ".concat(index));
  return [vertices, indices];
}
//# sourceMappingURL=sphere.dev.js.map
