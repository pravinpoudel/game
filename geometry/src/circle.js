export default class CircleGeometry {
    constructor(radius) {
        let verticesCount = 16;
        let angle = (2 * Math.PI) / verticesCount;
        this.vertices = [];
        this.indices = [];

        for (var i = 0; i < verticesCount; i++) {
            let x = radius * Math.cos(i * angle);
            let y = radius * Math.sin(i * angle);
            this.vertices.push(x, y, 0);
        }

        for (var i = 2; i < verticesCount; i++) {
            this.indices.push(0, i-1, i);
        }
    }
}