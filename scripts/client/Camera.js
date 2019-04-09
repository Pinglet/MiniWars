class Camera {
    pos = new Vector(0, 0);
    scale = 1;
    game;

    constructor(game) {
        this.game = game;
    }

    push() {
        this.game.cxt.save();
        this.game.cxt.scale(this.scale, this.scale);
        this.game.cxt.translate(-this.pos.x, -this.pos.y);
    }

    pop() {
        this.game.cxt.restore();
    }

    setZoom(value = 1) {
        this.pos.x += (this.game.canvas.width/this.scale - this.game.canvas.width/value)/2;
        this.pos.y += (this.game.canvas.height/this.scale - this.game.canvas.height/value)/2;
        this.scale = value;
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    modZoom(value) {
        this.setZoom(this.scale*value);
    }

    modPos(x, y) {
        this.pos.x += x;
        this.pos.y += y;
    }
}