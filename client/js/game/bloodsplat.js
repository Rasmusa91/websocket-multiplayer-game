BloodSplat = function(pos) {
    this.pos = pos;
    this.img = Resources.images["bloodsplat"].img;
    this.frames = 6;
    this.width = this.img.width / this.frames;
    this.height = this.img.height;
    this.frame = 0;
    this.animTime = Date.now();
    this.active = true;
};

BloodSplat.prototype = {
    update : function()
    {
        if(Date.now() - this.animTime > 50)
        {
            this.frame++;

            if(this.frame > 4) {
                this.active = false;
            }

            this.animTime = Date.now();
        }
    },
    draw : function(c, ctx)
    {
        ctx.drawImage(this.img,
            this.frame * this.width,
            0,
            this.width,
            this.height,
            this.pos.x - this.width * 0.33,
            this.pos.y - this.height * 0.33,
            this.width,
            this.height
        );
    }
};
