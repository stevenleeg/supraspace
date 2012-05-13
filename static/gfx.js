// Some initial objects
var Star = function(pt, radius) {
    this.elem = new Path.Circle(pt, radius);
    this.radius = radius;

    this.move = function(speed) {
        this.elem.position += speed;

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
    var n = Math.random() * (40, 50) + 40;
    for(var i=0; i < n; i++) {
        var size = Math.random() * (.5, 3) + .5;
        var point = Point.random() * view.bounds.bottomRight;
        var star = new Star(point, size);
        star.elem.fillColor = "#FFF";
        Game.gfx.stars.push(star);
    }
}

// Create the ship
Game.gfx.init = function() {
    var ship;
    // Create the user's ship
    ship = new Raster('ship_' + Game.ship.type);
    ship.size = new Size(32, 32);
    ship.position = view.center;

    Game.ship.elem = ship;

    // Render a bunch of stars
    Star.generate();
}

Game.Point = Point;
Game.gfx.ready();

function onKeyDown(e) {
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

function onKeyUp(e) {
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

function onFrame(event) {
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
            length: -.2,
            angle: Game.ship.deg
        }));

    // If we're moving, move the stars
    if(Math.abs(Game.ship.speed) > 0) {
        for(i in Game.gfx.stars) {
            Game.gfx.stars[i].move(Game.ship.velocity);
        }
    }
}
