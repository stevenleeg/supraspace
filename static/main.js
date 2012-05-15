paper.install(window);
paper.setup("canvas");

window.Game = {
    projectiles: [],
    gfx: { stars: [] }
};
Game.DEBUG = true;
Game.evt = {
    "rot_left": false,
    "rot_right": false,
    "accel": false,
    "deaccel": false
};

window.ImageURL = ["ship.png", "thrust.gif"];
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
            Game.ship.showThrust();
            break;
        case "down":
            Game.evt.deaccel = true;
            break;
        case "w":
            Game.ship.shoot();
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
            Game.ship.hideThrust();
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
            length: .1,
            angle: Game.ship.deg
        }));
    if(Game.evt.deaccel)
        Game.ship.accelerate(new Point({
            length: .1,
            angle: Game.ship.deg
        }), true);

    for(var i in Game.projectiles) {
        Game.projectiles[i].move();
    }
    
    // If we're moving, move the stars
    if(Game.ship.velocity.length > 0) {
        for(var i in Game.gfx.stars) {
            Game.gfx.stars[i].move(Game.ship.velocity);
        }

        // Friction! This isn't realistic but it's good for
        // development right now
        if(Game.DEBUG) Game.ship.velocity.length -= .01;
    }
}

$(document).ready(function() {
    // Load all of the images
    var i = 0;
    function loadImages(callback) {
        if(ImageURL[i] == undefined) return callback();
        Images[ImageURL[i]] = new Image();
        Images[ImageURL[i]].src = "/static/" + ImageURL[i];
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
