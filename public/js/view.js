
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
        background(this.images["bg"]);
    }

    drawTanks() {
        for (let i = 0; i < this.drawState.tanks.length; i++) {
            let tank = this.drawState.tanks[i]
            if (tank !== null) {
                image(this.images["tank"], tank.x, tank.y, tank.width, tank.height);
                if (tank.username !== undefined) {
                    fill(150);
                    textAlign(LEFT);
                    textSize(12);
                    text(tank.username, tank.x + 15, tank.y - 15);
                }
            }
        }
    }
    
    drawEnemies() {
        for (let i = 0; i < this.drawState.enemies.length; i++) {
            let enemy = this.drawState.enemies[i];
            if (enemy !== null) {
                image(enemy.currentAnimation == 0 ? this.images["enemy"] : this.images["enemy2"], enemy.x, enemy.y, enemy.width, enemy.height);
            }
        }
    }
    
    drawBullets() {
        for (let i = 0; i < this.drawState.bullets.length; i++) {
            let bullet = this.drawState.bullets[i]
            if (bullet.burst) {
                image(this.images["burst"], bullet.x, bullet.y, bullet.burstSize, bullet.burstSize);
            } else {
                image(this.images["bullet"], bullet.x, bullet.y, bullet.size, bullet.size);
            }
        }
    }
    
    drawGameOverText() {
        if (this.gameover) {
            textAlign(CENTER);
            fill(255, 0, 0);
            textSize(40);
            text("GAME OVER", CANVAS_X / 2, CANVAS_Y /2);
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

