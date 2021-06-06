import PlaneGeometry from '../src/plane';

test('initializing PlaneGeometry creates vertices with center on origin', () => {
    const planeGeometries = planeGeometriesToTest();
    const expectedVertices = verticesForPlaneGeometriesToTest()
    for (let i = 0; i < planeGeometries.length; i++) { 
        expect(planeGeometries[i].vertices).toEqual(expectedVertices[i]);
    }
});

test('PlaneGeometry always have 2 triangles indices to form a plane', () => {
    const planeGeometries = planeGeometriesToTest();
    const expectedIndices = [
        0, 1, 2,
        0, 3, 2,
    ];
    for (let i = 0; i < planeGeometries.length; i++) { 
        expect(planeGeometries[i].indices).toEqual(expectedIndices);
    }
});

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
            -50, -5, 0,
            50, -5, 0,
            50, 5, 0,
            -50, 5, 0,
        ],
    ];
}