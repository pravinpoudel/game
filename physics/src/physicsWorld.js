import Collision from "./collision";

export default class PhysicsWorld {
    constructor() {
        this.colliders = {}
        this.collisonListeners = {}
    }

    update(gameObjects) {
        this.groupGameObjectsWRTCollisionID(gameObjects);
        this.groupGameObjectsWRTColliderID(gameObjects);
        this.testCollision();
    }

    groupGameObjectsWRTCollisionID(gameObjects) {
        gameObjects.forEach(gameObject => {
            if (this.colliders[gameObject.physicsBody.collisionId] != null) {
                this.colliders[gameObject.physicsBody.collisionId].push(gameObject);
            } else {
                this.colliders[gameObject.physicsBody.collisionId] = [gameObject];
            }
        });
    }

    groupGameObjectsWRTColliderID(gameObjects) {
        gameObjects.forEach(gameObject => {
            if (gameObject.physicsBody.colliderId != null) {
                if (this.collisonListeners[gameObject.physicsBody.collisionId] != null) {
                    this.collisonListeners[gameObject.physicsBody.collisionId].push(gameObject);
                } else {
                    this.collisonListeners[gameObject.physicsBody.collisionId] = [gameObject];
                }
            }
        });
    }

    testCollision() {
        for (const collisionId in this.collisonListeners) {
            this.collisonListeners[collisionId].forEach(gameObject => {
                let collideAgainst = this.colliders[gameObject.physicsBody.colliderId]
                collideAgainst.forEach(collider => {
                    let collision = new Collision()
                    let a = collision.collidedBoxToBox(gameObject.physicsBody.collisionParameter(), collider.physicsBody.collisionParameter())
                    this.collisionOccured(gameObject, collider)
                });
            });
        }
    }
}