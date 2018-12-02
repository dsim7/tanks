"use strict"

var view = new View();
var controller;

var userid = sessionStorage.getItem("userid");

var login = (userid) => {
    console.log(userid);
    let usernameQuery = firebase.database().ref("users/"+userid+"/username");
    usernameQuery.once("value").then( (snapshot) => {
        let username = snapshot.val();

        controller = new Controller(view, username, userid);
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
    if (userid) {
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

// firebase.auth().onAuthStateChanged( (user) => {
//     if (user) {
//         let usernameQuery = firebase.database().ref("user-username/"+user.uid);
//         usernameQuery.once("value").then( (snapshot) => {
//             let username = snapshot.val();

//             controller = new Controller(view, username, user.uid);
//             view.controller = controller;
    
//             $('#start').on('click touchstart', () => {
//                 controller.startGame();
//             });
//             $('#reset').on('click touchstart', () => {
//                 controller.resetGame();
//             });
//         });
//     } else {
//         window.location.href = './index.html';
//     }
// });