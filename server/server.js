require("./master.js");

var port = 8133;
var http = require("http");
var WebSocketServer = require("websocket").server;

// Create a http server with a callback handling all requests
var httpServer = http.createServer(function(request, response)
{
    response.writeHead(200, {"Content-type": "text/plain"});
});

// Setup the http-server to listen to a port
httpServer.listen(port, function() {
    console.log((new Date()) + " HTTP server is listening on port " + port);
});

// Create an object for the websocket
wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

function acceptGame(request)
{
    var connection = request.accept("game-protocol");
    var player = Master.addPlayer(connection);

    connection.on("message", function(message)
    {
        if (message.type === "utf8") {
            handleMessage(message.utf8Data);
        }
    });

    connection.on("close", function(message)
    {
        Master.removePlayer(player);
    });

    function handleMessage(msg)
    {
        console.log("incoming: " + msg);
        var json = JSON.parse(msg);

        if(json.type === "requestPing") {
            sendMessage([connection], '{"type" : "ping", "date" : ' + Date.now() + '}', true);
        }
        else if(json.type === "requestRoom") {
            Master.roomRequest(player);
        }
        else if(json.type === "requestInitStartGame") {
            Master.roomRequestInitStart(json.roomId);
        }
        else if(json.type === "sendPlayerPosition") {
            Master.playerPosRecieved(json.roomId, json.playerId, json.moveId, json.position);
        }
        else if(json.type === "sendPlayerRotation") {
            Master.playerRotRecieved(json.roomId, json.playerId, json.rotation);
        }
        else if(json.type === "sendDoorState") {
            Master.doorChange(json.roomId, json.pos, json.open);
        }
        else if(json.type === "sendShootArrow") {
            Master.shootArrow(json.roomId, json.playerId, json.position, json.angle, json.timestamp);
        }
        else if(json.type === "sendDestroyChest") {
            Master.chestDestroyed(json.roomId, json.position, json.chestEvent);
        }
        else if(json.type === "sendPossessChest") {
            Master.possessChest(json.roomId, json.playerId, json.position);
        }
        else if(json.type === "sendUnPossessChest") {
            Master.unPossessChest(json.roomId, json.playerId, json.position);
        }
        else if(json.type === "sendKillPlayer") {
            Master.killPlayer(json.roomId, json.playerId);
        }
        else if(json.type === "sendAddArrow") {
            Master.addPlayerArrow(json.roomId, json.playerId);
        }
        else if(json.type === "sendPickupValuable") {
            Master.sendPickupValuable(json.roomId, json.position);
        }
    }

    function sendMessage(recievers, msg, sendSelf)
    {
        for(var key in recievers)
        {
            if(sendSelf !== true && recievers[key].id === connection.id) {
                continue;
            }

            recievers[key].sendUTF(msg);
        }
    }
}

// Create a callback to handle each connection request
wsServer.on("request", function(request)
{
    if (!originIsAllowed(request.origin))
    {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + " Connection from origin " + request.origin + " rejected.");

        return;
    }

    var accepted = false;

    for (var key in request.requestedProtocols)
    {
        var prot = request.requestedProtocols[key];

        if(prot === "game-protocol") {
            acceptGame(request);
            accepted = true;
        }
    }

    if (!accepted)
    {
        console.log((new Date()) + " Connection from origin " + request.origin + " rejected.");
        request.reject();
    }
});

// Always check and explicitly allow the origin
function originIsAllowed(origin)
{
    return origin === "http://www.student.bth.se";
}
