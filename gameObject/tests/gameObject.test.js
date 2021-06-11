import GameObject from '../src/gameObject'
import BoxGeometry from '../../geometry/src/box'

test('GameObject has initial position and angle at 0,0,0 and scale at 1,1,1', () => {
    let expectedPosition = {x: 0, y: 0, z:0}
    let expectedScale = {x: 1, y: 1, z:1}
    let expectedAngle = {x: 0, y: 0, z:0}
    expect(new GameObject().position).toEqual(expectedPosition);
    expect(new GameObject().scale).toEqual(expectedScale);
    expect(new GameObject().angle).toEqual(expectedAngle);
});

test('GameObject can have geometry', () => {
    let expectedGeometry = new BoxGeometry(1,1,1);
    expect(new GameObject().geometry).toBeNull();
    expect(new GameObject(expectedGeometry).geometry).toEqual(expectedGeometry);
});

test('GameObject move by given value', () => {
    let expectedPosition1 = {x: 1, y: -1.5, z:2}
    let expectedPosition2 = {x: 2, y: 0, z:1}
    let gameObject = new GameObject()
    gameObject.moveBy(1, -1.5, 2)
    expect(gameObject.position).toEqual(expectedPosition1);
    gameObject.moveBy(1, 1.5, -1)
    expect(gameObject.position).toEqual(expectedPosition2);
});

test('GameObject scales by given value', () => {
    let expectedScale1 = {x: 2, y: 2, z: 2}
    let expectedScale2 = {x: 0.5, y: 0.5, z:0.5}
    let gameObject = new GameObject()
    gameObject.scaleBy(2)
    expect(gameObject.scale).toEqual(expectedScale1);
    gameObject.scaleBy(0.25)
    expect(gameObject.scale).toEqual(expectedScale2);
});