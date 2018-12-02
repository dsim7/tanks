"use strict"

const auth = firebase.auth();

const badgebookLoginReturnURL = "https://" + window.location.host + "/game.html"
const badgebookLoginURL = "https://linkedout-dev.herokuapp.com/login";

$(() => {
    $('#login').on('click touchstart', login);
    $('#register').on('click touchstart', createUser);
    $('#bblogin').on('click touchstart', badgebookredirect);
});
    
var goToGame = (userid) => {
    sessionStorage.setItem('userid', userid);
    window.location.href = './game.html';
    return false;
}

var username;
var email;
var password;

const createUser = () => {
    console.log("Creating user");
    email = $('#registerEmail').val();
    password = $('#registerPassword').val();
    username = $('#registerUsername').val();
  
    const promise = auth.createUserWithEmailAndPassword(email, password).then( (signup) => {
        let usersQuery = firebase.database().ref("users");
        let userid = usersQuery.push({
            firebaseId : signup.user.uid,
            username : username,
            score : 0
        });
        userid.then(() => {
            goToGame(userid.key);
        });
    });
    promise.catch((error) => alert(error));

    $('#registerEmail').val("");
    $('#registerPassword').val("");
    $('#registerUsername').val("");
}

const login = () => {
    console.log("login");
    email = $('#loginEmail').val();
    password = $('#loginPassword').val();
  
    auth.signInWithEmailAndPassword(email, password).then((signin) => {
        if (signin) {
            if (signin.user.uid) {
                let usersQuery = firebase.database().ref("users");
                usersQuery.orderByChild('firebaseId').equalTo(signin.user.uid).limitToFirst(1).once("value", (snapshot) => {
                    snapshot.forEach((childsnapshot) => {
                        let userid = childsnapshot.key;
                        goToGame(userid);
                    });
                });
            }
        }
    });
    $('#loginEmail').val("");
    $('#loginPassword').val("");
}

const badgebookredirect = () => {
    let badgebookTokenQuery = firebase.database().ref("externaltokens/badgebook");
    badgebookTokenQuery.once("value").then((snapshot) => {
        let token = snapshot.val();
        console.log(window.location.href = badgebookLoginURL + "#" + badgebookLoginReturnURL + "#" + token);
        window.location.href = badgebookLoginURL + "#" + badgebookLoginReturnURL + "#" + token;
    });
}
