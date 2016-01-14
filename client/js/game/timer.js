Timer = function(duration, callback) {
    this.duration = duration;
    this.start = Date.now();

    if(typeof(callback) !== "undefined" && callback !== null) {
        this.timeout = setTimeout(callback, duration * 1000);
    }
};

Timer.prototype = {
    getTimePerc : function() {
        return (Date.now() - this.start) / (this.duration * 1000);
    },
    getTimeLeft : function() {
        return Math.floor((((this.duration * 1000) - (Date.now() - this.start)) / 1000));
    },
    getTimeLeftFormated : function()
    {
        var s;
        var time = this.getTimeLeft();

		if(time > 0)
		{
			var hours = Math.floor(time / (60 * 60));
			var minutes = Math.floor((time - hours * 60 * 60) / 60);
			var seconds = Math.floor(time - (hours * 60 * 60 + minutes * 60));

			s = (hours > 0 ? (hours < 10 ? "0" : "") + hours + ":" : "") + (minutes < 10 && hours > 0 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
		}
		else
		{
			s = "0:00";
		}

		return s;
    }
};
