Arrow = function(pos, angle, owner) {
    this.pos = pos;
    this.angle = angle;
    this.owner = owner;
    this.sprite = null;
    this.active = true;
    this.speed = 32;

    this.initialize();
};

Arrow.prototype = {
    initialize : function ()
    {
        this.sprite = new Sprite(this.pos, Resources.images.arrow);
        this.sprite.angle = this.angle;
        //this.sprite.offset = this.sprite.img.img.width / 4;
        this.angle += Math.PI / 4;

        this.testSprite = new SpriteTile(new Appelicious.Vector2(0, 0), Resources.images["529"]);
        this.testSprite2 = new Sprite(new Appelicious.Vector2(0, 0), Resources.images["1261"]);
    },
    update : function()
    {
        this.pos.x += Math.cos(this.angle) * this.speed;
        this.pos.y += Math.sin(this.angle) * this.speed;

        var hit = Map.checkArrow(new Appelicious.Vector2(
            Math.floor((this.pos.x + 16) / Map.tileSize),
            Math.floor((this.pos.y + 16) / Map.tileSize)
        ), this.owner);

        if (hit){
            this.active = false;
        }
    },
    draw : function(c, ctx)
    {
        this.sprite.draw(c, ctx);
    }
};
