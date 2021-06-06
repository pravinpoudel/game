export default class CircleGeometry {
    constructor(radius) {
        let vertices = [];
        let indices = [];

        let divisions = 3

        for (let i = 0; i <= divisions; ++i){
          let phi = i/divisions * Math.PI;
      
          for (let j = 0; j <= divisions; ++j){
              let theta = j/divisions * Math.PI * 2;
      
              let x = Math.cos(theta) *  Math.sin (phi) * radius;
              let y = Math.cos (phi) * radius;
              let z = Math.sin (theta) *  Math.sin (phi) * radius;
      
              vertices.push (x, y, z);
          }
      }
      
      for (let i = 0; i < divisions * divisions + divisions; ++i){
      
          indices.push (i);
          indices.push (i + divisions + 1);
          indices.push (i + divisions);
      
          indices.push (i + divisions + 1);
          indices.push (i);
          indices.push (i + 1);
      }
    }
}