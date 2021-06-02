export default class PlaneGeometry {
    constructor(length, width) {
        let x = width/2;
        let y = length/2;
        this.vertices = [
            -x, -y, 0,
            x, -y, 0,
            x, y, 0,
            -x, y, 0,
        ];
        this.indices = [
            0, 1, 2,
            0, 3, 2,
        ];
    }
}


