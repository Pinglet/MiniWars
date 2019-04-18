var Entity = require('../Entity');
var Shape = require('../Shape.js');
var Server = require('./Server');

const States = Object.freeze({
    ACTIVE:   Symbol("active"),
    PREGAME:  Symbol("pre"),
    ENDGAME: Symbol("end")
});

class ServerGame {
    constructor(width, height, io) {
        this.state = States.ACTIVE;
        this.gameWidth = width;
        this.gameHeight = height;
        this.objects = {};
        this.io = io;
    }

    update(dt) {
        for (var id in this.objects) {
            var player = this.objects[id];
            for (var oid in player) { 
                var obj1 = this.objects[id][oid];
                // if (obj1.isMoved()) {
                //     this.checkCollisions(id, oid, obj1);
                // }
                // // Update the moved checksum
                // obj1.setOldPos();

                if (obj1.moved) {
                    this.checkCollisions(id, oid, obj1);
                }
            }
        }
    }

    checkCollisions(id, oid, obj1) {
        for (var id2 in this.objects) {
            var player2 = this.objects[id2];
            for (var oid2 in player2) { 
                var obj2 = this.objects[id2][oid2];
                if (!obj1 || !obj2 || obj1 === obj2) {
                    continue;
                }
                // console.log({obj1, obj2});
                var collision = Shape.isCollide(obj1, obj2);
                if (collision) {
                    Shape.resolveCollision(obj1, obj2, collision);
                    this.updateObject(id, oid);
                    this.updateObject(id2, oid2);
                } else {
                    obj1.moved = false;
                }
            }
        }
    }

    updateObject(sid, oid) {
        this.io.sockets.emit('object', {id:sid, oid:oid, obj:this.createPacket(this.objects[sid][oid])});   
    }
    createPacket(obj) {
        return {x:obj.pos.x, y:obj.pos.y, size:obj.size, rotation:obj.rotation, shape:obj.shape};
    }
}



module.exports = ServerGame;