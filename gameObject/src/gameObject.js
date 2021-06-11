export default class GameObject {
    constructor(geometry = null) {
        this.geometry = geometry
        this.position = {
            x: 0,
            y: 0,
            z: 0,
        }
        this.scale = {
            x: 0,
            y: 0,
            z: 0,
        }
        this.angle = {
            x: 0,
            y: 0,
            z: 0,
        }
    }
}