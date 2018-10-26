
var socket;

$(function () {
    socket = io();

    socket.on('update', (newState) => {
        drawState = newState;
    });

    socket.on('gamereset', (msg) => {
        gameover = false;
        gamerunning = true;
    });

    socket.on('gameover', (msg) => {
        gameover = true;
        gamerunning = false;
    });
});

function keyPressed() {
    if (gamerunning) {
        if (keyCode == 65) {
            socket.emit('move', 'l');
        } else if (keyCode == 68) {
            socket.emit('move', 'r');
        }
    }   
    return false;
}

function keyReleased() {
    if (gamerunning) {
        if (keyCode == 65) {
            socket.emit('move', 'sl');
        } else if (keyCode == 68) {
            socket.emit('move', 'sr');
        }
    }
    return false;
}

function fireBullet() {
    if (gamerunning) {
        socket.emit('fire', { x : mouseX, y : mouseY });
    }
    return false;
}

function startGame() {
    socket.emit('gamestart', '');
}

function resetGame() {
    socket.emit('gamereset', '');
}