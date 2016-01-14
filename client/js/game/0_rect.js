Rect = function(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
};

Rect.prototype = {
    containsPoint : function(p) {
        return p.x >= this.x && p.x <= this.x + this.w && p.y >= this.y && p.y <= this.y + this.h;
    }
};
