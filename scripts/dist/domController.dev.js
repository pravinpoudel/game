"use strict";

(function () {
  var canvas = document.getElementById("main-canvas");
  var toggleButton = document.getElementById("toggle-button");

  var rotateHandler = function rotateHandler(e) {
    var keyPressed = e.keyCode;

    switch (keyPressed) {
      case 68:
      case 39:
        modelDegree -= 1.0;
        break;

      case 65:
      case 37:
        modelDegree += 1.0;
        break;

      default:
        console.log("".concat(keyPressed, " clicked"));
    }
  };

  var viewToggle = function viewToggle(e) {
    console.log("clicked");
  };

  window.addEventListener("keydown", rotateHandler); // toggleButton.addEventListener("onclick", viewToogle);
})();
//# sourceMappingURL=domController.dev.js.map
