Texter = (function() {
	var private, Texter = {};

	Texter.shadowColor = "black";

	Texter.setText = function(ctx, text, pos, color, size, align, shadow, valign)
	{
        ctx.font = size + "px Xolonium";
        ctx.textAlign = align;
        ctx.textBaseline = (typeof(valign) === "undefined" ? "top" : valign);

		if (shadow)
		{
	        ctx.strokeStyle = Texter.shadowColor;
	        ctx.lineWidth = size * 0.25;
	        ctx.strokeText(text, pos.x, pos.y);
		}

        ctx.fillStyle = color;
        ctx.fillText(text, pos.x, pos.y);
	};

	Texter.setShadowColor = function(color) {
		Texter.shadowColor = color;
	};

	return Texter;
})();
