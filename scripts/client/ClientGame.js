var Camera = require('./Camera');
var Entity = require('../Entity');
var Shape = require('../Shape');

const States = Object.freeze({
    ACTIVE:   Symbol("active"),
    PREGAME:  Symbol("pre"),
    ENDGAME: Symbol("end")
});

class ClientGame {
    
    constructor(client) {
        this.objects = {};
        this.canvas = document.getElementById("game")
        this.cxt = this.canvas.getContext("2d", {alpha: false});
        this.camera = new Camera(this);
        this.camera.setZoom(1);  
        this.state = States.PREGAME;
        this.client = client;
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }

    loop() {
        this.draw();
    }

    draw() {
        this.cxt.fillStyle = "black";
        this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.push()
        for (var id in this.objects) {
            var player = this.objects[id];
            for (var oid in player) { 
                Shape[this.objects[id][oid].shape].draw(this.cxt, this.objects[id][oid]);
            }
        }
        this.camera.pop();
    }

    setSize(width, height) {
        this.gameWidth = width;
        this.gameHeight = height;
    }
}

module.exports = ClientGame;