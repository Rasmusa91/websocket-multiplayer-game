Appelicious = (function(window, undefined) {
    var private, Appelicious = {};

    Appelicious.Vector2 = function(x, y) {
        this.x = x;
        this.y = y;

        this.delta = function(v2) {
            return new Appelicious.Vector2(
                this.x - v2.x,
                this.y - v2.y
            );
        };
        this.angle = function(v2) {
            var d = this.delta(v2);
            return Math.atan2(d.y, d.x);
        };
        this.angleDeg = function(v2) {
            var a = this.angle(v2);
            return a * (180 / Math.PI);
        };
        this.distance = function(v2) {
            var d = this.delta(v2);
            return Math.sqrt(d.x * d.x + d.y * d.y);
        };
        this.clamp = function(min, max) {
            var x = this.x, y = this.y;

            if(this.x > max.x) {
                x = max.x;
            }
            if(this.x < min.x) {
                x = min.x;
            }
            if(this.y > max.y) {
                y = max.y;
            }
            if(this.y < min.y) {
                y = min.y;
            }

            return new Appelicious.Vector2(x, y);
        };
        this.equals = function(v2){
            return this.x == v2.x && this.y == v2.y;
        };
        this.add = function(v2) {
            return new Appelicious.Vector2(this.x + v2.x, this.y + v2.y);
        };
        this.sub = function(v2) {
            return new Appelicious.Vector2(this.x - v2.x, this.y - v2.y);
        };
        this.prod = function(val) {
            return new Appelicious.Vector2(this.x * val, this.y * val);
        };
    };

    Appelicious.normalizeAngle = function(a) {
        return a - (Math.PI * 2) * Math.floor((a + Math.PI) / (Math.PI * 2));
    }

    Appelicious.randomInt = function(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    };

    Appelicious.clamp = function(val, min, max)
    {
        if(val > max) {
            val = max;
        }

        if(val < min) {
            val = min;
        }

        return val;
    };

    Appelicious.lerpAngle = function(from, too, n) {
        return (((((too - from) % (Math.PI * 2)) + (Math.PI * 3)) % (Math.PI * 2)) - (Math.PI)) * n;
    };

    Appelicious.arrayContains = function(array, val)
    {
        var contains = false;

        for(var ele in array)
        {
            if(array[ele] === val) {
                contains = true;
                break;
            }
        }

        return contains;
    };

    return Appelicious;
})();
