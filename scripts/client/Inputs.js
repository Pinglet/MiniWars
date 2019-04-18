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

