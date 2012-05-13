window.Game = {};
Game.evt = {
    "rot_left": false,
    "rot_right": false
};
Game.gfx = {};

var Speed = function(x, y) {
    this.x = x;
    this.y = y;
}

var Ship = function(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.velocity = new Game.Point({length: 0, angle: 0});
    this.deg = 0;
    this.top_speed = 5;

    this.rotate = function(deg) {
        this.deg += deg;
        if(this.deg >= 360) this.deg -= 360;
        this.elem.rotate(deg);
    }
    
    this.accelerate = function(accel) {
        this.velocity += accel;
        if(this.velocity.length > this.top_speed) this.velocity.length = this.top_speed;
    }
}

Game.gfx.ready = function() {
    Game.ship = new Ship(40, 40, 1);
    Game.gfx.init();
}
