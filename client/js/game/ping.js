PING = (function() {
    var private, PING = {};

    PING.text = null;

    PING.initialize = function() {
        PING.text = new Text("Ping: -", new Appelicious.Vector2(document.getElementById("canvas").width - 5, 23), 18, "white", true, "right", "top");
    };

    PING.draw = function(c, ctx) {
        PING.text.text = "Ping: " + Network.ping;
        PING.text.draw(c, ctx);
    };

    return PING;
})();
