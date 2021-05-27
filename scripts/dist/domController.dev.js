"use strict";

(function () {
  var canvas = document.getElementById("main-canvas");
  var toggleButton = document.getElementById("toggle-button");

  var rotateHandler = function rotateHandler(e) {
    var keyPressed = e.keyCode;

    switch (keyPressed) {
      case 68:
        modelTranslation[0] += 0.2;
        break;

      case 65:
        modelTranslation[0] -= 0.2;
        break;

      case 39:
        modelDegree -= 1.0;
        break;

      case 37:
        modelDegree += 1.0;
        break;

      default:
        console.log("".concat(keyPressed, " clicked"));
    }
  };

  var viewToggle = function viewToggle(e) {
    if (cameraYposition == 0.0) {
      cameraYposition = 2.5;
      return;
    }

    cameraYposition = 0.0;
  };

  window.addEventListener("keydown", rotateHandler);
  toggleButton.addEventListener("click", viewToggle);
})();
//# sourceMappingURL=domController.dev.js.map
