

class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.size = Bullet.size;
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

Bullet.size = 15;

module.exports = Bullet;