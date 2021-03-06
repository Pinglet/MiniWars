(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.module = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Vector = require('./Vector');
Shape = require('./Shape.js');

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
},{"./Shape.js":2,"./Vector":3}],2:[function(require,module,exports){
var TwoPi = Math.PI*2;

module.exports = {

    Shape: this,

    // Client use
    pushCxt(cxt, obj) {
        cxt.save();
        cxt.translate(obj.x, obj.y);
        cxt.rotate(-obj.rotation);
    },

    // Client use
    popCxt(cxt) {
        cxt.restore();
    },

    "Square": {
        draw(cxt, obj) {
            Shape.pushCxt(cxt, obj);
            cxt.fillStyle = "white";
            cxt.fillRect(-obj.size*0.5, -obj.size*0.5, obj.size, obj.size);
            Shape.popCxt(cxt);
        }
    },
    
    "Circle": {
        draw(cxt, obj) {
            cxt.fillStyle = "white";
            cxt.beginPath();
            cxt.arc(obj.x, obj.y, obj.size*0.5, 0, TwoPi);
            cxt.fill();
        }
    },
    
    "Bullet": {
        draw(cxt, obj) {
            cxt.fillStyle = "yellow";
            cxt.fillRect(obj.x-obj.size*0.5, obj.y-obj.size*5*0.5, obj.size, obj.size*5);
        }
    },

    // Server use
    isCollide(obj1, obj2) {
        var radii = (obj1.size + obj2.size)*0.5;
        var xdiff = obj1.pos.x - obj2.pos.x;
        var ydiff = obj1.pos.y - obj2.pos.y;
        var dis = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
        return dis <= radii ? {radii, xdiff, ydiff} : false;
    },

    resolveCollision(obj1, obj2, {radii, xdiff, ydiff}) {
        var length = Math.sqrt(xdiff*xdiff + ydiff*ydiff) || 1;
        var xunit = xdiff / length;
        var yunit = ydiff / length;
        var radiisum = radii + 1;
        obj1.pos.x = obj2.pos.x + (radiisum * xunit || 1); 
        obj1.pos.y = obj2.pos.y + (radiisum * yunit || 1);
    }
}
},{}],3:[function(require,module,exports){
class Vector {
    constructor(x, y) {
        this.xVal = x;
        this.yVal = y;
    }

    get x() {
        return this.xVal;
    }

    get y() {
        return this.yVal;
    }

    set x(value) {
        this.xVal = value;
    }

    set y(value) {
        this.yVal = value;
    }

    sameVector(vector) {
        return (this.x === vector.x && this.y === vector.y);
    }
    
    getEuclids(vector) {
        var dx = this.xVal - vector.x;
        var dy = this.yVal - vector.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
}

module.exports = Vector;
},{}],4:[function(require,module,exports){
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
},{"../Vector":3}],5:[function(require,module,exports){
var Inputs = require('./Inputs');
var ClientGame = require('./ClientGame');
var Entity = require('../Entity');

var socket = io();
var lastTime = Date.now();
var game;

init = function() {
    document.addEventListener('keydown', (event) => {
        Inputs.keyDown(event, game);
    });
    document.addEventListener('keyup', (event) => {
        Inputs.keyUp(event, game);
    });
    
    game = new ClientGame(this);
    game.canvas.addEventListener('mousedown', (event) => {
        mcoords = getMousePos(game.canvas, event)
        Inputs.mouseDown(mcoords.x, mcoords.y, socket);
    });  

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    socket.emit('new player');
    
    socket.on('new game', (data) => {
        loop = window.setInterval(() => {
            sendUpdates();
            game.loop();
        }, 10);
        game.setSize(data.width, data.height);
    });

    socket.on('object', (data) => {
        !(data.id in game.objects) && (game.objects[data.id] = {});
        var obj = data.obj;
        game.objects[data.id][data.oid] = obj;
    });

    socket.on('delete player', (id) => {
        delete game.objects[id];
    });
}

function sendUpdates() {
    socket.emit('movement', game.movement);
}
},{"../Entity":1,"./ClientGame":6,"./Inputs":7}],6:[function(require,module,exports){
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
},{"../Entity":1,"../Shape":2,"./Camera":4}],7:[function(require,module,exports){
module.exports = {
    keyDown: function(event, game) {
        switch (event.keyCode) {
            case 65: // A
                game.movement.left = true;
                break;
            case 87: // W
                game.movement.up = true;
                break;
            case 68: // D
                game.movement.right = true;
                break;
            case 83: // S
                game.movement.down = true;
                break;
            case 37: // left
                game.camera.modPos(-5, 0);
                break;
            case 38: // up
                game.camera.modPos(0, -5);
                break;
            case 39: // right
                game.camera.modPos(5, 0);
                break;
            case 40: // down
                game.camera.modPos(0, 5);
                break; 
        }
        console.log(game.movement);
    },
    keyUp: function(event, game) {
        switch (event.keyCode) {
            case 65: // A
                console.log(game.objects);
                game.movement.left = false;
                break;
            case 87: // W
                game.movement.up = false;
                break;
            case 68: // D
                game.movement.right = false;
                break;
            case 83: // S
                game.movement.down = false;
                break; 
        }
    },
    
    mouseDown: function(mx, my, socket) {
        socket.emit('mouse click', {mx, my});
    }
}


},{}]},{},[5])(5)
});
