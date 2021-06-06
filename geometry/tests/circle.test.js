import CircleGeometry from '../src/circle';

test('initializing CircleGeometry creates 16 vertices with center on origin', () => {
    const expectedVertices = [
        1, 0, 0,
        0.9238795325112867, 0.3826834323650898, 0,
        0.7071067811865476, 0.7071067811865475, 0,
        0.38268343236508984, 0.9238795325112867, 0,
        6.123233995736766e-17, 1, 0,
        -0.3826834323650897,0.9238795325112867, 0,
        -0.7071067811865475, 0.7071067811865476, 0,
        -0.9238795325112867, 0.3826834323650899, 0,
        -1, 1.2246467991473532e-16, 0,
        -0.9238795325112868, -0.38268343236508967, 0,
        -0.7071067811865477, -0.7071067811865475, 0,
        -0.38268343236509034, -0.9238795325112865, 0,
        -1.8369701987210297e-16, -1, 0,
        0.38268343236509, -0.9238795325112866, 0,
        0.7071067811865474, -0.7071067811865477, 0,
        0.9238795325112865, -0.3826834323650904, 0,
    ];

    const circle = new CircleGeometry(1)
    expect(circle.vertices).toEqual(expectedVertices);
});

test('initializing CircleGeometry creates 16 vertices with center on origin', () => {
    const expectedIndices = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 6,
        0, 6, 7,
        0, 7, 8,
        0, 8, 9,
        0, 9, 10,
        0, 10, 11,
        0, 11, 12,
        0, 12, 13,
        0, 13, 14,
        0, 14, 15,
    ];

    const circle = new CircleGeometry(1)
    expect(circle.indices).toEqual(expectedIndices);
});