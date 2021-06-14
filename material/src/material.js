export default class Material {
    constructor(color) {
        this.color = color
        this.colors = []
    }

    setupColors(vertices) {
        for (var i = 0; i < vertices; i++) {
            this.colors.push(this.color.r, this.color.g, this.color.b)
        }
    }
}