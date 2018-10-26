
const CANVAS_X = 1000;
const CANVAS_Y = 400;

var drawState;
var gameover = false;
var gamerunning = true;

function setup() {
    bg = loadImage("assets/tanksbg.png");
    tankImg = loadImage("assets/tank.png");
    bulletImg = loadImage("assets/bullet.png");
    burstImg = loadImage("assets/bulletburst.png");
    enemyImg = loadImage("assets/enemy.png");
    enemy2Img = loadImage("assets/enemy2.png");
    
    textSize(40);

    canvas = createCanvas(CANVAS_X, CANVAS_Y);
    canvas.parent("gameView");
    canvas.mousePressed(fireBullet);
}

function draw() {
    imageMode(CORNER);
    background(bg);

    if (drawState !== undefined) {
        imageMode(CENTER);
        for (let i = 0; i < drawState.tanks.length; i++) {
            let tank = drawState.tanks[i]
            if (tank !== null) {
                image(tankImg, tank.x, tank.y, tank.w, tank.h);
            }
        }

        for (let i = 0; i < drawState.enemies.length; i++) {
            let enemy = drawState.enemies[i];
            if (enemy !== null) {
                image(enemy.currentAnimation == 0 ? enemyImg : enemy2Img, enemy.x, enemy.y, enemy.w, enemy.h);
            }
        }

        for (let i = 0; i < drawState.bullets.length; i++) {
            let bullet = drawState.bullets[i]
            if (bullet.burst) {
                image(burstImg, bullet.x, bullet.y, bullet.burstSize, bullet.burstSize);
            } else {
                image(bulletImg, bullet.x, bullet.y, bullet.size, bullet.size);
            }
        }

        if (gameover) {
            textAlign(CENTER);
            fill(255, 0, 0);
            text("GAME OVER", CANVAS_X / 2, CANVAS_Y /2);
        }

        $("#life").html(drawState.life);
    }
}
