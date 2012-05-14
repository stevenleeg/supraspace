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
