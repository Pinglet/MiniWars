var socket = io();
var lastTime = Date.now();
var game;

function init () {

  
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);
  
  
  game = new ClientGame(0, 0);
  socket.emit('new player');
  
  socket.on('new game', (data) => {
    loop = window.setInterval(() => {
      sendUpdates();
      game.loop();
      game.setSize();
    }, 10);
  });

  socket.on('state', function(players) {
      game.objects = players;
  });
}

function sendUpdates() {
    socket.emit('movement', movement);
}

