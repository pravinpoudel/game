export default class Collision {
    collidedBoxToBox(box1, box2) {
        return (box1.minX <= box2.maxX && box1.maxX >= box2.minX) &&
            (box1.minY <= box2.maxY && box1.maxY >= box2.minY) &&
            (box1.minZ <= box2.maxZ && box1.maxZ >= box2.minZ);
    }
}