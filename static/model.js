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

var Projectile = function(origin, type) {
    this.origin = origin;
    this.direction = origin.deg - 90;
    if(this.direction < 0) this.direction += 360;

    // Render the little bugger
    var position = this.origin.elem.position.subtract(new Point(0, 5));
    this.elem = new Path.Circle(position, 2);
    this.elem.rotate(this.direction, this.origin.position);
    this.elem.fillColor = "#FF0000";
    Game.projectiles.push(this);

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
    this.top_speed = 5;

    this.elem = new Raster(Images['ship.png']);
    this.elem.size = new Size(32, 32);
    this.elem.position = pos;

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
        this.velocity = this.velocity.add(accel);
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
