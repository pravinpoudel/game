export default class ConeGeometry {
    constructor(radius, height) {
        let verticesCount = 16;
        let alpha = (2 * Math.PI) / verticesCount;
        let vertices = [];
        let indices = [];

        for (var i = 0; i < verticesCount; i++) {
            let x = radius * Math.cos(i * alpha);
            let z = radius * Math.sin(i * alpha);
            vertices.push(x, -height/2, z);
        }
        vertices.push(0, height/2, 0)

        for (var i = 2; i < verticesCount; i++) {
            indices.push(0, i-1, i);
            indices.push(i-2, i-1, verticesCount);
        }
        indices.push(verticesCount-2,verticesCount-1,verticesCount);
        indices.push(verticesCount-1,0,verticesCount);
    }
}