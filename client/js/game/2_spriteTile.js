SpriteTile = function(pos, img) {
	this.img = img;
	this.pos = pos;
	this.offsetPos = new Appelicious.Vector2(0, 0);
};

SpriteTile.prototype = new Sprite(this.pos, this.pos);

SpriteTile.prototype.draw = function(c, ctx)
{
	if(typeof(this.img) !== "undefined") {
		ctx.drawImage(this.img.img, (this.offsetPos.x + this.pos.x * Map.tileSize) - (this.img.img.width - Map.tileSize), (this.offsetPos.y + this.pos.y * Map.tileSize) - (this.img.img.height - Map.tileSize));
	}
};

SpriteTile.prototype.getTilePosition = function()
{
    return this.pos;
};

SpriteTile.prototype.getPosition = function() {
	return this.pos.prod(Map.tileSize).add(this.offsetPos);
};
