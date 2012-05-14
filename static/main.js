paper.install(window);
paper.setup("canvas");

window.Game = {};
Game.evt = {
    "rot_left": false,
    "rot_right": false,
    "accel": false,
    "deaccel": false
};
Game.gfx = {};

Game.onKeyDown = function(e) {
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

Game.onKeyUp = function(e) {
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

Game.onFrame = function(event) {
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

var ImageURL = ["ship.png"];
var Images = {};

$(document).ready(function() {
    // Load all of the images
    var i = 0;
    function loadNext() {
        if(ImageURL[i] == undefined) return finish();
        Images[ImageURL[i]] = new Image();
        Images[ImageURL[i]].src = "/static/" + ImageURL;
        i += 1;
        Images[ImageURL[i - 1]].onload = loadNext;
    }

    function finish() {
        paper.setup("canvas");
        Star.generate();
        new Layer();
        Game.ship = new Ship(view.center, 1);
        view.onFrame = Game.onFrame;
        view.draw();

        var tool = new Tool();
        tool.onKeyDown = Game.onKeyDown;
        tool.onKeyUp = Game.onKeyUp;
    }

    // Initiate loading
    loadNext();
});
