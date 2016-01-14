Loading = (function() {
	var private, Loading = {};

	Loading.LoadingState = {
		resources : 1,
		map : 2,
		game : 3
	};

	Loading.state = null;
	Loading.callback = null;

    Loading.progress = 0;

	Loading.initialize = function(callback) {
        Loading.callback = callback;
		Loading.loadState(Loading.LoadingState.resources);
	};

	Loading.draw = function(c, ctx) {
		Texter.setText(ctx, "Loading...", new Appelicious.Vector2(c.width * 0.5, c.height * 0.475), "white", 30, "center", false, "bottom");

		var loadRectWidth = c.width * 0.3;
		var loadRectHeight = 20;

		ctx.beginPath();
		ctx.lineWidth = "2";
		ctx.strokeStyle = "white";

		ctx.rect(
			c.width * 0.5 - loadRectWidth * 0.5,
			c.height * 0.5 - loadRectHeight * 0.5,
			loadRectWidth,
			loadRectHeight
		);

		ctx.stroke();

		ctx.fillRect(
			c.width * 0.5 - loadRectWidth * 0.5,
			c.height * 0.5 - loadRectHeight * 0.5,
			loadRectWidth * (isNaN(this.progress) ? 0 : this.progress),
			loadRectHeight
		);
	};

	Loading.loadState = function(state)
	{
		var self = this;

		this.state = state;

		if (this.state === this.LoadingState.resources)
		{
			var finished = function() {
				self.loadState(self.LoadingState.map);
			};
			var progress = function(p) {
				self.setProgress(p);
			};

			Resources.initialize(finished, progress);
		}
		else if (this.state === this.LoadingState.map)
		{
			Map.initialize(function() {
				self.loadState(self.LoadingState.game);
			});
		}
		else if (this.state === this.LoadingState.game)
		{
			Loading.callback();
		}

	};

	Loading.setProgress = function(progress) {
		Loading.progress = progress;
	};

	return Loading;
})();
