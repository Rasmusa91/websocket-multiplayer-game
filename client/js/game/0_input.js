Input = (function() {
    var private, Input = {};

    Input.EventSubs = {
        rDown : [],
        rUp : [],
        rClick : [],
        lDown : [],
        lUp : [],
        lClick : [],
        move : []
    };

    Input.canvasSize = {
        w : 0,
        h : 0
    };

    Input.mouseX = 0;
    Input.mouseY = 0;
    Input.rightMouseDown = false;
    Input.leftMouseDown = true;

    Input.initialize = function()
    {
        Input.canvasSize = {
            w : document.getElementById("canvas").width,
            h : document.getElementById("canvas").height
        };

        $("canvas").mousedown(function(e)
        {
            Input.mouseDown(e);
        });

        $("canvas").mouseup(function(e)
        {
            Input.mouseUp(e);
        });

        $("canvas").mousemove(function(e)
        {
            Input.mouseMove(e);
        });
    };

    Input.mouseDown = function(e)
    {
        if(e.button === 0)
        {
            Input.leftMouseDown = true;
            Input.invokeEvent("lDown");
        }
        if(e.button === 2)
        {
            Input.rightMouseDown = true;
            Input.invokeEvent("rDown");
        }
    };

    Input.mouseUp = function(e)
    {
        if(e.button === 0)
        {
            if(Input.leftMouseDown) {
                Input.invokeEvent("lClick");
            }

            Input.leftMouseDown = false;
            Input.invokeEvent("lUp");
        }
        if(e.button === 2)
        {
            if(Input.rightMouseDown) {
                Input.invokeEvent("rClick");
            }

            Input.rightMouseDown = false;
            Input.invokeEvent("rUp");
        }
    };

    Input.mouseMove = function(e)
    {
        Input.mouseX = (e.pageX / $("#canvas").width()) * Input.canvasSize.w;
        Input.mouseY = (e.pageY / $("#canvas").height()) * Input.canvasSize.h;
    };

    Input.subscribe = function(type, id, callback) {
        Input.EventSubs[type].push({
            id : id,
            callback : callback
        });
    };

    Input.unSubscribe = function(type, id)
    {
        var arrId = -1;

        for(var i = 0; i < Input.EventSubs[type].length && arrId === -1; i++)
        {
            if(Input.EventSubs[type][i].id === id) {
                arrId = i;
            }
        }

        if(arrId !== -1) {
            Input.EventSubs[type].splice(arrId, 1);
        }
    };

    Input.invokeEvent = function(event) {
        for(var i = 0; i < Input.EventSubs[event].length; i++) {
            Input.EventSubs[event][i].callback();
        }
    };

    Input.getMousePos = function() {
        return new Appelicious.Vector2(Input.mouseX, Input.mouseY);
    };

    Input.getMouseTruePos = function()
    {
        var canvasPos = $("canvas").position();
        var cameraPos = Camera.getPos();

        mX = Math.floor((Input.mouseX - canvasPos.left - Input.canvasSize.w * 0.5)) + cameraPos.x;
        mY = Math.floor((Input.mouseY - canvasPos.top - Input.canvasSize.h * 0.5)) + cameraPos.y;

        return new Appelicious.Vector2(mX, mY);
    };

    Input.getMouseTilePos = function()
    {
        var canvasPos = $("canvas").position();
        var cameraPos = Camera.getTilePos();

        mX = Math.floor((Input.mouseX + Map.tileSize * 0.5 - canvasPos.left - Input.canvasSize.w * 0.5) / Map.tileSize) + cameraPos.x;
        mY = Math.floor((Input.mouseY + Map.tileSize * 0.5 - canvasPos.top - Input.canvasSize.h * 0.5) / Map.tileSize) + cameraPos.y;

        return new Appelicious.Vector2(mX, mY);
    };

    return Input;
})();
