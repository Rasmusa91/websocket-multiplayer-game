$(document).ready(function(){
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.id = "canvas";
    canvas.width = 928;
    canvas.height = 480;
    canvas.style.border = "1px solid #000";
    canvas.style.width = "100%";
    document.getElementById("game").appendChild(canvas);

    $('canvas').bind('contextmenu', function(e){
        return false;
    });

    Game.initialize();

    FPS.initialize();
    PING.initialize();

    var gameLoop = (function()
    {
        var loops = 0, skipTicks = 1000 / 30;
        var maxFrameSkip = 10;
        var nextGameTick = (new Date).getTime();

        return function()
        {
            loops = 0;

            while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip)
            {
                Game.update();
                nextGameTick += skipTicks;
                loops++;
            }

            FPS.update();

            Game.draw(canvas, context);
            FPS.draw(canvas, context);
            PING.draw(canvas, context);

            window.requestAnimationFrame(gameLoop);
        };
    })();

    window.requestAnimationFrame(gameLoop);
});
