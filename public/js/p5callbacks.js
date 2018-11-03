"use strict"

// p5.js callbacks

var setup = () => {
    view.images["bg"] = loadImage("assets/tanksbg.png");
    view.images["tank"] = loadImage("assets/tank.png");
    view.images["bullet"] = loadImage("assets/bullet.png");
    view.images["burst"] = loadImage("assets/bulletburst.png");
    view.images["enemy"] = loadImage("assets/enemy.png");
    view.images["enemy2"] = loadImage("assets/enemy2.png");
    
    canvas = createCanvas(CANVAS_X, CANVAS_Y);
    canvas.parent("gameView");
    view.canvas = canvas;
    canvas.mousePressed(() => {
        view.controller.fireBullet(mouseX, mouseY);
    });
}

var draw = () => {
    imageMode(CORNER);
    view.draw();
}


var keyPressed = () => {
    if (view.controller !== undefined) {
        view.controller.move(keyCode);
    }
}

var keyReleased = () => {
    if (view.controller !== undefined) {
        view.controller.stopMoving(keyCode);
    }
}