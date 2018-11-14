"use strict"

const auth = firebase.auth();

$(() => {
    $('#login').on('click touchstart', login);
    $('#register').on('click touchstart', createUser);
});
    
var goToGame = (username) => {
    sessionStorage.setItem('username', username);
    window.location.href = './game.html';
    //window.location.href = './game.html';
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
  
    const promise = auth.createUserWithEmailAndPassword(email, password).then( () => { } );
    promise.catch(e => alert(e.message));

    $('#registerEmail').val("");
    $('#registerPassword').val("");
    $('#registerUsername').val("");
}

const login = () => {
    email = $('#loginEmail').val();
    password = $('#loginPassword').val();
  
    const promise = auth.signInWithEmailAndPassword(email, password);
    $('#loginEmail').val("");
    $('#loginPassword').val("");
}

firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        if(username) {
            user.updateProfile({
                displayName : username,
            }).then( () => {
                goToGame(user.displayName);
            }).catch( (error) => {
                alert(error);
            });
        } else {
            goToGame(user.displayName);
        }    
    }
});

