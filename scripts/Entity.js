class Entity {
    pos;
    rotation = 0;
    size;

    constructor(x, y, size) {
        this.pos = new Vector(x, y);
        this.size = size;
        console.log(this.constructor.name);
    }

    draw() {
        
    }
}