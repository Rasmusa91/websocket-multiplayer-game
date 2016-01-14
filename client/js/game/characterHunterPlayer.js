CharacterHunterPlayer.prototype = new CharacterHunter();
CharacterHunterPlayer.prototype.constructor = CharacterHunterPlayer;

function CharacterHunterPlayer(pos, img, owner) {
    this.pos = pos;
    this.img = img;
    this.owner = owner;

    this.playerController = new CharacterPlayerController(this);
    this.replicateTimer = null;

    this.initialize();
}

CharacterHunterPlayer.prototype.initialize = function()
{
    Object.getPrototypeOf (CharacterHunterPlayer.prototype).initialize.call(this);

    var self = this;
    Input.subscribe("lClick", this, function() {
        self.onLeftClick();
    });

    this.replicateAngle();
};

CharacterHunterPlayer.prototype.update = function()
{
    Object.getPrototypeOf (CharacterHunterPlayer.prototype).update.call(this);

    if(!this.alive) {
        return;
    }

    this.playerController.update();

    this.angle = Input.getMouseTruePos().angle(this.getPosition()) - Math.PI / 4;
};

CharacterHunterPlayer.prototype.draw = function(c, ctx)
{
    Object.getPrototypeOf (CharacterHunterPlayer.prototype).draw.call(this, c, ctx);

    if(!this.alive) {
        return;
    }
};

CharacterHunterPlayer.prototype.replicateAngle = function()
{
    if(!this.alive) {
        return;
    }

    var self = this;
    this.replicateTimer = new Timer(0.1, function() {
        self.replicateAngle();
    });

    Network.sendPlayerRotation(this.owner.id, this.angle);
};

CharacterHunterPlayer.prototype.onLeftClick = function()
{
     if(!this.alive || !this.canControl) {
         return;
     }

    if(this.shoot(this, this.getPosition(), this.angle)) {
        Network.replicateShootArrow(this.owner.id, this.getPosition(), this.angle, Date.now());
    }
};
