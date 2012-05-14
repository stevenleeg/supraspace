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

var Star = function(pt, radius) {
    this.elem = new Path.Circle(pt, radius);
    this.radius = radius;

    this.move = function(speed) {
        var nspeed = this.elem.position.add(speed);
        this.elem.position = nspeed;
        delete nspeed;

        if(this.elem.bounds.left > view.size.width)
            this.elem.position.x = 0;
        if(this.elem.bounds.right < 0)
            this.elem.position.x = view.size.width;

        if(this.elem.bounds.top > view.size.height)
            this.elem.position.y = 0;
        if(this.elem.bounds.bottom < 0)
            this.elem.position.y = view.size.height;
    }
}

Star.generate = function() {
    Game.gfx.stars = [];
    var n = Math.random() * (30 - 20) + 20;
    for(var i=0; i < n; i++) {
        var size = Math.random() * (3 - .5) + .5;
        var x = Math.random() * view.bounds.bottomRight.x
        var y = Math.random() * view.bounds.bottomRight.y
        var star = new Star(new Point(x, y), size);
        star.elem.fillColor = "#FFF";
        Game.gfx.stars.push(star);
    }
}

var Ship = function(pos, type) {
    this.type = type;
    this.velocity = new Point({length: 0, angle: 0});
    this.deg = 0;
    this.top_speed = 5;

    this.elem = new Raster(Images['ship.png']);
    this.elem.size = new Size(32, 32);
    this.elem.position = pos;

    this.rotate = function(deg) {
        this.deg += deg;
        if(this.deg >= 360) this.deg -= 360;
        this.elem.rotate(deg);
    }
    
    this.accelerate = function(accel, rev) {
        accel.angle += 90;
        if(rev) {
            accel.angle += 180;
            if(accel.angle >= 360) accel.angle -= 360;
        }
        this.velocity = this.velocity.add(accel);
        if(this.velocity.length > this.top_speed) this.velocity.length = this.top_speed;
    }
}

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
        Game.ship = new Ship(view.center, 1);
        Star.generate();
        view.onFrame = Game.onFrame;
        view.draw();

        var tool = new Tool();
        tool.onKeyDown = Game.onKeyDown;
        tool.onKeyUp = Game.onKeyUp;
    }
    loadNext();
});
