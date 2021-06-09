export default class Collision {
    collidedBoxToBox(box1, box2) {
        return (box1.minX <= box2.maxX && box1.maxX >= box2.minX) &&
            (box1.minY <= box2.maxY && box1.maxY >= box2.minY) &&
            (box1.minZ <= box2.maxZ && box1.maxZ >= box2.minZ);
    }

    collidedBoxToSphere(box, sphere) {
        var x = Math.max(box.minX, Math.min(sphere.x, box.maxX));
        var y = Math.max(box.minY, Math.min(sphere.y, box.maxY));
        var z = Math.max(box.minZ, Math.min(sphere.z, box.maxZ));

        var distance = Math.sqrt((x - sphere.x) * (x - sphere.x) +
                                (y - sphere.y) * (y - sphere.y) +
                                (z - sphere.z) * (z - sphere.z));

        return distance < sphere.radius;
    }
}