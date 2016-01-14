NetworkRoom = (function() {
    var private, NetworkRoom = {};

    NetworkRoom.id = -1;
    NetworkRoom.players = [];
    NetworkRoom.maxPlayers = 8;

    NetworkRoom.deserialize = function(room)
    {
        NetworkRoom.id = room.id;

        for(var i = 0; i < room.players.length; i++) {
            NetworkRoom.addPlayer(room.players[i]);
        }
    };

    NetworkRoom.inRoom = function()
    {
        return (NetworkRoom.id >= 0);
    };

    NetworkRoom.addPlayer = function(player)
    {
        var unique = true;

        for(var i = 0; i < NetworkRoom.players.length && unique; i++)
        {
            if(NetworkRoom.players[i].id === player.id) {
                unique = false;
            }
        }

        if(unique)
        {
            NetworkRoom.players.push(new NetworkPlayer(player));
        }
    };

    NetworkRoom.removePlayer = function(player)
    {
        var id = -1;

		for (var i = 0; i < NetworkRoom.players.length && id === -1; i++)
		{
			if (player.id === NetworkRoom.players[i].id) {
				id = i;
			}
		}

		if(id !== -1) {
			NetworkRoom.players.splice(id, 1);
		}
    };

    NetworkRoom.getNetworkPlayer = function(playerId)
    {
        var p = null;

        for(var i = 0; i < NetworkRoom.players.length; i++)
        {
            if(NetworkRoom.players[i].id === playerId) {
                p = NetworkRoom.players[i];
            }
        }

        return p;
    };

    NetworkRoom.setPlayerTeam = function(playerId, team)
    {
        var p = NetworkRoom.getNetworkPlayer(playerId);

        if(p !== null) {
            p.team = team;
        }
    };

    NetworkRoom.playerPositionUpdated = function(playerId, moveId, position)
    {
        if(Network.player.id !== playerId) {
            NetworkRoom.getNetworkPlayer(playerId).addMoveHistory(moveId, position);
        }
    };

    NetworkRoom.playerRotationUpdated = function(playerId, rotation)
    {
        if(Network.player.id !== playerId) {
            NetworkRoom.getNetworkPlayer(playerId).setWantedRotation(rotation);
        }
    };

    NetworkRoom.shootArrow = function(playerId, position, angle, timestamp)
    {
        if(Network.player.id !== playerId) {
            NetworkRoom.getNetworkPlayer(playerId).addArrowsShot(position, angle, timestamp);
        }
    };

    NetworkRoom.possessChest = function(playerId, position)
    {
        if(Network.player.id !== playerId) {
            Game.getPlayerByNetworkId(playerId).possessChest(new Appelicious.Vector2(position.x, position.y));
        }
    };

    NetworkRoom.unPossessChest = function(playerId, position)
    {
        if(Network.player.id !== playerId) {
            Game.getPlayerByNetworkId(playerId).unPossessChest(new Appelicious.Vector2(position.x, position.y));
        }
    };

    NetworkRoom.playerAddArrow = function(playerId)
    {
        if(Network.player.id !== playerId) {
            Game.getPlayerByNetworkId(playerId).arrowsAmount++;
        }
    };

    return NetworkRoom;
})();
