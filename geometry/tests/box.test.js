import BoxGeometry from '../src/box';

test('initializing BoxGeometry creates 8 vertices with center on origin', () => {
    for (let i = 0; i < testNumbers; i++) { 
        expect(boxGeometriesToTest()[i].vertices).toEqual(verticesForBoxGeometriesToTest()[i]);
    }
});

test('BoxGeometry always have 12 triangles indices for 6 sides of box', () => {
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
    for (let i = 0; i < testNumbers; i++) { 
        expect(boxGeometriesToTest()[i].indices).toEqual(expectedIndices);
    }
});

const testNumbers = boxGeometriesToTest().length;

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