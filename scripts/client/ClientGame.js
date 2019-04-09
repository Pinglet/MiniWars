const States = Object.freeze({
    ACTIVE:   Symbol("active"),
    PREGAME:  Symbol("pre"),
    ENDGAME: Symbol("end")
});

class ClientGame {

    canvas;
    cxt;
    camera;

    state = States.PREGAME;

    gameWidth;
    gameHeight;

    objects = {};

    constructor() {
        this.canvas = document.getElementById("game")
        this.cxt = this.canvas.getContext("2d", {alpha: false});
        this.camera = new Camera(this);
        this.camera.setZoom(0.5);      
    }

    loop() {
        this.update();
        this.draw();
    }

    update() {

    }

    draw() {
        this.cxt.fillStyle = "black";
        this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.push()
        // console.log(this.objects);
        for (var id in this.objects) {
            var player = this.objects[id];
            this.cxt.fillStyle = "white";
            this.cxt.fillRect(player.x, player.y, 50, 50);
        }
        this.camera.pop();
    }

    setSize(width, height) {
        this.gameWidth = width;
        this.gameHeight = height;
    }
}