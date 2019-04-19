var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var io = require('socket.io').listen(server);
var ServerGame = require('./ServerGame');
var Entity = require('../Entity');
var Vector = require ('../Vector');

var game;
var lastTime = Date.now();

function makeCounter() {
    var i = 0;
    return function() {
        return i++;
    }
}

app.set('port', 3000);

app.use('/', express.static(__dirname + '/..'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../../static/index.html'));
});

// Starts the server.
server.listen(3000, () => {
    console.log('Starting server on port 3000');
    
    thing = setInterval(loop, 10);
    game = new ServerGame(1000, 1000, io);
});

io.on('connection', function(socket) {

    socket.on('new player', function() {
        game.objects[socket.id] = {};
        console.log(socket.id);
        socket.emit('new game', {"width":game.gameWidth, "height":game.gameHeight});
        for (sid in game.objects) {
            for (oid in game.objects[sid]) {
                game.updateObject(sid, oid)
            }
        }
    });

    socket.on('disconnect', () => {
        disconnectPlayer(socket.id);
    });

    socket.on('mouse click', function(data) {
        newObject(socket.id, data.mx, data.my, 20, 0);
    });

    socket.on('movement', (data) => {
        var xv = 0; 
        var yv = 0;
        if (data.up) {
            yv -= 20;
        }
        if (data.down) {
            yv += 20;
        }
        if (data.left) {
            xv -= 20;
        }
        if (data.right) {
            xv += 20;
        }

        for (oid in game.objects[socket.id]) {
            game.objects[socket.id][oid].addForce(new Vector(xv, yv));
            game.checkCollisions(socket.id, oid, game.objects[socket.id][oid]);
            game.updateObject(socket.id, oid);
        }
    });
});

function disconnectPlayer(id) {
    delete game.objects[id];
    io.sockets.emit('delete player', id);
}

var newOid = makeCounter();

function newObject(sid, x, y, size, rotation) {
    var oid = newOid()
    var obj = new Entity(x, y, size, rotation);
    game.objects[sid][oid] = obj;
    io.sockets.emit('object', {id:sid, oid:oid, obj:game.createPacket(obj)}); 
    console.log(obj.shape);   
}

function loop() {
    var dt = calculateDT();
    // console.log(dt);
    update(dt);
}

function update(dt) {
    game.update(dt);
}

function calculateDT() {
    let now = Date.now();
    let dt = now - lastTime;
    lastTime = now;
    return dt/10;
}