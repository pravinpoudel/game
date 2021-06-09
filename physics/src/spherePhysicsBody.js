export default class BoxPhysicsBody {
    constructor(radius) {
        this.radius = radius
    }

    collisionParameter() {
        return {
            x: 0,
            y: 0,
            z: 0,
            radius: this.radius,
        }
    }
}