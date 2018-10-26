
const CANVAS_X = 1000;
const CANVAS_Y = 400;

const TANK_W = 70;
const TANK_H = 35;
const ENEMY_W = 70;
const ENEMY_H = 35;
const BULLET_SIZE = 15

class Enemy {
  constructor(y) {
    this.y = y;
    this.x = -100;
    this.w = ENEMY_W;
    this.h = ENEMY_H;
    this.speed = 1;
    this.life = 100;
    this.animationTime = 0;
    this.animationTimeMax = 20;
    this.currentAnimation = 0;
  }

  move() {
    this.x += this.speed;

    enemy.animationTime += 1;
    if (enemy.animationTime > enemy.animationTimeMax) {
      enemy.animationTime = 0;
      enemy.currentAnimation ^= 1;
    }
  }
}

class Tank {
  constructor(player, id) {
    this.id = id;
    this.w = TANK_W;
    this.h = TANK_H;
    this.left = 0;
    this.right = 0;
    this.currentShootCD = 0;
    this.shootCooldown = 10;
    this.canShoot = true;

    this.y = player === 1 ? CANVAS_Y - this.h : this.h;
    this.x = CANVAS_X / 2;
  }

  move() {
    if (this.x > 50) {
      this.x += this.left * -3;
    }
    if (this.x < CANVAS_X - 50) {
      this.x += this.right * 3;
    }
  }
}

class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.size = BULLET_SIZE;
    this.moving = '';
    this.lifeTime = 5000;
    this.burstTime = 350;
    this.burst = false;
    this.burstSize = 45;
    this.damage = 10;
  }

  move() {
    if (!this.burst) {
      this.x += 10*Math.cos(this.angle);
      this.y += 10*Math.sin(this.angle);
    }
  }

  detectCollision(enemy) {
    let enemyCoord1 = [enemy.x - enemy.w/2, enemy.y - enemy.h/2]
    let enemyCoord2 = [enemy.x + enemy.w/2, enemy.y + enemy.h/2]
    return !this.burst && 
          this.x > enemyCoord1[0] && this.x < enemyCoord2[0] &&
          this.y > enemyCoord1[1] && this.y < enemyCoord2[1];
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
let bullets = [];

// enemies
let enemies = [];

// life
let life = 5;

let gamerunning = true;
let gameover = false;
let enemiesSpawning = false;

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

  socket.on('gamereset', (msg) => {
    resetGame();

    enemiesSpawning = false;
  });

  socket.on('gamestart', (msg) => {
    resetGame();

    enemiesSpawning = true;
    spawnEnemy();
    (function spawnEnemiesLoop() {
      let minInterval = 500;
      let maxInterval = 4000;
      var randTimeInterval = Math.round(Math.random() * maxInterval + minInterval);
      setTimeout(() => {
              if (enemiesSpawning) {
                spawnEnemy();
                spawnEnemiesLoop();
              } 
      }, randTimeInterval);
    }());
  });

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
      if (firingTank.canShoot) {
        angle = Math.atan2(mouse.y - firingTank.y, mouse.x - firingTank.x);
        bullets.push(new Bullet(firingTank.x, firingTank.y, angle));
        firingTank.canShoot = false;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log("user " + socket.id + " disconnected ");
    delete clients[socket.id];
    if (tanks[0] !== undefined && tanks[0].id === socket.id) {
      tanks[0] = undefined;
    } else if (tanks[1] !== undefined && tanks[1].id === socket.id) {
      tanks[1] = undefined;
    }
    
    console.log(tanks);
    console.log(clients);
  });
});


let fps = 40;

function resetGame() {
  gameover = false;
  gamerunning = true;
  life = 5;
  enemies.length = 0;
  bullets.length = 0;

  for (let i = 0; i < tanks.length; i++) {
    tank = tanks[i];
    if (tank) {
      tank.x = CANVAS_X / 2;
      tank.left = 0;
      tank.right = 0; 
    }
  }

  io.emit('gamereset', '');
}

function gameOver() {
  gameover = true;
  gamerunning = false;
  enemiesSpawning = false;
}

function spawnEnemy() {
  enemies.push(new Enemy(Math.round(Math.random() * (CANVAS_Y - (TANK_H * 4)) + TANK_H * 2)));
}

setInterval(() => {
  if (gamerunning) {
    for (let i = 0; i < tanks.length; i++) {
      tank = tanks[i];
      if (tank != null) {
        tank.move();
        if (!tank.canShoot) {
          tank.currentShootCD += 1;
          if (tank.currentShootCD > tank.shootCooldown) {
            tank.canShoot = true;
            tank.currentShootCD = 0;
          }
        }
      }
    }
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullet = bullets[i];
      bullet.move();

      bullet.lifeTime -= 100;
      if (bullet.lifeTime < bullet.burstTime) {
        bullet.burst = true;
      }
      for (let j = enemies.length - 1; j >= 0; j--) {
        enemy = enemies[j];
        if (enemy !== undefined && bullet.detectCollision(enemy)) {
          enemy.life -= bullet.damage;
          bullet.lifeTime = bullet.burstTime;
          bullet.burst = true;
          break;
        }
      }
      if (bullet.lifeTime <= 0) {
        bullets.splice(i, 1);
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      enemy = enemies[i];
      enemy.move();
      if (enemy.life <= 0) {
        enemies.splice(i, 1);
      } else if (enemy.x >= CANVAS_X) {
        enemies.splice(i, 1);
        life--;
      }
    }
    if (life <= 0) {
      gameOver();
    }
  }
  if (gameover) {
    io.emit('gameover', '');
  }
  io.emit('update', { life, tanks, bullets, enemies });
}, 1000/fps);