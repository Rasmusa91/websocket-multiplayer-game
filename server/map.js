require("./../shared/data.js");

Map = function() {
    this.chests = [];
    this.valuables = [];
};

Map.prototype = {
    reset : function()
    {
        this.data = new Data();
        this.generateChests();
        this.generateValuables();
    },
    generateChests : function()
    {
        var availableSpots = [];

        for(var i = 0; i < this.data.groundTiles.length; i++)
        {
            for(var j = 0; j < this.data.groundTiles[i].length; j++)
            {
                if(this.data.groundTiles[i][j] == this.data.data.floorGround && this.data.wallTiles[i][j] === 0)
                {
                    var possibleChestPos = [];

                    var valid = true;

                    for(var x = -1; x <= 1; x++)
                    {
                        for(var y = -1; y <= 1; y++)
                        {
                            if(this.data.wallTiles[i + x][j - y] == this.data.data.door || this.data.wallTiles[i + x][j - y] == this.data.data.doorOpen) {
                                valid = false;
                            }
                        }
                    }

                    if(valid)
                    {
                        if(this.data.wallTiles[i][j - 1] == this.data.data.wall) {
                            possibleChestPos.push({x : 0, y : -1});
                        }
                        if(this.data.wallTiles[i][j + 1] == this.data.data.wall) {
                            possibleChestPos.push({x : 0, y : 1});
                        }
                        if(this.data.wallTiles[i -1][j] == this.data.data.wall) {
                            possibleChestPos.push({x : -1, y : 0});
                        }
                        if(this.data.wallTiles[i + 1][j] == this.data.data.wall) {
                            possibleChestPos.push({x : 1, y : 0});
                        }

                        if(possibleChestPos.length === 1)
                        {
                            availableSpots.push({
                                x : i,
                                y : j,
                                r : possibleChestPos[Appelicious.randomInt(0, possibleChestPos.length - 1)]
                            });
                        }
                    }
                }
            }
        }

        this.chests = [];
        for(var i = 0; i < Math.floor(availableSpots.length * 0.4); i++)
        {
            var chestId = Appelicious.randomInt(0, availableSpots.length - 1);

            this.chests.push(availableSpots[chestId]);
            this.data.wallTiles[availableSpots[chestId].x][availableSpots[chestId].y] = this.data.data.chest;

            availableSpots.splice(chestId, 1);
        }
    },
    generateValuables : function()
    {
        var availableSpots = [];

        for(var i = 0; i < this.data.groundTiles.length; i++)
        {
            for(var j = 0; j < this.data.groundTiles[i].length; j++)
            {
                if(this.data.groundTiles[i][j] == this.data.data.floorGround && this.data.wallTiles[i][j] === 0 && this.data.wallTiles[i][j] !== this.data.data.chest)
                {
                    availableSpots.push({
                        x : i,
                        y : j
                    });
                }
            }
        }

        this.valuables = [];
        for(var i = 0; i < Math.floor(availableSpots.length * 0.75); i++)
        {
            var valuableId = Appelicious.randomInt(0, availableSpots.length - 1);

            this.valuables.push(availableSpots[valuableId]);
            this.data.groundTiles[availableSpots[valuableId].x][availableSpots[valuableId].y] = this.data.data.valuables;

            availableSpots.splice(valuableId, 1);
        }
    },
    generateSpawnpoints : function(players)
    {
        var spawns = [];
        var availableSpawns = [];

        for(var i = 0; i < this.data.groundTiles.length; i++)
        {
            for(var j = 0; j < this.data.groundTiles[i].length; j++)
            {
                if(this.data.groundTiles[i][j] == this.data.data.stoneGround && this.data.wallTiles[i][j] != this.data.data.wall && this.data.wallTiles[i][j] != this.data.data.door) {
                    availableSpawns.push({
                        x : j,
                        y : i
                    });
                }
            }
        }

        for(var i = 0; i < players.length; i++)
        {
            var spawnId = Appelicious.randomInt(0, availableSpawns.length - 1);

            spawns.push({
                p : players[i].id,
                x : availableSpawns[spawnId].x,
                y : availableSpawns[spawnId].y
            });

            availableSpawns.splice(spawnId, 1);
        }

        return spawns;
    },
    doorChange : function(pos, open) {
        this.data.wallTiles[pos.y][pos.x] = (open ? this.data.data.doorOpen : this.data.data.door);
    },
    chestDestroyed : function(pos)
    {
        if(this.data.wallTiles[pos.y][pos.x] == this.data.data.chest)
        {
            this.data.wallTiles[pos.y][pos.x] = 0;

            return true;
        }

        return false;
    },
    pickupValuable : function(pos)
    {
        if(this.data.groundTiles[pos.y][pos.x] == this.data.data.valuables)
        {
            this.data.groundTiles[pos.y][pos.x] = 0;

            return true;
        }

        return false;
    }
};
