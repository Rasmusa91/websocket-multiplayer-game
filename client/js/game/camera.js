Camera = (function() {
    var private, Camera = {};

    Camera.target = null;

    Camera.setTarget = function(target)
    {
        Camera.target = target;
    };

    Camera.clearTarget = function()
    {
        Camera.target = null;
    };


    Camera.getTilePos = function()
    {
        var pos = new Appelicious.Vector2(36, 27);

        if(Camera.target !== null) {
            pos = Camera.target.getTilePosition();
        }

        return pos;
    };

    Camera.getPos = function()
    {
        var pos = new Appelicious.Vector2(36 * Map.tileSize, 27 * Map.tileSize);

        if(Camera.target !== null) {
            pos = Camera.target.getPosition();
        }

        return pos;
    };

    Camera.translate = function(c, ctx)
    {
        var camera = {
            x : 0,
            y : 0
        };

        var playerPos = Camera.getPos();

        camera.x = (playerPos.x - c.width * 0.5 + Map.tileSize * 0.5) * -1;
        camera.y = (playerPos.y - c.height * 0.5 + Map.tileSize * 0.5) * -1;

        ctx.translate(camera.x, camera.y);
        ctx.clearRect(-camera.x, -camera.y, c.width, c.height);
    };

    return Camera;
})();
