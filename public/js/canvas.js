
const CANVAS_X = 1000;
const CANVAS_Y = 400;

var drawState;

function setup() {
    bg = loadImage("assets/tanksbg.png");
    tankImg = loadImage("assets/tank.png");
    bulletImg = loadImage("assets/bullet.png");
    burstImg = loadImage("assets/bulletburst.png");
    createCanvas(CANVAS_X, CANVAS_Y);
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

        for (let i = 0; i < drawState.bullets.length; i++) {
            let bullet = drawState.bullets[i]
            if (bullet.burst) {
                image(burstImg, bullet.x, bullet.y, bullet.burstSize);
            } else {
                image(bulletImg, bullet.x, bullet.y, bullet.size, bullet.size);
            }
        }
    }   
}
