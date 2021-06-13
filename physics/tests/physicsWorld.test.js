import GameObject from '../../gameObject/src/gameObject';
import BoxPhysicsBody from '../src/boxPhysicsBody';
import PhysicsWorld from '../src/physicsWorld'

test('Material returns colors per vertices', () => {
    let g = new GameObject()
    g.physicsBody = new BoxPhysicsBody(1,1,1)
    g.physicsBody.collisionId = 1
    let gg = new GameObject()
    gg.physicsBody = new BoxPhysicsBody(1,1,1)
    gg.physicsBody.collisionId = 2
    gg.physicsBody.colliderId = 1
    let pw = new PhysicsWorld()

    const drink = jest.fn();

    pw.collisionOccured = drink
    pw.update([g,g,g,gg])
    expect(pw.colliders).toEqual({"1": [g,g,g], "2": [gg]});
    expect(pw.collisonListeners).toEqual({"2": [gg]});

    expect(drink.mock.calls.length).toBe(3);
});