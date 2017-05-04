(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Collisions = (function () {
    function Collisions() {
    }
    // , gems:Phaser.Group, golds:Phaser.Group, mobs:Phaser.Group
    Collisions.prototype.prepare = function (game, player) {
        var _this = this;
        this.player = player;
        this.game = game;
        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.gemsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.goldCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.mobsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.wallCollisionGroup = this.game.physics.p2.createCollisionGroup();
        player.sprite.body.setCollisionGroup(this.playerCollisionGroup);
        // player.sprite.body.setCollisionGroup(this.goldCollisionGroup);
        player.sprite.body.collides(this.gemsCollisionGroup, function (a, b) {
            b.sprite.destroy();
            _this.player.addPoints(100);
        }, this);
        player.sprite.body.collides(this.goldCollisionGroup, function (a, b) {
            b.sprite.destroy();
            _this.player.killingMode();
        }, this);
        player.sprite.body.collides(this.mobsCollisionGroup, function (a, b) {
            if (player.isKillingMode) {
                b.sprite.destroy();
                player.addPoints(150);
            }
            else {
                _this.game.state.start('gameOverState');
            }
        }, this);
        player.sprite.body.collides(this.wallCollisionGroup, function (a, b) {
            // console.log('wall', a, b)
        }, this);
    };
    Collisions.getInstance = function () {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    };
    Collisions.prototype.add = function (group, obj) {
        // console.log('added', group)
        switch (group) {
            case 'gem':
                // console.log(1);
                obj.sprite.body.setCollisionGroup(this.gemsCollisionGroup);
                obj.sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup], Collisions.collisionSolver.bind(this));
                break;
            case 'gold':
                // console.log(2);
                obj.sprite.body.setCollisionGroup(this.goldCollisionGroup);
                obj.sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup], Collisions.collisionSolver.bind(this));
                break;
            case 'mob':
            case 'sick':
                // console.log(3);
                obj.sprite.body.setCollisionGroup(this.mobsCollisionGroup);
                obj.sprite.body.collides([this.goldCollisionGroup, this.gemsCollisionGroup], Collisions.collisionSolver.bind(this));
                obj.sprite.body.collides([this.mobsCollisionGroup, this.wallCollisionGroup], obj.collide.bind(obj));
                break;
            case 'wall':
                // console.log(4);
                obj.sprite.body.setCollisionGroup(this.wallCollisionGroup);
                obj.sprite.body.collides([this.mobsCollisionGroup], function () { });
                break;
        }
        obj.sprite.body.collides(this.playerCollisionGroup, function (a, b) {
        }, this);
    };
    Collisions.prototype.mobBouncing = function (a, b) {
        console.log('mob bounce', a, b);
    };
    Collisions.collisionSolver = function (a, b) {
        var getValue = function (key) {
            switch (key) {
                case 'ufo': return 1000;
                case 'mob': return 2;
                case 'gold': return 0;
                case 'gem': return 1;
            }
        };
        if (!a.sprite || !b.sprite) {
            return;
        }
        if (a.sprite.key == b.sprite.key) {
            a.sprite.destroy();
        }
        else {
            var av = getValue(a.sprite.key);
            var bv = getValue(b.sprite.key);
            if (av > bv) {
                b.sprite.destroy();
            }
            else {
                a.sprite.destroy();
            }
        }
    };
    return Collisions;
}());
exports.Collisions = Collisions;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Consts = (function () {
    function Consts() {
    }
    return Consts;
}());
Consts.margins = 0;
Consts.tileSize = 0;
exports.Consts = Consts;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var wall_manager_1 = require("./wall-manager");
var const_1 = require("./const");
var collisions_1 = require("./collisions");
var gem_1 = require("./gem");
var GemManager = (function () {
    function GemManager(game, size) {
        this.game = game;
        this.size = size;
        this.gems = this.game.add.group();
        this.golds = this.game.add.group();
    }
    GemManager.prototype.start = function () {
        this.spawnGem();
        this.spawnGem();
        this.spawnGem();
        this.game.time.events.loop(3000, this.spawnGem.bind(this), this);
    };
    GemManager.prototype.spawnGem = function () {
        var isGem = Math.random() >= 0.3;
        var x = (Math.round(Math.random() * (this.size.x - 1)));
        var y = (Math.round(Math.random() * (this.size.y - 1)));
        var sprite = this.game.add.sprite(x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, isGem ? 'gem' : 'gold');
        sprite.anchor.set(0.5);
        sprite.scale.setTo(const_1.Consts.tileSize / 32 * 0.3, const_1.Consts.tileSize / 32 * 0.3);
        this.game.physics.p2.enable(sprite, false);
        sprite.body.setCircle(const_1.Consts.tileSize * 0.15);
        // sprite.body.kinematic = true;
        collisions_1.Collisions.getInstance().add(isGem ? 'gem' : 'gold', new gem_1.Gem(sprite, this.game));
    };
    return GemManager;
}());
exports.GemManager = GemManager;
},{"./collisions":1,"./const":2,"./gem":4,"./wall-manager":10}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Gem = (function () {
    function Gem(sprite, game) {
        this.game = game;
        this.sprite = sprite;
    }
    Gem.prototype.collide = function (a, b) {
        return;
    };
    return Gem;
}());
exports.Gem = Gem;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var const_1 = require("./const");
var maze_generator_1 = require("./maze-generator");
var wall_manager_1 = require("./wall-manager");
var pacman_1 = require("./pacman");
var gem_manager_1 = require("./gem-manager");
var collisions_1 = require("./collisions");
var mob_manager_1 = require("./mob-manager");
var MazeGame = (function () {
    function MazeGame() {
        var _this = this;
        this.size = { x: 15, y: 15 };
        this.moveObject = { left: false, right: false, up: false, down: false };
        this.maxW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.maxH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.minH = 960 / this.maxW * this.maxH;
        this.minW = 960;
        this.game = new Phaser.Game(this.minW, this.minH, Phaser.CANVAS, 'content');
        this.maze = maze_generator_1.MazeGenerator.getInstance().generate(this.size);
        this.game.state.add('startState', {
            preload: function () {
                if (_this.game.device.desktop) {
                    _this.game.scale.setGameSize(_this.maxW, _this.maxH);
                }
                _this.w = _this.game.width;
                _this.h = _this.game.height;
                const_1.Consts.tileSize = _this.w / 12;
                _this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                _this.game.scale.pageAlignHorizontally = true;
                _this.game.scale.pageAlignVertically = true;
            },
            create: function () {
                _this.time = 3;
                _this.timeInterval = setInterval(function () {
                    _this.time -= 1;
                    if (_this.time == 0) {
                        _this.textTimer.text = 'START!!';
                    }
                    else {
                        if (_this.time == -1) {
                            _this.game.state.start('gameState');
                            clearInterval(_this.timeInterval);
                        }
                        else {
                            _this.textTimer.text = 'Game will start in ' + _this.time + ' seconds';
                        }
                    }
                }, 1000);
                _this.textTimer = _this.game.add.text(_this.w / 2.0, _this.h / 2.0, 'Game will start in ' + _this.time + ' seconds', '');
                //	Center align
                _this.textTimer.anchor.set(0.5);
                _this.textTimer.align = 'center';
                //	Font style
                _this.textTimer.font = 'Arial Black';
                _this.textTimer.fontSize = 50;
                _this.textTimer.fontWeight = 'bold';
                //	Stroke color and thickness
                _this.textTimer.stroke = '#000000';
                _this.textTimer.strokeThickness = 6;
                _this.textTimer.fill = '#43d637';
            }
        }, true);
        this.game.state.add('gameState', this, false);
        this.game.state.add('gameOverState', {
            create: function () {
                var text = _this.game.add.text(_this.w / 2.0, _this.h / 2.0, 'Points: ' + _this.pacman.getPoints(), '');
                //	Center align
                text.anchor.set(0.5);
                text.align = 'center';
                //	Font style
                text.font = 'Arial Black';
                text.fontSize = 50;
                text.fontWeight = 'bold';
                //	Stroke color and thickness
                text.stroke = '#000000';
                text.strokeThickness = 6;
                text.fill = '#43d637';
                var text = _this.game.add.text(_this.w / 2.0, _this.h / 2.0 + 60, 'Click anything to restart', '');
                //	Center align
                text.anchor.set(0.5);
                text.align = 'center';
                //	Font style
                text.font = 'Arial Black';
                text.fontSize = 50;
                text.fontWeight = 'bold';
                //	Stroke color and thickness
                text.stroke = '#000000';
                text.strokeThickness = 6;
                text.fill = '#43d637';
                var started = false;
                _this.game.input.onDown.add(function () {
                    if (!started) {
                        _this.game.state.start('startState');
                    }
                    started = true;
                }, _this);
            }
        }, false);
    }
    MazeGame.prototype.preload = function () {
        this.game.load.image('ufo', 'assets/ufo.png');
        this.game.load.image('gem', 'assets/gem.png');
        this.game.load.image('gold', 'assets/gold.png');
        this.game.load.image('maze-bg', 'assets/maze-bg.png');
        this.game.load.spritesheet('mob', 'assets/mob.png', 32, 32);
        this.game.load.image('sick', 'assets/sick.png');
        this.game.load.image('hazard', 'assets/hazard.png');
        this.game.load.spritesheet('buttonvertical', 'assets/button-vertical.png', 32, 64);
        this.game.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png', 64, 32);
        this.game.load.spritesheet('buttondiagonal', 'assets/button-diagonal.png', 48, 48);
    };
    MazeGame.prototype.create = function () {
        this.wallManager = new wall_manager_1.WallManager(this.game);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.world.setBounds(0, 0, this.size.x * const_1.Consts.tileSize + wall_manager_1.WallManager.mazeOffset * 2, this.size.y * const_1.Consts.tileSize + wall_manager_1.WallManager.mazeOffset * 2);
        this.game.physics.p2.restitution = 0.8;
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        this.game.physics.p2.updateBoundsCollisionGroup();
        this.pacman = new pacman_1.Pacman(this.game, this.wallManager);
        collisions_1.Collisions.getInstance().prepare(this.game, this.pacman);
        this.wallManager.draw(this.maze, this.size);
        new gem_manager_1.GemManager(this.game, this.size).start();
        this.mobManager = new mob_manager_1.MobManager(this.game, this.pacman, this.size); //
        this.mobManager.start();
        console.log(this.w, this.h);
        this.pointsText = this.game.add.text(const_1.Consts.tileSize / 8, const_1.Consts.tileSize / 8, ':' + this.pacman.getPoints(), '');
        this.pointsText.fixedToCamera = true;
        //	Center align
        // this.pointsText.anchor.set(0.5);
        this.pointsText.align = 'right';
        //	Font style
        this.pointsText.font = 'Arial Black';
        this.pointsText.fontSize = const_1.Consts.tileSize / 4.0;
        this.pointsText.fontWeight = 'bold';
        //	Stroke color and thickness
        this.pointsText.stroke = '#000000';
        this.pointsText.strokeThickness = 6;
        this.pointsText.fill = '#43d637';
        this.pointsText.bringToTop();
    };
    MazeGame.prototype.update = function () {
        this.pacman.update();
        this.mobManager.update();
        this.pointsText.setText(':' + this.pacman.getPoints());
        // this.pointsText.position.set(this.game.camera.position.x, this.game.camera.position.y)
    };
    MazeGame.prototype.render = function () {
    };
    MazeGame.prototype.startState = function () {
        alert('start');
    };
    MazeGame.prototype.gameState = function () {
        alert('game');
    };
    MazeGame.prototype.gameOverState = function () {
        alert('Points:' + this.pacman.getPoints());
    };
    return MazeGame;
}());
window.onload = function () {
    var game = new MazeGame();
};
},{"./collisions":1,"./const":2,"./gem-manager":3,"./maze-generator":6,"./mob-manager":7,"./pacman":9,"./wall-manager":10}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MazeGenerator = (function () {
    function MazeGenerator() {
    }
    MazeGenerator.getInstance = function () {
        if (!this._instance) {
            this._instance = new MazeGenerator();
        }
        return this._instance;
    };
    MazeGenerator.prototype.generate = function (size) {
        var x = size.x;
        var y = size.y;
        var totalCells = x * y;
        var cells = new Array();
        var unvis = new Array();
        for (var i = 0; i < y; i++) {
            cells[i] = new Array();
            unvis[i] = new Array();
            for (var j = 0; j < x; j++) {
                cells[i][j] = [0, 0, 0, 0];
                unvis[i][j] = true;
            }
        }
        // Set a random position to start from
        var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
        var path = [currentCell];
        unvis[currentCell[0]][currentCell[1]] = false;
        var visited = 1;
        // Loop through all available cell positions
        while (visited < totalCells) {
            // Determine neighboring cells
            var pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
                [currentCell[0], currentCell[1] + 1, 1, 3],
                [currentCell[0] + 1, currentCell[1], 2, 0],
                [currentCell[0], currentCell[1] - 1, 3, 1]];
            var neighbors = new Array();
            // Determine if each neighboring cell is in game grid, and whether it has already been checked
            for (var l = 0; l < 4; l++) {
                if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) {
                    neighbors.push(pot[l]);
                }
            }
            // If at least one active neighboring cell has been found
            if (neighbors.length) {
                // Choose one of the neighbors at random
                var next = neighbors[Math.floor(Math.random() * neighbors.length)];
                // Remove the wall between the current cell and the chosen neighboring cell
                cells[currentCell[0]][currentCell[1]][next[2]] = 1;
                cells[next[0]][next[1]][next[3]] = 1;
                // Mark the neighbor as visited, and set it as the current cell
                unvis[next[0]][next[1]] = false;
                visited++;
                currentCell = [next[0], next[1]];
                path.push(currentCell);
            }
            else {
                currentCell = path.pop();
            }
        }
        var result = this.optimizeWalls(cells, size);
        return result;
    };
    MazeGenerator.prototype.optimizeWalls = function (cells, size) {
        var horizontalWalls = [];
        var prepforVert = [];
        cells.forEach(function (row, rowI, rows) {
            var nextRow = rows[rowI + 1];
            horizontalWalls[rowI] = [];
            var lastRowValue = null;
            var rowCache = 0;
            row.forEach(function (cell, cellI, cells) {
                if (!nextRow) {
                    return;
                }
                var horizontalWall = !!cell[2] || !!nextRow[cellI][0];
                if (lastRowValue === horizontalWall || lastRowValue === null) {
                    if (lastRowValue == null) {
                        lastRowValue = horizontalWall;
                    }
                    rowCache++;
                }
                else {
                    horizontalWalls[rowI].push({ wall: lastRowValue, count: rowCache });
                    lastRowValue = horizontalWall;
                    rowCache = 1;
                }
            });
            if (rowCache > 0) {
                horizontalWalls[rowI].push({ wall: lastRowValue, count: rowCache });
            }
        });
        var verticalWallsTmp = [];
        for (var i = 0; i < cells.length; i++) {
            verticalWallsTmp[i] = [];
        }
        verticalWallsTmp = cells.map(function (row, rowI, rows) {
            return row.map(function (cell, cellI, cells) {
                var nextCell = cells[cellI + 1];
                var verticalWall = !!cell[1] || (nextCell ? !!nextCell[3] : false);
                return verticalWall;
            });
        });
        var cols = [];
        for (var r = 0; r < verticalWallsTmp.length; r++) {
            for (var c = 0; c < verticalWallsTmp[r].length; c++) {
                var value = verticalWallsTmp[r][c];
                if (!cols[c]) {
                    cols[c] = [];
                }
                if (!cols[c][r]) {
                    cols[c][r] = [];
                }
                cols[c][r] = value;
            }
        }
        var verticalWalls = cols.map(function (col, colI, colA) {
            var lastValue = null;
            var count = 0;
            var res = [];
            col.forEach(function (wall, wallI, wallA) {
                if (lastValue == null) {
                    lastValue = wall;
                    count++;
                }
                else {
                    if (wall !== lastValue) {
                        res.push({ wall: lastValue, count: count });
                        lastValue = wall;
                        count = 1;
                    }
                    else {
                        count++;
                    }
                }
            });
            if (count > 0) {
                res.push({ wall: lastValue, count: count });
            }
            return res;
        });
        verticalWalls.pop();
        return { cols: [] || verticalWalls, rows: [] || horizontalWalls };
        // var xSum = 0;
        // var last = true;
        // var xca = [];
        // for (var i = 1; i < size.x; i++) {
        //   var xc = [];
        //   while (xSum != size.x) {
        //     var rest = size.x - xSum;
        //     var v = (Math.round(Math.random() * 7) + 1);
        //     v = v > rest ? rest : v;
        //     last = !last;
        //     xc.push({ wall: last, count: v })
        //     xSum += v;
        //   }
        //   xca.push(xc);
        //   xSum = 0;
        // }
        // var yca = [];
        // var ySum = 0;
        // for (var i = 1; i < size.x; i++) {
        //   var yc = [];
        //   while (ySum != size.y) {
        //     var rest = size.y - ySum;
        //     var v = (Math.round(Math.random() * 7) + 1);
        //     v = v > rest ? rest : v;
        //     last = !last;
        //     yc.push({ wall: last, count: v })
        //     ySum += v;
        //   }
        //   yca.push(yc);
        //   ySum = 0;
        // }
        // return { cols: yca, rows: xca }
    };
    return MazeGenerator;
}());
exports.MazeGenerator = MazeGenerator;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var wall_manager_1 = require("./wall-manager");
var const_1 = require("./const");
var collisions_1 = require("./collisions");
var mob_1 = require("./mob");
var MobManager = (function () {
    function MobManager(game, pacman, size) {
        this.game = game;
        this.pacman = pacman;
        this.size = size;
        this.mobsInstances = [];
    }
    MobManager.prototype.start = function () {
        this.mobs = this.game.add.group();
        this.spawnMob();
        this.spawnMob();
        this.spawnMob();
        this.game.time.events.loop(1000, this.spawnMob.bind(this), this);
    };
    MobManager.prototype.spawnMob = function () {
        var _this = this;
        var x = (Math.round(Math.random() * (this.size.x - 1)));
        var y = (Math.round(Math.random() * (this.size.y - 1)));
        var dist = this.game.physics.arcade.distanceToXY(this.pacman.sprite, x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset);
        while (const_1.Consts.tileSize * 2.5 >= dist) {
            console.log(dist, const_1.Consts.tileSize);
            x = (Math.round(Math.random() * (this.size.x - 1)));
            y = (Math.round(Math.random() * (this.size.y - 1)));
            dist = this.game.physics.arcade.distanceToXY(this.pacman.sprite, x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset);
        }
        var sprite = this.game.add.sprite(x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, 'hazard');
        sprite.anchor.set(0.5);
        sprite.scale.setTo(const_1.Consts.tileSize / 96 * 0.3, const_1.Consts.tileSize / 96 * 0.3);
        var tween = this.game.add.tween(sprite);
        tween.to({ alpha: 0 }, 3000, Phaser.Easing.Linear.None);
        tween.onComplete.add(function (e) {
            e.destroy();
            var sprite = _this.game.add.sprite(x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, 'mob');
            sprite.anchor.set(0.5);
            sprite.scale.setTo(const_1.Consts.tileSize / 32 * 0.3, const_1.Consts.tileSize / 32 * 0.3);
            _this.game.physics.p2.enable(sprite, false);
            sprite.body.setCircle(const_1.Consts.tileSize * 0.2);
            _this.mobs.add(sprite);
            // sprite.body.kinematic = true;
            var mob = new mob_1.Mob(sprite, _this.game);
            collisions_1.Collisions.getInstance().add('mob', mob);
            _this.mobsInstances.push(mob);
        }, this);
        tween.start();
    };
    MobManager.prototype.update = function () {
        var _this = this;
        this.mobsInstances.forEach(function (mob) {
            _this.pacman.isKillingMode ? mob.sprite.frame = 1 : mob.sprite.frame = 0;
            mob.move();
        }, this);
    };
    return MobManager;
}());
exports.MobManager = MobManager;
},{"./collisions":1,"./const":2,"./mob":8,"./wall-manager":10}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var const_1 = require("./const");
var collisions_1 = require("./collisions");
var Mob = (function () {
    function Mob(sprite, game) {
        this.game = game;
        this.isMoving = false;
        this.sprite = sprite;
        setInterval(this.collide.bind(this), 3000);
    }
    Mob.prototype.move = function () {
        console.log('move');
        if (this.sprite && this.sprite.body && !this.pos) {
            this.sprite.body.setZeroRotation();
            this.sprite.body.setZeroVelocity();
            this.pos = this.randomPosition();
            this.game.physics.arcade.moveToXY(this.sprite, this.pos.x, this.pos.y, const_1.Consts.tileSize / 3, 3000);
            this.isMoving = true;
        }
    };
    Mob.prototype.collide = function (a, b) {
        if (this.sprite && this.sprite.body) {
            if (this.pos) {
                this.pos = null;
                this.move();
            }
            else {
                collisions_1.Collisions.collisionSolver(a, b);
            }
        }
    };
    Mob.prototype.randomPosition = function () {
        var distance = const_1.Consts.tileSize * 5;
        var x = Math.random() * distance;
        var y = Math.sqrt(distance * distance - x * x);
        return { x: this.sprite.position.x + this.randomSign(x), y: this.sprite.position.y + this.randomSign(y) };
    };
    Mob.prototype.randomSign = function (value) {
        return (Math.random() > 0.5 ? 1 : -1) * value;
    };
    return Mob;
}());
exports.Mob = Mob;
},{"./collisions":1,"./const":2}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var const_1 = require("./const");
var wall_manager_1 = require("./wall-manager");
var Pacman = (function () {
    function Pacman(game, wallManager) {
        var _this = this;
        this.game = game;
        this.wallManager = wallManager;
        this.position = { x: 2, y: 3 };
        this.points = 0;
        this.touching = false;
        this.scaleToTile = 0.4;
        this.isKillingMode = false;
        this.particlesGroup = this.game.add.group();
        this.sprite = game.add.sprite(this.position.x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, this.position.y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, 'ufo');
        this.sprite.anchor.set(0.5);
        this.sprite.scale.setTo(const_1.Consts.tileSize / 96 * this.scaleToTile, const_1.Consts.tileSize / 96 * this.scaleToTile);
        game.physics.p2.enable(this.sprite, false);
        // this.sprite.body.enableBody = true;
        this.sprite.body.setCircle(const_1.Consts.tileSize * 0.5 * this.scaleToTile);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // this.game.time.events.loop(300, this.particles.bind(this), this);
        if (!this.game.device.desktop) {
            this.game.input.addMoveCallback(function (e) {
                _this.game.physics.arcade.moveToXY(_this.sprite, e.worldX, e.worldY, _this.speed);
                _this.touching = true;
            }, this);
            this.game.input.onUp.add(function () {
                _this.touching = false;
                _this.game.physics.arcade.moveToXY(_this.sprite, _this.sprite.position.x, _this.sprite.position.y, 0);
            }, this);
        }
    }
    Pacman.prototype.update = function () {
        if (this.game.device.desktop) {
            this.move();
        }
    };
    Pacman.prototype.move = function () {
        this.sprite.body.setZeroRotation();
        this.sprite.body.setZeroVelocity();
        var step = const_1.Consts.tileSize * 2;
        this.stopMoving();
        if (this.cursors.left.isDown) {
            this.moveObject.left = true;
        }
        else if (this.cursors.right.isDown) {
            this.moveObject.right = true;
        }
        if (this.cursors.up.isDown) {
            this.moveObject.up = true;
        }
        else if (this.cursors.down.isDown) {
            this.moveObject.down = true;
        }
        this.makeMoveFromMoveObject();
    };
    Pacman.prototype.stopMoving = function () {
        this.moveObject = { left: false, right: false, up: false, down: false };
    };
    Object.defineProperty(Pacman.prototype, "speed", {
        get: function () {
            return const_1.Consts.tileSize * 2;
        },
        enumerable: true,
        configurable: true
    });
    Pacman.prototype.makeMoveFromMoveObject = function () {
        var x = 0;
        var y = 0;
        if (this.moveObject.left) {
            x = -500;
        }
        if (this.moveObject.right) {
            x = +500;
        }
        if (this.moveObject.up) {
            y = -500;
        }
        if (this.moveObject.down) {
            y = +500;
        }
        if (x != 0 || y != 0) {
            this.game.physics.arcade.moveToXY(this.sprite, this.sprite.position.x + x, this.sprite.position.y + y, this.speed);
        }
        else {
            this.game.physics.arcade.moveToXY(this.sprite, this.sprite.position.x, this.sprite.position.y, 0);
        }
    };
    Pacman.prototype.particles = function () {
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown || this.touching) {
            var particle = this.game.add.sprite(1000, 1000, 'gold');
            particle.visible = false;
            particle.scale.setTo(const_1.Consts.tileSize / 32 * this.scaleToTile * 0.3);
            particle.anchor.set(0.5);
            particle.x = this.sprite.x;
            particle.y = this.sprite.y;
            this.particlesGroup.add(particle);
            particle.visible = true;
            var time = 45000;
            var tween = this.game.add.tween(particle);
            var tweenScale = this.game.add.tween(particle.scale);
            tweenScale.to({ y: 0, x: 0 }, time - 2000, Phaser.Easing.Linear.None, true);
            tween.to({ alpha: 0, angle: 8000 }, time, Phaser.Easing.Linear.None);
            tween.onComplete.add(function (e) {
                e.destroy();
            }, this);
            tween.start();
        }
    };
    Pacman.prototype.addPoints = function (points) {
        this.points += points;
        console.log(this.points);
    };
    Pacman.prototype.getPoints = function () {
        return this.points;
    };
    Pacman.prototype.killingMode = function () {
        var _this = this;
        if (this.isKillingMode) {
            clearTimeout(this._killingMode);
        }
        else {
            this.isKillingMode = true;
        }
        console.log('killing mode', this.isKillingMode);
        this._killingMode = setTimeout(function () {
            _this.isKillingMode = false;
            console.log('killing mode', _this.isKillingMode);
        }, 15000);
    };
    return Pacman;
}());
exports.Pacman = Pacman;
},{"./const":2,"./wall-manager":10}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var const_1 = require("./const");
var collisions_1 = require("./collisions");
var wall_1 = require("./wall");
var WallManager = (function () {
    function WallManager(game) {
        this.game = game;
        this.thickness = 0.1;
        this.palette = {
            color: 0xFF0000,
            opacity: 0.27,
        };
        this.bg = game.add.group();
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.walls.physicsBodyType = Phaser.Physics.P2JS;
    }
    Object.defineProperty(WallManager, "mazeOffset", {
        get: function () {
            return const_1.Consts.tileSize * 8;
        },
        enumerable: true,
        configurable: true
    });
    WallManager.prototype.draw = function (maze, size) {
        var _this = this;
        var offsetForBorder = const_1.Consts.tileSize * this.thickness;
        var floor = this.game.add.tileSprite(WallManager.mazeOffset, WallManager.mazeOffset, size.x * const_1.Consts.tileSize, size.y * const_1.Consts.tileSize, 'maze-bg');
        this.bg.add(floor);
        this.addBorders(size);
        maze.cols.forEach(function (col, colIndex) {
            var offset = 0;
            col.forEach(function (wall) {
                if (!wall.wall) {
                    _this.addWall(size, (colIndex + 1) * const_1.Consts.tileSize, offset * const_1.Consts.tileSize, _this.thickness * const_1.Consts.tileSize, wall.count * const_1.Consts.tileSize + offsetForBorder, false);
                }
                offset += wall.count;
            });
        });
        maze.rows.forEach(function (row, rowIndex) {
            var offset = 0;
            row.forEach(function (wall) {
                if (!wall.wall) {
                    _this.addWall(size, offset * const_1.Consts.tileSize, (rowIndex + 1) * const_1.Consts.tileSize, wall.count * const_1.Consts.tileSize + offsetForBorder, _this.thickness * const_1.Consts.tileSize, false);
                }
                offset += wall.count;
            });
        });
    };
    WallManager.prototype.addBorders = function (size) {
        var color = 0x000000;
        var opacity = 1;
        this.addWall(size, 0, 0, size.x * const_1.Consts.tileSize + WallManager.mazeOffset * 2, WallManager.mazeOffset * 1, true, color, opacity);
        this.addWall(size, 0, size.y * const_1.Consts.tileSize + WallManager.mazeOffset, size.x * const_1.Consts.tileSize + WallManager.mazeOffset * 2, WallManager.mazeOffset * 1, true, color, opacity);
        this.addWall(size, 0, 0, WallManager.mazeOffset * 1, size.y * const_1.Consts.tileSize + WallManager.mazeOffset * 2, true, color, opacity);
        this.addWall(size, size.x * const_1.Consts.tileSize + WallManager.mazeOffset, 0, WallManager.mazeOffset * 1, size.y * const_1.Consts.tileSize + WallManager.mazeOffset * 2, true, color, opacity);
    };
    WallManager.prototype.addWall = function (size, x, y, width, height, isBorder, color, opacity) {
        if (!isBorder) {
            x += WallManager.mazeOffset;
            y += WallManager.mazeOffset;
        }
        var maxWidth = size.x * const_1.Consts.tileSize + WallManager.mazeOffset;
        var maxHeight = size.y * const_1.Consts.tileSize + WallManager.mazeOffset;
        var graphics = this.game.add.graphics(const_1.Consts.margins, const_1.Consts.margins);
        graphics.lineStyle(2, color || color === 0 ? color : this.palette.color, 1);
        graphics.beginFill(color || color === 0 ? color : this.palette.color);
        graphics.drawRect(0, 0, x + width > maxWidth && !isBorder ? maxWidth - (x) : width, y + height > maxHeight && !isBorder ? maxHeight - (y) : height);
        graphics.alpha = (opacity || opacity === 0 ? opacity : this.palette.opacity);
        graphics.endFill();
        graphics.boundsPadding = 0;
        var shapeSprite = this.walls.create(x, y); // this.game.add.sprite(x, y);
        this.game.physics.p2.enable(shapeSprite, true);
        shapeSprite.addChild(graphics);
        shapeSprite.body.clearShapes();
        shapeSprite.body.addRectangle(width, height, width / 2.0, height / 2.0);
        // shapeSprite.body.mass = 1000;
        shapeSprite.body.kinematic = true;
        // this.walls.add(shapeSprite);
        collisions_1.Collisions.getInstance().add('wall', new wall_1.Wall(shapeSprite));
    };
    WallManager.prototype.offset = function (value) {
        return value * this.wallThickness();
    };
    WallManager.prototype.wallThickness = function () {
        return const_1.Consts.tileSize * this.thickness;
    };
    return WallManager;
}());
exports.WallManager = WallManager;
},{"./collisions":1,"./const":2,"./wall":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Wall = (function () {
    function Wall(sprite, game) {
        this.game = game;
        this.sprite = sprite;
    }
    Wall.prototype.collide = function (a, b) {
        return;
    };
    return Wall;
}());
exports.Wall = Wall;
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2NvbGxpc2lvbnMudHMiLCJzcmMvYXBwL2NvbnN0LnRzIiwic3JjL2FwcC9nZW0tbWFuYWdlci50cyIsInNyYy9hcHAvZ2VtLnRzIiwic3JjL2FwcC9tYXplLWdhbWUudHMiLCJzcmMvYXBwL21hemUtZ2VuZXJhdG9yLnRzIiwic3JjL2FwcC9tb2ItbWFuYWdlci50cyIsInNyYy9hcHAvbW9iLnRzIiwic3JjL2FwcC9wYWNtYW4udHMiLCJzcmMvYXBwL3dhbGwtbWFuYWdlci50cyIsInNyYy9hcHAvd2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFpREU7SUFFQSxDQUFDO0lBeENELDZEQUE2RDtJQUM3RCw0QkFBTyxHQUFQLFVBQVEsSUFBaUIsRUFBRSxNQUFjO1FBQXpDLGlCQW1DQztRQWxDQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDeEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN0RSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FB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LENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLDBCQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLDBCQUFXLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDdE0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLEdBQUcsR0FBRyxFQUFFLGNBQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDOUMsZ0NBQWdDO1FBQ2hDLHVCQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUFFLElBQUksU0FBRyxD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Tyw0QkFBTSxHQUFkLFVBQWUsS0FBYTtRQUMxQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRU8sbUNBQWEsR0FBckI7UUFDRSxNQUFNLENBQUMsY0FBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFDLENBQUM7SUFFSCxrQkFBQztBQUFELENBakhBLEFBaUhDLElBQUE7QUFqSFksa0NBQVc7Ozs7QUNKeEI7SUFNRSxjQUFZLE1BQXFCLEVBQVUsSUFBaUI7UUFBakIsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBTk0sc0JBQU8sR0FBZCxVQUFlLENBQU0sRUFBRSxDQUFNO1FBQzNCLE1BQU0sQ0FBQztJQUNULENBQUM7SUFLSCxXQUFDO0FBQUQsQ0FUQSxBQVNDLElBQUE7QUFUWSxvQkFBSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBQYWNtYW4gfSBmcm9tICcuL3BhY21hbic7XHJcbmltcG9ydCB7V2l0aFNyaXRlSW50ZXJmYWNlfSBmcm9tICcuL3dpdGgtc3JpdGUtaW50ZXJmYWNlJztcclxuZXhwb3J0IGNsYXNzIENvbGxpc2lvbnMge1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IENvbGxpc2lvbnM7XHJcbiAgcHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZTtcclxuICBwcml2YXRlIHBsYXllcjogUGFjbWFuO1xyXG5cclxuICBwcml2YXRlIHBsYXllckNvbGxpc2lvbkdyb3VwOiBQaGFzZXIuUGh5c2ljcy5QMi5Db2xsaXNpb25Hcm91cDtcclxuICBwcml2YXRlIGdlbXNDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXA7XHJcbiAgcHJpdmF0ZSBnb2xkQ29sbGlzaW9uR3JvdXA6IFBoYXNlci5QaHlzaWNzLlAyLkNvbGxpc2lvbkdyb3VwO1xyXG4gIHByaXZhdGUgbW9ic0NvbGxpc2lvbkdyb3VwOiBQaGFzZXIuUGh5c2ljcy5QMi5Db2xsaXNpb25Hcm91cDtcclxuICBwcml2YXRlIHdhbGxDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXA7XHJcbiAgLy8gLCBnZW1zOlBoYXNlci5Hcm91cCwgZ29sZHM6UGhhc2VyLkdyb3VwLCBtb2JzOlBoYXNlci5Hcm91cFxyXG4gIHByZXBhcmUoZ2FtZTogUGhhc2VyLkdhbWUsIHBsYXllcjogUGFjbWFuKSB7XHJcbiAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLnBsYXllckNvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMuZ2Vtc0NvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMubW9ic0NvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMud2FsbENvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5wbGF5ZXJDb2xsaXNpb25Hcm91cCk7XHJcbiAgICAvLyBwbGF5ZXIuc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5nb2xkQ29sbGlzaW9uR3JvdXApO1xyXG5cclxuICAgIHBsYXllci5zcHJpdGUuYm9keS5jb2xsaWRlcyh0aGlzLmdlbXNDb2xsaXNpb25Hcm91cCwgKGE6IGFueSwgYjogYW55KSA9PiB7XHJcbiAgICAgIGIuc3ByaXRlLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5wbGF5ZXIuYWRkUG9pbnRzKDEwMCk7XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy5nb2xkQ29sbGlzaW9uR3JvdXAsIChhOiBhbnksIGI6IGFueSkgPT4ge1xyXG4gICAgICBiLnNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgIHRoaXMucGxheWVyLmtpbGxpbmdNb2RlKCk7XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy5tb2JzQ29sbGlzaW9uR3JvdXAsIChhOiBhbnksIGI6IGFueSkgPT4ge1xyXG4gICAgICBpZiAocGxheWVyLmlzS2lsbGluZ01vZGUpIHtcclxuICAgICAgICBiLnNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgICAgcGxheWVyLmFkZFBvaW50cygxNTApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZU92ZXJTdGF0ZScpO1xyXG4gICAgICB9XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy53YWxsQ29sbGlzaW9uR3JvdXAsIGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnd2FsbCcsIGEsIGIpXHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ29sbGlzaW9ucyB7XHJcbiAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IHRoaXMoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGQoZ3JvdXA6IHN0cmluZywgb2JqOiBXaXRoU3JpdGVJbnRlcmZhY2UpOiB2b2lkIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdhZGRlZCcsIGdyb3VwKVxyXG4gICAgc3dpdGNoIChncm91cCkge1xyXG4gICAgICBjYXNlICdnZW0nOlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDEpO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmdlbXNDb2xsaXNpb25Hcm91cCk7XHJcbiAgICAgICAgb2JqLnNwcml0ZS5ib2R5LmNvbGxpZGVzKFt0aGlzLm1vYnNDb2xsaXNpb25Hcm91cCwgdGhpcy5nb2xkQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ2Vtc0NvbGxpc2lvbkdyb3VwXSxcclxuICAgICAgICAgIENvbGxpc2lvbnMuY29sbGlzaW9uU29sdmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ2dvbGQnOlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDIpO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmdvbGRDb2xsaXNpb25Hcm91cCk7XHJcbiAgICAgICAgb2JqLnNwcml0ZS5ib2R5LmNvbGxpZGVzKFt0aGlzLm1vYnNDb2xsaXNpb25Hcm91cCwgdGhpcy5nb2xkQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ2Vtc0NvbGxpc2lvbkdyb3VwXSxcclxuICAgICAgICAgIENvbGxpc2lvbnMuY29sbGlzaW9uU29sdmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ21vYic6XHJcbiAgICAgIGNhc2UgJ3NpY2snOlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDMpO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLm1vYnNDb2xsaXNpb25Hcm91cCk7XHJcbiAgICAgICAgb2JqLnNwcml0ZS5ib2R5LmNvbGxpZGVzKFt0aGlzLmdvbGRDb2xsaXNpb25Hcm91cCwgdGhpcy5nZW1zQ29sbGlzaW9uR3JvdXBdLFxyXG4gICAgICAgICAgQ29sbGlzaW9ucy5jb2xsaXNpb25Tb2x2ZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgb2JqLnNwcml0ZS5ib2R5LmNvbGxpZGVzKFt0aGlzLm1vYnNDb2xsaXNpb25Hcm91cCwgdGhpcy53YWxsQ29sbGlzaW9uR3JvdXBdLFxyXG4gICAgICAgICAgb2JqLmNvbGxpZGUuYmluZChvYmopKTtcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICd3YWxsJzpcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyg0KTtcclxuICAgICAgICBvYmouc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy53YWxsQ29sbGlzaW9uR3JvdXApO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5jb2xsaWRlcyhbdGhpcy5tb2JzQ29sbGlzaW9uR3JvdXBdLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIG9iai5zcHJpdGUuYm9keS5jb2xsaWRlcyh0aGlzLnBsYXllckNvbGxpc2lvbkdyb3VwLCBmdW5jdGlvbiAoYTogYW55LCBiOiBhbnkpIHtcclxuXHJcbiAgICB9LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbW9iQm91bmNpbmcoYTogYW55LCBiOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdtb2IgYm91bmNlJywgYSwgYilcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY29sbGlzaW9uU29sdmVyKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICB2YXIgZ2V0VmFsdWUgPSBmdW5jdGlvbiAoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICBjYXNlICd1Zm8nOiByZXR1cm4gMTAwMDtcclxuICAgICAgICBjYXNlICdtb2InOiByZXR1cm4gMjtcclxuICAgICAgICBjYXNlICdnb2xkJzogcmV0dXJuIDA7XHJcbiAgICAgICAgY2FzZSAnZ2VtJzogcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghYS5zcHJpdGUgfHwgIWIuc3ByaXRlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChhLnNwcml0ZS5rZXkgPT0gYi5zcHJpdGUua2V5KSB7XHJcbiAgICAgIGEuc3ByaXRlLmRlc3Ryb3koKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBhdiA9IGdldFZhbHVlKGEuc3ByaXRlLmtleSk7XHJcbiAgICAgIHZhciBidiA9IGdldFZhbHVlKGIuc3ByaXRlLmtleSk7XHJcbiAgICAgIGlmIChhdiA+IGJ2KSB7XHJcbiAgICAgICAgYi5zcHJpdGUuZGVzdHJveSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGEuc3ByaXRlLmRlc3Ryb3koKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0iLCJleHBvcnQgY2xhc3MgQ29uc3RzIHtcclxuICBwdWJsaWMgc3RhdGljIG1hcmdpbnM6IG51bWJlciA9IDA7XHJcbiAgcHVibGljIHN0YXRpYyB0aWxlU2l6ZTogbnVtYmVyID0gMDtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IFdhbGxNYW5hZ2VyIH0gZnJvbSAnLi93YWxsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBDb25zdHMgfSBmcm9tICcuL2NvbnN0JztcclxuaW1wb3J0IHsgQ29sbGlzaW9ucyB9IGZyb20gJy4vY29sbGlzaW9ucyc7XHJcbmltcG9ydCB7IEdlbSB9IGZyb20gJy4vZ2VtJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHZW1NYW5hZ2VyIHtcclxuXHJcbiAgcHVibGljIGdlbXM6IFBoYXNlci5Hcm91cDtcclxuICBwdWJsaWMgZ29sZHM6IFBoYXNlci5Hcm91cDtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lLCBwcml2YXRlIHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG4gICAgdGhpcy5nZW1zID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xyXG4gICAgdGhpcy5nb2xkcyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0KCkge1xyXG4gICAgdGhpcy5zcGF3bkdlbSgpOyB0aGlzLnNwYXduR2VtKCk7IHRoaXMuc3Bhd25HZW0oKTtcclxuICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5sb29wKDMwMDAsIHRoaXMuc3Bhd25HZW0uYmluZCh0aGlzKSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBzcGF3bkdlbSgpIHtcclxuICAgIHZhciBpc0dlbSA9IE1hdGgucmFuZG9tKCkgPj0gMC4zO1xyXG4gICAgdmFyIHggPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKHRoaXMuc2l6ZS54IC0gMSkpKTtcclxuICAgIHZhciB5ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueSAtIDEpKSk7XHJcblxyXG4gICAgdmFyIHNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHggKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCB5ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgaXNHZW0gPyAnZ2VtJyA6ICdnb2xkJyk7XHJcbiAgICBzcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgc3ByaXRlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDMyICogMC4zLCBDb25zdHMudGlsZVNpemUgLyAzMiAqIDAuMyk7XHJcblxyXG4gICAgdGhpcy5nYW1lLnBoeXNpY3MucDIuZW5hYmxlKHNwcml0ZSwgZmFsc2UpO1xyXG5cclxuICAgIHNwcml0ZS5ib2R5LnNldENpcmNsZShDb25zdHMudGlsZVNpemUgKiAwLjE1KTtcclxuICAgIC8vIHNwcml0ZS5ib2R5LmtpbmVtYXRpYyA9IHRydWU7XHJcbiAgICBDb2xsaXNpb25zLmdldEluc3RhbmNlKCkuYWRkKGlzR2VtID8gJ2dlbScgOiAnZ29sZCcsIG5ldyBHZW0oc3ByaXRlLCB0aGlzLmdhbWUpKTtcclxuXHJcbiAgfVxyXG5cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IFdpdGhTcml0ZUludGVyZmFjZSB9IGZyb20gJy4vd2l0aC1zcml0ZS1pbnRlcmZhY2UnO1xyXG5leHBvcnQgY2xhc3MgR2VtIGltcGxlbWVudHMgV2l0aFNyaXRlSW50ZXJmYWNlIHtcclxuICBwdWJsaWMgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xyXG4gIHB1YmxpYyBjb2xsaWRlKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihzcHJpdGU6IFBoYXNlci5TcHJpdGUsIHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWUpIHtcclxuICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG4gIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IENvbnN0cyB9IGZyb20gJy4vY29uc3QnO1xyXG5pbXBvcnQgeyBNYXplIH0gZnJvbSAnLi9tYXplJztcclxuaW1wb3J0IHsgTWF6ZUdlbmVyYXRvciB9IGZyb20gJy4vbWF6ZS1nZW5lcmF0b3InO1xyXG5pbXBvcnQgeyBXYWxsTWFuYWdlciB9IGZyb20gJy4vd2FsbC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgUGFjbWFuIH0gZnJvbSAnLi9wYWNtYW4nO1xyXG5pbXBvcnQgeyBHZW1NYW5hZ2VyIH0gZnJvbSAnLi9nZW0tbWFuYWdlcic7XHJcbmltcG9ydCB7IENvbGxpc2lvbnMgfSBmcm9tICcuL2NvbGxpc2lvbnMnO1xyXG5pbXBvcnQgeyBNb2JNYW5hZ2VyIH0gZnJvbSAnLi9tb2ItbWFuYWdlcic7XHJcblxyXG5jbGFzcyBNYXplR2FtZSB7XHJcblxyXG4gICAgZ2FtZTogUGhhc2VyLkdhbWU7XHJcblxyXG4gICAgbWF6ZTogTWF6ZTtcclxuXHJcbiAgICB3YWxsTWFuYWdlcjogV2FsbE1hbmFnZXI7XHJcbiAgICBtb2JNYW5hZ2VyOiBNb2JNYW5hZ2VyO1xyXG5cclxuICAgIHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSA9IHsgeDogMTUsIHk6IDE1IH07XHJcblxyXG4gICAgcGFjbWFuOiBQYWNtYW47XHJcbiAgICB3OiBudW1iZXI7XHJcbiAgICBoOiBudW1iZXJcclxuICAgIG1heFc6IG51bWJlcjtcclxuICAgIG1heEg6IG51bWJlcjtcclxuICAgIG1pblc6IG51bWJlcjtcclxuICAgIG1pbkg6IG51bWJlcjtcclxuICAgIHRpbWU6IG51bWJlcjtcclxuICAgIHRleHRUaW1lcjogUGhhc2VyLlRleHQ7XHJcbiAgICB0aW1lSW50ZXJ2YWw6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWF4VyA9IHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIHRoaXMubWF4SCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIHRoaXMubWluSCA9IDk2MCAvIHRoaXMubWF4VyAqIHRoaXMubWF4SDtcclxuICAgICAgICB0aGlzLm1pblcgPSA5NjA7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSh0aGlzLm1pblcsIHRoaXMubWluSCwgUGhhc2VyLkNBTlZBUywgJ2NvbnRlbnQnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXplID0gTWF6ZUdlbmVyYXRvci5nZXRJbnN0YW5jZSgpLmdlbmVyYXRlKHRoaXMuc2l6ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ3N0YXJ0U3RhdGUnLCB7XHJcblxyXG4gICAgICAgICAgICBwcmVsb2FkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNldEdhbWVTaXplKHRoaXMubWF4VywgdGhpcy5tYXhIKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudyA9IHRoaXMuZ2FtZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaCA9IHRoaXMuZ2FtZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBDb25zdHMudGlsZVNpemUgPSB0aGlzLncgLyAxMjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNyZWF0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lID0gMztcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZUludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZSAtPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci50ZXh0ID0gJ1NUQVJUISEnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWUgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZVN0YXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZUludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLnRleHQgPSAnR2FtZSB3aWxsIHN0YXJ0IGluICcgKyB0aGlzLnRpbWUgKyAnIHNlY29uZHMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lciA9IHRoaXMuZ2FtZS5hZGQudGV4dCh0aGlzLncgLyAyLjAsIHRoaXMuaCAvIDIuMCwgJ0dhbWUgd2lsbCBzdGFydCBpbiAnICsgdGhpcy50aW1lICsgJyBzZWNvbmRzJywgJycpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRDZW50ZXIgYWxpZ25cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLmFsaWduID0gJ2NlbnRlcic7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9cdEZvbnQgc3R5bGVcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLmZvbnQgPSAnQXJpYWwgQmxhY2snO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuZm9udFNpemUgPSA1MDtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLmZvbnRXZWlnaHQgPSAnYm9sZCc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9cdFN0cm9rZSBjb2xvciBhbmQgdGhpY2tuZXNzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci5zdHJva2UgPSAnIzAwMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci5zdHJva2VUaGlja25lc3MgPSA2O1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuZmlsbCA9ICcjNDNkNjM3JztcclxuXHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWVTdGF0ZScsIHRoaXMsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuYWRkKCdnYW1lT3ZlclN0YXRlJywge1xyXG4gICAgICAgICAgICBjcmVhdGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KHRoaXMudyAvIDIuMCwgdGhpcy5oIC8gMi4wLCAnUG9pbnRzOiAnICsgdGhpcy5wYWNtYW4uZ2V0UG9pbnRzKCksICcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0Q2VudGVyIGFsaWduXHJcbiAgICAgICAgICAgICAgICB0ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIHRleHQuYWxpZ24gPSAnY2VudGVyJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0Rm9udCBzdHlsZVxyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250ID0gJ0FyaWFsIEJsYWNrJztcclxuICAgICAgICAgICAgICAgIHRleHQuZm9udFNpemUgPSA1MDtcclxuICAgICAgICAgICAgICAgIHRleHQuZm9udFdlaWdodCA9ICdib2xkJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0U3Ryb2tlIGNvbG9yIGFuZCB0aGlja25lc3NcclxuICAgICAgICAgICAgICAgIHRleHQuc3Ryb2tlID0gJyMwMDAwMDAnO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5zdHJva2VUaGlja25lc3MgPSA2O1xyXG4gICAgICAgICAgICAgICAgdGV4dC5maWxsID0gJyM0M2Q2MzcnO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCh0aGlzLncgLyAyLjAsIHRoaXMuaCAvIDIuMCArIDYwLCAnQ2xpY2sgYW55dGhpbmcgdG8gcmVzdGFydCcsICcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0Q2VudGVyIGFsaWduXHJcbiAgICAgICAgICAgICAgICB0ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIHRleHQuYWxpZ24gPSAnY2VudGVyJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0Rm9udCBzdHlsZVxyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250ID0gJ0FyaWFsIEJsYWNrJztcclxuICAgICAgICAgICAgICAgIHRleHQuZm9udFNpemUgPSA1MDtcclxuICAgICAgICAgICAgICAgIHRleHQuZm9udFdlaWdodCA9ICdib2xkJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0U3Ryb2tlIGNvbG9yIGFuZCB0aGlja25lc3NcclxuICAgICAgICAgICAgICAgIHRleHQuc3Ryb2tlID0gJyMwMDAwMDAnO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5zdHJva2VUaGlja25lc3MgPSA2O1xyXG4gICAgICAgICAgICAgICAgdGV4dC5maWxsID0gJyM0M2Q2MzcnO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5vbkRvd24uYWRkKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdzdGFydFN0YXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCd1Zm8nLCAnYXNzZXRzL3Vmby5wbmcnKTtcclxuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSgnZ2VtJywgJ2Fzc2V0cy9nZW0ucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2dvbGQnLCAnYXNzZXRzL2dvbGQucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ21hemUtYmcnLCAnYXNzZXRzL21hemUtYmcucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ21vYicsICdhc3NldHMvbW9iLnBuZycsIDMyLCAzMik7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ3NpY2snLCAnYXNzZXRzL3NpY2sucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2hhemFyZCcsICdhc3NldHMvaGF6YXJkLnBuZycpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2J1dHRvbnZlcnRpY2FsJywgJ2Fzc2V0cy9idXR0b24tdmVydGljYWwucG5nJywgMzIsIDY0KTtcclxuICAgICAgICB0aGlzLmdhbWUubG9hZC5zcHJpdGVzaGVldCgnYnV0dG9uaG9yaXpvbnRhbCcsICdhc3NldHMvYnV0dG9uLWhvcml6b250YWwucG5nJywgNjQsIDMyKTtcclxuICAgICAgICB0aGlzLmdhbWUubG9hZC5zcHJpdGVzaGVldCgnYnV0dG9uZGlhZ29uYWwnLCAnYXNzZXRzL2J1dHRvbi1kaWFnb25hbC5wbmcnLCA0OCwgNDgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwb2ludHNUZXh0OiBQaGFzZXIuVGV4dDtcclxuXHJcbiAgICBjcmVhdGUoKSB7XHJcbiAgICAgICAgdGhpcy53YWxsTWFuYWdlciA9IG5ldyBXYWxsTWFuYWdlcih0aGlzLmdhbWUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLlAySlMpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnNldEltcGFjdEV2ZW50cyh0cnVlKTtcclxuICAgICAgICB0aGlzLmdhbWUud29ybGQuc2V0Qm91bmRzKDAsIDAsIHRoaXMuc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIsIHRoaXMuc2l6ZS55ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnJlc3RpdHV0aW9uID0gMC44O1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnNldEJvdW5kc1RvV29ybGQodHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnVwZGF0ZUJvdW5kc0NvbGxpc2lvbkdyb3VwKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGFjbWFuID0gbmV3IFBhY21hbih0aGlzLmdhbWUsIHRoaXMud2FsbE1hbmFnZXIpO1xyXG5cclxuICAgICAgICBDb2xsaXNpb25zLmdldEluc3RhbmNlKCkucHJlcGFyZSh0aGlzLmdhbWUsIHRoaXMucGFjbWFuKTtcclxuXHJcbiAgICAgICAgdGhpcy53YWxsTWFuYWdlci5kcmF3KHRoaXMubWF6ZSwgdGhpcy5zaXplKTtcclxuXHJcbiAgICAgICAgbmV3IEdlbU1hbmFnZXIodGhpcy5nYW1lLCB0aGlzLnNpemUpLnN0YXJ0KClcclxuICAgICAgICB0aGlzLm1vYk1hbmFnZXIgPSBuZXcgTW9iTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMucGFjbWFuLCB0aGlzLnNpemUpOy8vXHJcbiAgICAgICAgdGhpcy5tb2JNYW5hZ2VyLnN0YXJ0KClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy53LCB0aGlzLmgpXHJcbiAgICAgICAgdGhpcy5wb2ludHNUZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KENvbnN0cy50aWxlU2l6ZSAvIDgsIENvbnN0cy50aWxlU2l6ZSAvIDgsICc6JyArIHRoaXMucGFjbWFuLmdldFBvaW50cygpLCAnJyk7XHJcbiAgICAgICAgdGhpcy5wb2ludHNUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIC8vXHRDZW50ZXIgYWxpZ25cclxuICAgICAgICAvLyB0aGlzLnBvaW50c1RleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgIHRoaXMucG9pbnRzVGV4dC5hbGlnbiA9ICdyaWdodCc7XHJcblxyXG4gICAgICAgIC8vXHRGb250IHN0eWxlXHJcbiAgICAgICAgdGhpcy5wb2ludHNUZXh0LmZvbnQgPSAnQXJpYWwgQmxhY2snO1xyXG4gICAgICAgIHRoaXMucG9pbnRzVGV4dC5mb250U2l6ZSA9IENvbnN0cy50aWxlU2l6ZSAvIDQuMDtcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuZm9udFdlaWdodCA9ICdib2xkJztcclxuXHJcbiAgICAgICAgLy9cdFN0cm9rZSBjb2xvciBhbmQgdGhpY2tuZXNzXHJcbiAgICAgICAgdGhpcy5wb2ludHNUZXh0LnN0cm9rZSA9ICcjMDAwMDAwJztcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuc3Ryb2tlVGhpY2tuZXNzID0gNjtcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuZmlsbCA9ICcjNDNkNjM3JztcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuYnJpbmdUb1RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLnBhY21hbi51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLm1vYk1hbmFnZXIudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5wb2ludHNUZXh0LnNldFRleHQoJzonICsgdGhpcy5wYWNtYW4uZ2V0UG9pbnRzKCkpO1xyXG4gICAgICAgIC8vIHRoaXMucG9pbnRzVGV4dC5wb3NpdGlvbi5zZXQodGhpcy5nYW1lLmNhbWVyYS5wb3NpdGlvbi54LCB0aGlzLmdhbWUuY2FtZXJhLnBvc2l0aW9uLnkpXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydFN0YXRlKCkge1xyXG4gICAgICAgIGFsZXJ0KCdzdGFydCcpXHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZVN0YXRlKCkge1xyXG4gICAgICAgIGFsZXJ0KCdnYW1lJylcclxuICAgIH1cclxuICAgIGdhbWVPdmVyU3RhdGUoKSB7XHJcbiAgICAgICAgYWxlcnQoJ1BvaW50czonICsgdGhpcy5wYWNtYW4uZ2V0UG9pbnRzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVPYmplY3QgPSB7IGxlZnQ6IGZhbHNlLCByaWdodDogZmFsc2UsIHVwOiBmYWxzZSwgZG93bjogZmFsc2UgfVxyXG5cclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGxldCBnYW1lID0gbmV3IE1hemVHYW1lKCk7XHJcbn0iLCJpbXBvcnQgeyBNYXplIH0gZnJvbSAnLi9tYXplJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXplR2VuZXJhdG9yIHtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBNYXplR2VuZXJhdG9yO1xyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XHJcbiAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IE1hemVHZW5lcmF0b3IoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdlbmVyYXRlKHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG4gICAgdmFyIHggPSBzaXplLng7XHJcbiAgICB2YXIgeSA9IHNpemUueTtcclxuXHJcbiAgICB2YXIgdG90YWxDZWxscyA9IHggKiB5O1xyXG4gICAgdmFyIGNlbGxzID0gbmV3IEFycmF5KCk7XHJcbiAgICB2YXIgdW52aXMgPSBuZXcgQXJyYXkoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeTsgaSsrKSB7XHJcbiAgICAgIGNlbGxzW2ldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgIHVudmlzW2ldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgeDsgaisrKSB7XHJcbiAgICAgICAgY2VsbHNbaV1bal0gPSBbMCwgMCwgMCwgMF07XHJcbiAgICAgICAgdW52aXNbaV1bal0gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0IGEgcmFuZG9tIHBvc2l0aW9uIHRvIHN0YXJ0IGZyb21cclxuICAgIHZhciBjdXJyZW50Q2VsbCA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB5KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogeCldO1xyXG4gICAgdmFyIHBhdGggPSBbY3VycmVudENlbGxdO1xyXG4gICAgdW52aXNbY3VycmVudENlbGxbMF1dW2N1cnJlbnRDZWxsWzFdXSA9IGZhbHNlO1xyXG4gICAgdmFyIHZpc2l0ZWQgPSAxO1xyXG5cclxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgYXZhaWxhYmxlIGNlbGwgcG9zaXRpb25zXHJcbiAgICB3aGlsZSAodmlzaXRlZCA8IHRvdGFsQ2VsbHMpIHtcclxuICAgICAgLy8gRGV0ZXJtaW5lIG5laWdoYm9yaW5nIGNlbGxzXHJcbiAgICAgIHZhciBwb3QgPSBbW2N1cnJlbnRDZWxsWzBdIC0gMSwgY3VycmVudENlbGxbMV0sIDAsIDJdLFxyXG4gICAgICBbY3VycmVudENlbGxbMF0sIGN1cnJlbnRDZWxsWzFdICsgMSwgMSwgM10sXHJcbiAgICAgIFtjdXJyZW50Q2VsbFswXSArIDEsIGN1cnJlbnRDZWxsWzFdLCAyLCAwXSxcclxuICAgICAgW2N1cnJlbnRDZWxsWzBdLCBjdXJyZW50Q2VsbFsxXSAtIDEsIDMsIDFdXTtcclxuICAgICAgdmFyIG5laWdoYm9ycyA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIGlmIGVhY2ggbmVpZ2hib3JpbmcgY2VsbCBpcyBpbiBnYW1lIGdyaWQsIGFuZCB3aGV0aGVyIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2hlY2tlZFxyXG4gICAgICBmb3IgKHZhciBsID0gMDsgbCA8IDQ7IGwrKykge1xyXG4gICAgICAgIGlmIChwb3RbbF1bMF0gPiAtMSAmJiBwb3RbbF1bMF0gPCB5ICYmIHBvdFtsXVsxXSA+IC0xICYmIHBvdFtsXVsxXSA8IHggJiYgdW52aXNbcG90W2xdWzBdXVtwb3RbbF1bMV1dKSB7IG5laWdoYm9ycy5wdXNoKHBvdFtsXSk7IH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgYXQgbGVhc3Qgb25lIGFjdGl2ZSBuZWlnaGJvcmluZyBjZWxsIGhhcyBiZWVuIGZvdW5kXHJcbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gQ2hvb3NlIG9uZSBvZiB0aGUgbmVpZ2hib3JzIGF0IHJhbmRvbVxyXG4gICAgICAgIHZhciBuZXh0ID0gbmVpZ2hib3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGgpXTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSB3YWxsIGJldHdlZW4gdGhlIGN1cnJlbnQgY2VsbCBhbmQgdGhlIGNob3NlbiBuZWlnaGJvcmluZyBjZWxsXHJcbiAgICAgICAgY2VsbHNbY3VycmVudENlbGxbMF1dW2N1cnJlbnRDZWxsWzFdXVtuZXh0WzJdXSA9IDE7XHJcbiAgICAgICAgY2VsbHNbbmV4dFswXV1bbmV4dFsxXV1bbmV4dFszXV0gPSAxO1xyXG5cclxuICAgICAgICAvLyBNYXJrIHRoZSBuZWlnaGJvciBhcyB2aXNpdGVkLCBhbmQgc2V0IGl0IGFzIHRoZSBjdXJyZW50IGNlbGxcclxuICAgICAgICB1bnZpc1tuZXh0WzBdXVtuZXh0WzFdXSA9IGZhbHNlO1xyXG4gICAgICAgIHZpc2l0ZWQrKztcclxuICAgICAgICBjdXJyZW50Q2VsbCA9IFtuZXh0WzBdLCBuZXh0WzFdXTtcclxuICAgICAgICBwYXRoLnB1c2goY3VycmVudENlbGwpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIE90aGVyd2lzZSBnbyBiYWNrIHVwIGEgc3RlcCBhbmQga2VlcCBnb2luZ1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjdXJyZW50Q2VsbCA9IHBhdGgucG9wKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5vcHRpbWl6ZVdhbGxzKGNlbGxzLCBzaXplKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcHRpbWl6ZVdhbGxzKGNlbGxzOiBudW1iZXJbXVtdW10sIHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSk6IE1hemUge1xyXG4gICAgdmFyIGhvcml6b250YWxXYWxsczogeyB3YWxsOiBib29sZWFuLCBjb3VudDogbnVtYmVyIH1bXVtdID0gW107XHJcblxyXG4gICAgdmFyIHByZXBmb3JWZXJ0ID0gW107XHJcblxyXG4gICAgY2VsbHMuZm9yRWFjaCgocm93LCByb3dJLCByb3dzKSA9PiB7XHJcbiAgICAgIHZhciBuZXh0Um93ID0gcm93c1tyb3dJICsgMV07XHJcbiAgICAgIGhvcml6b250YWxXYWxsc1tyb3dJXSA9IFtdO1xyXG4gICAgICB2YXIgbGFzdFJvd1ZhbHVlOiBib29sZWFuID0gbnVsbDtcclxuICAgICAgdmFyIHJvd0NhY2hlID0gMDtcclxuICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNlbGxJLCBjZWxscykgPT4ge1xyXG4gICAgICAgIGlmICghbmV4dFJvdykge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaG9yaXpvbnRhbFdhbGwgPSAhIWNlbGxbMl0gfHwgISFuZXh0Um93W2NlbGxJXVswXTtcclxuICAgICAgICBpZiAobGFzdFJvd1ZhbHVlID09PSBob3Jpem9udGFsV2FsbCB8fCBsYXN0Um93VmFsdWUgPT09IG51bGwpIHtcclxuICAgICAgICAgIGlmIChsYXN0Um93VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsYXN0Um93VmFsdWUgPSBob3Jpem9udGFsV2FsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJvd0NhY2hlKys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGhvcml6b250YWxXYWxsc1tyb3dJXS5wdXNoKHsgd2FsbDogbGFzdFJvd1ZhbHVlLCBjb3VudDogcm93Q2FjaGUgfSk7XHJcbiAgICAgICAgICBsYXN0Um93VmFsdWUgPSBob3Jpem9udGFsV2FsbDtcclxuICAgICAgICAgIHJvd0NhY2hlID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KVxyXG4gICAgICBpZiAocm93Q2FjaGUgPiAwKSB7XHJcbiAgICAgICAgaG9yaXpvbnRhbFdhbGxzW3Jvd0ldLnB1c2goeyB3YWxsOiBsYXN0Um93VmFsdWUsIGNvdW50OiByb3dDYWNoZSB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHZhciB2ZXJ0aWNhbFdhbGxzVG1wOiBib29sZWFuW11bXSA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2ZXJ0aWNhbFdhbGxzVG1wW2ldID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZlcnRpY2FsV2FsbHNUbXAgPSBjZWxscy5tYXAoKHJvdywgcm93SSwgcm93cykgPT4ge1xyXG4gICAgICByZXR1cm4gcm93Lm1hcCgoY2VsbCwgY2VsbEksIGNlbGxzKSA9PiB7XHJcbiAgICAgICAgdmFyIG5leHRDZWxsID0gY2VsbHNbY2VsbEkgKyAxXTtcclxuICAgICAgICB2YXIgdmVydGljYWxXYWxsID0gISFjZWxsWzFdIHx8IChuZXh0Q2VsbCA/ICEhbmV4dENlbGxbM10gOiBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuIHZlcnRpY2FsV2FsbFxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICB2YXIgY29sczogYW55ID0gW11cclxuXHJcbiAgICBmb3IgKHZhciByID0gMDsgciA8IHZlcnRpY2FsV2FsbHNUbXAubGVuZ3RoOyByKyspIHtcclxuICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCB2ZXJ0aWNhbFdhbGxzVG1wW3JdLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdmVydGljYWxXYWxsc1RtcFtyXVtjXTtcclxuICAgICAgICBpZiAoIWNvbHNbY10pIHtcclxuICAgICAgICAgIGNvbHNbY10gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFjb2xzW2NdW3JdKSB7XHJcbiAgICAgICAgICBjb2xzW2NdW3JdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbHNbY11bcl0gPSB2YWx1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHZlcnRpY2FsV2FsbHM6IHsgd2FsbDogYm9vbGVhbiwgY291bnQ6IG51bWJlciB9W11bXSA9IGNvbHMubWFwKChjb2w6IGFueSwgY29sSTogYW55LCBjb2xBOiBhbnkpID0+IHtcclxuICAgICAgdmFyIGxhc3RWYWx1ZTogYm9vbGVhbiA9IG51bGw7XHJcbiAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgIHZhciByZXM6IHsgd2FsbDogYm9vbGVhbiwgY291bnQ6IG51bWJlciB9W10gPSBbXTtcclxuICAgICAgY29sLmZvckVhY2goKHdhbGw6IGFueSwgd2FsbEk6IGFueSwgd2FsbEE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChsYXN0VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgbGFzdFZhbHVlID0gd2FsbDtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh3YWxsICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgcmVzLnB1c2goeyB3YWxsOiBsYXN0VmFsdWUsIGNvdW50OiBjb3VudCB9KTtcclxuICAgICAgICAgICAgbGFzdFZhbHVlID0gd2FsbDtcclxuICAgICAgICAgICAgY291bnQgPSAxO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICByZXMucHVzaCh7IHdhbGw6IGxhc3RWYWx1ZSwgY291bnQ6IGNvdW50IH0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9KVxyXG5cclxuICAgIHZlcnRpY2FsV2FsbHMucG9wKCk7XHJcblxyXG5cclxuICAgIHJldHVybiB7IGNvbHM6IFtdIHx8IHZlcnRpY2FsV2FsbHMsIHJvd3M6IFtdIHx8IGhvcml6b250YWxXYWxscyB9O1xyXG4gICAgLy8gdmFyIHhTdW0gPSAwO1xyXG4gICAgLy8gdmFyIGxhc3QgPSB0cnVlO1xyXG4gICAgLy8gdmFyIHhjYSA9IFtdO1xyXG4gICAgLy8gZm9yICh2YXIgaSA9IDE7IGkgPCBzaXplLng7IGkrKykge1xyXG4gICAgLy8gICB2YXIgeGMgPSBbXTtcclxuICAgIC8vICAgd2hpbGUgKHhTdW0gIT0gc2l6ZS54KSB7XHJcbiAgICAvLyAgICAgdmFyIHJlc3QgPSBzaXplLnggLSB4U3VtO1xyXG4gICAgLy8gICAgIHZhciB2ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDcpICsgMSk7XHJcbiAgICAvLyAgICAgdiA9IHYgPiByZXN0ID8gcmVzdCA6IHY7XHJcbiAgICAvLyAgICAgbGFzdCA9ICFsYXN0O1xyXG4gICAgLy8gICAgIHhjLnB1c2goeyB3YWxsOiBsYXN0LCBjb3VudDogdiB9KVxyXG4gICAgLy8gICAgIHhTdW0gKz0gdjtcclxuICAgIC8vICAgfVxyXG5cclxuICAgIC8vICAgeGNhLnB1c2goeGMpO1xyXG4gICAgLy8gICB4U3VtID0gMDtcclxuICAgIC8vIH1cclxuICAgIC8vIHZhciB5Y2EgPSBbXTtcclxuICAgIC8vIHZhciB5U3VtID0gMDtcclxuICAgIC8vIGZvciAodmFyIGkgPSAxOyBpIDwgc2l6ZS54OyBpKyspIHtcclxuICAgIC8vICAgdmFyIHljID0gW107XHJcbiAgICAvLyAgIHdoaWxlICh5U3VtICE9IHNpemUueSkge1xyXG4gICAgLy8gICAgIHZhciByZXN0ID0gc2l6ZS55IC0geVN1bTtcclxuICAgIC8vICAgICB2YXIgdiA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiA3KSArIDEpO1xyXG4gICAgLy8gICAgIHYgPSB2ID4gcmVzdCA/IHJlc3QgOiB2O1xyXG4gICAgLy8gICAgIGxhc3QgPSAhbGFzdDtcclxuICAgIC8vICAgICB5Yy5wdXNoKHsgd2FsbDogbGFzdCwgY291bnQ6IHYgfSlcclxuICAgIC8vICAgICB5U3VtICs9IHY7XHJcbiAgICAvLyAgIH1cclxuXHJcbiAgICAvLyAgIHljYS5wdXNoKHljKTtcclxuICAgIC8vICAgeVN1bSA9IDA7XHJcbiAgICAvLyB9XHJcblxyXG5cclxuICAgIC8vIHJldHVybiB7IGNvbHM6IHljYSwgcm93czogeGNhIH1cclxuICB9XHJcblxyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBXYWxsTWFuYWdlciB9IGZyb20gJy4vd2FsbC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IENvbGxpc2lvbnMgfSBmcm9tICcuL2NvbGxpc2lvbnMnO1xyXG5pbXBvcnQgeyBQYWNtYW4gfSBmcm9tICcuL3BhY21hbic7XHJcbmltcG9ydCB7IE1vYiB9IGZyb20gJy4vbW9iJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNb2JNYW5hZ2VyIHtcclxuXHJcbiAgcHVibGljIG1vYnM6IFBoYXNlci5Hcm91cDtcclxuICBwdWJsaWMgbW9ic0luc3RhbmNlczogTW9iW10gPSBbXTtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lLCBwcml2YXRlIHBhY21hbjogUGFjbWFuLCBwcml2YXRlIHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG4gIH1cclxuXHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLm1vYnMgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XHJcbiAgICB0aGlzLnNwYXduTW9iKCk7IHRoaXMuc3Bhd25Nb2IoKTsgdGhpcy5zcGF3bk1vYigpO1xyXG4gICAgdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmxvb3AoMTAwMCwgdGhpcy5zcGF3bk1vYi5iaW5kKHRoaXMpLCB0aGlzKTtcclxuICB9XHJcblxyXG4gIHNwYXduTW9iKCkge1xyXG5cclxuICAgIHZhciB4ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueCAtIDEpKSk7XHJcbiAgICB2YXIgeSA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAodGhpcy5zaXplLnkgLSAxKSkpO1xyXG4gICAgdmFyIGRpc3QgPSB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZGlzdGFuY2VUb1hZKFxyXG4gICAgICB0aGlzLnBhY21hbi5zcHJpdGUsXHJcbiAgICAgIHggKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LFxyXG4gICAgICB5ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCk7XHJcblxyXG4gICAgd2hpbGUgKENvbnN0cy50aWxlU2l6ZSAqIDIuNSA+PSBkaXN0KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRpc3QsIENvbnN0cy50aWxlU2l6ZSlcclxuICAgICAgeCA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAodGhpcy5zaXplLnggLSAxKSkpO1xyXG4gICAgICB5ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueSAtIDEpKSk7XHJcbiAgICAgIGRpc3QgPSB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZGlzdGFuY2VUb1hZKFxyXG4gICAgICAgIHRoaXMucGFjbWFuLnNwcml0ZSxcclxuICAgICAgICB4ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCxcclxuICAgICAgICB5ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCk7XHJcbiAgICB9XHJcbiAgICB2YXIgc3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoeCAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIHkgKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCAnaGF6YXJkJyk7XHJcbiAgICBzcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgc3ByaXRlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDk2ICogMC4zLCBDb25zdHMudGlsZVNpemUgLyA5NiAqIDAuMyk7XHJcbiAgICB2YXIgdHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHNwcml0ZSk7XHJcbiAgICB0d2Vlbi50byh7IGFscGhhOiAwIH0sIDMwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUpO1xyXG4gICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKGU6IGFueSkgPT4ge1xyXG4gICAgICBlLmRlc3Ryb3koKTtcclxuICAgICAgdmFyIHNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHggKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCB5ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgJ21vYicpO1xyXG4gICAgICBzcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICBzcHJpdGUuc2NhbGUuc2V0VG8oQ29uc3RzLnRpbGVTaXplIC8gMzIgKiAwLjMsIENvbnN0cy50aWxlU2l6ZSAvIDMyICogMC4zKTtcclxuXHJcbiAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLmVuYWJsZShzcHJpdGUsIGZhbHNlKTtcclxuXHJcbiAgICAgIHNwcml0ZS5ib2R5LnNldENpcmNsZShDb25zdHMudGlsZVNpemUgKiAwLjIpO1xyXG4gICAgICB0aGlzLm1vYnMuYWRkKHNwcml0ZSk7XHJcbiAgICAgIC8vIHNwcml0ZS5ib2R5LmtpbmVtYXRpYyA9IHRydWU7XHJcbiAgICAgIHZhciBtb2IgPSBuZXcgTW9iKHNwcml0ZSwgdGhpcy5nYW1lKTtcclxuICAgICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLmFkZCgnbW9iJywgbW9iKTtcclxuXHJcbiAgICAgIHRoaXMubW9ic0luc3RhbmNlcy5wdXNoKG1vYik7XHJcblxyXG4gICAgfSwgdGhpcyk7XHJcbiAgICB0d2Vlbi5zdGFydCgpO1xyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIHRoaXMubW9ic0luc3RhbmNlcy5mb3JFYWNoKChtb2I6IE1vYikgPT4ge1xyXG4gICAgICB0aGlzLnBhY21hbi5pc0tpbGxpbmdNb2RlID8gbW9iLnNwcml0ZS5mcmFtZSA9IDEgOiBtb2Iuc3ByaXRlLmZyYW1lID0gMDtcclxuICAgICAgbW9iLm1vdmUoKTtcclxuICAgIH0sIHRoaXMpXHJcblxyXG5cclxuICB9XHJcblxyXG5cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IENvbnN0cyB9IGZyb20gJy4vY29uc3QnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb25zIH0gZnJvbSAnLi9jb2xsaXNpb25zJztcclxuaW1wb3J0IHsgV2l0aFNyaXRlSW50ZXJmYWNlIH0gZnJvbSAnLi93aXRoLXNyaXRlLWludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTW9iIGltcGxlbWVudHMgV2l0aFNyaXRlSW50ZXJmYWNlIHtcclxuICBwdWJsaWMgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xyXG4gIHByaXZhdGUgaXNNb3Zpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBjb25zdHJ1Y3RvcihzcHJpdGU6IFBoYXNlci5TcHJpdGUsIHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWUpIHtcclxuICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG4gICAgc2V0SW50ZXJ2YWwodGhpcy5jb2xsaWRlLmJpbmQodGhpcyksIDMwMDApXHJcbiAgfVxyXG5cclxuICBwb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfVxyXG4gIHB1YmxpYyBtb3ZlKCkge1xyXG4gICAgY29uc29sZS5sb2coJ21vdmUnKVxyXG4gICAgaWYgKHRoaXMuc3ByaXRlICYmIHRoaXMuc3ByaXRlLmJvZHkgJiYgIXRoaXMucG9zKSB7XHJcbiAgICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XHJcbiAgICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0WmVyb1ZlbG9jaXR5KCk7XHJcbiAgICAgIHRoaXMucG9zID0gdGhpcy5yYW5kb21Qb3NpdGlvbigpO1xyXG4gICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUubW92ZVRvWFkodGhpcy5zcHJpdGUsIHRoaXMucG9zLngsIHRoaXMucG9zLnksIENvbnN0cy50aWxlU2l6ZSAvIDMsIDMwMDApO1xyXG4gICAgICB0aGlzLmlzTW92aW5nID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb2xsaWRlKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICBpZiAodGhpcy5zcHJpdGUgJiYgdGhpcy5zcHJpdGUuYm9keSkge1xyXG4gICAgICBpZiAodGhpcy5wb3MpIHtcclxuICAgICAgICB0aGlzLnBvcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5tb3ZlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQ29sbGlzaW9ucy5jb2xsaXNpb25Tb2x2ZXIoYSwgYik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmFuZG9tUG9zaXRpb24oKTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9IHtcclxuICAgIHZhciBkaXN0YW5jZSA9IENvbnN0cy50aWxlU2l6ZSAqIDU7XHJcbiAgICB2YXIgeCA9IE1hdGgucmFuZG9tKCkgKiBkaXN0YW5jZTtcclxuICAgIHZhciB5ID0gTWF0aC5zcXJ0KGRpc3RhbmNlICogZGlzdGFuY2UgLSB4ICogeCk7XHJcblxyXG4gICAgcmV0dXJuIHsgeDogdGhpcy5zcHJpdGUucG9zaXRpb24ueCArIHRoaXMucmFuZG9tU2lnbih4KSwgeTogdGhpcy5zcHJpdGUucG9zaXRpb24ueSArIHRoaXMucmFuZG9tU2lnbih5KSB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJhbmRvbVNpZ24odmFsdWU6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpID4gMC41ID8gMSA6IC0xKSAqIHZhbHVlO1xyXG4gIH1cclxuXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBDb25zdHMgfSBmcm9tICcuL2NvbnN0JztcclxuaW1wb3J0IHsgV2FsbE1hbmFnZXIgfSBmcm9tICcuL3dhbGwtbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFjbWFuIHtcclxuXHJcbiAgcG9zaXRpb24gPSB7IHg6IDIsIHk6IDMgfVxyXG4gIHNwcml0ZTogUGhhc2VyLlNwcml0ZTtcclxuICBjdXJzb3JzOiBQaGFzZXIuQ3Vyc29yS2V5cztcclxuICBlbWl0dGVyOiBQaGFzZXIuUGFydGljbGVzLkFyY2FkZS5FbWl0dGVyO1xyXG4gIHBhcnRpY2xlc0dyb3VwOiBQaGFzZXIuR3JvdXA7XHJcblxyXG4gIHByaXZhdGUgcG9pbnRzOiBudW1iZXIgPSAwO1xyXG5cclxuICBtb3ZlT2JqZWN0OiB7IGxlZnQ6IGJvb2xlYW4sIHJpZ2h0OiBib29sZWFuLCB1cDogYm9vbGVhbiwgZG93bjogYm9vbGVhbiB9XHJcbiAgdG91Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHByaXZhdGUgc2NhbGVUb1RpbGUgPSAwLjQ7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSwgcHJpdmF0ZSB3YWxsTWFuYWdlcjogV2FsbE1hbmFnZXIpIHtcclxuXHJcbiAgICB0aGlzLnBhcnRpY2xlc0dyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xyXG5cclxuICAgIHRoaXMuc3ByaXRlID0gZ2FtZS5hZGQuc3ByaXRlKHRoaXMucG9zaXRpb24ueCAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIHRoaXMucG9zaXRpb24ueSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsICd1Zm8nKTtcclxuICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDk2ICogdGhpcy5zY2FsZVRvVGlsZSwgQ29uc3RzLnRpbGVTaXplIC8gOTYgKiB0aGlzLnNjYWxlVG9UaWxlKTtcclxuXHJcbiAgICBnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuc3ByaXRlLCBmYWxzZSk7XHJcbiAgICAvLyB0aGlzLnNwcml0ZS5ib2R5LmVuYWJsZUJvZHkgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0Q2lyY2xlKENvbnN0cy50aWxlU2l6ZSAqIDAuNSAqIHRoaXMuc2NhbGVUb1RpbGUpO1xyXG4gICAgdGhpcy5jdXJzb3JzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XHJcblxyXG4gICAgdGhpcy5nYW1lLmNhbWVyYS5mb2xsb3codGhpcy5zcHJpdGUsIFBoYXNlci5DYW1lcmEuRk9MTE9XX0xPQ0tPTiwgMC4xLCAwLjEpO1xyXG5cclxuICAgIC8vIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5sb29wKDMwMCwgdGhpcy5wYXJ0aWNsZXMuYmluZCh0aGlzKSwgdGhpcyk7XHJcbiAgICBpZiAoIXRoaXMuZ2FtZS5kZXZpY2UuZGVza3RvcCkge1xyXG4gICAgICB0aGlzLmdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKChlOiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUubW92ZVRvWFkodGhpcy5zcHJpdGUsIGUud29ybGRYLCBlLndvcmxkWSwgdGhpcy5zcGVlZCk7XHJcbiAgICAgICAgdGhpcy50b3VjaGluZyA9IHRydWU7XHJcbiAgICAgIH0sIHRoaXMpXHJcblxyXG4gICAgICB0aGlzLmdhbWUuaW5wdXQub25VcC5hZGQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudG91Y2hpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUubW92ZVRvWFkodGhpcy5zcHJpdGUsIHRoaXMuc3ByaXRlLnBvc2l0aW9uLngsIHRoaXMuc3ByaXRlLnBvc2l0aW9uLnksIDApO1xyXG4gICAgICB9LCB0aGlzKVxyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7XHJcbiAgICBpZiAodGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XHJcbiAgICAgIHRoaXMubW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW92ZSgpIHtcclxuICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XHJcbiAgICB0aGlzLnNwcml0ZS5ib2R5LnNldFplcm9WZWxvY2l0eSgpO1xyXG4gICAgdmFyIHN0ZXAgPSBDb25zdHMudGlsZVNpemUgKiAyO1xyXG5cclxuICAgIHRoaXMuc3RvcE1vdmluZygpO1xyXG5cclxuICAgIGlmICh0aGlzLmN1cnNvcnMubGVmdC5pc0Rvd24pIHtcclxuICAgICAgdGhpcy5tb3ZlT2JqZWN0LmxlZnQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5jdXJzb3JzLnJpZ2h0LmlzRG93bikge1xyXG4gICAgICB0aGlzLm1vdmVPYmplY3QucmlnaHQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnNvcnMudXAuaXNEb3duKSB7XHJcbiAgICAgIHRoaXMubW92ZU9iamVjdC51cCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLmN1cnNvcnMuZG93bi5pc0Rvd24pIHtcclxuICAgICAgdGhpcy5tb3ZlT2JqZWN0LmRvd24gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgdGhpcy5tYWtlTW92ZUZyb21Nb3ZlT2JqZWN0KCk7XHJcbiAgfVxyXG5cclxuICBzdG9wTW92aW5nKCkge1xyXG4gICAgdGhpcy5tb3ZlT2JqZWN0ID0geyBsZWZ0OiBmYWxzZSwgcmlnaHQ6IGZhbHNlLCB1cDogZmFsc2UsIGRvd246IGZhbHNlIH1cclxuICB9XHJcblxyXG4gIGdldCBzcGVlZCgpIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiAyO1xyXG4gIH1cclxuXHJcbiAgbWFrZU1vdmVGcm9tTW92ZU9iamVjdCgpIHtcclxuICAgIHZhciB4ID0gMDtcclxuICAgIHZhciB5ID0gMDtcclxuXHJcblxyXG4gICAgaWYgKHRoaXMubW92ZU9iamVjdC5sZWZ0KSB7XHJcbiAgICAgIHggPSAtNTAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubW92ZU9iamVjdC5yaWdodCkge1xyXG4gICAgICB4ID0gKzUwMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1vdmVPYmplY3QudXApIHtcclxuICAgICAgeSA9IC01MDA7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5tb3ZlT2JqZWN0LmRvd24pIHtcclxuICAgICAgeSA9ICs1MDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHggIT0gMCB8fCB5ICE9IDApIHtcclxuICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLm1vdmVUb1hZKHRoaXMuc3ByaXRlLCB0aGlzLnNwcml0ZS5wb3NpdGlvbi54ICsgeCwgdGhpcy5zcHJpdGUucG9zaXRpb24ueSArIHksIHRoaXMuc3BlZWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLm1vdmVUb1hZKHRoaXMuc3ByaXRlLCB0aGlzLnNwcml0ZS5wb3NpdGlvbi54LCB0aGlzLnNwcml0ZS5wb3NpdGlvbi55LCAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBhcnRpY2xlcygpIHtcclxuICAgIGlmICh0aGlzLmN1cnNvcnMubGVmdC5pc0Rvd24gfHwgdGhpcy5jdXJzb3JzLnJpZ2h0LmlzRG93biB8fCB0aGlzLmN1cnNvcnMudXAuaXNEb3duIHx8IHRoaXMuY3Vyc29ycy5kb3duLmlzRG93biB8fCB0aGlzLnRvdWNoaW5nKSB7XHJcblxyXG4gICAgICB2YXIgcGFydGljbGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgxMDAwLCAxMDAwLCAnZ29sZCcpO1xyXG4gICAgICBwYXJ0aWNsZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIHBhcnRpY2xlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDMyICogdGhpcy5zY2FsZVRvVGlsZSAqIDAuMyk7XHJcblxyXG4gICAgICBwYXJ0aWNsZS5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgIHBhcnRpY2xlLnggPSB0aGlzLnNwcml0ZS54O1xyXG4gICAgICBwYXJ0aWNsZS55ID0gdGhpcy5zcHJpdGUueTtcclxuICAgICAgdGhpcy5wYXJ0aWNsZXNHcm91cC5hZGQocGFydGljbGUpO1xyXG4gICAgICBwYXJ0aWNsZS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgdmFyIHRpbWUgPSA0NTAwMDtcclxuICAgICAgdmFyIHR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2VlbihwYXJ0aWNsZSk7XHJcbiAgICAgIHZhciB0d2VlblNjYWxlID0gdGhpcy5nYW1lLmFkZC50d2VlbihwYXJ0aWNsZS5zY2FsZSk7XHJcbiAgICAgIHR3ZWVuU2NhbGUudG8oeyB5OiAwLCB4OiAwIH0sIHRpbWUgLSAyMDAwLCBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lLCB0cnVlKVxyXG5cclxuICAgICAgdHdlZW4udG8oeyBhbHBoYTogMCwgYW5nbGU6IDgwMDAgfSwgdGltZSwgUGhhc2VyLkVhc2luZy5MaW5lYXIuTm9uZSk7XHJcbiAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKChlOiBhbnkpID0+IHtcclxuICAgICAgICBlLmRlc3Ryb3koKTtcclxuICAgICAgfSwgdGhpcyk7XHJcbiAgICAgIHR3ZWVuLnN0YXJ0KCk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkUG9pbnRzKHBvaW50czogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnBvaW50cyArPSBwb2ludHM7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnBvaW50cylcclxuICB9XHJcblxyXG4gIGdldFBvaW50cygpIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50cztcclxuICB9XHJcblxyXG4gIF9raWxsaW5nTW9kZTogYW55O1xyXG4gIGlzS2lsbGluZ01vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBraWxsaW5nTW9kZSgpIHtcclxuICAgIGlmICh0aGlzLmlzS2lsbGluZ01vZGUpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2tpbGxpbmdNb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNLaWxsaW5nTW9kZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygna2lsbGluZyBtb2RlJywgdGhpcy5pc0tpbGxpbmdNb2RlKVxyXG5cclxuICAgIHRoaXMuX2tpbGxpbmdNb2RlID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuaXNLaWxsaW5nTW9kZSA9IGZhbHNlO1xyXG4gICAgICBjb25zb2xlLmxvZygna2lsbGluZyBtb2RlJywgdGhpcy5pc0tpbGxpbmdNb2RlKVxyXG4gICAgfSwgMTUwMDApO1xyXG4gIH1cclxuXHJcblxyXG5cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IENvbnN0cyB9IGZyb20gJy4vY29uc3QnO1xyXG5pbXBvcnQgeyBNYXplIH0gZnJvbSAnLi9tYXplJztcclxuaW1wb3J0IHsgQ29sbGlzaW9ucyB9IGZyb20gJy4vY29sbGlzaW9ucyc7XHJcbmltcG9ydCB7IFdhbGwgfSBmcm9tICcuL3dhbGwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdhbGxNYW5hZ2VyIHtcclxuXHJcbiAgdGhpY2tuZXNzOiBudW1iZXIgPSAwLjE7XHJcblxyXG4gIHB1YmxpYyBiZzogUGhhc2VyLkdyb3VwO1xyXG4gIHB1YmxpYyB3YWxsczogUGhhc2VyLkdyb3VwO1xyXG4gIHBhbGV0dGUgPSB7XHJcbiAgICBjb2xvcjogMHhGRjAwMDAsXHJcbiAgICBvcGFjaXR5OiAwLjI3LFxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSkge1xyXG4gICAgdGhpcy5iZyA9IGdhbWUuYWRkLmdyb3VwKCk7XHJcbiAgICB0aGlzLndhbGxzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMud2FsbHMuZW5hYmxlQm9keSA9IHRydWU7XHJcbiAgICB0aGlzLndhbGxzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLlAySlM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGdldCBtYXplT2Zmc2V0KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gQ29uc3RzLnRpbGVTaXplICogODtcclxuICB9XHJcbiAgcHVibGljIGRyYXcobWF6ZTogTWF6ZSwgc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XHJcbiAgICB2YXIgb2Zmc2V0Rm9yQm9yZGVyID0gQ29uc3RzLnRpbGVTaXplICogdGhpcy50aGlja25lc3M7XHJcbiAgICB2YXIgZmxvb3IgPSB0aGlzLmdhbWUuYWRkLnRpbGVTcHJpdGUoV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplLCBzaXplLnkgKiBDb25zdHMudGlsZVNpemUsICdtYXplLWJnJyk7XHJcbiAgICB0aGlzLmJnLmFkZChmbG9vcik7XHJcblxyXG5cclxuICAgIHRoaXMuYWRkQm9yZGVycyhzaXplKTtcclxuXHJcbiAgICBtYXplLmNvbHMuZm9yRWFjaCgoY29sLCBjb2xJbmRleCkgPT4ge1xyXG4gICAgICB2YXIgb2Zmc2V0ID0gMDtcclxuICAgICAgY29sLmZvckVhY2god2FsbCA9PiB7XHJcbiAgICAgICAgaWYgKCF3YWxsLndhbGwpIHtcclxuICAgICAgICAgIHRoaXMuYWRkV2FsbChzaXplLFxyXG4gICAgICAgICAgICAoY29sSW5kZXggKyAxKSAqIENvbnN0cy50aWxlU2l6ZSxcclxuICAgICAgICAgICAgb2Zmc2V0ICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICB0aGlzLnRoaWNrbmVzcyAqIENvbnN0cy50aWxlU2l6ZSxcclxuICAgICAgICAgICAgd2FsbC5jb3VudCAqIENvbnN0cy50aWxlU2l6ZSArIG9mZnNldEZvckJvcmRlcixcclxuICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgb2Zmc2V0ICs9IHdhbGwuY291bnRcclxuICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgbWF6ZS5yb3dzLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcclxuICAgICAgdmFyIG9mZnNldCA9IDA7XHJcbiAgICAgIHJvdy5mb3JFYWNoKHdhbGwgPT4ge1xyXG4gICAgICAgIGlmICghd2FsbC53YWxsKSB7XHJcbiAgICAgICAgICB0aGlzLmFkZFdhbGwoc2l6ZSxcclxuICAgICAgICAgICAgb2Zmc2V0ICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICAocm93SW5kZXggKyAxKSAqIENvbnN0cy50aWxlU2l6ZSxcclxuICAgICAgICAgICAgd2FsbC5jb3VudCAqIENvbnN0cy50aWxlU2l6ZSArIG9mZnNldEZvckJvcmRlcixcclxuICAgICAgICAgICAgdGhpcy50aGlja25lc3MgKiBDb25zdHMudGlsZVNpemUsXHJcbiAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9mZnNldCArPSB3YWxsLmNvdW50XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRCb3JkZXJzKHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG4gICAgdmFyIGNvbG9yID0gMHgwMDAwMDA7XHJcbiAgICB2YXIgb3BhY2l0eSA9IDE7XHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgMCwgMCwgc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgMCwgc2l6ZS55ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcblxyXG4gICAgdGhpcy5hZGRXYWxsKHNpemUsIDAsIDAsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCBzaXplLnkgKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgdHJ1ZSwgY29sb3IsIG9wYWNpdHkpO1xyXG4gICAgdGhpcy5hZGRXYWxsKHNpemUsIHNpemUueCAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIDAsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCBzaXplLnkgKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgdHJ1ZSwgY29sb3IsIG9wYWNpdHkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRXYWxsKHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBpc0JvcmRlcjogYm9vbGVhbiwgY29sb3I/OiBudW1iZXIsIG9wYWNpdHk/OiBudW1iZXIpIHtcclxuICAgIGlmICghaXNCb3JkZXIpIHtcclxuICAgICAgeCArPSBXYWxsTWFuYWdlci5tYXplT2Zmc2V0O1xyXG4gICAgICB5ICs9IFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICB9XHJcbiAgICB2YXIgbWF4V2lkdGggPSBzaXplLnggKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0O1xyXG4gICAgdmFyIG1heEhlaWdodCA9IHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICB2YXIgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKENvbnN0cy5tYXJnaW5zLCBDb25zdHMubWFyZ2lucyk7XHJcbiAgICBncmFwaGljcy5saW5lU3R5bGUoMiwgY29sb3IgfHwgY29sb3IgPT09IDAgPyBjb2xvciA6IHRoaXMucGFsZXR0ZS5jb2xvciwgMSk7XHJcbiAgICBncmFwaGljcy5iZWdpbkZpbGwoY29sb3IgfHwgY29sb3IgPT09IDAgPyBjb2xvciA6IHRoaXMucGFsZXR0ZS5jb2xvcik7XHJcbiAgICBncmFwaGljcy5kcmF3UmVjdChcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgeCArIHdpZHRoID4gbWF4V2lkdGggJiYgIWlzQm9yZGVyID8gbWF4V2lkdGggLSAoeCkgOiB3aWR0aCxcclxuICAgICAgeSArIGhlaWdodCA+IG1heEhlaWdodCAmJiAhaXNCb3JkZXIgPyBtYXhIZWlnaHQgLSAoeSkgOiBoZWlnaHQsXHJcbiAgICApO1xyXG4gICAgZ3JhcGhpY3MuYWxwaGEgPSAob3BhY2l0eSB8fCBvcGFjaXR5ID09PSAwID8gb3BhY2l0eSA6IHRoaXMucGFsZXR0ZS5vcGFjaXR5KTtcclxuICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcclxuICAgIGdyYXBoaWNzLmJvdW5kc1BhZGRpbmcgPSAwO1xyXG4gICAgdmFyIHNoYXBlU3ByaXRlOiBQaGFzZXIuU3ByaXRlID0gdGhpcy53YWxscy5jcmVhdGUoeCx5KTsvLyB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4LCB5KTtcclxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLmVuYWJsZShzaGFwZVNwcml0ZSwgdHJ1ZSk7XHJcbiAgICBzaGFwZVNwcml0ZS5hZGRDaGlsZChncmFwaGljcyk7XHJcblxyXG4gICAgc2hhcGVTcHJpdGUuYm9keS5jbGVhclNoYXBlcygpO1xyXG4gICAgc2hhcGVTcHJpdGUuYm9keS5hZGRSZWN0YW5nbGUod2lkdGgsIGhlaWdodCwgd2lkdGggLyAyLjAsIGhlaWdodCAvIDIuMCk7XHJcbiAgICAvLyBzaGFwZVNwcml0ZS5ib2R5Lm1hc3MgPSAxMDAwO1xyXG4gICAgc2hhcGVTcHJpdGUuYm9keS5raW5lbWF0aWMgPSB0cnVlO1xyXG4gICAgLy8gdGhpcy53YWxscy5hZGQoc2hhcGVTcHJpdGUpO1xyXG5cclxuICAgIENvbGxpc2lvbnMuZ2V0SW5zdGFuY2UoKS5hZGQoJ3dhbGwnLCBuZXcgV2FsbChzaGFwZVNwcml0ZSkpO1xyXG5cclxuICB9XHJcblxyXG4gIHByaXZhdGUgb2Zmc2V0KHZhbHVlOiBudW1iZXIpIHtcclxuICAgIHJldHVybiB2YWx1ZSAqIHRoaXMud2FsbFRoaWNrbmVzcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB3YWxsVGhpY2tuZXNzKCkge1xyXG4gICAgcmV0dXJuIENvbnN0cy50aWxlU2l6ZSAqIHRoaXMudGhpY2tuZXNzO1xyXG4gIH1cclxuXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBXaXRoU3JpdGVJbnRlcmZhY2UgfSBmcm9tICcuL3dpdGgtc3JpdGUtaW50ZXJmYWNlJztcclxuZXhwb3J0IGNsYXNzIFdhbGwgaW1wbGVtZW50cyBXaXRoU3JpdGVJbnRlcmZhY2Uge1xyXG4gIHB1YmxpYyBzcHJpdGU6IFBoYXNlci5TcHJpdGU7XHJcbiAgcHVibGljIGNvbGxpZGUoYTogYW55LCBiOiBhbnkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNwcml0ZTogUGhhc2VyLlNwcml0ZSwgcHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSkge1xyXG4gICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgfVxyXG59Il19
