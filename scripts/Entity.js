Vector = require('./Vector');
Shape = require('./Shape.js');
Physics = require('./PhysicsConfig');

class Entity {
    constructor(x, y, size, shape, type) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.size = size;
        this.shape = "Square";
        this.type = "Infantry";
        this.rotation = 0;
        this.hp = 100;
        this.power = 20;
        this.accuracy = 0.95;
        this.oldPos = new Vector(null, null);
        this.mass = 10;
        this.forces = [];
        this.force = new Vector(0, 0);
    }

    update(dt) {
        this.calculateResultantForce();
        this.calculateAcceleration();
        this.calculateVelocity(dt);
        this.calculatePos(dt);
    }

    addForce(force) {
        this.forces.push(force);
    }

    calculateResultantForce() {
        this.force.setZero();

        this.forces.forEach(f => {
            this.force.addVector(f);
        });
        this.forces = [];
    }

    calculateFrictionAcceleration() {
        return Physics.g * Physics.friction;
    }

    calculateAcceleration() {
        this.acc.x = this.force.x / this.mass;
        this.acc.y = this.force.y / this.mass;
        this.force.setZero();
    }

    calculateVelocity(dt) {
        this.vel.x += this.acc.x*dt;
        this.vel.y += this.acc.y*dt;

        var total = Math.abs(this.vel.x)+Math.abs(this.vel.y);
        var frictionAcc = this.calculateFrictionAcceleration() * dt;

        var newX = this.vel.x - frictionAcc * (this.vel.x/total || 0);
        var newY = this.vel.y - frictionAcc * (this.vel.y/total || 0);
        
        console.log(`Vel: ${this.vel.x}`);
        console.log(`Sign: ${Math.sign(this.vel.x)}`);
        console.log(`Fric: ${frictionAcc}`);
        console.log(`Prop: ${this.vel.x/total}`);
        // console.log(this.vel);
        console.log(`New: ${newX}`);
        
        if (Math.sign(this.vel.x) === Math.sign(newX)) {
            this.vel.x = newX;
        } else {
            this.vel.x = 0;
        }
        
        if (Math.sign(this.vel.y) === Math.sign(newY)) {
            this.vel.y = newY;
        } else {
            this.vel.y = 0;
        }
    }

    calculatePos(dt) {
        this.pos.x += this.vel.x*dt;
        this.pos.y += this.vel.y*dt;
    }

    setOldPos() {
        this.oldPos.x = this.pos.x;
        this.oldPos.y = this.pos.y;
    }

    isMoved() {
        var result = this.pos.sameVector(this.oldPos);
        return !result;
    }

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