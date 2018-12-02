"use strict"

var userid = sessionStorage.getItem("userid");

var login = (userid) => {
    console.log(userid);
    let usernameQuery = firebase.database().ref("users/"+userid+"/username");
    usernameQuery.once("value").then( (snapshot) => {
        let username = snapshot.val();

        var view = new View();
        var controller = new Controller(view, username, userid);
        view.controller = controller;

        $('#start').on('click touchstart', () => {
            controller.startGame();
        });
        $('#reset').on('click touchstart', () => {
            controller.resetGame();
        });
    });
}

if (userid !== undefined && userid != null) {
    login(userid);
} else {
    let locationHash = window.location.hash;
    let urlSplit = locationHash.split('#');
    let userid;
    let token;
    if (urlSplit.length > 2) {
        userid = urlSplit[1];
        token = urlSplit[2];
    }
    if (token && userid) {
        let externalTokenQuery = firebase.database().ref("tokens/badgebook");
        externalTokenQuery.once("value").then((snapshot) => {
            if (snapshot.val() == token) {
                let userQuery = firebase.database().ref("users/"+userid);
                userQuery.once("value").then((snapshot) => {
                    if (snapshot.val() != null) {
                        sessionStorage.setItem("userid", userid);
                        window.location.href = './game.html';
                    } else {
                        window.location.href = './index.html';
                    }
                });
            } else {
                window.location.href = './index.html'; 
            }
        });
    }
}
