const States = Object.freeze({
    ACTIVE:   Symbol("active"),
    PREGAME:  Symbol("pre"),
    ENDGAME: Symbol("end")
});

class ServerGame {
    constructor() {
        this.state = States.ACTIVE;
        this.gameWidth = 1000;
        this.gameHeight = 1000;
    }
}

module.exports = ServerGame;