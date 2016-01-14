Map = (function() {
	var private, Map = {};

	Map.tileSize = 32;
	Map.SpriteCollection = function() {
		this.content = [];

		this.add = function(sprite, x, y)
		{
			if(typeof(this.content[x]) === "undefined") {
				this.content[x] = [];
			}

			if(typeof(this.content[x][y]) === "undefined") {
				this.content[x][y] = [];
			}

			this.content[x][y].push(sprite);

		};

		this.get = function(x, y)
		{
			if(typeof(this.content[x]) === "undefined") {
				this.content[x] = [];
			}

			if(typeof(this.content[x][y]) === "undefined") {
				this.content[x][y] = [];
			}

			return this.content[x][y];
		};

		this.remove = function(x, y, id) {
			this.content[x][y].splice(id, 1);
		};
	};

	Map.groundSprites = null;
	Map.wallSprites = null;

	Map.data = null;

	Map.spritData = {
		waterGround : {
			id : 0,
			img : [
				529, 530, 531, 532, 533, 534
			]
		},
		floorGround : {
			id : 2,
			img : [
				308
			]
		},
		grassGround : {
			id : 1,
			img : [
				8121, 8122, 8123, 8124, 8125, 8126, 8127, 8128, 8129, 8130, 8131, 8132, 8133, 8134, 8135, 8136
			]
		},
		dirtGround : {
			id : 3,
			img : [
				251, 252, 253, 254, 255
			],
			border : {
				n : 0,
				e : 0,
				s : 0,
				w : 0,
				ne : 0,
				nw : 0,
				se : 0,
				sw : 0
			}
		},
		stoneGround : {
			id : 4,
			img : [
				770
			]
		},
		wall : {
			id : 5
		},
		door : {
			id : 6
		},
		doorOpen : {
			id : 7
		},
		waterBorder : {
			id : 8
		},
		chest : {
			id : 9
		},
		valuables : {
			id : 10,
			img : [
				2153, 2154, 2155, 2156, 2158
			]
		}
	};

	Map.playerSpawnPoint = null;
	Map.treasure = 0;
	Map.traps = 0;

	Map.reInitialize = function()
	{
		Map.initialize();
	};

	Map.initialize = function(callback)
	{
		Map.treasure = 0;
		Map.traps = 0;

		Map.groundSprites = new Map.SpriteCollection();
		Map.wallSprites = new Map.SpriteCollection();
		Map.data = new Data();

		var extraWater = 20;

		for(var i = -extraWater; i < Map.data.groundTiles.length + extraWater; i++)
		{
			for(var j = -extraWater; j < Map.data.groundTiles[0].length + extraWater; j++)
			{
				var imgPath = null;

				/* WATER GROUND */
				if (!(i >= 0 && i < Map.data.groundTiles.length && j >= 0 && j < Map.data.groundTiles[0].length) || Map.data.groundTiles[i][j] == Map.spritData.waterGround.id)
				{
					imgPath = Map.spritData.waterGround.img[Appelicious.randomInt(0, Map.spritData.waterGround.img.length - 1)];
					//Map.sprites[j + "." + i] = new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]);
					Map.groundSprites.add(new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]), j, i);
				}

				/* HOUSE GROUND */
				else if (Map.data.groundTiles[i][j] == Map.spritData.floorGround.id)
				{
					imgPath = Map.spritData.floorGround.img[Appelicious.randomInt(0, Map.spritData.floorGround.img.length - 1)];
					//Map.sprites[j + "." + i] = new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]);
					Map.groundSprites.add(new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]), j, i);
				}

				/* GRASS GROUND */
				else if (Map.data.groundTiles[i][j] == Map.spritData.grassGround.id || Map.data.groundTiles[i][j] == Map.spritData.wall.id)
				{
					imgPath = Map.spritData.grassGround.img[Appelicious.randomInt(0, Map.spritData.grassGround.img.length - 1)];
					//Map.sprites[j + "." + i] = new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]);
					Map.groundSprites.add(new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]), j, i);
				}

				/* DIRT GROUND */
				else if (Map.data.groundTiles[i][j] == Map.spritData.dirtGround.id)
				{
					imgPath = Map.spritData.dirtGround.img[Appelicious.randomInt(0, Map.spritData.dirtGround.img.length - 1)];
					//Map.sprites[j + "." + i] = new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]);
					Map.groundSprites.add(new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]), j, i);
				}

				/* STONE GROUND */
				else if (Map.data.groundTiles[i][j] == Map.spritData.stoneGround.id)
				{
					imgPath = Map.spritData.stoneGround.img[Appelicious.randomInt(0, Map.spritData.stoneGround.img.length - 1)];
					//Map.sprites[j + "." + i] = new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]);
					Map.groundSprites.add(new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[imgPath.toString()]), j, i);
				}
			}

			Map.playerSpawnPoint = new Appelicious.Vector2(36, 27);
		}

		Map.generateBordersGround();
		Map.generateBordersWall();

		if(typeof(callback) !== "undefined") {
			callback();
		}
	};

	Map.generateBordersGround = function()
	{
		var borderPresets = [
			{
				t1: [Map.spritData.grassGround.id],
				t2: [Map.spritData.waterGround.id],
				changeTo : [Map.spritData.waterBorder.id],
				//b : ["4544", "4545", "4546", "4547", "4548", "4549", "4550", "4551", "4552", "4553", "4554", "4555"],
				b : {
					"4544" : [
						2, 0, 2,
						1, 1, 1,
						1, 1, 1,
					],
					"4549" : [
						2, 0, 2,
						1, 1, 0,
						1, 1, 2,
					],
					"4553" : [
						1, 1, 0,
						1, 1, 1,
						1, 1, 1,
					],
					"4545" : [
						1, 1, 2,
						1, 1, 0,
						1, 1, 2,
					],
					"4551" : [
						1, 1, 2,
						1, 1, 0,
						2, 0, 2,
					],
					"4555" : [
						1, 1, 1,
						1, 1, 1,
						1, 1, 0,
					],
					"4546" : [
						1, 1, 1,
						1, 1, 1,
						2, 0, 2,
					],
					"4550" : [
						2, 1, 1,
						0, 1, 1,
						2, 0, 2,
					],
					"4554" : [
						1, 1, 1,
						1, 1, 1,
						0, 1, 1,
					],
					"4547" : [
						2, 1, 1,
						0, 1, 1,
						2, 1, 1,
					],
					"4548" : [
						2, 0, 2,
						0, 1, 1,
						2, 1, 1,
					],
					"4552" : [
						0, 1, 1,
						1, 1, 1,
						1, 1, 1,
					],
				}
			},
			{
				t1: [Map.spritData.stoneGround.id],
				t2: [Map.spritData.dirtGround.id],
				//b : ["4544", "4545", "4546", "4547", "4548", "4549", "4550", "4551", "4552", "4553", "4554", "4555"],
				b : {
					"4696" : [
						2, 0, 2,
						1, 1, 1,
						1, 1, 1,
					],
					"4705" : [
						2, 0, 2,
						1, 1, 0,
						1, 1, 2,
					],
					"4701" : [
						1, 1, 0,
						1, 1, 1,
						1, 1, 1,
					],
					"4697" : [
						1, 1, 2,
						1, 1, 0,
						1, 1, 2,
					],
					"4707" : [
						1, 1, 2,
						1, 1, 0,
						2, 0, 2,
					],
					"4703" : [
						1, 1, 1,
						1, 1, 1,
						1, 1, 0,
					],
					"4698" : [
						1, 1, 1,
						1, 1, 1,
						2, 0, 2,
					],
					"4706" : [
						2, 1, 1,
						0, 1, 1,
						2, 0, 2,
					],
					"4702" : [
						1, 1, 1,
						1, 1, 1,
						0, 1, 1,
					],
					"4699" : [
						2, 1, 1,
						0, 1, 1,
						2, 1, 1,
					],
					"4704" : [
						2, 0, 2,
						0, 1, 1,
						2, 1, 1,
					],
					"4700" : [
						0, 1, 1,
						1, 1, 1,
						1, 1, 1,
					],
				}
			},
			{
				t1: [Map.spritData.stoneGround.id, Map.spritData.dirtGround.id],
				t2: [Map.spritData.grassGround.id],
				//b : ["4544", "4545", "4546", "4547", "4548", "4549", "4550", "4551", "4552", "4553", "4554", "4555"],
				b : {
					"4431" : [
						2, 0, 2,
						1, 1, 1,
						1, 1, 1,
					],
					"4440" : [
						2, 0, 2,
						1, 1, 0,
						1, 1, 2,
					],
					"4436" : [
						1, 1, 0,
						1, 1, 1,
						1, 1, 1,
					],
					"4432" : [
						1, 1, 2,
						1, 1, 0,
						1, 1, 2,
					],
					"4442" : [
						1, 1, 2,
						1, 1, 0,
						2, 0, 2,
					],
					"4438" : [
						1, 1, 1,
						1, 1, 1,
						1, 1, 0,
					],
					"4433" : [
						1, 1, 1,
						1, 1, 1,
						2, 0, 2,
					],
					"4441" : [
						2, 1, 1,
						0, 1, 1,
						2, 0, 2,
					],
					"4437" : [
						1, 1, 1,
						1, 1, 1,
						0, 1, 1,
					],
					"4434" : [
						2, 1, 1,
						0, 1, 1,
						2, 1, 1,
					],
					"4439" : [
						2, 0, 2,
						0, 1, 1,
						2, 1, 1,
					],
					"4435" : [
						0, 1, 1,
						1, 1, 1,
						1, 1, 1,
					],
				}
			},
			{
				t1: [Map.spritData.grassGround.id],
				t2: [Map.spritData.grassGround.id],
				//b : ["4544", "4545", "4546", "4547", "4548", "4549", "4550", "4551", "4552", "4553", "4554", "4555"],
				b : {
					"6115-6116-6117-6118-115-6116-6117-6118-115-6116-6117-6118-6115-6116-6117-6118-115-6116-6117-6118-115-6116-6117-6118-6115-6116-6117-6118-115-6116-6117-6118-115-6116-6117-6118-3555-3556-3557-3561-3575-3576-3577-3578-3579-3580-3554" : [
						2, 2, 2,
						2, 0, 2,
						2, 2, 2,
					],
				}
			},
			{
				t1: [Map.spritData.dirtGround.id],
				t2: [Map.spritData.dirtGround.id],
				//b : ["4544", "4545", "4546", "4547", "4548", "4549", "4550", "4551", "4552", "4553", "4554", "4555"],
				b : {
					"0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-1261-1283-1310-1311-1312-1313-1326-3587-3588-3589-3590-3597-3598-3599" : [
						2, 2, 2,
						2, 0, 2,
						2, 2, 2,
					],
				}
			},
			{
				t1: [Map.spritData.waterBorder.id],
				t2: [Map.spritData.waterBorder.id],
				//b : ["4544", "4545", "4546", "4547", "4548", "4549", "4550", "4551", "4552", "4553", "4554", "4555"],
				b : {
					"0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-10814-10815-10816" : [
						2, 2, 2,
						2, 0, 2,
						2, 2, 2,
					],
				}
			},
			{
				t1: [Map.spritData.waterGround.id],
				t2: [Map.spritData.waterGround.id],
				//b : ["4544", "4545", "4546", "4547", "4548", "4549", "4550", "4551", "4552", "4553", "4554", "4555"],
				b : {
					"0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-2755-2756-2757-2758" : [
						2, 2, 2,
						2, 0, 2,
						2, 2, 2,
					],
				}
			}
        ];

		Map.generateBorders(Map.data.groundTiles, borderPresets, Map.groundSprites);
	};

	Map.generateBordersWall = function()
	{
		var borderPresets = [
			{
				t1: [Map.spritData.wall.id],
				t2: [Map.spritData.wall.id, Map.spritData.door.id],
				b : {
					"951" : [
						2, 2, 2,
						2, 0, 0,
						2, 0, 2,
					],
					"952-952-952-952-5052" : [
						2, 2, 2,
						0, 0, 2,
						2, 2, 2,
					],
					"954-954-954-954-5054" : [
						2, 0, 2,
						2, 0, 2,
						2, 2, 2,
					],
					"953" : [
						2, 0, 2,
						0, 0, 2,
						2, 2, 2,
					]
				}
			},
			{
				t1: [Map.spritData.door.id],
				t2: [Map.spritData.wall.id],
				b : {
					"3439" : [
						2, 0, 2,
						2, 2, 2,
						2, 0, 2,
					],
					"3441" : [
						2, 2, 2,
						0, 2, 2,
						2, 2, 2,
					]
				}
			}
        ];

		Map.generateBorders(Map.data.wallTiles, borderPresets, Map.wallSprites, Map.data.groundTiles);
	};

	Map.generateBorders = function(tiles, borderPresets, collection, altTiles)
    {
        for(var i = 0; i < tiles.length; i++)
        {
            for(var j = 0; j < tiles[i].length; j++)
            {
				for(var k = 0; k < borderPresets.length; k++)
	            {
					if(Appelicious.arrayContains(borderPresets[k].t1, tiles[i][j]) || (typeof(altTiles) !== "undefined" && Appelicious.arrayContains(borderPresets[k].t1, altTiles[i][j])))
					{
						for (var border in borderPresets[k].b)
						{
							var x = -1, y = -1, match = true;
							for(var l = 0; l < borderPresets[k].b[border].length; l++)
							{
								if(i + x >= 0 && j + y >= 0 && i + x < tiles.length && j + y < tiles[i].length)
								{
									if(borderPresets[k].b[border][l] === 0 && !Appelicious.arrayContains(borderPresets[k].t2, tiles[i + x][j + y])) {
										match = false;
									}
									if(borderPresets[k].b[border][l] === 1 && Appelicious.arrayContains(borderPresets[k].t2, tiles[i + x][j + y])) {
										match = false;
									}
								}

								y++;
								if(y > 1) {
									y = -1;
									x++;
								}
							}

							if(match)
							{
								var borders = border.split("-");
								var borderImg = borders[Appelicious.randomInt(0, borders.length - 1)];

								if(borderImg !== "0")
								{
									collection.add(new SpriteTile(new Appelicious.Vector2(j, i), Resources.images[borderImg]), j, i);

									if(typeof(borderPresets[k].changeTo) !== "undefined")
									{
										var change = borderPresets[k].changeTo[Appelicious.randomInt(0, borderPresets[k].changeTo.length - 1)];
										tiles[i][j] = change;
									}

									if(typeof(borderPresets[k].callback) !== "undefined") {
										borderPresets[k].callback();
									}
								}
							}
						}
					}
	            }
            }
        }
    };

	Map.spawnChests = function(chests)
	{
		for(var i = 0; i < chests.length; i++)
		{
			var img = null;

			if(chests[i].r.x === 0 && chests[i].r.y === -1) {
				img = "1673";
			}
			else if(chests[i].r.x === 0 && chests[i].r.y === 1) {
				img = "1674";
			}
			else if(chests[i].r.x === 1 && chests[i].r.y === 0) {
				img = "1672";
			}
			else if(chests[i].r.x === -1 && chests[i].r.y === 0) {
				img = "1664";
			}

			if(img !== null)
			{
				this.wallSprites.add(new SpriteTile(new Appelicious.Vector2(chests[i].y, chests[i].x), Resources.images[img]), chests[i].y, chests[i].x);
				this.data.wallTiles[chests[i].x][chests[i].y] = this.data.data.chest;
			}
		}
	};

	Map.spawnValuables = function(valuables)
	{
		for(var i = 0; i < valuables.length; i++)
		{
			this.groundSprites.add(new SpriteTile(new Appelicious.Vector2(valuables[i].y, valuables[i].x), Resources.images[Map.spritData.valuables.img[Appelicious.randomInt(0, Map.spritData.valuables.img.length - 1)]]), valuables[i].y, valuables[i].x);
			this.data.groundTiles[valuables[i].x][valuables[i].y] = this.data.data.valuables;
		}
	};

	Map.draw = function(c, ctx, players)
	{
		var cameraPos = Camera.getTilePos();

		var viewDimension = {
			x : 16,
			y : 9
		};

		for(var i = 0; i < viewDimension.x * 2 + 1; i++)
		{
			for(var j = 0; j < viewDimension.y * 2 + 1; j++)
			{
				var x = cameraPos.x - viewDimension.x + i;
				var y = cameraPos.y - viewDimension.y + j;

				var sprites = Map.groundSprites.get(x, y);

				for(var s in sprites) {
					sprites[s].draw(c, ctx);
				}
			}
		}

		for(var i = 0; i < viewDimension.x * 2 + 1; i++)
		{
			for(var j = 0; j < viewDimension.y * 2 + 1; j++)
			{
				var x = cameraPos.x - viewDimension.x + i;
				var y = cameraPos.y - viewDimension.y + j;

				var sprites = Map.wallSprites.get(x, y);

				for(var s in sprites) {
					sprites[s].draw(c, ctx);
				}

				for(var k = 0; k < players.length; k++)
				{
					if(players[k].getTilePosition().equals(new Appelicious.Vector2(x, y))) {
						players[k].draw(c, ctx);
					}
				}
			}
		}


	};

	Map.addBloodSplat = function(pos) {

		var splatPattern = [
			[4, 4, 0, 0, 0, 4, 4],
			[4, 0, 0, 0, 0, 0, 4],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[4, 0, 0, 0, 0, 0, 4],
			[4, 4, 0, 0, 0, 4, 4]
		];

		for(var i = 0; i < splatPattern.length; i++)
		{
			for(var j = 0; j < splatPattern[i].length; j++)
			{
				splatPattern[i][j] = {"v" : splatPattern[i][j], "i" : -1};
			}
		}

		var w = 1;
		var h = 1;

		for(var a = 0; a < 4; a++)
		{
			var hw = (w - 1) / 2;
			var hh = (h - 1) / 2;

			for(var i = -hw; i < hw + 1; i++)
			{
				for(var j = -hh; j < hh + 1; j++)
				{
					var x = (splatPattern.length  - 1) / 2 + i;
					var y = (splatPattern.length  - 1) / 2 + j;
					var tX = x + pos.x - (splatPattern.length - 1) / 2;
					var tY = y + pos.y - (splatPattern.length - 1) / 2;

					if(splatPattern[x][y].v === 0)
					{
						var testParents = [
							{x : 0, y : -1},
							{x : 0, y : 1},
							{x : -1, y : 0},
							{x : 1, y : 0},

							{x : -1, y : -1},
							{x : 1, y : -1},
							{x : 1, y : 1},
							{x : -1, y : 1},
						];

						var suitable = true;

						for(var key in testParents)
						{
							var px = testParents[key].x;
							var py = testParents[key].y;

							if(x + px >= 0 && x + px < splatPattern.length && y + py >= 0 && y + py < splatPattern.length)
							{
								if(splatPattern[x + px][y + py].i != w && (splatPattern[x + px][y + py].v === 2 || splatPattern[x + px][y + py].v === 3)) {
									suitable = false;
								}
							}
						}

						if(!suitable) {
							splatPattern[x][y].v = 3;
							splatPattern[x][y].i = w;
						}
						else if(Appelicious.arrayContains([5, 6, 7, 9, 10], Map.data.wallTiles[tY][tX])) {
							splatPattern[x][y].v = 2;
							splatPattern[x][y].i = w;
						}
						else {
							splatPattern[x][y].v = 1;
							splatPattern[x][y].i = w;
						}

						//Map.wallSprites.add(new SpriteTile(new Appelicious.Vector2(tX, tY), Resources.images[["1903", "1900", "8121"][splatPattern[x][y].v - 1]]), tX, tY);
					}
				}
			}

			w += 2;
			h += 2;
		}

		//console.log(splatPattern);

		for(var i = 0; i < splatPattern.length; i++)
		{
			for(var j = 0; j < splatPattern.length; j++)
			{
				if(Appelicious.randomInt(0, 100) < 20 || splatPattern[i][j].v === 3 || splatPattern[i][j].v === 4) {
					continue;
				}

				var x = pos.x - (splatPattern.length - 1) / 2 + i;
				var y = pos.y - (splatPattern.length - 1) / 2  + j;

				if(Map.data.wallTiles[y][x] === 0)
				{
					if(!Appelicious.arrayContains([Map.spritData.waterGround.id, Map.spritData.waterBorder.id], Map.data.groundTiles[y][x])) {
						var groundBloodSpriteCodes = ["1903", "1904", "1905"];
						Map.groundSprites.add(new SpriteTile(new Appelicious.Vector2(x, y), Resources.images[groundBloodSpriteCodes[Appelicious.randomInt(0, groundBloodSpriteCodes.length - 1)]]), x, y);
					}
				}
				else {
					var wallSprites = Map.wallSprites.get(x, y);

					for(var key in wallSprites)
					{
						if(Appelicious.arrayContains(["952", "5052"], wallSprites[key].img.name) && pos.y - y > 0)
						{
							var exception = false;
							if(Map.data.wallTiles[y + 1][x] === 5) {
								exception = true;
							}

							if(!exception) {
								var wallBloodSpriteCodes = ["1900", "1901", "1902"];
								Map.wallSprites.add(new SpriteTile(new Appelicious.Vector2(x, y), Resources.images[wallBloodSpriteCodes[Appelicious.randomInt(0, wallBloodSpriteCodes.length - 1)]]), x, y);
							}
						}
						if(Appelicious.arrayContains(["954", "5054"], wallSprites[key].img.name) && pos.x - x > 0)
						{
							var exception = false;
							if(Map.data.wallTiles[y][x + 1] === 5) {
								exception = true;
							}

							if(!exception) {
								var wallBloodSpriteCodes = ["1897", "1898", "1899"];
								Map.wallSprites.add(new SpriteTile(new Appelicious.Vector2(x, y), Resources.images[wallBloodSpriteCodes[Appelicious.randomInt(0, wallBloodSpriteCodes.length - 1)]]), x, y);
							}
						}
					}
				}
			}
		}
	};

	Map.isTileWalkable = function(x, y)
	{
		var walkable = true;

		var groundTile = Map.data.groundTiles[y][x];
		var wallTile = Map.data.wallTiles[y][x];

		if(groundTile === Map.spritData.waterBorder.id) {
			walkable = false;
		}

		if(wallTile === Map.spritData.wall.id || wallTile === Map.spritData.door.id || wallTile === Map.spritData.chest.id) {
			walkable = false;
		}

		if(Game.getAlivePlayerIdAtPos(new Appelicious.Vector2(x, y)) !== -1) {
			walkable = false;
		}

		return walkable;
	};

	Map.checkDoor = function(pos)
	{
		var isDoor = false;

		if(Map.data.wallTiles[pos.y][pos.x] === Map.spritData.door.id) {
			Map.replicateDoorState(pos, true);
			isDoor = true;
		}
		else if(Map.data.wallTiles[pos.y][pos.x] === Map.spritData.doorOpen.id) {
			Map.replicateDoorState(pos, false);
			isDoor = true;
		}

		return isDoor;
	};

	Map.replicateDoorState = function(pos, open)
	{
		Map.changeDoorState(pos, open);
		Network.sendDoorState(pos, open);
	};

	Map.changeDoorState = function(pos, open)
	{
		if(open && Map.data.wallTiles[pos.y][pos.x] == Map.spritData.doorOpen.id) {
			return;
		}

		if(!open && Map.data.wallTiles[pos.y][pos.x] == Map.spritData.door.id) {
			return;
		}

		Map.data.wallTiles[pos.y][pos.x] = (open ? Map.spritData.doorOpen.id : Map.spritData.door.id);
		var sprites =  Map.wallSprites.get(pos.x, pos.y);

		for(var key in sprites)
		{
			if(!open)
			{
				if(sprites[key].img.name === "3442") {
					sprites[key].img = Resources.images["3441"];
				}
				else if(sprites[key].img.name === "3440") {
					sprites[key].img = Resources.images["3439"];
				}
			}
			else
			{
				if(sprites[key].img.name === "3439") {
					sprites[key].img = Resources.images["3440"];
				}
				else if(sprites[key].img.name === "3441") {
					sprites[key].img = Resources.images["3442"];
				}
			}
		}

		if(open) {
			Sound.play("openDoor");
		}
		else {
			Sound.play("closeDoor");
		}
	};

	Map.checkValuable = function(pos)
	{
		if(Map.data.groundTiles[pos.y][pos.x] === Map.spritData.valuables.id)
		{
			Map.replicateValuablePickup(pos);
		}
	};

	Map.replicateValuablePickup = function(pos)
	{
		Map.pickupValuable(pos);
		Network.replicatePickupValuable(pos);
	};

	Map.pickupValuable = function(pos)
	{
		var sprites = Map.groundSprites.get(pos.x, pos.y);

		for(var key in sprites)
		{
			var isValuable = false;

			for(var i = 0; i < Map.spritData.valuables.img.length; i++)
			{
				if(sprites[key].img.name == Map.spritData.valuables.img[i].toString()) {
					isValuable = true;
				}
			}

			if(isValuable)
			{
				Map.groundSprites.remove(pos.x, pos.y, key);
			}
		}
	};

	Map.checkArrow = function(pos, owner)
	{
		var hit = false;

		if(pos.y < 0 || pos.y >= Map.data.groundTiles.length || pos.x < 0 || pos.x >= Map.data.groundTiles[0].length) {
			hit = true;
		}

		if(!hit && Map.data.wallTiles[pos.y][pos.x] === Map.spritData.wall.id) {
			hit = true;
		}

		if(!hit && Map.data.wallTiles[pos.y][pos.x] === Map.spritData.door.id) {
			hit = true;
		}

		if(!hit && owner.isMine() && Map.checkDestroyChest(pos, owner)) {
			hit = true;
		}

		if(!hit)
		{
			var id = Game.getAlivePlayerIdAtPos(pos);

			if(id !== -1)
			{
				Game.replicateKillPlayerById(id, owner);
				hit = true;
			}
		}

		return hit;
	};

	Map.checkRightClick = function(pos, owner)
	{
		if(pos.distance(owner.getTilePosition()) < 1.5)
		{
			Map.checkDoor(pos);

			if(owner.owner.team == Team.hunter) {
				Map.checkDestroyChest(pos, owner);
				Game.replicateKillPlayerById(Game.getAlivePlayerIdAtPos(pos), owner);
			}
			else if(owner.owner.team == Team.survivor) {
				Map.checkPossesChest(pos, owner);
			}
		}
	};

	Map.checkPossesChest = function(pos, owner)
	{
		if(Map.data.wallTiles[pos.y][pos.x] === Map.spritData.chest.id)
		{
			if(!owner.possessingChest)
			{
				owner.possessChest(pos);
				Network.replicatePossessChest(pos, owner.owner.id);
			}
			else
			{
				if(owner.possessingChestPos.equals(pos))
				{
					var availablePos = null;

					for(var i = -1; i <= 1 && availablePos === null; i++)
					{
						for(var j = -1; j <= 1 && availablePos === null; j++)
						{
							if(Map.isTileWalkable(pos.x + i, pos.y + j)) {
								availablePos = new Appelicious.Vector2(pos.x + i, pos.y + j);
							}
						}
					}

					if(availablePos !== null) {
						owner.unPossessChest(availablePos);
						Network.replicateUnPossessChest(availablePos, owner.owner.id);
					}
				}
			}
		}
	};

	Map.checkDestroyChest = function(pos, owner)
	{
		var e = ChestEventEnum.none;

		if(Map.data.wallTiles[pos.y][pos.x] === Map.spritData.chest.id)
		{
			Map.data.wallTiles[pos.y][pos.x] = 0;

			var pId = Game.getAlivePlayerIdAtPos(pos);
			if (pId !== -1) {
				e = ChestEventEnum.player;
			}

			if(e == ChestEventEnum.none)
			{
				var chestRand = Appelicious.randomInt(1, 100);
				if(chestRand > 66)
				{
					e = ChestEventEnum.trap;

					for(var i = -1; i <= 1; i++)
					{
						for(var j = -1; j <= 1; j++)
						{
							if(!(i === 0 && j === 0))
							{
								Map.checkDestroyChest(new Appelicious.Vector2(pos.x + i, pos.y + j), owner);
							}
						}
					}

					for(var i = 0; i < Game.players.length; i++)
					{
						if(Game.players[i].getTilePosition().distance(pos) < 1.5) {
							Game.replicateKillPlayerById(i, null);
						}
					}
				}
				else if(chestRand > 33) {
					e = ChestEventEnum.treasure;
					owner.arrowsAmount++;
					Network.replicateAddArrow(owner.owner.id);
				}
				else {
					e = ChestEventEnum.normal;
				}
			}

			Map.replicateDestroyChest(pos, e, owner.owner.id === Network.player.id);

			if(e == ChestEventEnum.player) {
				Game.replicateKillPlayerById(pId, owner);
			}
		}

		return e != ChestEventEnum.none;
	};

	Map.replicateDestroyChest = function(pos, chestEvent, force) {
		Map.destroyChest(pos, chestEvent, force);
		Network.replicateDestroyChest(pos, chestEvent);
	};

	Map.destroyChest = function(pos, chestEvent, force)
	{
		if(typeof(force) === "undefined") {
			force = false;
		}

		if(Map.data.wallTiles[pos.y][pos.x] !== Map.spritData.chest.id && !force) {
			return;
		}

		Map.data.wallTiles[pos.y][pos.x] = 0;

		var sprites =  Map.wallSprites.get(pos.x, pos.y);

		for(var key in sprites)
		{
			if(sprites[key].img.name === "1664" || sprites[key].img.name === "1672" || sprites[key].img.name === "1673" || sprites[key].img.name === "1674")
			{
				var debrisImgs = ["2250", "2251", "2252", "2253", "2254", "2255"];
				Map.groundSprites.add(new SpriteTile(new Appelicious.Vector2(pos.x, pos.y), Resources.images[debrisImgs[Appelicious.randomInt(0, debrisImgs.length - 1)]]), pos.x, pos.y);
				Map.wallSprites.remove(pos.x, pos.y, key);
			}
		}

		if(chestEvent == ChestEventEnum.trap)
		{
			Sound.play("explosion");
			Game.addExplosion(new Appelicious.Vector2(pos.x * Map.tileSize, pos.y * Map.tileSize));
		}
		else if(chestEvent == ChestEventEnum.treasure) {
			Game.addFloatingText("+1 arrow", new Appelicious.Vector2(pos.x * Map.tileSize + Map.tileSize * 0.5, pos.y * Map.tileSize + Map.tileSize * 0.5));
		}
	};

	return Map;
})();
