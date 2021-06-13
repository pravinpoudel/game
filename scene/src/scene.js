export default class Scene {
    construct() {
        this.gameObjects = [];
        // this.camera = Camera();
        gameloop()
    }

    gameloop() {
        this.gameObjects.forEach(function(gameObject) {
            gameObject.update();
        });
        this.physicsWorld.update(this.gameObjects);
        // this.camera.render(this.gameObjects);
        window.requestAnimationFrame(this.gameloop)
    }
}