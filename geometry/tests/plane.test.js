import PlaneGeometry from '../src/plane';

test('initializing PlaneGeometry creates vertices with center on origin', () => {
    for (let i = 0; i < testNumbers; i++) { 
        expect(planeGeometriesToTest[i].vertices).toEqual(verticesForPlaneGeometriesToTest[i]);
    }
});

test('PlaneGeometry always have 2 triangles indices to form a plane', () => {
    const expectedIndices = [
        0, 1, 2,
        0, 3, 2,
    ];
    for (let i = 0; i < testNumbers; i++) { 
        expect(planeGeometriesToTest[i].vertices).toEqual(expectedIndices);
    }
});

const testNumbers = planeGeometriesToTest.length;

function planeGeometriesToTest() {
    return [
        new PlaneGeometry(1,1),
        new PlaneGeometry(2,1),
        new PlaneGeometry(1,2),
        new PlaneGeometry(0.1,0.1),
        new PlaneGeometry(10,100),
    ];
}

function verticesForPlaneGeometriesToTest() {
    return [
        [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0,
            -0.5, 0.5, 0,
        ],
        [
            -0.5, -1, 0,
            0.5, -1, 0,
            0.5, 1, 0,
            -0.5, 1, 0,
        ],
        [
            -1, -0.5, 0,
            1, -0.5, 0,
            1, 0.5, 0,
            -1, 0.5, 0,
        ],
        [
            -0.05, -0.05, 0,
            0.05, -0.05, 0,
            0.05, 0.05, 0,
            -0.05, 0.05, 0,
        ],
        [
            -5, -50, 0,
            5, -50, 0,
            5, 50, 0,
            -5, 50, 0,
        ],
    ];
}