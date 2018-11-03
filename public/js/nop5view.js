
"use strict"

const CANVAS_X = 1000;
const CANVAS_Y = 400;

class View {
    constructor() {
        this.controller = undefined;
        this.canvas = document.getElementById("gameView").getContext('2d');
        this.canvas.fillStyle = "#ffffff";
        this.drawState = undefined;
        this.gameover = false;
        this.images = {};

        document.onkeydown = (e) => {
            if (this.controller !== undefined) {
                this.controller.move(e.keyCode);
            }
        }

        document.onkeyup = (e) => {
            if (this.controller !== undefined) {
                this.controller.stopMoving(e.keyCode);
            }
        }

        let canvasElement = $("#gameView");
        canvasElement.on("click" , (click) => {
            let x = click.offsetX;
            let y = click.offsetY;
            this.controller.fireBullet(x, y);
        });
        

    }

    setDrawState(drawState) {
        this.drawState = drawState;
        this.draw();
    }

    draw() {
        if (this.canvas !== undefined && this.drawState !== undefined) {
            this.drawBG();
            this.drawTanks();
            this.drawEnemies();
            this.drawBullets();
            this.drawGameOverText();
            this.updateHtml();
        }
    }

    drawBG() {
        this.canvas.fillStyle = "#000000";
        this.canvas.fillRect(0, 0, CANVAS_X, CANVAS_Y);
        this.canvas.fillStyle = "#ffffff";
    }

    drawTanks() {
        for (let i = 0; i < this.drawState.tanks.length; i++) {
            let tank = this.drawState.tanks[i]
            if (tank !== null) {
                this.canvas.fillRect((tank.x - tank.w/2), (tank.y - tank.h/2), tank.w, tank.h);
                if (tank.username !== undefined) {
                    this.canvas.fillText(tank.username, tank.x + 25, tank.y - 25);
                }
            }
        }
    }
    
    drawEnemies() {
        for (let i = 0; i < this.drawState.enemies.length; i++) {
            let enemy = this.drawState.enemies[i];
            if (enemy !== null) {
                this.canvas.fillRect(enemy.x - enemy.w/2, enemy.y - enemy.h/2, enemy.w, enemy.h);
            }
        }
    }
    
    drawBullets() {
        for (let i = 0; i < this.drawState.bullets.length; i++) {
            let bullet = this.drawState.bullets[i]
            this.canvas.beginPath();
            this.canvas.arc(bullet.x, bullet.y, bullet.size/2, 0, 2 * Math.PI);
            this.canvas.fill();
        }
    }
    
    drawGameOverText() {
        if (this.gameover) {
            this.canvas.fillText("Game Over", CANVAS_X/2, CANVAS_Y/2);
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

















