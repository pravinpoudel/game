"use strict";

var numbLatitude = 50;
var numbLongitude = 50;
var radius = 0.5;
var vertices = [];
var indices = [];

function sphereVertIndices() {
  var index = 0;

  for (var i = 0; i <= numbLatitude; i++) {
    theta = i * Math.PI / numbLatitude;
    var sintheta = Math.sin(theta);
    var costheta = Math.cos(theta);

    for (var j = 0; j <= numbLongitude; j++) {
      var phi = j * (2.0 * Math.PI) / numbLongitude;
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

  console.log("index1 is ".concat(index));
  index = 0;

  for (var _i = 0, _x = vertices.length; _i <= numbLatitude; _i++) {
    for (var _j = 0; _j <= numbLongitude; _j++) {
      var p0 = _i * (numbLongitude + 1) + _j; //remember not j+1;

      var p1 = p0 + numbLongitude + 1; //dont forget to add 1;

      indices[index++] = p0;
      indices[index++] = p1;
      indices[index++] = p0 + 1;
      indices[index++] = p1;
      indices[index++] = p1 + 1;
      indices[index++] = p0 + 1;
    }
  }

  console.log("index2 is ".concat(index));
  return [vertices, indices];
}
//# sourceMappingURL=sphere.dev.js.map
