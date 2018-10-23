// Import express framework
let express = require('express');

// Create app
let app = express();

// Create server listening to port 3000
let server = app.listen(3000, () => {
  console.log("listening to port 3000");
});

// Import socket.io and create socket server for the server
let io = require('socket.io')(server);

// Serve the public folder
app.use(express.static('public'));

// dictionary of tanks, key is socket id
let tanks = {};

// On server connection, initialize socket
io.on("connection", (socket) => {
  console.log("user " + socket.id + " connected");

  numTanks = Object.keys(tanks).length;
  if (numTanks < 2) {
    tanks[socket.id] = new Tank(numTanks == 0 ? 1 : 2);
  }
  

  let fps = 20;

  setInterval(() => {
    io.emit('update', tanks);
  }, 1000/fps);

  socket.on('move', (msg) => {
    //console.log("user " + socket.id + " says: " + msg);
    if (tanks[socket.id] !== undefined) {
      tanks[socket.id].moveX(msg === 'left' ? -3 : 3);
    }
  });

  socket.on('disconnect', () => {
    console.log("user " + socket.id + " disconnected");
    delete tanks[socket.id];
  });
});

const CANVAS_X = 1000;
const CANVAS_Y = 400;

class Tank {
  constructor(player) {
    this.width = 70;
    this.height = 35;

    this.y = player === 1 ? CANVAS_Y - this.height : 0;
    this.x = 425;
  }

  moveX(amount) {
    this.x += amount;
  }
}