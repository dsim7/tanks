
const CANVAS_X = 1000;
const CANVAS_Y = 400;

var drawState;

function setup() {
    createCanvas(CANVAS_X, CANVAS_Y);
    rectMode(CENTER);
}

function draw() {
    background(150,150,255);

    if (drawState !== undefined) {
        for (let i = 0; i < drawState.tanks.length; i++) {
            let tank = drawState.tanks[i]
            if (tank !== null) {
                fill(0);
                rect(tank.x, tank.y, tank.w, tank.h);
            }
        }

        for (let i = 0; i < drawState.bullets.length; i++) {
            let bullet = drawState.bullets[i]
            fill(255, 0, 0);
            ellipse(bullet.x, bullet.y, bullet.r);
        }
    }   
}
