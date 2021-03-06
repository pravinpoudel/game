import Collision from '../src/collision'

test('Collision test for box to box', () => {
    const box1 = {
        minX: -0.5,
        maxX: 0.5,
        minY: -1,
        maxY: 1,
        minZ: -1.5,
        maxZ: 1.5,
    }
    const box2 = {
        minX: -1,
        maxX: 1,
        minY: -1,
        maxY: 1,
        minZ: -1,
        maxZ: 1,
    }
    
    expect(new Collision().collidedBoxToBox(box1, box2)).toBe(true);
});

test('Collision test for box to sphere', () => {
    const box1 = {
        minX: -0.5,
        maxX: 0.5,
        minY: -1,
        maxY: 1,
        minZ: -1.5,
        maxZ: 1.5,
    }
    let sphere = {
        x: 0,
        y: 0,
        z: 0,
        radius: 1,
    }
    
    expect(new Collision().collidedBoxToSphere(box1, sphere)).toBe(true);
});

test('Collision test for sphere to sphere', () => {
    let sphere1 = {
        x: 0,
        y: 0,
        z: 0,
        radius: 1,
    }
    let sphere2 = {
        x: 1,
        y: 1,
        z: 1,
        radius: 1.5,
    }
    expect(new Collision().collidedSphereToSphere(sphere1, sphere2)).toBe(true);
});