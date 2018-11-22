
"use strict"

class Controller {

    constructor(view, username, userID) {
        this.view = view;
        this.username = username;
        this.gamerunning = true;
        this.socket = io();
        this.firebaseDatabase = firebase.database();

        let userObj = { name : username, id : userID };
        this.socket.emit('new user', userObj);

        this.socket.on('update', (newState) => {
            this.view.setDrawState(newState);
        });

        this.socket.on('gamereset', (msg) => {
            this.view.gameover = false;
            this.gamerunning = true;
        });

        this.socket.on('gameover', (msg) => {
            this.view.gameover = true;
            this.gamerunning = false;
        });

        this.socket.on('score', (msg) => {
            console.log(msg);
            this.updateUserScores(msg.user1, msg.user2, msg.score);
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

    updateUserScores(user1, user2, score) {
        console.log(user1);
        console.log(user2);
        if (user1 !== undefined) {
            let dataref = this.firebaseDatabase.ref('users/' + user1);
            dataref.once("value").then( (snapshot) => {
                console.log(snapshot.child("score"));
                let curscore = snapshot.child("score").val();
                if (curscore < score) {
                    this.firebaseDatabase.ref('users/' + user1 + '/score').set(score);
                }
            }).catch((error) => alert(error));
        }
        if (user2 !== undefined) {
            let dataref = this.firebaseDatabase.ref('users/' + user2);
            dataref.once("value").then( (snapshot) => {
                let curscore = snapshot.child("score").val();
                if (curscore < score) {
                    this.firebaseDatabase.ref('users/' + user2 + '/score').set(score);
                }
            }).catch((error) => alert(error));
        }
    }
}