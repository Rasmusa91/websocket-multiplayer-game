function CharacterPlayerController(parent) {
    this.parent = parent;
    this.keysDown = [];
    this.moveId = 0;

    this.initialize();
}

CharacterPlayerController.prototype.initialize = function()
{
    var self = this;
    $(document).bind("keyup", function(e) {
        self.keyUp(e.which);
    });
    $(document).bind("keydown", function(e) {
        self.keyDown(e.which);
    });
    Input.subscribe("rClick", this, function() {
        self.onRightClick();
    });

    this.keysDown = [];
    this.moveId = 0;
};

CharacterPlayerController.prototype.update = function()
{
    if(this.keysDown.length > 0 && this.parent.sprite.pos.equals(this.parent.wantedPos) && this.parent.canControl)
    {
        var key = this.keysDown[0];

        if(key == 38) {
            this.moveTo(new Appelicious.Vector2(this.parent.sprite.pos.x, this.parent.sprite.pos.y - 1));
        }
        else if(key == 40) {
            this.moveTo(new Appelicious.Vector2(this.parent.sprite.pos.x, this.parent.sprite.pos.y + 1));
        }
        else if(key == 37) {
            this.moveTo(new Appelicious.Vector2(this.parent.sprite.pos.x - 1, this.parent.sprite.pos.y));
        }
        else if(key == 39) {
            this.moveTo(new Appelicious.Vector2(this.parent.sprite.pos.x + 1, this.parent.sprite.pos.y));
        }
    }
};

CharacterPlayerController.prototype.keyUp = function(key)
{
    this.keysDown.splice(this.keysDown.indexOf(key), 1);
};

CharacterPlayerController.prototype.keyDown = function(key)
{
    if(this.keysDown.indexOf(key) == -1) {
        this.keysDown.push(key);
    }
};

CharacterPlayerController.prototype.moveTo = function(v2)
{
    if(this.parent.sprite.pos.equals(this.parent.wantedPos))
    {
        if(Map.isTileWalkable(v2.x, v2.y))
        {
            this.parent.setWantedPosition(v2);

            Network.sendPlayerPosition(this.parent.owner.id, this.moveId++, {x : v2.x, y : v2.y});
        }
    }
};

CharacterPlayerController.prototype.onRightClick = function()
{
    Map.checkRightClick(Input.getMouseTilePos(), this.parent);
};
