export default class CylinderGeometry {
    constructor(radius, height) {
        let verticesCount = 16;
        let alpha = (2 * Math.PI) / verticesCount;
        let vertices = [];
        let indices = [];

        for (var i = 0; i < verticesCount; i++) {
            let x = radius * Math.cos(i * alpha);
            let z = radius * Math.sin(i * alpha);
            vertices.push(x, height/2, z);
            vertices.push(x, -height/2, z);
        }


        for (var i = 5; i < verticesCount*2; i += 2) {
            indices.push(0, i-3, i-1);
            indices.push(1, i-2, i);

            indices.push(i-5, i-4, i-3);
            indices.push(i-4, i-3, i-2);
        }
        indices.push((verticesCount*2)-2, (verticesCount*2)-1, 0);
        indices.push((verticesCount*2)-1, 0, 1);

        indices.push((verticesCount*2)-4, (verticesCount*2)-3, (verticesCount*2)-2);
        indices.push((verticesCount*2)-4, (verticesCount*2)-2, (verticesCount*2)-1);
    }
}