require("./../shared/appelicious.js");
require("./team.js");
require("./player.js");
require("./room.js");

Master = (function() {
	var private, Master = {};

	Master.players = [];
    Master.rooms = [];
    Master.totalPlayers = 0;
    Master.totalRooms = 0;

    Master.addPlayer = function(peer)
    {
        var player = new Player(peer, ++Master.totalPlayers);
        Master.players.push(player);

		console.log("Player (" + player.id + ") added to master");

        return player;
    };

	Master.removePlayer = function(player)
    {
		/* Remove player from her room */
		for(var i = 0; i < Master.rooms.length; i++)
		{
			if(Master.rooms[i].id === player.roomId) {
				Master.rooms[i].removePlayer(player);
			}
		}

		/* Remove player from the master server */
		var arrId = -1;

		for (var i = 0; i < Master.players.length && arrId === -1; i++)
		{
			if (Master.players[i].id === player.id) {
				arrId = i;
			}
		}

		if(arrId !== -1) {
			Master.players.splice(arrId, 1);
		}

		console.log("Player (" + player.id + ") removed from master");

        return player;
    };

    Master.roomRequest = function(player)
    {
        console.log("Room requested");

        var room = Master.findEmptyRoom();
		player.roomId = room.id;
        room.addPlayer(player);

		player.sendMsg('{"type" : "onJoinRoom", "room" : ' + room.serialize() + ', "player" : ' + player.serialize() + ', "date" : ' + Date.now() + '}');
    };

    Master.createRoom = function()
    {
        console.log("Creating room");

        var room = new Room(++Master.totalRooms);
        Master.rooms.push(room);

        return room;
    };

    Master.findEmptyRoom = function()
    {
        var room = null;

        for (var i = 0; i < Master.rooms.length && room === null; i++)
        {
            if(Master.rooms[i].getAvailableSpots() > 0 && Master.rooms[i].state === Master.rooms[i].RoomState.Lobby) {
                room = Master.rooms[i];
            }
        }

        if(room === null) {
            room = Master.createRoom();
        }

        return room;
    };

	Master.getRoomById = function(id)
	{
		var room = null;

		for(var i = 0; i < Master.rooms.length && room === null; i++)
		{
			if(Master.rooms[i].id === id) {
				room = Master.rooms[i];
			}
		}

		return room;
	};

	Master.roomRequestInitStart = function(id)
	{
		Master.getRoomById(id).requestInitStartGame();
	};

	Master.playerPosRecieved = function(roomId, playerId, moveId, position)
	{
		Master.getRoomById(roomId).positionRecieved(playerId, moveId, position);
	};

	Master.playerRotRecieved = function(roomId, playerId, rotation)
	{
		Master.getRoomById(roomId).rotationRecieved(playerId, rotation);
	};

	Master.doorChange = function(roomId, pos, open)
	{
		Master.getRoomById(roomId).doorChange(pos, open);
	};

	Master.shootArrow = function(roomId, playerId, position, angle, timestamp)
	{
		Master.getRoomById(roomId).shootArrow(playerId, position, angle, timestamp);
	};

	Master.chestDestroyed = function(roomId, pos, chestEvent)
	{
		Master.getRoomById(roomId).chestDestroyed(pos, chestEvent);
	};

	Master.possessChest = function(roomId, playerId, position)
	{
		Master.getRoomById(roomId).possessChest(playerId, position);
	};

	Master.unPossessChest = function(roomId, playerId, position)
	{
		Master.getRoomById(roomId).unPossessChest(playerId, position);
	};

	Master.killPlayer = function(roomId, playerId)
	{
		Master.getRoomById(roomId).killPlayer(playerId);
	};

	Master.addPlayerArrow = function(roomId, playerId)
	{
		Master.getRoomById(roomId).addPlayerArrow(playerId);
	};

	Master.sendPickupValuable = function(roomId, position)
	{
		Master.getRoomById(roomId).pickupValuable(position);
	};

    return Master;
})();
