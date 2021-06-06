import BoxGeometry from '../src/box';

test('initializing BoxGeometry creates 8 vertices with center on origin', () => {
    const boxGeometries = boxGeometriesToTest();
    const expectedVertices = verticesForBoxGeometriesToTest()
    for (let i = 0; i < boxGeometries.length; i++) { 
        expect(boxGeometries[i].vertices).toEqual(expectedVertices[i]);
    }
});

test('BoxGeometry always have 12 triangles indices for 6 sides of box', () => {
    const boxGeometries = boxGeometriesToTest();
    const expectedIndices = [
        0, 1, 2,
        0, 3, 2,
        1, 5, 6,
        1, 2, 6,
        5, 4, 7, 
        5, 6, 7,
        4, 0, 3,
        4, 7, 3,
        3, 2, 6,
        3, 7, 6,
        1, 5, 4,
        1, 0, 4,
    ];
    for (let i = 0; i < boxGeometries.length; i++) { 
        expect(boxGeometries[i].indices).toEqual(expectedIndices);
    }
});

function boxGeometriesToTest() {
    return [
        new BoxGeometry(1,1,1),
        new BoxGeometry(2,1,1),
        new BoxGeometry(1,2,1),
        new BoxGeometry(0.1,0.1,0.1),
        new BoxGeometry(10,100,1000),
    ];
}

function verticesForBoxGeometriesToTest() {
    return [
        [
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
        ],
        [
            -0.5, -1, -0.5,
            0.5, -1, -0.5,
            0.5, 1, -0.5,
            -0.5, 1, -0.5,
            -0.5, -1, 0.5,
            0.5, -1, 0.5,
            0.5, 1, 0.5,
            -0.5, 1, 0.5,
        ],
        [
            -1, -0.5, -0.5,
            1, -0.5, -0.5,
            1, 0.5, -0.5,
            -1, 0.5, -0.5,
            -1, -0.5, 0.5,
            1, -0.5, 0.5,
            1, 0.5, 0.5,
            -1, 0.5, 0.5,
        ],
        [
            -0.05, -0.05, -0.05,
            0.05, -0.05, -0.05,
            0.05, 0.05, -0.05,
            -0.05, 0.05, -0.05,
            -0.05, -0.05, 0.05,
            0.05, -0.05, 0.05,
            0.05, 0.05, 0.05,
            -0.05, 0.05, 0.05,
        ],
        [
            -50, -5, -500,
            50, -5, -500,
            50, 5, -500,
            -50, 5, -500,
            -50, -5, 500,
            50, -5, 500,
            50, 5, 500,
            -50, 5, 500,
        ],
    ];
}