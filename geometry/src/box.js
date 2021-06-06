export default class BoxGeometry {
    constructor(length, width, depth) {
        let x = width/2;
        let y = length/2;
        let z = depth/2;
        this.vertices = [
            -x, -y, -z,
            x, -y, -z,
            x, y, -z,
            -x, y, -z,
            -x, -y, z,
            x, -y, z,
            x, y, z,
            -x, y, z,
        ];
        this.indices = [
            // front
            0, 1, 2,
            0, 3, 2,
            // right
            1, 5, 6,
            1, 2, 6,
            //back
            5, 4, 7, 
            5, 6, 7,
            //left
            4, 0, 3,
            4, 7, 3,
            //top
            3, 2, 6,
            3, 7, 6,
            //bottom
            1, 5, 4,
            1, 0, 4,
        ];
    }
}


