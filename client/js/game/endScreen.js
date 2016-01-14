EndScreen = (function() {
    var private, EndScreen = {};

    EndScreen.endScreenState = {
        FadeBG : 1,
        Ending : 2
    };

    EndScreen.state = EndScreen.endScreenState.FadeBG;
    EndScreen.alpha = 0;
    EndScreen.title = null;
    EndScreen.desc = null;

    EndScreen.initialize = function(winningTeam) {
        EndScreen.title = new Text((winningTeam == Team.hunter ? "Hunters win!" : "Survivors win!"),
            new Appelicious.Vector2(
                document.getElementById("canvas").width * 0.5,
                document.getElementById("canvas").height * 0.5
            ),
            40, "white", true, "center", "middle");

        EndScreen.desc = new Text("Ending in ",
            new Appelicious.Vector2(
                document.getElementById("canvas").width - 10,
                document.getElementById("canvas").height -10
            ),
            20, "white", true, "right", "bottom");

        EndScreen.state = EndScreen.endScreenState.FadeBG;
        EndScreen.alpha = 0;
    };

    EndScreen.update = function()
    {
        if(EndScreen.state === EndScreen.endScreenState.FadeBG)
        {
            EndScreen.alpha = Appelicious.clamp(Game.timer.getTimePerc() / 0.1, 0, 1);

            if(Game.timer.getTimePerc()  >= 0.1) {
                EndScreen.state = EndScreen.endScreenState.Ending;
            }
        }

        EndScreen.desc.text = "Continuing in " + Appelicious.clamp(Game.timer.getTimeLeft(), 0, Game.timer.duration);
    };

    EndScreen.draw = function(c, ctx)
    {
        ctx.fillStyle = "rgba(0, 0, 0, " + (EndScreen.alpha * 0.7) + ")";
        ctx.fillRect(0, 0, c.width, c.height);

        EndScreen.title.draw(c, ctx);

        if(EndScreen.state === EndScreen.endScreenState.Ending)
        {
            EndScreen.desc.draw(c, ctx);
        }
    };

    return EndScreen;
})();
