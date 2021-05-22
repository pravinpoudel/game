(function () {
  let canvas = document.getElementById("main-canvas");
  let toggleButton = document.getElementById("toggle-button");
  const rotateHandler = (e) => {
    let keyPressed = e.keyCode;
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
        console.log(`${keyPressed} clicked`);
    }
  };

  const viewToggle = (e) => {
    if(cameraYposition == 0.0){
      cameraYposition = 2.5
      return
    }
    cameraYposition = 0.0;
  };

  window.addEventListener("keydown", rotateHandler);
  toggleButton.addEventListener("click", viewToggle);
})();
