
"use strict"

const CANVAS_X = 1000;
const CANVAS_Y = 400;

class View {
    constructor() {
        this.controller = undefined;
        this.canvas = undefined;
        this.drawState = undefined;
        this.gameover = false;
        this.images = {};

    }
    
    setDrawState(drawState) {
        this.drawState = drawState;
    }

    draw() {
        if (this.canvas !== undefined && this.drawState !== undefined) {
            this.drawBG();
            imageMode(CENTER);
            this.drawTanks();
            this.drawEnemies();
            this.drawBullets();
            this.drawGameOverText();
            this.updateHtml();
        }
    }

    drawBG() {
        background(this.images["bg"]); // p5
    }

    drawTanks() {
        for (let i = 0; i < this.drawState.tanks.length; i++) {
            let tank = this.drawState.tanks[i]
            if (tank !== null) {
                image(this.images["tank"], tank.x, tank.y, tank.width, tank.height); // p5
                if (tank.username !== undefined) {
                    fill(150); // p5 
                    textAlign(LEFT); // p5
                    textSize(12); // p5
                    text(tank.username, tank.x + 15, tank.y - 15); // p5
                }
            }
        }
    }
    
    drawEnemies() {
        for (let i = 0; i < this.drawState.enemies.length; i++) {
            let enemy = this.drawState.enemies[i];
            if (enemy !== null) {
                image(enemy.currentAnimation == 0 ? this.images["enemy"] : this.images["enemy2"],
                    enemy.x, enemy.y, enemy.width, enemy.height); // p5
            }
        }
    }
    
    drawBullets() {
        for (let i = 0; i < this.drawState.bullets.length; i++) {
            let bullet = this.drawState.bullets[i]
            if (bullet.burst) {
                image(this.images["burst"], bullet.x, bullet.y, bullet.burstSize, bullet.burstSize); // p5
            } else {
                image(this.images["bullet"], bullet.x, bullet.y, bullet.size, bullet.size); // p5
            }
        }
    }
    
    drawGameOverText() {
        if (this.gameover) {
            textAlign(CENTER); // p5
            fill(255, 0, 0); // p5
            textSize(40); // p5
            text("GAME OVER", CANVAS_X / 2, CANVAS_Y /2); // p5
        }
    }
    
    updateHtml() {
        $("#life").html(this.drawState.life);
    
        $("#users").html('');
        let clients = this.drawState.clients;
        for (let clientKey in clients) {
            let client = clients[clientKey];
            let userText = client.username + (client.tank === undefined ? ' (Spectating)' : '');
            $("#users").prepend('<div class="user">'+userText+'</div>');
        }
    }
}




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