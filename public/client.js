
var tanksToDraw = {}

let fps = 20;
let direction = 'left'

$(function () {
    let socket = io();
    
    setInterval(() => {
        direction = direction === 'left' ? 'right' : 'left'
    }, 1000);

    setInterval(() => {
        socket.emit('move', direction);
    }, 1000 / fps);

    socket.on('update', (tanks) => {
        tanksToDraw = tanks
        console.log(tanks);
    });
});