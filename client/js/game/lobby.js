Lobby = (function()
{
	var private, Lobby = {};

	Lobby.LobbyState = {
		Connecting : 1,
		JoiningRoom : 2,
		WaitingForPlayers : 3,
		Starting : 4
	};

	Lobby.state = null;
	Lobby.startButton = null;

	Lobby.initialize = function()
	{
		if(!Network.isConnected()) {
			Lobby.state = Lobby.LobbyState.Connecting;
		}
		else if(!NetworkRoom.inRoom()) {
			Lobby.state = Lobby.LobbyState.JoiningRoom;
		}
		else {
			Lobby.state = Lobby.LobbyState.WaitingForPlayers;
		}

		Lobby.startButton = new Button(
			new Sprite(new Appelicious.Vector2(0, 434), Resources.images.button_green),
			new Sprite(new Appelicious.Vector2(0, 434), Resources.images.button_green_hover),
			new Text("Start Game", new Appelicious.Vector2(0, -3), 24, "white", false, "center", "middle"),
			function()
			{
				if(Lobby.state == Lobby.LobbyState.WaitingForPlayers) {
					Network.doInitStartGame();
				}
			}
		);
	};

	Lobby.update = function()
    {

	};

	Lobby.draw = function(c, ctx)
    {
        /* BG */
        ctx.fillStyle = "rgba(0, 0, 0, " + (0.7) + ")";
        ctx.fillRect(0, 0, c.width, c.height);

		/* TOP BAR */
		ctx.fillStyle = "rgba(0, 0, 0, " + (0.7) + ")";
        ctx.fillRect(0, 0, c.width, 50);

		Texter.setText(ctx, "Lobby", {x: 10, y: 25}, "white", 28, "left", false, "middle");

        /* LEFT BLUE BOX */
        var o = 15;
        var h = c.height - 100 - o * 2;
        var w = c.width / 2 - o * 1.5;
        var x = o;
        var y = c.height / 2 - h / 2;

        ctx.fillStyle = "rgba(0, 0, 255, " + (0.7) + ")";
        ctx.fillRect(x, y, w, h);

        Texter.setText(ctx, "Hunters", {x: x + o, y: y + o / 2}, "white", 40, "left", false) ;

		y += 40;
		for(var i = 0; i < NetworkRoom.players.length; i++)
		{
			if(NetworkRoom.players[i].team == Team.hunter)
			{
				Texter.setText(ctx, NetworkRoom.players[i].name, {x: x + o, y: y + o / 2}, "white", 20, "left", false) ;
				y += 20;
			}
		}

        /* RIGHT RED BOX */
        x = c.width - o - w;
        y = c.height / 2 - h / 2;

        ctx.fillStyle = "rgba(255, 0, 0, " + (0.7) + ")";
        ctx.fillRect(x, y, w, h);

        Texter.setText(ctx, "Survivors", {x: x + o, y: y + o / 2}, "white", 40, "left", false) ;

		y += 40;
		for(var i = 0; i < NetworkRoom.players.length; i++)
		{
			if(NetworkRoom.players[i].team == Team.survivor)
			{
				Texter.setText(ctx, NetworkRoom.players[i].name, {x: x + o, y: y + o / 2}, "white", 20, "left", false) ;
				y += 20;
			}
		}

		/* Bottom BG */
        ctx.fillStyle = "rgba(0, 0, 0, " + (0.7) + ")";
        ctx.fillRect(0, c.height - 50, c.width, 50);

		if(Lobby.state == Lobby.LobbyState.WaitingForPlayers) {
			Lobby.startButton.draw(c, ctx);
		}

        Texter.setText(ctx, Lobby.getStateText(), {x: c.width - 10, y: c.height - 35}, "white", 20, "right", false);
	};

	Lobby.getStateText = function()
	{
		var t = "";

		switch(Lobby.state) {
			case Lobby.LobbyState.Connecting:
				t = "Connecting...";
				break;
			case Lobby.LobbyState.JoiningRoom:
				t = "Joining room...";
				break;
			case Lobby.LobbyState.WaitingForPlayers:
				t = "Waiting for " + (NetworkRoom.maxPlayers - NetworkRoom.players.length) + " players...";
				break;
			case Lobby.LobbyState.Starting:
				t = "Starting in " + Appelicious.clamp(0, Game.timer.getTimeLeft());
				break;
		}

		return t;
	};

	Lobby.setState = function (state) {
	   Lobby.state = state;
   };

	return Lobby;
})();
