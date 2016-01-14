Network = (function () {
	var private, Network = {};

	Network.ping = "-";
	Network.pingedAt = null;
	Network.pingTimeout = null;
	Network.player = null;
	Network.websocket = null;
	Network.timeDiff = 0;

	Network.connect = function()
	{
		Network.websocket = new WebSocket("ws://nodejs1.student.bth.se:8133", "game-protocol");

	    Network.websocket.onopen = function()
	    {
	    	Network.doPingServer();
	    	Game.onConnectedToMaster();
	    };

	    Network.websocket.onmessage = function(e)
	    {
	       Network.handleMessage(e.data);
	    };

	    Network.websocket.onclose = function()
	    {
	        clearTimeout(Network.pingTimeout);
	        Network.pingTimeout = null;
	    };

	    Network.websocket.onerror = function()
	    {

	    };
	};

	Network.handleMessage = function(msg)
	{
		var json = JSON.parse(msg);

		if(json.type === "ping") {
			Network.onServerPinged(json.date);
		}
		else if(json.type === "onJoinRoom") {
			Network.onJoinRoom(json.player, json.room, json.date);
		}
		else if(json.type === "onPlayerJoinRoom") {
			Network.onPlayerJoinRoom(json.player);
		}
		else if(json.type === "onPlayerLeaveRoom") {
			Network.onPlayerLeaveRoom(json.player);
		}
		else if(json.type === "onInitStartGame") {
			Network.onInitStartGame(json.duration, json.chests, json.valuables, json.timerEnds);
		}
		else if(json.type === "onStartGame") {
			Network.onStartGame(json.spawns, json.timerEnds);
		}
		else if(json.type === "onPlayerPositionUpdate") {
			Network.onPlayerPositionUpdate(json.playerId, json.moveId, json.position);
		}
		else if(json.type === "onPlayerRotationUpdate") {
			Network.onPlayerRotationUpdate(json.playerId, json.rotation);
		}
		else if(json.type === "onDoorChange") {
			Network.onDoorChange(json.pos, json.open);
		}
		else if(json.type === "onShootArrow") {
			Network.onShootArrow(json.playerId, json.position, json.angle, json.timestamp);
		}
		else if(json.type === "onChestDestroyed") {
			Network.onChestDestroyed(json.position, json.chestEvent);
		}
		else if(json.type === "onPossessChest") {
			Network.onPossessChest(json.playerId, json.position);
		}
		else if(json.type === "onUnPossessChest") {
			Network.onUnPossessChest(json.playerId, json.position);
		}
		else if(json.type === "onKillPlayer") {
			Network.onKillPlayer(json.playerId);
		}
		else if(json.type === "onEndGame") {
			Network.onEndGame(json.winningTeam, json.timerEnds);
		}
		else if(json.type === "onRestartGame") {
			Network.onRestartGame();
		}
		else if(json.type === "onPlayerTeamChange") {
			Network.onPlayerTeamChange(json.playerId, json.team);
		}
		else if(json.type === "onAddPlayerArrow") {
			Network.onAddPlayerArrow(json.playerId);
		}
		else if(json.type === "onValuablePickup") {
			Network.onValuablePickup(json.position, json.subbedTime);
		}
		else if(json.type === "onGameTimerAltered") {
			Network.onGameTimerAltered(json.timerEnds);
		}
	};

	Network.isConnected = function() {
		return (Network.websocket !== null && Network.websocket.readyState === Network.websocket.OPEN);
	};

	Network.doPingServer = function()
	{
        Network.pingTimeout = setTimeout(function() {
        	Network.pingedAt = Date.now();
			Network.websocket.send('{"type" : "requestPing"}');
        }, 1000);
	};

	Network.onServerPinged = function(serverDate) {
		Network.ping = Date.now() - Network.pingedAt;
		Network.timeDiff = serverDate - Date.now() - Network.ping;
		Network.doPingServer();
	};

	Network.doJoinRoom = function() {
		Network.websocket.send('{"type" : "requestRoom"}');
	};

	Network.onJoinRoom = function(player, room, serverDate) {
		Network.timeDiff = serverDate - Date.now();
		Network.player = NetworkRoom.getNetworkPlayer(player.id);
		NetworkRoom.deserialize(room);
		Game.onJoinedRoom();
	};

	Network.onPlayerJoinRoom = function(player) {
		NetworkRoom.addPlayer(player);
	};

	Network.onPlayerLeaveRoom = function(player) {
		NetworkRoom.removePlayer(player);
	};

	Network.doInitStartGame = function() {
		Network.websocket.send('{"type" : "requestInitStartGame", "roomId" : ' + NetworkRoom.id + '}');
	};

	Network.onInitStartGame = function(duration, chests, valuables, timerEnds) {
		Game.initStartGame(duration, chests, valuables, timerEnds);
	};

	Network.onStartGame = function(spawns, timerEnds) {
		Game.initializeGame(spawns, timerEnds);
	};

	Network.sendPlayerPosition = function(playerId, moveId, position) {
		Network.websocket.send('{"type" : "sendPlayerPosition", "roomId" : ' + NetworkRoom.id + ', "playerId" : ' + playerId + ', "moveId" : ' + moveId + ', "position" : {"x" : ' + position.x + ', "y" : ' + position.y + '}}');
	};

	Network.onPlayerPositionUpdate = function(playerId, moveId, position) {
		NetworkRoom.playerPositionUpdated(playerId, moveId, position);
	};

	Network.onPlayerRotationUpdate = function(playerId, rotation) {
		NetworkRoom.playerRotationUpdated(playerId, rotation);
	};

	Network.sendPlayerRotation = function(playerId, rotation) {
		Network.websocket.send('{"type" : "sendPlayerRotation", "roomId" : ' + NetworkRoom.id + ', "playerId" : ' + playerId + ', "rotation" : ' + rotation + '}');
	};

	Network.sendDoorState = function(pos, open) {
		Network.websocket.send('{"type" : "sendDoorState", "roomId" : ' + NetworkRoom.id + ', "pos" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}, "open" : ' + open + '}');
	};

	Network.onDoorChange = function(pos, open) {
		Map.changeDoorState(pos, open);
	};

	Network.replicateShootArrow = function(playerId, position, angle, timestamp) {
		Network.websocket.send('{"type" : "sendShootArrow", "roomId" : ' + NetworkRoom.id + ', "playerId" : ' + playerId + ', "position" : {"x" : ' + position.x + ', "y" : ' + position.y + '}, "angle" : ' + angle + ', "timestamp" : ' + timestamp + '}');
	};

	Network.onShootArrow = function(playerId, position, angle, timestamp) {
		NetworkRoom.shootArrow(playerId, position, angle, timestamp);
	};

	Network.replicateDestroyChest = function(pos, chestEvent) {
		Network.websocket.send('{"type" : "sendDestroyChest", "roomId" : ' + NetworkRoom.id + ', "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}, "chestEvent" : ' + chestEvent + '}');
	};

	Network.onChestDestroyed = function(pos, chestEvent) {
		Map.destroyChest(pos, chestEvent);
	};

	Network.replicatePossessChest = function(pos, playerId) {
		Network.websocket.send('{"type" : "sendPossessChest", "roomId" : ' + NetworkRoom.id + ', "playerId" : ' + playerId + ', "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}}');
	};

	Network.replicateUnPossessChest = function(pos, playerId) {
		Network.websocket.send('{"type" : "sendUnPossessChest", "roomId" : ' + NetworkRoom.id + ', "playerId" : ' + playerId + ', "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}}');
	};

	Network.onPossessChest = function(playerId, pos) {
		NetworkRoom.possessChest(playerId, pos);
	};

	Network.onUnPossessChest = function(playerId, pos) {
		NetworkRoom.unPossessChest(playerId, pos);
	};

	Network.replicateKillPlayer = function(playerId) {
		Network.websocket.send('{"type" : "sendKillPlayer", "roomId" : ' + NetworkRoom.id + ', "playerId" : ' + playerId + '}');
	};

	Network.onKillPlayer = function(playerId) {
		Game.killPlayer(Game.getPlayerByNetworkId(playerId));
	};

	Network.onEndGame = function(winningTeam, timerEnds) {
		Game.endGame(winningTeam, timerEnds);
	};

	Network.onRestartGame = function() {
		Game.restart();
	};

	Network.onPlayerTeamChange = function(playerId, team) {
		NetworkRoom.setPlayerTeam(playerId, team);
	};

	Network.replicateAddArrow = function(playerId) {
		Network.websocket.send('{"type" : "sendAddArrow", "roomId" : ' + NetworkRoom.id + ', "playerId" : ' + playerId + '}');
	};

	Network.onAddPlayerArrow = function(playerId) {
		NetworkRoom.playerAddArrow(playerId);
	};

	Network.replicatePickupValuable = function(pos) {
		Network.websocket.send('{"type" : "sendPickupValuable", "roomId" : ' + NetworkRoom.id + ', "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}}');
	};

	Network.onValuablePickup = function(pos, subbedTime) {
		Map.pickupValuable(pos);
		Game.addTimeSubFloatingText(subbedTime);
	};

	Network.onGameTimerAltered = function(timerEnds) {
		Game.setGameTimer(timerEnds);
	};

	return Network;
})();
