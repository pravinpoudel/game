export default class BoxPhysicsBody {
    constructor(length, height, depth) {
        this.length = length;
        this.height = height;
        this.depth = depth;
    }

    collisionParameter() {
        return {
            minX: -this.length/2,
            maxX: this.length/2,
            minY: -this.height/2,
            maxY: this.height/2,
            minZ: -this.depth/2,
            maxZ: this.depth/2,
        }
    }
}