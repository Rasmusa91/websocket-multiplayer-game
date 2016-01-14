require("./map.js");

Room = function(id) {
	this.RoomState = {
		Lobby : 1,
		Starting : 2,
		Game : 3,
		End : 4
	};

	this.state = this.RoomState.Lobby;

	this.id = id;
	this.playerLimit = 8;
	this.players = [];
	this.timer = null;
	this.timerEnding = null;
	this.timerCallback = null;

	this.map = new Map();
};

Room.prototype = {
	serialize : function()
	{
		var players = "";

		for(var i = 0; i < this.players.length; i++)
		{
			players += this.players[i].serialize();

			if(this.players.length - 1 > i) {
				players += ", ";
			}
		}

		players = "[" + players + "]";

		return '{"id" : ' + this.id + ', "players" : ' + players + '}';
	},
	broadcast : function(msg) {
		console.log("outgoing: " + msg);
		for(var i = 0; i < this.players.length; i++) {
			this.players[i].sendMsg(msg);
		}
	},
	addPlayer : function(player) {
		this.players.push(player);
		this.assignPlayerTeam(player);
		this.broadcast('{"type" : "onPlayerJoinRoom", "player" : ' + player.serialize() + '}');

		console.log("Player (" + player.id + ") added to room (" + this.id + ")");
	},
	removePlayer : function(player) {
		var id = -1;

		for (var i = 0; i < this.players.length && id === -1; i++)
		{
			if (player.id === this.players[i].id) {
				id = i;
			}
		}

		if(id !== -1) {
			this.players.splice(id, 1);
		}

		if(this.state == this.RoomState.Game) {
			this.checkAlivePlayers();
		}

		this.broadcast('{"type" : "onPlayerLeaveRoom", "player" : ' + player.serialize() + '}');

		console.log("Player (" + player.id + ") removed from room (" + this.id + ")");
	},
	getAvailableSpots : function() {
		return this.playerLimit - this.players.length;
	},
	assignPlayerTeam : function(player)
	{
		var hunters = 0;
		var survivors = 0;

		for(var i = 0; i < this.players.length; i++)
		{
			if(this.players[i].team === Team.hunter) {
				hunters++;
			}
			else if(this.players[i].team === Team.survivor) {
				survivors++;
			}
		}

		player.team = (hunters > survivors ? Team.survivor : Team.hunter);
	},
	requestInitStartGame : function()
	{
		if(this.state === this.RoomState.Lobby) {
			this.initStartGame();
		}
	},
	initStartGame : function()
	{
		this.state = this.RoomState.Starting;

		this.map.reset();

		var self = this;
		this.setTimer(function() {
			self.startGame();
		}, 10000);

		this.broadcast('{"type" : "onInitStartGame", "timerEnds" : ' + this.timerEnding + ', "chests" : ' + JSON.stringify(this.map.chests) + ', "valuables" : ' + JSON.stringify(this.map.valuables) + '}');

		console.log("Preparing to start game in room (" + this.id + ")");
	},
	startGame : function()
	{
		for(var i = 0; i < this.players.length; i++) {
			this.players[i].alive = true;
		}

		this.state = this.RoomState.Game;

		var self = this;
		this.setTimer(function() {
			self.endGame(Team.survivor);
		}, 300000);

		this.broadcast('{"type" : "onStartGame", "timerEnds" : ' + (this.timerEnding) + ', "spawns" : ' + JSON.stringify(this.map.generateSpawnpoints(this.players)) + '}');

		console.log("Game started in room (" + this.id + ")");
	},
	positionRecieved : function(playerId, moveId, position) {
		this.broadcast('{"type" : "onPlayerPositionUpdate", "playerId" : ' + playerId + ', "moveId" : ' + moveId + ', "position" : {"x" : ' + position.x + ', "y" : ' + position.y + '}}');
	},
	rotationRecieved : function(playerId, rotation) {
		this.broadcast('{"type" : "onPlayerRotationUpdate", "playerId" : ' + playerId + ', "rotation" : ' + rotation + '}');
	},
	doorChange : function(pos, open) {
		this.map.doorChange(pos, open);
		this.broadcast('{"type" : "onDoorChange", "pos" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}, "open" : ' + open + '}');
	},
	shootArrow : function(playerId, position, angle, timestamp) {
		this.broadcast('{"type" : "onShootArrow", "playerId" : ' + playerId + ', "position" : {"x" : ' + position.x + ', "y" : ' + position.y + '}, "angle" : ' + angle + ', "timestamp" : ' + timestamp + '}');
	},
	chestDestroyed : function(pos, chestEvent)
	{
		if(this.map.chestDestroyed(pos)) {
			this.broadcast('{"type" : "onChestDestroyed", "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}, "chestEvent" : ' + chestEvent + '}');
		}
	},
	pickupValuable : function(pos)
	{
		if(this.map.pickupValuable(pos))
		{
			var timeToSub = 2000;

			this.addTime(-timeToSub);

			this.broadcast('{"type" : "onGameTimerAltered", "timerEnds" : ' + this.timerEnding + '}');
			this.broadcast('{"type" : "onValuablePickup", "subbedTime" : ' + timeToSub + ', "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}}');
		}
	},
	possessChest : function(playerId, pos) {
		this.broadcast('{"type" : "onPossessChest", "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}, "playerId" : ' + playerId + '}');
	},
	unPossessChest : function(playerId, pos) {
		this.broadcast('{"type" : "onUnPossessChest", "position" : {"x" : ' + pos.x + ', "y" : ' + pos.y + '}, "playerId" : ' + playerId + '}');
	},
	killPlayer : function(playerId) {
		for(var i = 0; i < this.players.length; i++)
		{
			if(this.players[i].id == playerId) {
				this.players[i].alive = false;
			}
		}

		if(this.state == this.RoomState.Game) {
			this.checkAlivePlayers();
		}

		this.broadcast('{"type" : "onKillPlayer", "playerId" : ' + playerId + '}');
	},
	addPlayerArrow : function(playerId) {
		this.broadcast('{"type" : "onAddPlayerArrow", "playerId" : ' + playerId + '}');
	},
	checkAlivePlayers : function()
	{
		var aliveHunters = 0;
		var aliveSurvivors = 0;

		for(var i = 0; i < this.players.length; i++)
		{
			if(this.players[i].alive)
			{
				if(this.players[i].team == Team.hunter) {
					aliveHunters++;
				}
				else if(this.players[i].team == Team.survivor) {
					aliveSurvivors++;
				}
			}
		}

		if(aliveHunters === 0) {
			this.endGame(Team.survivor);
		}
		else if(aliveSurvivors === 0) {
			this.endGame(Team.hunter);
		}
	},
	endGame : function(winningTeam)
	{
		if(this.state != this.RoomState.Game) {
			return;
		}

		this.state = this.RoomState.End;

		var self = this;
		this.setTimer(function() {
			self.restartGame();
		}, 10000);

		this.broadcast('{"type" : "onEndGame", "timerEnds" : ' + (this.timerEnding) + ', "winningTeam" : ' + winningTeam + '}');
	},
	restartGame : function() {
		this.state = this.RoomState.Lobby;

		for(var i = 0; i < this.players.length; i++) {
			this.players[i].alive = true;
		}

		this.switchTeams();

		this.broadcast('{"type" : "onRestartGame"}');
	},
	switchTeams : function()
	{
		for(var i = 0; i < this.players.length; i++)
		{
			if(this.players[i].team == Team.hunter) {
				this.players[i].team = Team.survivor;
			}
			else if(this.players[i].team == Team.survivor) {
				this.players[i].team = Team.hunter;
			}

			this.broadcast('{"type" : "onPlayerTeamChange", "playerId" : ' + this.players[i].id + ', "team" : ' + this.players[i].team + '}');
		}
	},
	setTimer : function(callback, duration)
	{
		this.clearTimer();
		this.timerEnding = Date.now() + duration;
		this.timerCallback = callback;
		this.timer = setTimeout(callback, duration);
	},
	clearTimer : function()
	{
		clearTimeout(this.timer);
	},
	addTime : function(amount)
	{
		this.setTimer(this.timerCallback, (this.timerEnding - Date.now()) + amount);
	}
};
