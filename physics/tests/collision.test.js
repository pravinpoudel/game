import Collision from '../src/collision'

test('Collision', () => {
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