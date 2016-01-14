CharacterSurvivorAI.prototype = new CharacterSurvivor();
CharacterSurvivorAI.prototype.constructor = CharacterSurvivorAI;

function CharacterSurvivorAI(pos, img, owner) {
    this.pos = pos;
    this.img = img;
    this.owner = owner;

    this.AIController = new CharacterAIController(this);

    this.initialize();
}

CharacterSurvivorAI.prototype.initialize = function()
{
    Object.getPrototypeOf (CharacterSurvivorAI.prototype).initialize.call(this);
};

CharacterSurvivorAI.prototype.update = function()
{
    Object.getPrototypeOf (CharacterSurvivorAI.prototype).update.call(this);

    this.AIController.update();
};

CharacterSurvivorAI.prototype.draw = function(c, ctx)
{
    Object.getPrototypeOf (CharacterSurvivorAI.prototype).draw.call(this, c, ctx);
};
