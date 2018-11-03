


goToGame = () => {
    let username = $('#username').val();
    if (username == 0) {
        $('#warning').html('<p>Enter a username</p>');
    } else {
        sessionStorage.setItem('username', username);
        window.location.href = './game.html';
        return false;
    }
}