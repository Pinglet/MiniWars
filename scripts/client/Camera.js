var Vector = require('../Vector');

class Camera {
    
    constructor(game) {
        this.pos = new Vector(0, 0);
        this.scale = 1;
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
        this.checkBounds();
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        this.checkBounds();
    }

    modZoom(value) {
        this.setZoom(this.scale*value);
        this.checkBounds();
    }

    modPos(x, y) {
        this.pos.x += x;
        this.pos.y += y;
        this.checkBounds();
    }

    checkBounds() {
        if (this.pos.x + this.game.canvas.width/this.scale > this.game.gameWidth) {
            this.pos.x = this.game.gameWidth - this.game.canvas.width/this.scale;
        } else if (this.pos.x < 0) {
            this.pos.x = 0;
        }
        if (this.pos.y + this.game.canvas.height/this.scale > this.game.gameHeight) {
            this.pos.y = this.game.gameHeight - this.game.canvas.height/this.scale;
        } else if (this.pos.y < 0) {
            this.pos.y = 0;
        }
    }
}

module.exports = Camera;