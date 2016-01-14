 function Character(pos, img, owner) {
    this.pos = pos;
    this.img = img;
    this.owner = owner;

    this.sprite = null;
    this.wantedPos = null;
    this.alive = true;

    this.canControl = true;

    this.speed = Map.tileSize / 8;
}

Character.prototype = {
    initialize : function() {
        this.sprite = new SpriteSheet(this.pos, this.img);
        this.wantedPos = new Appelicious.Vector2(this.sprite.pos.x, this.sprite.pos.y);
        this.alive = true;
    },
    update : function()
    {
        if(!this.alive) {
            return;
        }

        if(!this.sprite.pos.equals(this.wantedPos))
        {
            this.sprite.setIdle(false);
            this.sprite.offsetPos = this.sprite.offsetPos.add(this.wantedPos.sub(this.sprite.pos).prod(this.speed));

            if(this.sprite.pos.distance(this.sprite.pos.add(this.sprite.offsetPos)) >= Map.tileSize)
            {
                this.sprite.offsetPos = new Appelicious.Vector2(0, 0);
                this.sprite.pos = this.wantedPos;
                this.onArriveDestination();
            }
        }
        else {
            this.sprite.setIdle(true);
        }

        this.sprite.update();
    },
    draw : function(c, ctx)
    {
        if(!this.alive) {
            return;
        }

        this.sprite.draw(c, ctx);
    },
    getPosition : function() {
        return this.sprite.getPosition();
    },
    setTilePosition : function(pos) {
        this.sprite.pos = pos;
        this.wantedPos = pos;
    },
    getTilePosition : function()
    {
        return this.sprite.getTilePosition();
    },
    setWantedPosition : function(pos)
    {
        this.wantedPos = pos;

        if(this.owner.team == Team.survivor)
        {
            var a = this.wantedPos.angleDeg(this.sprite.pos);
            var presets = [90, 180, 0, -90];
            this.sprite.setDirection(presets.indexOf(a));
        }
    },
    isMine : function() {
        return (this.owner.id == Network.player.id);
    },
    onArriveDestination : function() {
    }
};
