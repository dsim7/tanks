"use strict"

var userid = sessionStorage.getItem("userid");

var view = new View();

var login = (userid) => {
    console.log(userid);
    let usernameQuery = firebase.database().ref("users/"+userid+"/username");
    usernameQuery.once("value").then( (snapshot) => {
        let username = snapshot.val();

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

if (userid !== undefined && userid !== null) {
    login(userid);
} else {
    let locationHash = window.location.hash;
    let urlSplit = locationHash.split('#');
    let username;
    let token;
    if (urlSplit.length > 2) {
        username = urlSplit[1];
        token = urlSplit[2];
    }
    if (token && username) {
        console.log("in token");    
        let externalTokenQuery = firebase.database().ref("tokens/badgebook");
        externalTokenQuery.once("value").then((snapshot) => {
            if (snapshot.val() == token) {
                let usersQuery = firebase.database().ref("users");
                console.log(username)
                usersQuery.orderByChild('username').equalTo(username).limitToFirst(1).once("value", (snapshot) => {
                    console.log(snapshot);
                    if (snapshot.hasChildren()) {
                        snapshot.forEach((childsnapshot) => {
                            sessionStorage.setItem("userid", childsnapshot.key);
                            window.location.href = './game.html';
                        });
                    } else {
                        let usersQuery = firebase.database().ref("users");
                        let newUser = usersQuery.push({
                            firebaseId : "badgebookuser",
                            score: 0,
                            username: username
                        });
                        sessionStorage.setItem("userid", newUser.key);
                        window.location.href = './game.html';
                    }
                });
            } else {
                window.location.href = './index.html'; 
            }
        });
    }
}

