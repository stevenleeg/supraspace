paper.install(window);
paper.setup("canvas");

window.IMAGE_URLS = ["ship.png", "thrust.gif"];
window.Images = {};
window.current_game = false;

$(document).ready(function() {
    // Load all of the images
    var i = 0;
    function loadImages(callback) {
        if(IMAGE_URLS[i] == undefined) return callback();
        Images[IMAGE_URLS[i]] = new Image();
        Images[IMAGE_URLS[i]].src = "/static/img/" + IMAGE_URLS[i];
        i += 1;
        Images[IMAGE_URLS[i - 1]].onload = function() { loadImages(callback); };
    }

    function finishLoad() {
        current_game = new Game(true);
        current_game.initGame();
    }

    // Initiate loading
    loadImages(finishLoad);
});
