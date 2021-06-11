export default class GameObject {
    constructor(geometry = null) {
        this.geometry = geometry
        this.position = {
            x: 0,
            y: 0,
            z: 0,
        }
        this.scale = {
            x: 1,
            y: 1,
            z: 1,
        }
        this.angle = {
            x: 0,
            y: 0,
            z: 0,
        }
    }

    moveBy(x, y, z) {
        this.position.x += x
        this.position.y += y
        this.position.z += z
    }

    scaleBy(scale) {
        this.scale.x *= scale
        this.scale.y *= scale
        this.scale.z *= scale
    }

    rotateBy(angle, x, y, z) {
        this.angle.x += angle * x
        this.angle.y += angle * y
        this.angle.z += angle * z
    }
}