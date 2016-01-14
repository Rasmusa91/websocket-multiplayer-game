Game = (function() {
    var private, Game = {};

    Game.GameState = {
        Loading     : 1,
        Lobby       : 2,
        Game        : 3,
        EndScreen   : 4
    },

    Game.gameState = Game.GameState.Loading;
    Game.timer = null;
    Game.players = [];
    Game.myPlayer = null;
    Game.explosions = [];
    Game.bloodSplats = [];
    Game.arrows = [];
    Game.floatingTexts = [];
    Game.GUIFloatingTexts = [];

    Game.GUItimerText = null;
    Game.GUIarrowsSprite = null;

    Game.initialize = function()
    {
        Input.initialize();

        Loading.initialize(function() {
            Game.initializeConnect();
        });
    };

    Game.initializeConnect = function()
    {
        Network.connect();
        Game.initializeLobby();
    };

    Game.initializeLobby = function()
    {
        for(var i = 0; i < Game.players.length; i++)
        {
            Game.players[i].alive = false;
        }

        Game.players = [];
        Game.myPlayer = null;

        Lobby.initialize();
        Game.changeState(Game.GameState.Lobby);
    };

    Game.onConnectedToMaster = function()
    {
        Lobby.setState(Lobby.LobbyState.JoiningRoom);
        Network.doJoinRoom();
    };

    Game.onJoinedRoom = function()
    {
        Lobby.setState(Lobby.LobbyState.WaitingForPlayers);
    };

    Game.initStartGame = function(duration, chests, valuables, timerEnds)
    {
        Map.spawnChests(chests);
        Map.spawnValuables(valuables);
        Lobby.setState(Lobby.LobbyState.Starting);
        Game.timer = new Timer(Math.floor(((timerEnds - Network.timeDiff) - Date.now()) / 1000), null);
    };

    Game.initializeGame = function(spawns, timerEnds)
    {
        for(var i = 0; i < NetworkRoom.players.length; i++)
        {
            var p = null;
            var spawn = null;

            for(var j = 0; j < spawns.length && spawn === null; j++)
            {
                if(NetworkRoom.players[i].id == spawns[j].p) {
                    spawn = new Appelicious.Vector2(spawns[j].x, spawns[j].y);
                }
            }

            if(NetworkRoom.players[i].id === Network.player.id)
            {
                if(NetworkRoom.players[i].team == Team.hunter) {
                    p = new CharacterHunterPlayer(spawn, Resources.images.player, NetworkRoom.players[i]);
                }
                else {
                    p = new CharacterSurvivorPlayer(spawn, Resources.images.monster, NetworkRoom.players[i]);
                }

                Game.myPlayer = p;
                Camera.setTarget(p);
            }
            else
            {
                if(NetworkRoom.players[i].team == Team.hunter) {
                    p = new CharacterHunterAI(spawn, Resources.images.player, NetworkRoom.players[i]);
                }
                else {
                    p = new CharacterSurvivorAI(spawn, Resources.images.monster, NetworkRoom.players[i]);
                }
            }

            Game.players.push(p);
        }

        Game.timer = new Timer(Math.floor(((timerEnds - Network.timeDiff) - Date.now()) / 1000), null);
        Game.GUIarrowsSprite = new Sprite(new Appelicious.Vector2(10, document.getElementById("canvas").height - Resources.images.arrow.img.height - 5), Resources.images.arrow);

        Game.changeState(Game.GameState.Game);
        //Sound.play("natureAmbient", true);
    };

    Game.update = function()
    {
        if(Game.gameState === Game.GameState.Lobby) {

        }

        if(Game.gameState === Game.GameState.Game || Game.gameState === Game.GameState.EndScreen)
        {
            for(var i = Game.arrows.length - 1; i >= 0; i--)
            {
                if(Game.arrows[i].active) {
                    Game.arrows[i].update();
                }
                else {
                    Game.arrows.splice(i, 1);
                }
            }

            for(var i = Game.bloodSplats.length - 1; i >= 0; i--)
            {
                if(Game.bloodSplats[i].active) {
                    Game.bloodSplats[i].update();
                }
                else {
                    Game.bloodSplats.splice(i, 1);
                }
            }

            for(var i = Game.explosions.length - 1; i >= 0; i--)
            {
                if(Game.explosions[i].active) {
                    Game.explosions[i].update();
                }
                else {
                    Game.explosions.splice(i, 1);
                }
            }

            for(var i = Game.floatingTexts.length - 1; i >= 0; i--)
            {
                if(Game.floatingTexts[i].active) {
                    Game.floatingTexts[i].update();
                }
                else {
                    Game.floatingTexts.splice(i, 1);
                }
            }

            for(var i = Game.GUIFloatingTexts.length - 1; i >= 0; i--)
            {
                if(Game.GUIFloatingTexts[i].active) {
                    Game.GUIFloatingTexts[i].update();
                }
                else {
                    Game.GUIFloatingTexts.splice(i, 1);
                }
            }
		}
        if(Game.gameState === Game.GameState.Game)
        {
             for(var i = 0; i < Game.players.length; i++)
             {
                 if(Game.players[i].alive) {
                     Game.players[i].update();
                 }
            }
        }
        if(Game.gameState === Game.GameState.EndScreen)
        {
            EndScreen.update();
        }
    };

    Game.draw = function(c, ctx)
    {
		ctx.save();
        Camera.translate(c, ctx);

        if(Game.gameState === Game.GameState.Lobby || Game.gameState === Game.GameState.Game || Game.gameState === Game.GameState.EndScreen)  {
            Map.draw(c, ctx, Game.players);
        }

		if(Game.gameState === Game.GameState.Game || Game.gameState === Game.GameState.EndScreen)
        {
            for(var key in Game.arrows)
            {
                if(Game.arrows[key].active) {
                    Game.arrows[key].draw(c, ctx);
                }
            }

            for(var key in Game.bloodSplats)
            {
                if(Game.bloodSplats[key].active) {
                    Game.bloodSplats[key].draw(c, ctx);
                }
            }

            for(var key in Game.explosions)
            {
                if(Game.explosions[key].active) {
                    Game.explosions[key].draw(c, ctx);
                }
            }

            for(var key in Game.floatingTexts)
            {
                if(Game.floatingTexts[key].active) {
                    Game.floatingTexts[key].draw(c, ctx);
                }
            }
		}

        ctx.restore();

        if(Game.gameState === Game.GameState.Loading) {
            Loading.draw(c, ctx);
        }

        if(Game.gameState === Game.GameState.Lobby)
        {
            Lobby.draw(c, ctx);
            //Topbar.draw(c, ctx);
        }

        if(Game.gameState === Game.GameState.Game)
        {
            ctx.beginPath();

            if(Network.player.team == Team.hunter) {
                ctx.rect(5, c.height - 40, 65, 35);
            }

            ctx.rect(c.width / 2 - 40, 5, 80, 35);
            ctx.fillStyle = "rgba(0, 0, 0, " + (0.7) + ")";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.stroke();

            Texter.setText(ctx, Game.timer.getTimeLeftFormated(), {x: c.width / 2, y: 10}, "white", 22, "center", true);

            if(Network.player.team == Team.hunter)
            {
                Game.GUIarrowsSprite.draw(c, ctx);
                Texter.setText(ctx, Game.myPlayer.getArrowsAmount(), {x: Game.GUIarrowsSprite.img.img.width + 15, y: c.height - Game.GUIarrowsSprite.img.img.height * 0.5 - 5}, "white", 16, "left", true, "middle");
            }

            for(var key in Game.GUIFloatingTexts)
            {
                if(Game.GUIFloatingTexts[key].active) {
                    Game.GUIFloatingTexts[key].draw(c, ctx);
                }
            }
        }

        if(Game.gameState === Game.GameState.EndScreen)
        {
            EndScreen.draw(c, ctx);
        }
    };

    Game.setGameTimer = function(timerEnds)
    {
        Game.timer = new Timer(Math.floor(((timerEnds - Network.timeDiff) - Date.now()) / 1000), null);
    };

    Game.endGame = function(winningTeam, timerEnds)
    {
        for(var i = 0; i < Game.players.length; i++)
        {
            Game.players[i].canControl = false;
        }

        Game.timer = new Timer(Math.floor(((timerEnds - Network.timeDiff) - Date.now()) / 1000), null);
        Game.changeState(Game.GameState.EndScreen);
        EndScreen.initialize(winningTeam);
    };

    Game.restart = function() {
        Map.reInitialize();
        Game.initializeLobby();
    };

    Game.changeState = function(state) {
        Game.gameState = state;
    };

    Game.addExplosion = function(pos) {
        Game.explosions.push(new Explosion(pos));
    };

    Game.addArrow = function(pos, angle, owner) {
        Game.arrows.push(new Arrow(pos, angle, owner));
    };

    Game.addFloatingText = function(text, pos) {
        Game.floatingTexts.push(new FloatingText(text, pos));
    };

    Game.addGUIFloatingText = function(text, pos, speed, color) {
        Game.GUIFloatingTexts.push(new FloatingText(text, pos, speed, color));
    };

    Game.addTimeSubFloatingText = function(subbedTime) {
        Game.addGUIFloatingText("-" + (subbedTime / 1000) + " time", new Appelicious.Vector2(document.getElementById("canvas").width / 2 + 40, 30), 1, (Network.player.team == Team.hunter ? {r : 155, g : 0, b : 0} : {r : 0, g : 155, b : 0}));
    };

    Game.getPlayerByNetworkId = function(id)
    {
        var p = null;

        for(var i = 0; i < Game.players.length; i++)
        {
            if(Game.players[i].owner.id == id) {
                p = Game.players[i];
            }
        }

        return p;
    };

    Game.getAlivePlayerIdAtPos = function(pos)
    {
        var id = -1;

        for(var i = 0; i < Game.players.length && id === -1; i++)
        {
            if(Game.players[i].alive && Game.players[i].getTilePosition().equals(pos)) {
                id = i;
            }
        }

        return id;
    };

    Game.replicateKillPlayerById = function(id, owner)
    {
        if(id !== -1 && (owner === null || (owner !== null && owner.isMine() && owner.owner.team != Game.players[id].owner.team)))
        {
            Game.killPlayer(Game.players[id]);
            Network.replicateKillPlayer(Game.players[id].owner.id);
        }
    };

    Game.killPlayer = function(player)
    {
        if(!player.alive) {
            return false;
        }

        player.alive = false;
        Map.addBloodSplat(player.getTilePosition());
        Game.bloodSplats.push(new BloodSplat(player.getPosition()));
        Sound.play("bloodsplat");
    };

    return Game;
})();
