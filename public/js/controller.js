

class Controller {
    constructor(view, username) {
        this.view = view;
        this.username = username;
        this.gamerunning = true;
        this.socket = io();

        this.socket.emit('new user', this.username);

        this.socket.on('update', (newState) => {
            this.view.drawState = newState;
        });

        this.socket.on('gamereset', (msg) => {
            this.view.gameover = false;
            this.gamerunning = true;
        });

        this.socket.on('gameover', (msg) => {
            this.view.gameover = true;
            this.gamerunning = false;
        });

        this.socket.on('welcome', (msg) => {
            console.log(msg);
        });
    }

    move(keyCode) {
        if (this.gamerunning) {
            if (keyCode == 65) {
                this.socket.emit('move', 'l');
            } else if (keyCode == 68) {
                this.socket.emit('move', 'r');
            }
        }   
        return false;
    }
    
    stopMoving(keyCode) {
        if (this.gamerunning) {
            if (keyCode == 65) {
                this.socket.emit('move', 'sl');
            } else if (keyCode == 68) {
                this.socket.emit('move', 'sr');
            }
        }
        return false;
    }
    
    fireBullet(mouseX, mouseY) {
        if (this.gamerunning) {
            this.socket.emit('fire', { x : mouseX, y : mouseY });
        }
        return false;
    }
    
    startGame() {
        this.socket.emit('gamestart', '');
    }
    
    resetGame() {
        this.socket.emit('gamereset', '');
    }
}
