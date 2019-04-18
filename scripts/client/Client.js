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