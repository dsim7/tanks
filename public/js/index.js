
var view;
var controller;

$(() => {
    let username = sessionStorage.getItem('username');
    if (username === null) {
        window.location.href = './index.html';
        return false;
    } else {
        view = new View();
        controller = new Controller(view, username);
        view.controller = controller;
    }
});