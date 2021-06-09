import BoxPhysicsBody from '../src/boxPhysicsBody'

test('Collision parameters for BoxPhysicsBody gives minX, maxX, minY, maxY, minZ, maxZ', () => {
    const boxPhysicsBody = new BoxPhysicsBody(1,2,3)
    const expectedParameter = {
        minX: -0.5,
        maxX: 0.5,
        minY: -1,
        maxY: 1,
        minZ: -1.5,
        maxZ: 1.5,
    };
    expect(boxPhysicsBody.collisionParameter()).toEqual(expectedParameter);
});
