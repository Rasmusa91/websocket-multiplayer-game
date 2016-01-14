Sprite = function(pos, img) {
	this.img = img;
	this.pos = pos;
	this.angle = 0;
	this.offset = 0;

	if(typeof(pos) !== "undefined") {
		this.rect = new Rect(this.pos.x, this.pos.y, this.img.img.width, this.img.img.height);
	}
};

Sprite.prototype = {
	update : function() {

	},
	draw : function(c, ctx)
	{
		if(typeof(this.img) === "undefined") {
			return;
		}

		ctx.save();
		ctx.translate(this.pos.x + this.img.img.width / 2, this.pos.y + this.img.img.height / 2);
		ctx.rotate(this.angle);
		ctx.drawImage(this.img.img, -this.img.img.width / 2 + this.offset, -this.img.img.height / 2 + this.offset);
		ctx.restore();
	},
	getPosition : function() {
        return this.pos;
    },
	getRect : function() {
		return this.rect;
    }
};
