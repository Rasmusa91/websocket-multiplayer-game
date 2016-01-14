CharacterHunterAI.prototype = new CharacterHunter();
CharacterHunterAI.prototype.constructor = CharacterHunterAI;

function CharacterHunterAI(pos, img, owner) {
    this.pos = pos;
    this.img = img;
    this.owner = owner;

    this.AIController = new CharacterAIController(this);

    this.initialize();
}

CharacterHunterAI.prototype.initialize = function()
{
    Object.getPrototypeOf (CharacterHunterPlayer.prototype).initialize.call(this);
};

CharacterHunterAI.prototype.update = function()
{
    Object.getPrototypeOf (CharacterHunterPlayer.prototype).update.call(this);

    this.angle += Appelicious.lerpAngle(this.angle, this.owner.wantedRotation, 0.25);

    this.checkShotArrows();

    this.AIController.update();
};

CharacterHunterAI.prototype.draw = function(c, ctx)
{
    Object.getPrototypeOf (CharacterHunterPlayer.prototype).draw.call(this, c, ctx);
};

CharacterHunterAI.prototype.checkShotArrows = function()
{
    for(var i = 0; i < this.owner.arrowsShot.length; i++)
    {
        this.shoot(Game.getPlayerByNetworkId(this.owner.arrowsShot[i].playerId), this.owner.arrowsShot[i].pos, this.owner.arrowsShot[i].angle, true);
    }

    this.owner.arrowsShot = [];
};
