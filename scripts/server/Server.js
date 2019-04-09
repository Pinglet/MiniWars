var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var io = require('socket.io').listen(server);
var ServerGame = require('./ServerGame');

var lastTime = Date.now();

app.set('port', 3000);

app.use('/', express.static(__dirname + '/..'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../../static/index.html'));
});

// Starts the server.
server.listen(3000, function() {
    console.log('Starting server on port 3000');
    
    thing = setInterval(loop, 10);
    game = new ServerGame(1000, 1000);
});

var players = {};
io.on('connection', function(socket) {
    socket.on('new player', function() {
        players[socket.id] = {x: 300, y: 300};
        socket.emit('new game', {"width":game.gameWidth, "height":game.gameHeight});
    });
    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        if (data.left) {
          player.x -= 5;
        }
        if (data.up) {
          player.y -= 5;
        }
        if (data.right) {
          player.x += 5;
        }
        if (data.down) {
          player.y += 5;
        }
    });
});

function loop() {
    var dt = calculateDT();
    update(dt);
}

function update(dt) {
    io.sockets.emit('state', players);
}

function calculateDT() {
    let now = Date.now();
    let dt = now - lastTime;
    lastTime = now;
    return dt;
}