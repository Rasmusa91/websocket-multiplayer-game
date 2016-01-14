CharacterSurvivorPlayer.prototype = new CharacterSurvivor();
CharacterSurvivorPlayer.prototype.constructor = CharacterHunterPlayer;

function CharacterSurvivorPlayer(pos, img, owner)
{
    this.pos = pos;
    this.img = img;
    this.owner = owner;

    this.playerController = new CharacterPlayerController(this);

    this.initialize();
}

CharacterSurvivorPlayer.prototype.initialize = function()
{
    Object.getPrototypeOf (CharacterSurvivorPlayer.prototype).initialize.call(this);
};

CharacterSurvivorPlayer.prototype.update = function()
{
    Object.getPrototypeOf (CharacterSurvivorPlayer.prototype).update.call(this);

    if(!this.alive) {
        return;
    }

    this.playerController.update();
};

CharacterSurvivorPlayer.prototype.draw = function(c, ctx)
{
    Object.getPrototypeOf (CharacterSurvivorPlayer.prototype).draw.call(this, c, ctx);

    if(!this.alive) {
        return;
    }
};

CharacterSurvivorPlayer.prototype.possessChest = function(pos)
{
    Object.getPrototypeOf (CharacterSurvivorPlayer.prototype).possessChest.call(this, pos);

    if(!this.alive) {
        return;
    }

    this.canControl = false;
};

CharacterSurvivorPlayer.prototype.unPossessChest = function(pos)
{
    Object.getPrototypeOf (CharacterSurvivorPlayer.prototype).unPossessChest.call(this, pos);

    if(!this.alive) {
        return;
    }

    this.canControl = true;
};

CharacterSurvivorPlayer.prototype.onArriveDestination = function()
{
    Object.getPrototypeOf (CharacterSurvivorPlayer.prototype).onArriveDestination.call(this);

    Map.checkValuable(this.getTilePosition());
};
