CharacterSurvivor.prototype = new Character();
CharacterSurvivor.prototype.constructor = CharacterSurvivor;

function CharacterSurvivor(pos, img, owner)
{
    this.pos = pos;
    this.img = img;
    this.owner = owner;

    this.possessingChest = false;
    this.possessingChestPos = null;
}

CharacterSurvivor.prototype.initialize = function()
{
    Object.getPrototypeOf (CharacterSurvivor.prototype).initialize.call(this);

    this.speed = Map.tileSize / 4;
    this.possessingChest = false;
    this.possessingChestPos = null;
};

CharacterSurvivor.prototype.update = function()
{
    Object.getPrototypeOf (CharacterSurvivor.prototype).update.call(this);

    if(!this.alive) {
        return;
    }
};

CharacterSurvivor.prototype.draw = function(c, ctx)
{
    if(!this.possessingChest) {
        Object.getPrototypeOf (CharacterSurvivor.prototype).draw.call(this, c, ctx);
    }

    if(!this.alive) {
        return;
    }
};

CharacterSurvivor.prototype.setWantedPosition = function(pos)
{
    Object.getPrototypeOf (CharacterSurvivor.prototype).setWantedPosition.call(this, pos);

    if(!this.alive) {
        return;
    }

    var a = this.wantedPos.angleDeg(this.sprite.pos);
    var presets = [90, 180, 0, -90];
    this.sprite.setDirection(presets.indexOf(a));
};

CharacterSurvivor.prototype.possessChest = function(pos)
{
    if(!this.alive) {
        return;
    }

    this.setTilePosition(pos);
    this.possessingChest = true;
    this.possessingChestPos = pos;

    this.owner.moveHistory = [];
};

CharacterSurvivor.prototype.unPossessChest = function(pos)
{
    if(!this.alive) {
        return;
    }

    this.setTilePosition(pos);
    this.possessingChest = false;
    this.possessingChestPos = null;

    this.owner.moveHistory = [];
};

CharacterSurvivor.prototype.onArriveDestination = function()
{
    Object.getPrototypeOf (CharacterSurvivor.prototype).onArriveDestination.call(this);
};
