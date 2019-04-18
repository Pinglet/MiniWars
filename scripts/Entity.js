Vector = require('./Vector');
Shape = require('./Shape.js');

class Entity {
    constructor(x, y, size, shape, type) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.size = size;
        this.shape = "Circle";
        this.type = "Infantry";
        this.rotation = 0;
        this.hp = 100;
        this.power = 20;
        this.accuracy = 0.95;
        // this.oldPos = new Vector(null, null);
        this.moved = true;

    }

    // setOldPos() {
    //     this.oldPos.x = this.pos.x;
    //     this.oldPos.y = this.pos.y;
    // }

    // isMoved() {
    //     var result = this.pos.sameVector(this.oldPos);
    //     return !result;
    // }

    calculateAngle(otherObj) {
        let xVec = otherObj.pos.x - this.pos.x;
        let yVec = otherObj.pos.y - this.pos.y;
    
        let rotation;
        
        if (xVec > 0) {
            if (yVec > 0) {
                rotation = Math.atan(xVec/yVec);
            } else if (yVec < 0) {
                rotation = Math.PI + Math.atan(xVec/yVec);
            } else {
                rotation = Math.PI/2;
            }
        } else if (xVec < 0) {
            if (yVec > 0) {
                rotation = Math.PI*2 + Math.atan(xVec/yVec);
            } else if (yVec < 0){
                rotation = Math.PI + Math.atan(xVec/yVec);
            } else {
                rotation = Math.PI*1.5;
            }
        } else {
            if (yVec > 0) {
                rotation = 0;
            } else if (yVec < 0){
                rotation = Math.PI;
            } else {
                rotation = undefined;
            }
        }
        return rotation;
    }
}

module.exports = Entity;