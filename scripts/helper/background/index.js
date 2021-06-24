(function () {
  let background = document.getElementById("background-canvas");
  console.log(background);
  let gl_back = background.getContext("2d");
  const cwidth = background.width;
  const cheight = background.height;

  // gradient = gl_back.createRadialGradient(0, 0, cwidth, cheight);
  // gradient.addColorStop(0, "rgb(0, 0, 0)");
  // gradient.addColorStop(0.5, "rgb(128, 128, 128)");
  // gradient.addColorStop(1, "rgb(0, 0, 0)");

  var grd = gl_back.createRadialGradient(75, 50, 5, 200, 60, 200);
  grd.addColorStop(0, "black");
  grd.addColorStop(1, "#333333");

  background.style.backgroundColor = "black";

  gl_back.beginPath();
  gl_back.rect(0, 0, cwidth, cheight);
  gl_back.fillStyle = grd;
  gl_back.fill();
})();
