
// let fps = 20;
// let direction = 'left'

var socket;

$(function () {
    socket = io();

    // setInterval(() => {
    //     direction = direction === 'left' ? 'right' : 'left'
    // }, 3000);

    // setInterval(() => {
    //     socket.emit('move', direction);
    // }, 1000 / fps);

    socket.on('update', (newState) => {
        drawState = newState; // shallow copy
    });
});

function keyPressed() {
    if (keyCode == 65) {
        socket.emit('move', 'l');
    } else if (keyCode == 68) {
        socket.emit('move', 'r');
    }
    return false;
}

function keyReleased() {
    if (keyCode == 65) {
        socket.emit('move', 'sl');
    } else if (keyCode == 68) {
        socket.emit('move', 'sr');
    }
    return false;
}

function mousePressed() {
    console.log("mouse pressed");
    socket.emit('fire', { x : mouseX, y : mouseY });
    return false;
}