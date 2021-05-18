const numbLatitude = 100;
const numbLongitude = 100;
const radius = 1;
const vertices = [];
const indices = [];

function sphereVertIndices() {
    
  let index = 0;

  for (let i = 0; i < numbLatitude; i++) {
    theta = (i*(2.0*Math.PI)/numbLatitude);
   
    let sintheta = Math.sin(theta);
    let costheta = Math.cos(theta); 

    for (let j = 0; j < numbLongitude; j++) {
        let phi = (j*(2.0*Math.PI)/numbLongitude);
        let sinphi = Math.sin(phi);
        let cosinephi = Math.cos(phi);

        let x = (radius*sintheta*cosinephi);
        let y = (radius*costheta);
        let z = (radius*sintheta*sinphi);

        vertices[index++] = x;
        vertices[index++] = y;
        vertices[index++] = z;
    }
  }
  
  index = 0;
  for (let i = 0; i < numbLatitude; i++) {
    for (let j = 0; j < numbLongitude; j++) {

        let p0 = i*(numbLongitude+1)+j; //remember not j+1;
        let p1 = p0+ numbLongitude+1; //dont forget to add 1;

        indices[index++] = p0;
        indices[index++] = p1;
        indices[index++] = p0 + 1;

        indices[index++] = p1;
        indices[index++] = p1 + 1;
        indices[index++] = p0 + 1;
    }
  }
    return [vertices, indices];
}
