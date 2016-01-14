Player = function(peer, id) {
    this.id = id;
    this.peer = peer;
    this.name = "player" + id;
    this.team = null;
    this.roomId = -1;
    this.alive = false;
};

Player.prototype = {
    serialize : function() {
        return '{"id" : ' + this.id + ', "name" : "' + this.name + '", "team" : "' + this.team + '"}';
    },
    sendMsg : function(msg) {
        this.peer.sendUTF(msg);
    }
};
