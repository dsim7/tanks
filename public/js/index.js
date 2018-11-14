"use strict"

var view = new View();
var controller;

firebase.auth().onAuthStateChanged( (user) => {
    if (user) {
        controller = new Controller(view, user.displayName, user.uid);
        view.controller = controller;

        $('#start').on('click touchstart', () => {
            controller.startGame();
        });
        $('#reset').on('click touchstart', () => {
            controller.resetGame();
        });
    } else {
        window.location.href = './index.html';
    }
});