FloatingText = function(text, pos, speed, color) {
    this.speed = speed;
    this.color = color;

    if(typeof(this.speed) === "undefined") {
        this.speed = 2;
    }

    if(typeof(this.color) === "undefined") {
        this.color = {r : 0, g : 155, b : 0};
    }

    this.text = new Text(text, pos, 10, "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", 1)", true, "center", "middle");
    this.active = true;

    var self = this;
    this.timer = new Timer(1, function() {
        self.active = false;
    });
};

FloatingText.prototype = {
    update : function()
    {
        this.text.pos.y -= this.speed;
        this.text.color = "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", " + (1 - this.timer.getTimePerc()) + ")";
        this.text.setShadowColor("rgba(0, 0, 0, " + (1 - this.timer.getTimePerc()) + ")");
    },
    draw : function(c, ctx)
    {
        this.text.draw(c, ctx);
    }
};
