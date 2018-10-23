
var canvasX = 1000;
var canvasY = 400;
var tankWidth = 70;
var tankHeight = 35;

function setup() {
    createCanvas(canvasX, canvasY);
}

function draw() {
    background(150,150,255);
    fill(0);
    for (tankID in tanksToDraw) {
        let tank = tanksToDraw[tankID]
        rect(tank.x, tank.y, tankWidth, tankHeight);
    }
}