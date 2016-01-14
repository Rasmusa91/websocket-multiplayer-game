NetworkPlayer = function(player) {
    this.id = player.id;
    this.name = player.name;
    this.team = player.team;
    this.mine = false;
    this.moveHistory = [];
    this.wantedRotation = 0;
    this.arrowsShot = [];
};

NetworkPlayer.prototype =
{
    addMoveHistory : function(moveId, position) {
        this.moveHistory.push({
            id : moveId,
            pos : position
        });
    },
    setWantedRotation : function(rotation) {
        this.wantedRotation = rotation;
    },
    addArrowsShot : function(position, angle, timestamp) {
        this.arrowsShot.push({
            playerId : this.id,
            pos : position,
            angle : angle,
            time : timestamp
        });
    }
};
