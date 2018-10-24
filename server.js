
const CANVAS_X = 1000;
const CANVAS_Y = 400;

class Tank {
  constructor(player, id) {
    this.id = id;
    this.w = 70;
    this.h = 35;
    this.left = 0;
    this.right = 0;

    this.y = player === 1 ? CANVAS_Y - this.h : this.h;
    this.x = 425;
  }

  move() {
    this.x += this.left * -3;
    this.x += this.right * 3;
  }
}

class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.r = 10;
    this.moving = '';
    this.lifetime = 5000;
  }

  move() {
    this.x += 10*Math.cos(this.angle);
    this.y += 10*Math.sin(this.angle);
  }
}




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

// clients
let clients = { };

// players
let tanks = [undefined, undefined];

// bullets
let bullets = [(new Bullet(100, 100, Math.PI * 2/3))];

// enemies
let enemies = [];

// On server connection, initialize socket
io.on("connection", (socket) => {
  console.log("user " + socket.id + " connected");

  clients[socket.id] = { };
  if (tanks[0] === undefined) {
    console.log("initializing player 1");
    tanks[0] = new Tank(1, socket.id);
    clients[socket.id].tank = tanks[0];
  } else if (tanks[1] === undefined) {
    console.log("initializing player 2");
    tanks[1] = new Tank(2, socket.id);
    clients[socket.id].tank = tanks[1];
  }

  console.log(tanks);
  console.log(clients);


  socket.on('move', (msg) => {
    movingTank = clients[socket.id].tank
    if (movingTank !== undefined) {
      if (msg === 'sl') {
        movingTank.left = 0;
      } else if (msg === 'sr') {
        movingTank.right = 0;
      } else if (msg === 'l') {
        movingTank.left = 1;
      } else if (msg === 'r') {
        movingTank.right = 1;
      }
    }
  });

  socket.on('fire', (mouse) => {
    firingTank = clients[socket.id].tank;
    if (firingTank != null) {
      angle = Math.atan2(mouse.y - firingTank.y, mouse.x - firingTank.x);
      bullets.push(new Bullet(firingTank.x, firingTank.y, angle));
    }
  });

  socket.on('disconnect', () => {
    console.log("user " + socket.id + " disconnected ");
    delete clients[socket.id];
    if (tanks[0].id === socket.id) {
      tanks[0] = undefined;
    } else if (tanks[1] !== undefined && tanks[1].id === socket.id) {
      tanks[1] = undefined;
    }
    
    console.log(tanks);
    console.log(clients);
  });
});


let fps = 40;

setInterval(() => {
  for (let i = 0; i < tanks.length; i++) {
    tank = tanks[i];
    if (tank != null) {
      tank.move();
    }  
  }
  
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullet = bullets[i];
    bullet.move();
    bullet.lifetime -= 100;
    if (bullet.lifetime < 0) {
      bullets.splice(i, 1);
    }
  }
  io.emit('update', { tanks, bullets, enemies });
}, 1000/fps);