


function goToGame() {
    let username = $('#username').val();
    console.log(username);
    sessionStorage.setItem('username', username);
    window.location.href = './game.html';
    return false;
}