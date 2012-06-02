var Game = function(debug) {
    this.DEBUG = (debug == true) ? debug : false;
    this.stars = [];
    this.projectiles = [];
    this.evt = {
        "rot_right": false,
        "rot_left": false,
        "accel": false,
        "deaccel": false
    };

    this.connect = function(server, nick, callback) {
        if(!callback) callback = this.initGame;
        return true;
    }

    this.initGame = function() {
        paper.setup("canvas");
        Star.generate(this);
        new Layer();
        this.ship = new Ship(view.center, 1);
        view.onFrame = this.onFrame;
        view.draw();

        this.tool = new Tool();
        tool.onKeyDown = this.onKeyDown;
        tool.onKeyUp = this.onKeyUp;
    }

    this.onKeyDown = function(e) {
        e.preventDefault();
        switch(e.key) {
            case "left":
                current_game.evt.rot_left = true;
                break;
            case "right":
                current_game.evt.rot_right = true;
                break;
            case "up":
                current_game.evt.accel = true;
                current_game.ship.showThrust();
                break;
            case "down":
                current_game.evt.deaccel = true;
                break;
            case "w":
                current_game.ship.shoot();
                break;
        }
    }

    this.onKeyUp = function(e) {
        e.preventDefault();
        switch(e.key) {
            case "left":
                current_game.evt.rot_left = false;
                break;
            case "right":
                current_game.evt.rot_right = false;
                break;
            case "up":
                current_game.evt.accel = false;
                current_game.ship.hideThrust();
                break;
            case "down":
                current_game.evt.deaccel = false;
                break;
        }
    }

    this.onFrame = function(event) {
        if(current_game.evt.offFrame) return;
        // See if we need to rotate ourself
        if(current_game.evt.rot_right)
            current_game.ship.rotate(3);
        if(current_game.evt.rot_left)
            current_game.ship.rotate(-3);
        if(current_game.evt.accel)
            current_game.ship.accelerate(new Point({
                length: .07,
                angle: current_game.ship.deg
            }));
        if(current_game.evt.deaccel)
            current_game.ship.accelerate(new Point({
                length: .07,
                angle: current_game.ship.deg
            }), true);

        for(var i in current_game.projectiles) {
            current_game.projectiles[i].move();
        }
        
        // If we're moving, move the stars
        if(current_game.ship.velocity.length > 0) {
            for(var i in current_game.stars) {
                current_game.stars[i].move(current_game.ship.velocity);
            }

            current_game.evt.offFrame = true;
            var pt = current_game.ship.elem.position.clone();
            pt.x -= view.size.width / 2;
            pt.y -= view.size.height / 2;
            var bound = new Rectangle(pt, view.size);

            if(bound.left > 0) {
                view.scrollBy(new Point(current_game.ship.velocity.x, 0));
            }
            if(bound.top > 0) {
                view.scrollBy(new Point(0, current_game.ship.velocity.y));
            }
            current_game.evt.offFrame = false;
            current_game.ship.move();

            // Friction! This isn't realistic but it's good for
            // development right now
            if(current_game.DEBUG) current_game.ship.velocity.length -= .01;
        }
    }
}

