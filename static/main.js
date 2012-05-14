paper.install(window);
paper.setup("canvas");

window.Game = {};
Game.DEBUG = true;
Game.evt = {
    "rot_left": false,
    "rot_right": false,
    "accel": false,
    "deaccel": false
};
Game.gfx = {};

window.ImageURL = ["ship.png"];
window.Images = {};

Game.evt.onKeyDown = function(e) {
    e.preventDefault();
    switch(e.key) {
        case "left":
            Game.evt.rot_left = true;
            break;
        case "right":
            Game.evt.rot_right = true;
            break;
        case "up":
            Game.evt.accel = true;
            break;
        case "down":
            Game.evt.deaccel = true;
            break;
    }
}

Game.evt.onKeyUp = function(e) {
    e.preventDefault();
    switch(e.key) {
        case "left":
            Game.evt.rot_left = false;
            break;
        case "right":
            Game.evt.rot_right = false;
            break;
        case "up":
            Game.evt.accel = false;
            break;
        case "down":
            Game.evt.deaccel = false;
            break;
    }
}

Game.evt.onFrame = function(event) {
    // See if we need to rotate ourself
    if(Game.evt.rot_right)
        Game.ship.rotate(4);
    if(Game.evt.rot_left)
        Game.ship.rotate(-4);
    if(Game.evt.accel)
        Game.ship.accelerate(new Point({
            length: .2,
            angle: Game.ship.deg
        }));
    if(Game.evt.deaccel)
        Game.ship.accelerate(new Point({
            length: .2,
            angle: Game.ship.deg
        }), true);

    // If we're moving, move the stars
    if(Game.ship.velocity.length > 0) {
        for(i in Game.gfx.stars) {
            Game.gfx.stars[i].move(Game.ship.velocity);
        }
    }
}

$(document).ready(function() {
    // Load all of the images
    var i = 0;
    function loadImages(callback) {
        if(ImageURL[i] == undefined) return callback();
        Images[ImageURL[i]] = new Image();
        Images[ImageURL[i]].src = "/static/" + ImageURL;
        i += 1;
        Images[ImageURL[i - 1]].onload = function() { loadImages(callback); };
    }

    function startGame() {
        paper.setup("canvas");
        Star.generate();
        new Layer();
        Game.ship = new Ship(view.center, 1);
        view.onFrame = Game.evt.onFrame;
        view.draw();

        var tool = new Tool();
        tool.onKeyDown = Game.evt.onKeyDown;
        tool.onKeyUp = Game.evt.onKeyUp;
    }

    // Initiate loading
    if(Game.DEBUG) {
        Game.server = "http://localhost:8080";
        Game.nickname = "dev";
    } else {
        Game.server = prompt("Please provide the server address you'd like to connect to", "http://localhost:8080");
        Game.nickname = prompt("What nickname would you like to use?", "User" + Math.floor(Math.random() * 25));
    }
    loadImages(startGame);
});
