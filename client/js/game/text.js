Text = function(text, pos, size, color, shadow, align, valign) {
    this.text = text;
    this.pos = pos;
    this.size = size;
    this.color = color;
    this.shadow = shadow;
    this.align = align;
    this.valign = valign;
    this.shadowColor = "black";
};

Text.prototype = {
    draw : function(c, ctx) {
        Texter.setShadowColor(this.shadowColor);
        Texter.setText(ctx, this.text, this.pos, this.color, this.size, this.align, this.shadow, this.valign);
    },
    setShadowColor : function(color) {
		this.shadowColor = color;
	}
};
