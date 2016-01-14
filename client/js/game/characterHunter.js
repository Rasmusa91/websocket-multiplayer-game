CharacterHunter.prototype = new Character();
CharacterHunter.prototype.constructor = CharacterHunter;

function CharacterHunter(pos, img, owner)
{
    this.pos = pos;
    this.img = img;
    this.owner = owner;

    this.bow = null;
    this.arrow = null;
    this.angle = 0;

    this.arrowsAmount = 0;

    this.shootTimer = null;
}

CharacterHunter.prototype.initialize = function()
{
    Object.getPrototypeOf (CharacterHunter.prototype).initialize.call(this);

    this.arrowsAmount = 3;

    this.angle = 0;
    this.bow = new Sprite(this.getPosition(), Resources.images.bow);
    this.bow.offset = this.bow.img.img.width / 4;
    this.arrow = new Sprite(this.getPosition(), Resources.images.arrow);
    this.arrow.offset = this.arrow.img.img.width / 4;

    this.speed = Map.tileSize / 8;
};

CharacterHunter.prototype.update = function()
{
    Object.getPrototypeOf (CharacterHunter.prototype).update.call(this);

    if(!this.alive) {
        return;
    }

    this.bow.pos = this.getPosition();
    this.bow.angle = this.angle;
    this.arrow.pos = this.getPosition();
    this.arrow.angle = this.angle;

    var normalizedAngle = Appelicious.normalizeAngle(this.angle);

    if(normalizedAngle >= 0 && normalizedAngle <= Math.PI / 2) {
        this.sprite.setDirection(0);
    }
    else if(normalizedAngle >=  Math.PI / 2 && normalizedAngle <= Math.PI) {
        this.sprite.setDirection(1);
    }
    else if(normalizedAngle >=  -Math.PI && normalizedAngle <= -Math.PI / 2) {
        this.sprite.setDirection(3);
    }
    else {
        this.sprite.setDirection(2);
    }
};

CharacterHunter.prototype.draw = function(c, ctx)
{
    if(!this.alive) {
        return;
    }


    if(this.sprite.direction == 3 || this.sprite.direction == 2)
    {
        this.bow.draw(c, ctx);

        if(this.shootTimer === null && this.arrowsAmount > 0) {
            this.arrow.draw(c, ctx);
        }

        Object.getPrototypeOf (CharacterHunter.prototype).draw.call(this, c, ctx);
    }
    else
    {
        Object.getPrototypeOf (CharacterHunter.prototype).draw.call(this, c, ctx);

        this.bow.draw(c, ctx);

        if(this.shootTimer === null && this.arrowsAmount > 0) {
            this.arrow.draw(c, ctx);
        }
    }
};

CharacterHunter.prototype.shoot = function(owner, pos, angle, force)
{
    if((typeof(force) === "undefined" || !force))
    {
        if(!this.alive) {
            return;
        }

        if(this.shootTimer !== null) {
            return;
        }

        if(this.arrowsAmount <= 0) {
            return;
        }
    }

    Game.addArrow(pos, angle, owner);

    var self = this;
    this.shootTimer = new Timer(0.75, function() {
        self.shootCDExpired();
    });

    this.arrowsAmount--;

    return true;
};

CharacterHunter.prototype.shootCDExpired = function() {
    this.shootTimer = null;
};

CharacterHunter.prototype.getArrowsAmount = function()
{
    return this.arrowsAmount;
};
