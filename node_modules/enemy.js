

class Enemy {
    constructor(y) {
        this.y = y;
        this.x = -100;
        this.w = Enemy.width;
        this.h = Enemy.height;
        this.speed = Math.random() * 2.25 + 0.75;
        this.life = 60;
        this.animationTime = 0;
        this.animationTimeMax = 20;
        this.currentAnimation = 0;
    }

    move() {
        this.x += this.speed;

        this.animationTime += 1;
        if (this.animationTime > this.animationTimeMax) {
            this.animationTime = 0;
            this.currentAnimation ^= 1;
        }
    }
}

Enemy.width = 70;
Enemy.height = 35;

module.exports = Enemy;