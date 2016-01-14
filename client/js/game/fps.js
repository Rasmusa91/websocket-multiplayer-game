FPS = (function() {
    var private, FPS = {};

    FPS.counter = 0;
    FPS.FPS = 0;
    FPS.timer = 0;
    FPS.text = null;

    FPS.initialize = function() {
        FPS.text = new Text("FPS: -", new Appelicious.Vector2(document.getElementById("canvas").width - 5, 5), 18, "white", true, "right", "top");
    };

    FPS.update = function() {
        FPS.counter++;

        if (Date.now() - FPS.timer >= 1000) {
            FPS.FPS = FPS.counter;
            FPS.counter = 0;
            FPS.timer = Date.now();
        }

        FPS.text.text = "FPS: " + FPS.FPS;
    };

    FPS.draw = function(c, ctx) {
        FPS.text.draw(c, ctx);
    };

    return FPS;
})();
