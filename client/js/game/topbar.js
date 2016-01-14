Topbar = (function()
{
	var private, Topbar = {};

	Topbar.update = function() {

	};

	Topbar.draw = function(c, ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, " + (0.7) + ")";
        ctx.fillRect(0, 0, c.width, 50);
	};

	return Topbar;
})();
