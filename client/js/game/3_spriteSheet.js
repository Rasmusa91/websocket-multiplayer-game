SpriteSheet = function(pos, img) {
	this.pos = pos;
	this.img = img;
	this.offsetPos = new Appelicious.Vector2(0, 0);
	this.direction = 3;
	this.frame = 1;
	this.idle = true;
	this.animTimer = -1;
};

SpriteSheet.prototype = new SpriteTile(this.pos, this.img);

SpriteSheet.prototype.update = function()
{
	if(!this.idle && Date.now() - this.animTimer >= 250)
	{
		if(this.frame === 0) {
			this.frame = 2;
		}
		else {
			this.frame = 0;
		}

		this.animTimer = Date.now();
	}
};

SpriteSheet.prototype.draw = function(c, ctx) {
	if(typeof(this.img) !== "undefined") {
		ctx.drawImage(this.img.img,
            this.frame * Map.tileSize,
			this.direction * Map.tileSize,
            Map.tileSize,
            Map.tileSize,
            this.offsetPos.x + this.pos.x * Map.tileSize,
            this.offsetPos.y + this.pos.y * Map.tileSize,
            Map.tileSize,
            Map.tileSize
        );
	}
};

SpriteSheet.prototype.setDirection = function(dir)
{
	this.direction = dir;
};

SpriteSheet.prototype.setIdle = function(state)
{
	if(this.idle !== state)
	{
		this.idle = state;
		this.frame = (state ? 1 : 0);
		this.animTimer = Date.now();
	}
};
