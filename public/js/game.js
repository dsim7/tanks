"use strict"

var view = new View();
var controller;

var userid = sessionStorage.getItem("userid");

var login = (userid) => {
    console.log(userid);
    let usernameQuery = firebase.database().ref("users/"+userid+"/username");
    usernameQuery.once("value").then( (snapshot) => {
        console.log(snapshot);
        console.log(snapshot.val());
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
    console.log(userid);
    login(userid);
} else {
    let locationHash = window.location.hash;
    let urlSplit = locationHash.split('#');
    let userid;
    if (urlSplit.length > 1) {
        userid = urlSplit[1];
    }
    if (userid) {
        console.log(userid);
        sessionStorage.setItem("userid", userid);
        window.location.href = './game.html';
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