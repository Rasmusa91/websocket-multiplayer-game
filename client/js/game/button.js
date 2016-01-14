Button = function(sprite, spriteHover, text, callback) {
    this.sprite = sprite;
    this.spriteHover = spriteHover;
    this.text = text;
    this.callback = callback;
    this.hover = false;

    this.initialize();
};

Button.prototype = {
    initialize : function()
    {
        var rect = this.sprite.getRect();
        this.text.pos.x += rect.x + rect.w / 2;
        this.text.pos.y += rect.y + rect.h / 2;

        var self = this;

        Input.subscribe("lDown", this, function() {
            self.onDown();
        });

        Input.subscribe("lUp", this, function() {
            self.onUp();
        });

        Input.subscribe("lClick", this, function() {
            self.onClick();
        });
    },
    update : function()
    {

    },
    draw : function(c, ctx)
    {
        if(!this.hover) {
            this.sprite.draw(c, ctx);
        }
        else {
            this.spriteHover.draw(c, ctx);
        }

        this.text.draw(c, ctx);
    },
    onDown : function()
    {
        if(this.sprite.rect.containsPoint(Input.getMousePos())) {
            this.hover = true;
        }
    },
    onUp : function()
    {
        this.hover = false;
    },
    onClick : function()
    {
        if(this.sprite.rect.containsPoint(Input.getMousePos())) {
            this.callback();
        }
    }
};
