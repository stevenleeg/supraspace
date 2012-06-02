var Star = function(pt, radius) {
    this.elem = new Path.Circle(pt, radius);
    this.radius = radius;

    this.move = function() {
        if(this.elem.bounds.bottom < view.bounds.top)
            this.elem.position.y = view.bounds.bottom;
        if(this.elem.bounds.top > view.bounds.bottom)
            this.elem.position.y = view.bounds.top;
        if(this.elem.bounds.right < view.bounds.left)
            this.elem.position.x = view.bounds.right;
        if(this.elem.bounds.left > view.bounds.right)
            this.elem.position.x = view.bounds.left;
    }
}

Star.generate = function(game) {
    var n = Math.random() * (30 - 20) + 20;
    for(var i=0; i < n; i++) {
        var size = Math.random() * (3 - .5) + .5;
        var x = Math.random() * view.bounds.bottomRight.x
        var y = Math.random() * view.bounds.bottomRight.y
        var star = new Star(new Point(x, y), size);
        star.elem.fillColor = "#FFF";
        game.stars.push(star);
    }
}

var Projectile = function(game, origin, type) {
    this.origin = origin;
    this.direction = origin.deg - 90;
    if(this.direction < 0) this.direction += 360;

    // Render the little bugger
    var position = this.origin.elem.position.subtract(new Point(0, 5));
    this.elem = new Path.Circle(position, 2);
    this.elem.rotate(this.direction, this.origin.position);
    this.elem.fillColor = "#FF0000";
    game.projectiles.push(this);

    this.move = function() {
        this.elem.position = this.elem.position.add(new Point({length: 15, angle: this.direction}));
        if(this.elem.position.getDistance(this.origin.elem.position, false) > 350) this.remove();
    }

    this.remove = function() {
        this.elem.remove();
        Game.projectiles.splice(Game.projectiles.indexOf(this), 1);
    }
}

var Ship = function(pos, type) {
    this.type = type;
    this.velocity = new Point({length: 0, angle: 0});
    this.deg = 0;
    this.top_speed = 4;

    this.elem = new Raster(Images['ship.png']);
    this.elem.size = new Size(32, 32);
    this.elem.position = pos;

    this.moveTo = function(point) {
        this.elem.position = point;
        if(this.thruster) {
            var pos = 
            this.thruster.position = point.add(new Point(0, 27)).rotate(this.deg, this.elem.position);
        }
    }

    this.move = function() {
        var pt = this.elem.position.add(this.velocity);
        if(pt.x > 10)
            this.elem.position.x = pt.x;
        else
            this.velocity.x = -this.velocity.x;

        if(pt.y > 10)
            this.elem.position.y = pt.y;
        else
            this.velocity.y = -this.velocity.y;

        if(this.thruster) {
            pt = this.thruster.position.add(this.velocity);
            if(pt.x > 0)
                this.thruster.position.x = pt.x;
            if(pt.y > 0)
                this.thruster.position.y = pt.y;
        }
    }

    this.rotate = function(deg) {
        this.deg += deg;
        if(this.deg >= 360) this.deg -= 360;
        this.elem.rotate(deg);
        if(this.thruster) {
            this.thruster.rotate(deg, this.elem.position);
        }
    }
    
    this.accelerate = function(accel, rev) {
        accel.angle += 90;
        if(rev) {
            accel.angle += 180;
            if(accel.angle >= 360) accel.angle -= 360;
        }
        this.velocity = this.velocity.add(accel.multiply(-1));
        if(this.velocity.length > this.top_speed) this.velocity.length = this.top_speed;
    }

    this.showThrust = function() {
        if(this.thruster != undefined) return;
        var thrust = new Raster(Images['thrust.gif']);
        thrust.position = this.elem.position.add(new Point(0, 27));
        thrust.rotate(180);
        thrust.rotate(this.deg, this.elem.position);
        this.thruster = thrust;
    }

    this.hideThrust = function() {
        this.thruster.remove();
        delete this.thruster;
    }

    this.shoot = function(type) {
        console.log("Shooting!");
        new Projectile(this);
    }
}
