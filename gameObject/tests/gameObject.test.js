import GameObject from '../src/gameObject'

test('GameObject has initial position, scale and angle at 0,0,0', () => {
    let expectedPosition = {x: 0, y: 0, z:0}
    let expectedScale = {x: 0, y: 0, z:0}
    let expectedAngle = {x: 0, y: 0, z:0}
    expect(new GameObject().position).toEqual(expectedPosition);
    expect(new GameObject().scale).toEqual(expectedScale);
    expect(new GameObject().angle).toEqual(expectedAngle);
});