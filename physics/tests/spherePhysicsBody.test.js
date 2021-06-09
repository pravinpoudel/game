import SpherePhysicsBody from '../src/spherePhysicsBody'

test('Collision parameters for SpherePhysicsBody gives spheres position and radius', () => {
    const spherePhysicsBody = new SpherePhysicsBody(1)
    const expectedParameter = {
        x: 0,
        y: 0,
        z: 0,
        radius: 1,
    };
    expect(spherePhysicsBody.collisionParameter()).toEqual(expectedParameter);
});
