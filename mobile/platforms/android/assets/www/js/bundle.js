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
    Collisions.prototype.add = function (group, sprite) {
        // console.log('added', group)
        switch (group) {
            case 'gem':
                // console.log(1);
                sprite.body.setCollisionGroup(this.gemsCollisionGroup);
                sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup], this.collisionSolver.bind(this));
                break;
            case 'gold':
                // console.log(2);
                sprite.body.setCollisionGroup(this.goldCollisionGroup);
                sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup], this.collisionSolver.bind(this));
                break;
            case 'mob':
                // console.log(3);
                sprite.body.setCollisionGroup(this.mobsCollisionGroup);
                sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup], this.collisionSolver.bind(this));
                break;
            case 'wall':
                // console.log(4);
                sprite.body.setCollisionGroup(this.wallCollisionGroup);
                break;
        }
        sprite.body.collides(this.playerCollisionGroup, function (a, b) {
        }, this);
    };
    Collisions.prototype.collisionSolver = function (a, b) {
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
        var isGem = Math.random() >= 0.2;
        var x = (Math.round(Math.random() * (this.size.x - 1)));
        var y = (Math.round(Math.random() * (this.size.y - 1)));
        var sprite = this.game.add.sprite(x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, isGem ? 'gem' : 'gold');
        sprite.anchor.set(0.5);
        sprite.scale.setTo(const_1.Consts.tileSize / 16 * 0.3, const_1.Consts.tileSize / 16 * 0.3);
        this.game.physics.p2.enable(sprite, false);
        sprite.body.setCircle(const_1.Consts.tileSize * 0.15);
        // sprite.body.kinematic = true;
        collisions_1.Collisions.getInstance().add(isGem ? 'gem' : 'gold', sprite);
    };
    return GemManager;
}());
exports.GemManager = GemManager;
},{"./collisions":1,"./const":2,"./wall-manager":8}],4:[function(require,module,exports){
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
                setInterval(function () {
                    _this.time -= 1;
                    if (_this.time == 0) {
                        _this.textTimer.text = 'START!!';
                    }
                    else {
                        _this.textTimer.text = 'Game will start in ' + _this.time + ' seconds';
                    }
                }, 1000);
                setTimeout(function () {
                    _this.game.state.start('gameState');
                }, 4000);
                _this.textTimer = _this.game.add.text(_this.maxW / 2.0, _this.maxH / 2.0, 'Game will start in ' + _this.time + ' seconds', '');
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
                _this.game.input.onDown.add(function () {
                    _this.game.state.start('startState');
                }, _this);
            }
        }, false);
    }
    MazeGame.prototype.preload = function () {
        this.game.load.image('ufo', 'assets/ufo.png');
        this.game.load.image('gem', 'assets/gem.png');
        this.game.load.image('gold', 'assets/gold.png');
        this.game.load.image('maze-bg', 'assets/maze-bg.png');
        this.game.load.image('mob', 'assets/mob.png');
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
        new mob_manager_1.MobManager(this.game, this.pacman, this.size).start();
    };
    MazeGame.prototype.update = function () {
        this.pacman.update();
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
},{"./collisions":1,"./const":2,"./gem-manager":3,"./maze-generator":5,"./mob-manager":6,"./pacman":7,"./wall-manager":8}],5:[function(require,module,exports){
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
        var result = this.optimizeWalls(cells);
        return result;
    };
    MazeGenerator.prototype.optimizeWalls = function (cells) {
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
        return { cols: verticalWalls, rows: horizontalWalls };
    };
    return MazeGenerator;
}());
exports.MazeGenerator = MazeGenerator;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var wall_manager_1 = require("./wall-manager");
var const_1 = require("./const");
var collisions_1 = require("./collisions");
var MobManager = (function () {
    function MobManager(game, pacman, size) {
        this.game = game;
        this.pacman = pacman;
        this.size = size;
    }
    MobManager.prototype.start = function () {
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
        sprite.scale.setTo(const_1.Consts.tileSize / 512 * 0.3, const_1.Consts.tileSize / 512 * 0.3);
        var tween = this.game.add.tween(sprite);
        tween.to({ alpha: 0 }, 3000, Phaser.Easing.Linear.None);
        tween.onComplete.add(function (e) {
            e.destroy();
            var sprite = _this.game.add.sprite(x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, 'mob');
            sprite.anchor.set(0.5);
            sprite.scale.setTo(const_1.Consts.tileSize / 98 * 0.3, const_1.Consts.tileSize / 98 * 0.3);
            _this.game.physics.p2.enable(sprite, false);
            sprite.body.setCircle(const_1.Consts.tileSize * 0.2);
            // sprite.body.kinematic = true;
            collisions_1.Collisions.getInstance().add('mob', sprite);
        }, this);
        tween.start();
    };
    return MobManager;
}());
exports.MobManager = MobManager;
},{"./collisions":1,"./const":2,"./wall-manager":8}],7:[function(require,module,exports){
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
        this.scaleToTile = 0.5;
        this.isKillingMode = false;
        this.particlesGroup = this.game.add.group();
        this.sprite = game.add.sprite(this.position.x * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, this.position.y * const_1.Consts.tileSize + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, 'ufo');
        this.sprite.anchor.set(0.5);
        this.sprite.scale.setTo(const_1.Consts.tileSize / 512 * this.scaleToTile, const_1.Consts.tileSize / 512 * this.scaleToTile);
        game.physics.p2.enable(this.sprite, false);
        // this.sprite.body.enableBody = true;
        this.sprite.body.setCircle(const_1.Consts.tileSize * 0.5 * this.scaleToTile);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // this.game.time.events.loop(300, this.particles.bind(this), this);
        if (!this.game.device.desktop) {
            this.game.input.addMoveCallback(function (e) {
                console.log(_this.sprite, e)
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
        // this.sprite.body.collides(, hitPanda, this);
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
},{"./const":2,"./wall-manager":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
var const_1 = require("./const");
var collisions_1 = require("./collisions");
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
        collisions_1.Collisions.getInstance().add('wall', shapeSprite);
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
},{"./collisions":1,"./const":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2NvbGxpc2lvbnMudHMiLCJzcmMvYXBwL2NvbnN0LnRzIiwic3JjL2FwcC9nZW0tbWFuYWdlci50cyIsInNyYy9hcHAvbWF6ZS1nYW1lLnRzIiwic3JjL2FwcC9tYXplLWdlbmVyYXRvci50cyIsInNyYy9hcHAvbW9iLW1hbmFnZXIudHMiLCJzcmMvYXBwL3BhY21hbi50cyIsInNyYy9hcHAvd2FsbC1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNHQTtJQWlERTtJQUVBLENBQUM7SUF4Q0QsNkRBQTZEO0lBQzdELDRCQUFPLEdBQVAsVUFBUSxJQUFpQixFQUFFLE1BQWM7UUFBekMsaUJBbUNDO1FBbENDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN4RSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN0RSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFFdEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENB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Q0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELDBCQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELDZCQUFRLEdBQVI7UUFDRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQztRQUN0TSxNQUFNLENBQUMsTUFBTSxDQUFD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WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IFBhY21hbiB9IGZyb20gJy4vcGFjbWFuJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsaXNpb25zIHtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBDb2xsaXNpb25zO1xyXG4gIHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWU7XHJcbiAgcHJpdmF0ZSBwbGF5ZXI6IFBhY21hbjtcclxuXHJcbiAgcHJpdmF0ZSBwbGF5ZXJDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXA7XHJcbiAgcHJpdmF0ZSBnZW1zQ29sbGlzaW9uR3JvdXA6IFBoYXNlci5QaHlzaWNzLlAyLkNvbGxpc2lvbkdyb3VwO1xyXG4gIHByaXZhdGUgZ29sZENvbGxpc2lvbkdyb3VwOiBQaGFzZXIuUGh5c2ljcy5QMi5Db2xsaXNpb25Hcm91cDtcclxuICBwcml2YXRlIG1vYnNDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXA7XHJcbiAgcHJpdmF0ZSB3YWxsQ29sbGlzaW9uR3JvdXA6IFBoYXNlci5QaHlzaWNzLlAyLkNvbGxpc2lvbkdyb3VwO1xyXG4gIC8vICwgZ2VtczpQaGFzZXIuR3JvdXAsIGdvbGRzOlBoYXNlci5Hcm91cCwgbW9iczpQaGFzZXIuR3JvdXBcclxuICBwcmVwYXJlKGdhbWU6IFBoYXNlci5HYW1lLCBwbGF5ZXI6IFBhY21hbikge1xyXG4gICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgdGhpcy5wbGF5ZXJDb2xsaXNpb25Hcm91cCA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XHJcbiAgICB0aGlzLmdlbXNDb2xsaXNpb25Hcm91cCA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XHJcbiAgICB0aGlzLmdvbGRDb2xsaXNpb25Hcm91cCA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XHJcbiAgICB0aGlzLm1vYnNDb2xsaXNpb25Hcm91cCA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XHJcbiAgICB0aGlzLndhbGxDb2xsaXNpb25Hcm91cCA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XHJcblxyXG4gICAgcGxheWVyLnNwcml0ZS5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMucGxheWVyQ29sbGlzaW9uR3JvdXApO1xyXG4gICAgLy8gcGxheWVyLnNwcml0ZS5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy5nZW1zQ29sbGlzaW9uR3JvdXAsIChhOiBhbnksIGI6IGFueSkgPT4ge1xyXG4gICAgICBiLnNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgIHRoaXMucGxheWVyLmFkZFBvaW50cygxMDApO1xyXG4gICAgfSwgdGhpcyk7XHJcblxyXG4gICAgcGxheWVyLnNwcml0ZS5ib2R5LmNvbGxpZGVzKHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwLCAoYTogYW55LCBiOiBhbnkpID0+IHtcclxuICAgICAgYi5zcHJpdGUuZGVzdHJveSgpO1xyXG4gICAgICB0aGlzLnBsYXllci5raWxsaW5nTW9kZSgpO1xyXG4gICAgfSwgdGhpcyk7XHJcblxyXG4gICAgcGxheWVyLnNwcml0ZS5ib2R5LmNvbGxpZGVzKHRoaXMubW9ic0NvbGxpc2lvbkdyb3VwLCAoYTogYW55LCBiOiBhbnkpID0+IHtcclxuICAgICAgaWYgKHBsYXllci5pc0tpbGxpbmdNb2RlKSB7XHJcbiAgICAgICAgYi5zcHJpdGUuZGVzdHJveSgpO1xyXG4gICAgICAgIHBsYXllci5hZGRQb2ludHMoMTUwKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2dhbWVPdmVyU3RhdGUnKTtcclxuICAgICAgfVxyXG4gICAgfSwgdGhpcyk7XHJcblxyXG4gICAgcGxheWVyLnNwcml0ZS5ib2R5LmNvbGxpZGVzKHRoaXMud2FsbENvbGxpc2lvbkdyb3VwLCBmdW5jdGlvbiAoYTogYW55LCBiOiBhbnkpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3dhbGwnLCBhLCBiKVxyXG4gICAgfSwgdGhpcyk7XHJcblxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IENvbGxpc2lvbnMge1xyXG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyB0aGlzKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkKGdyb3VwOiBzdHJpbmcsIHNwcml0ZTogUGhhc2VyLlNwcml0ZSk6IHZvaWQge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2FkZGVkJywgZ3JvdXApXHJcbiAgICBzd2l0Y2ggKGdyb3VwKSB7XHJcbiAgICAgIGNhc2UgJ2dlbSc6XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coMSk7XHJcbiAgICAgICAgc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5nZW1zQ29sbGlzaW9uR3JvdXApO1xyXG4gICAgICAgIHNwcml0ZS5ib2R5LmNvbGxpZGVzKFt0aGlzLm1vYnNDb2xsaXNpb25Hcm91cCwgdGhpcy5nb2xkQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ2Vtc0NvbGxpc2lvbkdyb3VwXSxcclxuICAgICAgICAgIHRoaXMuY29sbGlzaW9uU29sdmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ2dvbGQnOlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDIpO1xyXG4gICAgICAgIHNwcml0ZS5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwKTtcclxuICAgICAgICBzcHJpdGUuYm9keS5jb2xsaWRlcyhbdGhpcy5tb2JzQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwLCB0aGlzLmdlbXNDb2xsaXNpb25Hcm91cF0sXHJcbiAgICAgICAgICB0aGlzLmNvbGxpc2lvblNvbHZlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdtb2InOlxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDMpO1xyXG4gICAgICAgIHNwcml0ZS5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMubW9ic0NvbGxpc2lvbkdyb3VwKTtcclxuICAgICAgICBzcHJpdGUuYm9keS5jb2xsaWRlcyhbdGhpcy5tb2JzQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwLCB0aGlzLmdlbXNDb2xsaXNpb25Hcm91cF0sXHJcbiAgICAgICAgICB0aGlzLmNvbGxpc2lvblNvbHZlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICd3YWxsJzpcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyg0KTtcclxuICAgICAgICBzcHJpdGUuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLndhbGxDb2xsaXNpb25Hcm91cCk7XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuXHJcbiAgICBzcHJpdGUuYm9keS5jb2xsaWRlcyh0aGlzLnBsYXllckNvbGxpc2lvbkdyb3VwLCBmdW5jdGlvbiAoYTogYW55LCBiOiBhbnkpIHtcclxuXHJcbiAgICB9LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb2xsaXNpb25Tb2x2ZXIoYTogYW55LCBiOiBhbnkpIHtcclxuICAgIHZhciBnZXRWYWx1ZSA9IGZ1bmN0aW9uKGtleTpzdHJpbmcpIHtcclxuICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgY2FzZSAndWZvJzogcmV0dXJuIDEwMDA7XHJcbiAgICAgICAgICBjYXNlICdtb2InOiByZXR1cm4gMjtcclxuICAgICAgICAgIGNhc2UgJ2dvbGQnOiByZXR1cm4gMDtcclxuICAgICAgICAgIGNhc2UgJ2dlbSc6IHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoIWEuc3ByaXRlIHx8ICFiLnNwcml0ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoYS5zcHJpdGUua2V5ID09IGIuc3ByaXRlLmtleSkge1xyXG4gICAgICAgIGEuc3ByaXRlLmRlc3Ryb3koKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgYXYgPSBnZXRWYWx1ZShhLnNwcml0ZS5rZXkpO1xyXG4gICAgICAgIHZhciBidiA9IGdldFZhbHVlKGIuc3ByaXRlLmtleSk7XHJcbiAgICAgICAgaWYgKGF2ID4gYnYpIHtcclxuICAgICAgICAgIGIuc3ByaXRlLmRlc3Ryb3koKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYS5zcHJpdGUuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIH1cclxuXHJcbn0iLCJleHBvcnQgY2xhc3MgQ29uc3RzIHtcclxuICBwdWJsaWMgc3RhdGljIG1hcmdpbnM6IG51bWJlciA9IDA7XHJcbiAgcHVibGljIHN0YXRpYyB0aWxlU2l6ZTogbnVtYmVyID0gMDtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IFdhbGxNYW5hZ2VyIH0gZnJvbSAnLi93YWxsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBDb25zdHMgfSBmcm9tICcuL2NvbnN0JztcclxuaW1wb3J0IHsgQ29sbGlzaW9ucyB9IGZyb20gJy4vY29sbGlzaW9ucyc7XHJcblxyXG5leHBvcnQgY2xhc3MgR2VtTWFuYWdlciB7XHJcblxyXG4gIHB1YmxpYyBnZW1zOiBQaGFzZXIuR3JvdXA7XHJcbiAgcHVibGljIGdvbGRzOiBQaGFzZXIuR3JvdXA7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSwgcHJpdmF0ZSBzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICAgIHRoaXMuZ2VtcyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMuZ29sZHMgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XHJcbiAgfVxyXG5cclxuICBzdGFydCgpIHtcclxuICAgIHRoaXMuc3Bhd25HZW0oKTsgdGhpcy5zcGF3bkdlbSgpOyB0aGlzLnNwYXduR2VtKCk7XHJcbiAgICB0aGlzLmdhbWUudGltZS5ldmVudHMubG9vcCgzMDAwLCB0aGlzLnNwYXduR2VtLmJpbmQodGhpcyksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc3Bhd25HZW0oKSB7XHJcbiAgICB2YXIgaXNHZW0gPSBNYXRoLnJhbmRvbSgpID49IDAuMjtcclxuICAgIHZhciB4ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueCAtIDEpKSk7XHJcbiAgICB2YXIgeSA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAodGhpcy5zaXplLnkgLSAxKSkpO1xyXG5cclxuICAgIHZhciBzcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgeSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIGlzR2VtID8gJ2dlbScgOiAnZ29sZCcpO1xyXG4gICAgc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHNwcml0ZS5zY2FsZS5zZXRUbyhDb25zdHMudGlsZVNpemUgLyAxNiAqIDAuMywgQ29uc3RzLnRpbGVTaXplIC8gMTYgKiAwLjMpO1xyXG5cclxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLmVuYWJsZShzcHJpdGUsIGZhbHNlKTtcclxuXHJcbiAgICBzcHJpdGUuYm9keS5zZXRDaXJjbGUoQ29uc3RzLnRpbGVTaXplICogMC4xNSk7XHJcbiAgICAvLyBzcHJpdGUuYm9keS5raW5lbWF0aWMgPSB0cnVlO1xyXG4gICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLmFkZChpc0dlbSA/ICdnZW0nIDogJ2dvbGQnLCBzcHJpdGUpO1xyXG5cclxuICB9XHJcblxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9waGFzZXIvdHlwZXNjcmlwdC9waGFzZXIuZC50c1wiLz5cclxuaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IE1hemUgfSBmcm9tICcuL21hemUnO1xyXG5pbXBvcnQgeyBNYXplR2VuZXJhdG9yIH0gZnJvbSAnLi9tYXplLWdlbmVyYXRvcic7XHJcbmltcG9ydCB7IFdhbGxNYW5hZ2VyIH0gZnJvbSAnLi93YWxsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBQYWNtYW4gfSBmcm9tICcuL3BhY21hbic7XHJcbmltcG9ydCB7IEdlbU1hbmFnZXIgfSBmcm9tICcuL2dlbS1tYW5hZ2VyJztcclxuaW1wb3J0IHsgQ29sbGlzaW9ucyB9IGZyb20gJy4vY29sbGlzaW9ucyc7XHJcbmltcG9ydCB7IE1vYk1hbmFnZXIgfSBmcm9tICcuL21vYi1tYW5hZ2VyJztcclxuXHJcbmNsYXNzIE1hemVHYW1lIHtcclxuXHJcbiAgICBnYW1lOiBQaGFzZXIuR2FtZTtcclxuXHJcbiAgICBtYXplOiBNYXplO1xyXG5cclxuICAgIHdhbGxNYW5hZ2VyOiBXYWxsTWFuYWdlcjtcclxuXHJcbiAgICBzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0gPSB7IHg6IDE1LCB5OiAxNSB9O1xyXG5cclxuICAgIHBhY21hbjogUGFjbWFuO1xyXG4gICAgdzogbnVtYmVyO1xyXG4gICAgaDogbnVtYmVyXHJcbiAgICBtYXhXOiBudW1iZXI7XHJcbiAgICBtYXhIOiBudW1iZXI7XHJcbiAgICBtaW5XOiBudW1iZXI7XHJcbiAgICBtaW5IOiBudW1iZXI7XHJcbiAgICB0aW1lOiBudW1iZXI7XHJcbiAgICB0ZXh0VGltZXI6IFBoYXNlci5UZXh0O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhXID0gd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgdGhpcy5tYXhIID0gd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5taW5IID0gOTYwIC8gdGhpcy5tYXhXICogdGhpcy5tYXhIO1xyXG4gICAgICAgIHRoaXMubWluVyA9IDk2MDtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lID0gbmV3IFBoYXNlci5HYW1lKHRoaXMubWluVywgdGhpcy5taW5ILCBQaGFzZXIuQ0FOVkFTLCAnY29udGVudCcpO1xyXG5cclxuICAgICAgICB0aGlzLm1hemUgPSBNYXplR2VuZXJhdG9yLmdldEluc3RhbmNlKCkuZ2VuZXJhdGUodGhpcy5zaXplKTtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLmFkZCgnc3RhcnRTdGF0ZScsIHtcclxuXHJcbiAgICAgICAgICAgIHByZWxvYWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUuZGV2aWNlLmRlc2t0b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2V0R2FtZVNpemUodGhpcy5tYXhXLCB0aGlzLm1heEgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy53ID0gdGhpcy5nYW1lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oID0gdGhpcy5nYW1lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIENvbnN0cy50aWxlU2l6ZSA9IHRoaXMudyAvIDEyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWUgPSAzO1xyXG4gICAgICAgICAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZSAtPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci50ZXh0ID0gJ1NUQVJUISEnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLnRleHQgPSAnR2FtZSB3aWxsIHN0YXJ0IGluICcgKyB0aGlzLnRpbWUgKyAnIHNlY29uZHMnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lU3RhdGUnKTtcclxuICAgICAgICAgICAgICAgIH0sIDQwMDApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyID0gdGhpcy5nYW1lLmFkZC50ZXh0KHRoaXMubWF4VyAvIDIuMCwgdGhpcy5tYXhIIC8gMi4wLCAnR2FtZSB3aWxsIHN0YXJ0IGluICcgKyB0aGlzLnRpbWUgKyAnIHNlY29uZHMnLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9cdENlbnRlciBhbGlnblxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuYWxpZ24gPSAnY2VudGVyJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0Rm9udCBzdHlsZVxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuZm9udCA9ICdBcmlhbCBCbGFjayc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci5mb250U2l6ZSA9IDUwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuZm9udFdlaWdodCA9ICdib2xkJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0U3Ryb2tlIGNvbG9yIGFuZCB0aGlja25lc3NcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLnN0cm9rZSA9ICcjMDAwMDAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLnN0cm9rZVRoaWNrbmVzcyA9IDY7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci5maWxsID0gJyM0M2Q2MzcnO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLmFkZCgnZ2FtZVN0YXRlJywgdGhpcywgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWVPdmVyU3RhdGUnLCB7XHJcbiAgICAgICAgICAgIGNyZWF0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQodGhpcy53IC8gMi4wLCB0aGlzLmggLyAyLjAsICdQb2ludHM6ICcgKyB0aGlzLnBhY21hbi5nZXRQb2ludHMoKSwgJycpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRDZW50ZXIgYWxpZ25cclxuICAgICAgICAgICAgICAgIHRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5hbGlnbiA9ICdjZW50ZXInO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRGb250IHN0eWxlXHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZvbnQgPSAnQXJpYWwgQmxhY2snO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250U2l6ZSA9IDUwO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250V2VpZ2h0ID0gJ2JvbGQnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRTdHJva2UgY29sb3IgYW5kIHRoaWNrbmVzc1xyXG4gICAgICAgICAgICAgICAgdGV4dC5zdHJva2UgPSAnIzAwMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LnN0cm9rZVRoaWNrbmVzcyA9IDY7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZpbGwgPSAnIzQzZDYzNyc7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KHRoaXMudyAvIDIuMCwgdGhpcy5oIC8gMi4wICsgNjAsICdDbGljayBhbnl0aGluZyB0byByZXN0YXJ0JywgJycpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRDZW50ZXIgYWxpZ25cclxuICAgICAgICAgICAgICAgIHRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5hbGlnbiA9ICdjZW50ZXInO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRGb250IHN0eWxlXHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZvbnQgPSAnQXJpYWwgQmxhY2snO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250U2l6ZSA9IDUwO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250V2VpZ2h0ID0gJ2JvbGQnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRTdHJva2UgY29sb3IgYW5kIHRoaWNrbmVzc1xyXG4gICAgICAgICAgICAgICAgdGV4dC5zdHJva2UgPSAnIzAwMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LnN0cm9rZVRoaWNrbmVzcyA9IDY7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZpbGwgPSAnIzQzZDYzNyc7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm9uRG93bi5hZGQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnc3RhcnRTdGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCd1Zm8nLCAnYXNzZXRzL3Vmby5wbmcnKTtcclxuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSgnZ2VtJywgJ2Fzc2V0cy9nZW0ucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2dvbGQnLCAnYXNzZXRzL2dvbGQucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ21hemUtYmcnLCAnYXNzZXRzL21hemUtYmcucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ21vYicsICdhc3NldHMvbW9iLnBuZycpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdoYXphcmQnLCAnYXNzZXRzL2hhemFyZC5wbmcnKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KCdidXR0b252ZXJ0aWNhbCcsICdhc3NldHMvYnV0dG9uLXZlcnRpY2FsLnBuZycsIDMyLCA2NCk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2J1dHRvbmhvcml6b250YWwnLCAnYXNzZXRzL2J1dHRvbi1ob3Jpem9udGFsLnBuZycsIDY0LCAzMik7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2J1dHRvbmRpYWdvbmFsJywgJ2Fzc2V0cy9idXR0b24tZGlhZ29uYWwucG5nJywgNDgsIDQ4KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlKCkge1xyXG4gICAgICAgIHRoaXMud2FsbE1hbmFnZXIgPSBuZXcgV2FsbE1hbmFnZXIodGhpcy5nYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5QMkpTKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLnNpemUueCAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyLCB0aGlzLnNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5yZXN0aXR1dGlvbiA9IDAuODtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5zZXRCb3VuZHNUb1dvcmxkKHRydWUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi51cGRhdGVCb3VuZHNDb2xsaXNpb25Hcm91cCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBhY21hbiA9IG5ldyBQYWNtYW4odGhpcy5nYW1lLCB0aGlzLndhbGxNYW5hZ2VyKTtcclxuXHJcbiAgICAgICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLnByZXBhcmUodGhpcy5nYW1lLCB0aGlzLnBhY21hbik7XHJcblxyXG4gICAgICAgIHRoaXMud2FsbE1hbmFnZXIuZHJhdyh0aGlzLm1hemUsIHRoaXMuc2l6ZSk7XHJcblxyXG4gICAgICAgIG5ldyBHZW1NYW5hZ2VyKHRoaXMuZ2FtZSwgdGhpcy5zaXplKS5zdGFydCgpXHJcbiAgICAgICAgbmV3IE1vYk1hbmFnZXIodGhpcy5nYW1lLCB0aGlzLnBhY21hbiwgdGhpcy5zaXplKS5zdGFydCgpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMucGFjbWFuLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydFN0YXRlKCkge1xyXG4gICAgICAgIGFsZXJ0KCdzdGFydCcpXHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZVN0YXRlKCkge1xyXG4gICAgICAgIGFsZXJ0KCdnYW1lJylcclxuICAgIH1cclxuICAgIGdhbWVPdmVyU3RhdGUoKSB7XHJcbiAgICAgICAgYWxlcnQoJ1BvaW50czonICsgdGhpcy5wYWNtYW4uZ2V0UG9pbnRzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVPYmplY3QgPSB7IGxlZnQ6IGZhbHNlLCByaWdodDogZmFsc2UsIHVwOiBmYWxzZSwgZG93bjogZmFsc2UgfVxyXG5cclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGxldCBnYW1lID0gbmV3IE1hemVHYW1lKCk7XHJcbn0iLCJpbXBvcnQgeyBNYXplIH0gZnJvbSAnLi9tYXplJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXplR2VuZXJhdG9yIHtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBNYXplR2VuZXJhdG9yO1xyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XHJcbiAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IE1hemVHZW5lcmF0b3IoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdlbmVyYXRlKHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG4gICAgdmFyIHggPSBzaXplLng7XHJcbiAgICB2YXIgeSA9IHNpemUueTtcclxuXHJcbiAgICB2YXIgdG90YWxDZWxscyA9IHggKiB5O1xyXG4gICAgdmFyIGNlbGxzID0gbmV3IEFycmF5KCk7XHJcbiAgICB2YXIgdW52aXMgPSBuZXcgQXJyYXkoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeTsgaSsrKSB7XHJcbiAgICAgIGNlbGxzW2ldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgIHVudmlzW2ldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgeDsgaisrKSB7XHJcbiAgICAgICAgY2VsbHNbaV1bal0gPSBbMCwgMCwgMCwgMF07XHJcbiAgICAgICAgdW52aXNbaV1bal0gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0IGEgcmFuZG9tIHBvc2l0aW9uIHRvIHN0YXJ0IGZyb21cclxuICAgIHZhciBjdXJyZW50Q2VsbCA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB5KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogeCldO1xyXG4gICAgdmFyIHBhdGggPSBbY3VycmVudENlbGxdO1xyXG4gICAgdW52aXNbY3VycmVudENlbGxbMF1dW2N1cnJlbnRDZWxsWzFdXSA9IGZhbHNlO1xyXG4gICAgdmFyIHZpc2l0ZWQgPSAxO1xyXG5cclxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgYXZhaWxhYmxlIGNlbGwgcG9zaXRpb25zXHJcbiAgICB3aGlsZSAodmlzaXRlZCA8IHRvdGFsQ2VsbHMpIHtcclxuICAgICAgLy8gRGV0ZXJtaW5lIG5laWdoYm9yaW5nIGNlbGxzXHJcbiAgICAgIHZhciBwb3QgPSBbW2N1cnJlbnRDZWxsWzBdIC0gMSwgY3VycmVudENlbGxbMV0sIDAsIDJdLFxyXG4gICAgICBbY3VycmVudENlbGxbMF0sIGN1cnJlbnRDZWxsWzFdICsgMSwgMSwgM10sXHJcbiAgICAgIFtjdXJyZW50Q2VsbFswXSArIDEsIGN1cnJlbnRDZWxsWzFdLCAyLCAwXSxcclxuICAgICAgW2N1cnJlbnRDZWxsWzBdLCBjdXJyZW50Q2VsbFsxXSAtIDEsIDMsIDFdXTtcclxuICAgICAgdmFyIG5laWdoYm9ycyA9IG5ldyBBcnJheSgpO1xyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIGlmIGVhY2ggbmVpZ2hib3JpbmcgY2VsbCBpcyBpbiBnYW1lIGdyaWQsIGFuZCB3aGV0aGVyIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2hlY2tlZFxyXG4gICAgICBmb3IgKHZhciBsID0gMDsgbCA8IDQ7IGwrKykge1xyXG4gICAgICAgIGlmIChwb3RbbF1bMF0gPiAtMSAmJiBwb3RbbF1bMF0gPCB5ICYmIHBvdFtsXVsxXSA+IC0xICYmIHBvdFtsXVsxXSA8IHggJiYgdW52aXNbcG90W2xdWzBdXVtwb3RbbF1bMV1dKSB7IG5laWdoYm9ycy5wdXNoKHBvdFtsXSk7IH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgYXQgbGVhc3Qgb25lIGFjdGl2ZSBuZWlnaGJvcmluZyBjZWxsIGhhcyBiZWVuIGZvdW5kXHJcbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gQ2hvb3NlIG9uZSBvZiB0aGUgbmVpZ2hib3JzIGF0IHJhbmRvbVxyXG4gICAgICAgIHZhciBuZXh0ID0gbmVpZ2hib3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGgpXTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSB3YWxsIGJldHdlZW4gdGhlIGN1cnJlbnQgY2VsbCBhbmQgdGhlIGNob3NlbiBuZWlnaGJvcmluZyBjZWxsXHJcbiAgICAgICAgY2VsbHNbY3VycmVudENlbGxbMF1dW2N1cnJlbnRDZWxsWzFdXVtuZXh0WzJdXSA9IDE7XHJcbiAgICAgICAgY2VsbHNbbmV4dFswXV1bbmV4dFsxXV1bbmV4dFszXV0gPSAxO1xyXG5cclxuICAgICAgICAvLyBNYXJrIHRoZSBuZWlnaGJvciBhcyB2aXNpdGVkLCBhbmQgc2V0IGl0IGFzIHRoZSBjdXJyZW50IGNlbGxcclxuICAgICAgICB1bnZpc1tuZXh0WzBdXVtuZXh0WzFdXSA9IGZhbHNlO1xyXG4gICAgICAgIHZpc2l0ZWQrKztcclxuICAgICAgICBjdXJyZW50Q2VsbCA9IFtuZXh0WzBdLCBuZXh0WzFdXTtcclxuICAgICAgICBwYXRoLnB1c2goY3VycmVudENlbGwpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIE90aGVyd2lzZSBnbyBiYWNrIHVwIGEgc3RlcCBhbmQga2VlcCBnb2luZ1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjdXJyZW50Q2VsbCA9IHBhdGgucG9wKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5vcHRpbWl6ZVdhbGxzKGNlbGxzKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcHRpbWl6ZVdhbGxzKGNlbGxzOiBudW1iZXJbXVtdW10pOiBNYXplIHtcclxuICAgIHZhciBob3Jpem9udGFsV2FsbHM6IHsgd2FsbDogYm9vbGVhbiwgY291bnQ6IG51bWJlciB9W11bXSA9IFtdO1xyXG5cclxuICAgIHZhciBwcmVwZm9yVmVydCA9IFtdO1xyXG5cclxuICAgIGNlbGxzLmZvckVhY2goKHJvdywgcm93SSwgcm93cykgPT4ge1xyXG4gICAgICB2YXIgbmV4dFJvdyA9IHJvd3Nbcm93SSArIDFdO1xyXG4gICAgICBob3Jpem9udGFsV2FsbHNbcm93SV0gPSBbXTtcclxuICAgICAgdmFyIGxhc3RSb3dWYWx1ZTogYm9vbGVhbiA9IG51bGw7XHJcbiAgICAgIHZhciByb3dDYWNoZSA9IDA7XHJcbiAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjZWxsSSwgY2VsbHMpID0+IHtcclxuICAgICAgICBpZiAoIW5leHRSb3cpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGhvcml6b250YWxXYWxsID0gISFjZWxsWzJdIHx8ICEhbmV4dFJvd1tjZWxsSV1bMF07XHJcbiAgICAgICAgaWYgKGxhc3RSb3dWYWx1ZSA9PT0gaG9yaXpvbnRhbFdhbGwgfHwgbGFzdFJvd1ZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICBpZiAobGFzdFJvd1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgbGFzdFJvd1ZhbHVlID0gaG9yaXpvbnRhbFdhbGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByb3dDYWNoZSsrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBob3Jpem9udGFsV2FsbHNbcm93SV0ucHVzaCh7IHdhbGw6IGxhc3RSb3dWYWx1ZSwgY291bnQ6IHJvd0NhY2hlIH0pO1xyXG4gICAgICAgICAgbGFzdFJvd1ZhbHVlID0gaG9yaXpvbnRhbFdhbGw7XHJcbiAgICAgICAgICByb3dDYWNoZSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSlcclxuICAgICAgaWYgKHJvd0NhY2hlID4gMCkge1xyXG4gICAgICAgIGhvcml6b250YWxXYWxsc1tyb3dJXS5wdXNoKHsgd2FsbDogbGFzdFJvd1ZhbHVlLCBjb3VudDogcm93Q2FjaGUgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB2YXIgdmVydGljYWxXYWxsc1RtcDogYm9vbGVhbltdW10gPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmVydGljYWxXYWxsc1RtcFtpXSA9IFtdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2ZXJ0aWNhbFdhbGxzVG1wID0gY2VsbHMubWFwKChyb3csIHJvd0ksIHJvd3MpID0+IHtcclxuICAgICAgcmV0dXJuIHJvdy5tYXAoKGNlbGwsIGNlbGxJLCBjZWxscykgPT4ge1xyXG4gICAgICAgIHZhciBuZXh0Q2VsbCA9IGNlbGxzW2NlbGxJICsgMV07XHJcbiAgICAgICAgdmFyIHZlcnRpY2FsV2FsbCA9ICEhY2VsbFsxXSB8fCAobmV4dENlbGwgPyAhIW5leHRDZWxsWzNdIDogZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiB2ZXJ0aWNhbFdhbGxcclxuICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgdmFyIGNvbHM6IGFueSA9IFtdXHJcblxyXG4gICAgZm9yICh2YXIgciA9IDA7IHIgPCB2ZXJ0aWNhbFdhbGxzVG1wLmxlbmd0aDsgcisrKSB7XHJcbiAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgdmVydGljYWxXYWxsc1RtcFtyXS5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHZlcnRpY2FsV2FsbHNUbXBbcl1bY107XHJcbiAgICAgICAgaWYgKCFjb2xzW2NdKSB7XHJcbiAgICAgICAgICBjb2xzW2NdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghY29sc1tjXVtyXSkge1xyXG4gICAgICAgICAgY29sc1tjXVtyXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2xzW2NdW3JdID0gdmFsdWVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB2ZXJ0aWNhbFdhbGxzOiB7IHdhbGw6IGJvb2xlYW4sIGNvdW50OiBudW1iZXIgfVtdW10gPSBjb2xzLm1hcCgoY29sOiBhbnksIGNvbEk6IGFueSwgY29sQTogYW55KSA9PiB7XHJcbiAgICAgIHZhciBsYXN0VmFsdWU6IGJvb2xlYW4gPSBudWxsO1xyXG4gICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICB2YXIgcmVzOiB7IHdhbGw6IGJvb2xlYW4sIGNvdW50OiBudW1iZXIgfVtdID0gW107XHJcbiAgICAgIGNvbC5mb3JFYWNoKCh3YWxsOiBhbnksIHdhbGxJOiBhbnksIHdhbGxBOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAobGFzdFZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgIGxhc3RWYWx1ZSA9IHdhbGw7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAod2FsbCAhPT0gbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJlcy5wdXNoKHsgd2FsbDogbGFzdFZhbHVlLCBjb3VudDogY291bnQgfSk7XHJcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHdhbGw7XHJcbiAgICAgICAgICAgIGNvdW50ID0gMTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgcmVzLnB1c2goeyB3YWxsOiBsYXN0VmFsdWUsIGNvdW50OiBjb3VudCB9KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSlcclxuXHJcbiAgICB2ZXJ0aWNhbFdhbGxzLnBvcCgpO1xyXG5cclxuXHJcbiAgICByZXR1cm4geyBjb2xzOiB2ZXJ0aWNhbFdhbGxzLCByb3dzOiBob3Jpem9udGFsV2FsbHMgfTtcclxuICB9XHJcblxyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBXYWxsTWFuYWdlciB9IGZyb20gJy4vd2FsbC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IENvbGxpc2lvbnMgfSBmcm9tICcuL2NvbGxpc2lvbnMnO1xyXG5pbXBvcnQgeyBQYWNtYW4gfSBmcm9tICcuL3BhY21hbic7XHJcblxyXG5leHBvcnQgY2xhc3MgTW9iTWFuYWdlciB7XHJcblxyXG4gIHB1YmxpYyBtb2JzOiBQaGFzZXIuR3JvdXA7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSwgcHJpdmF0ZSBwYWNtYW46IFBhY21hbiwgcHJpdmF0ZSBzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICB9XHJcblxyXG4gIHN0YXJ0KCkge1xyXG4gICAgdGhpcy5zcGF3bk1vYigpOyB0aGlzLnNwYXduTW9iKCk7IHRoaXMuc3Bhd25Nb2IoKTtcclxuICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5sb29wKDEwMDAsIHRoaXMuc3Bhd25Nb2IuYmluZCh0aGlzKSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBzcGF3bk1vYigpIHtcclxuXHJcbiAgICB2YXIgeCA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAodGhpcy5zaXplLnggLSAxKSkpO1xyXG4gICAgdmFyIHkgPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKHRoaXMuc2l6ZS55IC0gMSkpKTtcclxuICAgIHZhciBkaXN0ID0gdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmRpc3RhbmNlVG9YWShcclxuICAgICAgdGhpcy5wYWNtYW4uc3ByaXRlLFxyXG4gICAgICB4ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCxcclxuICAgICAgeSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQpO1xyXG5cclxuICAgIHdoaWxlIChDb25zdHMudGlsZVNpemUqMi41ID49IGRpc3QpIHtcclxuICAgICAgY29uc29sZS5sb2coZGlzdCwgQ29uc3RzLnRpbGVTaXplKVxyXG4gICAgICB4ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueCAtIDEpKSk7XHJcbiAgICAgIHkgPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKHRoaXMuc2l6ZS55IC0gMSkpKTtcclxuICAgICAgZGlzdCA9IHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5kaXN0YW5jZVRvWFkoXHJcbiAgICAgICAgdGhpcy5wYWNtYW4uc3ByaXRlLFxyXG4gICAgICAgIHggKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LFxyXG4gICAgICAgIHkgKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0KTtcclxuICAgIH1cclxuICAgIHZhciBzcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgeSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsICdoYXphcmQnKTtcclxuICAgIHNwcml0ZS5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICBzcHJpdGUuc2NhbGUuc2V0VG8oQ29uc3RzLnRpbGVTaXplIC8gNTEyICogMC4zLCBDb25zdHMudGlsZVNpemUgLyA1MTIgKiAwLjMpO1xyXG4gICAgdmFyIHR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2VlbihzcHJpdGUpO1xyXG4gICAgdHdlZW4udG8oeyBhbHBoYTogMCB9LCAzMDAwLCBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lKTtcclxuICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKChlOiBhbnkpID0+IHtcclxuICAgICAgZS5kZXN0cm95KCk7XHJcbiAgICAgIHZhciBzcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgeSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsICdtb2InKTtcclxuICAgICAgc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgc3ByaXRlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDk4ICogMC4zLCBDb25zdHMudGlsZVNpemUgLyA5OCAqIDAuMyk7XHJcblxyXG4gICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5lbmFibGUoc3ByaXRlLCBmYWxzZSk7XHJcblxyXG4gICAgICBzcHJpdGUuYm9keS5zZXRDaXJjbGUoQ29uc3RzLnRpbGVTaXplICogMC4yKTtcclxuICAgICAgLy8gc3ByaXRlLmJvZHkua2luZW1hdGljID0gdHJ1ZTtcclxuICAgICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLmFkZCgnbW9iJywgc3ByaXRlKTtcclxuICAgIH0sIHRoaXMpO1xyXG4gICAgdHdlZW4uc3RhcnQoKTtcclxuXHJcbiAgfVxyXG5cclxuXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBDb25zdHMgfSBmcm9tICcuL2NvbnN0JztcclxuaW1wb3J0IHsgV2FsbE1hbmFnZXIgfSBmcm9tICcuL3dhbGwtbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFjbWFuIHtcclxuXHJcbiAgcG9zaXRpb24gPSB7IHg6IDIsIHk6IDMgfVxyXG4gIHNwcml0ZTogUGhhc2VyLlNwcml0ZTtcclxuICBjdXJzb3JzOiBQaGFzZXIuQ3Vyc29yS2V5cztcclxuICBlbWl0dGVyOiBQaGFzZXIuUGFydGljbGVzLkFyY2FkZS5FbWl0dGVyO1xyXG4gIHBhcnRpY2xlc0dyb3VwOiBQaGFzZXIuR3JvdXA7XHJcblxyXG4gIHByaXZhdGUgcG9pbnRzOiBudW1iZXIgPSAwO1xyXG5cclxuICBtb3ZlT2JqZWN0OiB7IGxlZnQ6IGJvb2xlYW4sIHJpZ2h0OiBib29sZWFuLCB1cDogYm9vbGVhbiwgZG93bjogYm9vbGVhbiB9XHJcbiAgdG91Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHByaXZhdGUgc2NhbGVUb1RpbGUgPSAwLjU7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSwgcHJpdmF0ZSB3YWxsTWFuYWdlcjogV2FsbE1hbmFnZXIpIHtcclxuXHJcbiAgICB0aGlzLnBhcnRpY2xlc0dyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xyXG5cclxuICAgIHRoaXMuc3ByaXRlID0gZ2FtZS5hZGQuc3ByaXRlKHRoaXMucG9zaXRpb24ueCAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIHRoaXMucG9zaXRpb24ueSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsICd1Zm8nKTtcclxuICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDUxMiAqIHRoaXMuc2NhbGVUb1RpbGUsIENvbnN0cy50aWxlU2l6ZSAvIDUxMiAqIHRoaXMuc2NhbGVUb1RpbGUpO1xyXG5cclxuICAgIGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIGZhbHNlKTtcclxuICAgIC8vIHRoaXMuc3ByaXRlLmJvZHkuZW5hYmxlQm9keSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zcHJpdGUuYm9keS5zZXRDaXJjbGUoQ29uc3RzLnRpbGVTaXplICogMC41ICogdGhpcy5zY2FsZVRvVGlsZSk7XHJcbiAgICB0aGlzLmN1cnNvcnMgPSBnYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcclxuXHJcbiAgICB0aGlzLmdhbWUuY2FtZXJhLmZvbGxvdyh0aGlzLnNwcml0ZSwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OLCAwLjEsIDAuMSk7XHJcblxyXG4gICAgLy8gdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmxvb3AoMzAwLCB0aGlzLnBhcnRpY2xlcy5iaW5kKHRoaXMpLCB0aGlzKTtcclxuICAgIGlmICghdGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XHJcbiAgICAgIHRoaXMuZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2soKGU6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgZS53b3JsZFgsIGUud29ybGRZLCB0aGlzLnNwZWVkKTtcclxuICAgICAgICB0aGlzLnRvdWNoaW5nID0gdHJ1ZTtcclxuICAgICAgfSwgdGhpcylcclxuXHJcbiAgICAgIHRoaXMuZ2FtZS5pbnB1dC5vblVwLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b3VjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGUucG9zaXRpb24ueCwgdGhpcy5zcHJpdGUucG9zaXRpb24ueSwgMCk7XHJcbiAgICAgIH0sIHRoaXMpXHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIC8vIHRoaXMuc3ByaXRlLmJvZHkuY29sbGlkZXMoLCBoaXRQYW5kYSwgdGhpcyk7XHJcbiAgICBpZiAodGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XHJcbiAgICAgIHRoaXMubW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW92ZSgpIHtcclxuICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XHJcbiAgICB0aGlzLnNwcml0ZS5ib2R5LnNldFplcm9WZWxvY2l0eSgpO1xyXG4gICAgdmFyIHN0ZXAgPSBDb25zdHMudGlsZVNpemUgKiAyO1xyXG5cclxuICAgIHRoaXMuc3RvcE1vdmluZygpO1xyXG5cclxuICAgIGlmICh0aGlzLmN1cnNvcnMubGVmdC5pc0Rvd24pIHtcclxuICAgICAgdGhpcy5tb3ZlT2JqZWN0LmxlZnQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5jdXJzb3JzLnJpZ2h0LmlzRG93bikge1xyXG4gICAgICB0aGlzLm1vdmVPYmplY3QucmlnaHQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmN1cnNvcnMudXAuaXNEb3duKSB7XHJcbiAgICAgIHRoaXMubW92ZU9iamVjdC51cCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLmN1cnNvcnMuZG93bi5pc0Rvd24pIHtcclxuICAgICAgdGhpcy5tb3ZlT2JqZWN0LmRvd24gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgdGhpcy5tYWtlTW92ZUZyb21Nb3ZlT2JqZWN0KCk7XHJcbiAgfVxyXG5cclxuICBzdG9wTW92aW5nKCkge1xyXG4gICAgdGhpcy5tb3ZlT2JqZWN0ID0geyBsZWZ0OiBmYWxzZSwgcmlnaHQ6IGZhbHNlLCB1cDogZmFsc2UsIGRvd246IGZhbHNlIH1cclxuICB9XHJcblxyXG4gIGdldCBzcGVlZCgpIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiAyO1xyXG4gIH1cclxuXHJcbiAgbWFrZU1vdmVGcm9tTW92ZU9iamVjdCgpIHtcclxuICAgIHZhciB4ID0gMDtcclxuICAgIHZhciB5ID0gMDtcclxuXHJcblxyXG4gICAgaWYgKHRoaXMubW92ZU9iamVjdC5sZWZ0KSB7XHJcbiAgICAgIHggPSAtNTAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubW92ZU9iamVjdC5yaWdodCkge1xyXG4gICAgICB4ID0gKzUwMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1vdmVPYmplY3QudXApIHtcclxuICAgICAgeSA9IC01MDA7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5tb3ZlT2JqZWN0LmRvd24pIHtcclxuICAgICAgeSA9ICs1MDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHggIT0gMCB8fCB5ICE9IDApIHtcclxuICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLm1vdmVUb1hZKHRoaXMuc3ByaXRlLCB0aGlzLnNwcml0ZS5wb3NpdGlvbi54ICsgeCwgdGhpcy5zcHJpdGUucG9zaXRpb24ueSArIHksIHRoaXMuc3BlZWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLm1vdmVUb1hZKHRoaXMuc3ByaXRlLCB0aGlzLnNwcml0ZS5wb3NpdGlvbi54LCB0aGlzLnNwcml0ZS5wb3NpdGlvbi55LCAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBhcnRpY2xlcygpIHtcclxuICAgIGlmICh0aGlzLmN1cnNvcnMubGVmdC5pc0Rvd24gfHwgdGhpcy5jdXJzb3JzLnJpZ2h0LmlzRG93biB8fCB0aGlzLmN1cnNvcnMudXAuaXNEb3duIHx8IHRoaXMuY3Vyc29ycy5kb3duLmlzRG93biB8fCB0aGlzLnRvdWNoaW5nKSB7XHJcblxyXG4gICAgICB2YXIgcGFydGljbGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgxMDAwLCAxMDAwLCAnZ29sZCcpO1xyXG4gICAgICBwYXJ0aWNsZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIHBhcnRpY2xlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDMyICogdGhpcy5zY2FsZVRvVGlsZSAqIDAuMyk7XHJcblxyXG4gICAgICBwYXJ0aWNsZS5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgIHBhcnRpY2xlLnggPSB0aGlzLnNwcml0ZS54O1xyXG4gICAgICBwYXJ0aWNsZS55ID0gdGhpcy5zcHJpdGUueTtcclxuICAgICAgdGhpcy5wYXJ0aWNsZXNHcm91cC5hZGQocGFydGljbGUpO1xyXG4gICAgICBwYXJ0aWNsZS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgdmFyIHRpbWUgPSA0NTAwMDtcclxuICAgICAgdmFyIHR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2VlbihwYXJ0aWNsZSk7XHJcbiAgICAgIHZhciB0d2VlblNjYWxlID0gdGhpcy5nYW1lLmFkZC50d2VlbihwYXJ0aWNsZS5zY2FsZSk7XHJcbiAgICAgIHR3ZWVuU2NhbGUudG8oeyB5OiAwLCB4OiAwIH0sIHRpbWUgLSAyMDAwLCBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lLCB0cnVlKVxyXG5cclxuICAgICAgdHdlZW4udG8oeyBhbHBoYTogMCwgYW5nbGU6IDgwMDAgfSwgdGltZSwgUGhhc2VyLkVhc2luZy5MaW5lYXIuTm9uZSk7XHJcbiAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKChlOiBhbnkpID0+IHtcclxuICAgICAgICBlLmRlc3Ryb3koKTtcclxuICAgICAgfSwgdGhpcyk7XHJcbiAgICAgIHR3ZWVuLnN0YXJ0KCk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkUG9pbnRzKHBvaW50czogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnBvaW50cyArPSBwb2ludHM7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnBvaW50cylcclxuICB9XHJcblxyXG4gIGdldFBvaW50cygpIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50cztcclxuICB9XHJcblxyXG4gIF9raWxsaW5nTW9kZTogYW55O1xyXG4gIGlzS2lsbGluZ01vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBraWxsaW5nTW9kZSgpIHtcclxuICAgIGlmICh0aGlzLmlzS2lsbGluZ01vZGUpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2tpbGxpbmdNb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNLaWxsaW5nTW9kZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygna2lsbGluZyBtb2RlJywgdGhpcy5pc0tpbGxpbmdNb2RlKVxyXG5cclxuICAgIHRoaXMuX2tpbGxpbmdNb2RlID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuaXNLaWxsaW5nTW9kZSA9IGZhbHNlO1xyXG4gICAgICBjb25zb2xlLmxvZygna2lsbGluZyBtb2RlJywgdGhpcy5pc0tpbGxpbmdNb2RlKVxyXG4gICAgfSwgMTUwMDApO1xyXG4gIH1cclxuXHJcblxyXG5cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IENvbnN0cyB9IGZyb20gJy4vY29uc3QnO1xyXG5pbXBvcnQgeyBNYXplIH0gZnJvbSAnLi9tYXplJztcclxuaW1wb3J0IHsgQ29sbGlzaW9ucyB9IGZyb20gJy4vY29sbGlzaW9ucyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2FsbE1hbmFnZXIge1xyXG5cclxuICB0aGlja25lc3M6IG51bWJlciA9IDAuMTtcclxuXHJcbiAgcHVibGljIGJnOiBQaGFzZXIuR3JvdXA7XHJcbiAgcHVibGljIHdhbGxzOiBQaGFzZXIuR3JvdXA7XHJcbiAgcGFsZXR0ZSA9IHtcclxuICAgIGNvbG9yOiAweEZGMDAwMCxcclxuICAgIG9wYWNpdHk6IDAuMjcsXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lKSB7XHJcbiAgICB0aGlzLmJnID0gZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMud2FsbHMgPSBnYW1lLmFkZC5ncm91cCgpO1xyXG4gICAgdGhpcy53YWxscy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgIHRoaXMud2FsbHMucGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuUDJKUztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IG1hemVPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiA4O1xyXG4gIH1cclxuICBwdWJsaWMgZHJhdyhtYXplOiBNYXplLCBzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICAgIHZhciBvZmZzZXRGb3JCb3JkZXIgPSBDb25zdHMudGlsZVNpemUgKiB0aGlzLnRoaWNrbmVzcztcclxuICAgIHZhciBmbG9vciA9IHRoaXMuZ2FtZS5hZGQudGlsZVNwcml0ZShXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBzaXplLnggKiBDb25zdHMudGlsZVNpemUsIHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSwgJ21hemUtYmcnKTtcclxuICAgIHRoaXMuYmcuYWRkKGZsb29yKTtcclxuXHJcblxyXG4gICAgdGhpcy5hZGRCb3JkZXJzKHNpemUpO1xyXG5cclxuICAgIG1hemUuY29scy5mb3JFYWNoKChjb2wsIGNvbEluZGV4KSA9PiB7XHJcbiAgICAgIHZhciBvZmZzZXQgPSAwO1xyXG4gICAgICBjb2wuZm9yRWFjaCh3YWxsID0+IHtcclxuICAgICAgICBpZiAoIXdhbGwud2FsbCkge1xyXG4gICAgICAgICAgdGhpcy5hZGRXYWxsKHNpemUsXHJcbiAgICAgICAgICAgIChjb2xJbmRleCArIDEpICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICBvZmZzZXQgKiBDb25zdHMudGlsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMudGhpY2tuZXNzICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICB3YWxsLmNvdW50ICogQ29uc3RzLnRpbGVTaXplICsgb2Zmc2V0Rm9yQm9yZGVyLFxyXG4gICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBvZmZzZXQgKz0gd2FsbC5jb3VudFxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICBtYXplLnJvd3MuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xyXG4gICAgICB2YXIgb2Zmc2V0ID0gMDtcclxuICAgICAgcm93LmZvckVhY2god2FsbCA9PiB7XHJcbiAgICAgICAgaWYgKCF3YWxsLndhbGwpIHtcclxuICAgICAgICAgIHRoaXMuYWRkV2FsbChzaXplLFxyXG4gICAgICAgICAgICBvZmZzZXQgKiBDb25zdHMudGlsZVNpemUsXHJcbiAgICAgICAgICAgIChyb3dJbmRleCArIDEpICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICB3YWxsLmNvdW50ICogQ29uc3RzLnRpbGVTaXplICsgb2Zmc2V0Rm9yQm9yZGVyLFxyXG4gICAgICAgICAgICB0aGlzLnRoaWNrbmVzcyAqIENvbnN0cy50aWxlU2l6ZSxcclxuICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgb2Zmc2V0ICs9IHdhbGwuY291bnRcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZEJvcmRlcnMoc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XHJcbiAgICB2YXIgY29sb3IgPSAweDAwMDAwMDtcclxuICAgIHZhciBvcGFjaXR5ID0gMTtcclxuICAgIHRoaXMuYWRkV2FsbChzaXplLCAwLCAwLCBzaXplLnggKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHRydWUsIGNvbG9yLCBvcGFjaXR5KTtcclxuICAgIHRoaXMuYWRkV2FsbChzaXplLCAwLCBzaXplLnkgKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBzaXplLnggKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHRydWUsIGNvbG9yLCBvcGFjaXR5KTtcclxuXHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgMCwgMCwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgMCwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZFdhbGwoc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGlzQm9yZGVyOiBib29sZWFuLCBjb2xvcj86IG51bWJlciwgb3BhY2l0eT86IG51bWJlcikge1xyXG4gICAgaWYgKCFpc0JvcmRlcikge1xyXG4gICAgICB4ICs9IFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICAgIHkgKz0gV2FsbE1hbmFnZXIubWF6ZU9mZnNldDtcclxuICAgIH1cclxuICAgIHZhciBtYXhXaWR0aCA9IHNpemUueCAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICB2YXIgbWF4SGVpZ2h0ID0gc2l6ZS55ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldDtcclxuICAgIHZhciBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoQ29uc3RzLm1hcmdpbnMsIENvbnN0cy5tYXJnaW5zKTtcclxuICAgIGdyYXBoaWNzLmxpbmVTdHlsZSgyLCBjb2xvciB8fCBjb2xvciA9PT0gMCA/IGNvbG9yIDogdGhpcy5wYWxldHRlLmNvbG9yLCAxKTtcclxuICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvciB8fCBjb2xvciA9PT0gMCA/IGNvbG9yIDogdGhpcy5wYWxldHRlLmNvbG9yKTtcclxuICAgIGdyYXBoaWNzLmRyYXdSZWN0KFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB4ICsgd2lkdGggPiBtYXhXaWR0aCAmJiAhaXNCb3JkZXIgPyBtYXhXaWR0aCAtICh4KSA6IHdpZHRoLFxyXG4gICAgICB5ICsgaGVpZ2h0ID4gbWF4SGVpZ2h0ICYmICFpc0JvcmRlciA/IG1heEhlaWdodCAtICh5KSA6IGhlaWdodCxcclxuICAgICk7XHJcbiAgICBncmFwaGljcy5hbHBoYSA9IChvcGFjaXR5IHx8IG9wYWNpdHkgPT09IDAgPyBvcGFjaXR5IDogdGhpcy5wYWxldHRlLm9wYWNpdHkpO1xyXG4gICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xyXG4gICAgZ3JhcGhpY3MuYm91bmRzUGFkZGluZyA9IDA7XHJcbiAgICB2YXIgc2hhcGVTcHJpdGU6IFBoYXNlci5TcHJpdGUgPSB0aGlzLndhbGxzLmNyZWF0ZSh4LHkpOy8vIHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHgsIHkpO1xyXG4gICAgdGhpcy5nYW1lLnBoeXNpY3MucDIuZW5hYmxlKHNoYXBlU3ByaXRlLCB0cnVlKTtcclxuICAgIHNoYXBlU3ByaXRlLmFkZENoaWxkKGdyYXBoaWNzKTtcclxuXHJcbiAgICBzaGFwZVNwcml0ZS5ib2R5LmNsZWFyU2hhcGVzKCk7XHJcbiAgICBzaGFwZVNwcml0ZS5ib2R5LmFkZFJlY3RhbmdsZSh3aWR0aCwgaGVpZ2h0LCB3aWR0aCAvIDIuMCwgaGVpZ2h0IC8gMi4wKTtcclxuICAgIC8vIHNoYXBlU3ByaXRlLmJvZHkubWFzcyA9IDEwMDA7XHJcbiAgICBzaGFwZVNwcml0ZS5ib2R5LmtpbmVtYXRpYyA9IHRydWU7XHJcbiAgICAvLyB0aGlzLndhbGxzLmFkZChzaGFwZVNwcml0ZSk7XHJcblxyXG4gICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLmFkZCgnd2FsbCcsIHNoYXBlU3ByaXRlKTtcclxuXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9mZnNldCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgKiB0aGlzLndhbGxUaGlja25lc3MoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgd2FsbFRoaWNrbmVzcygpIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiB0aGlzLnRoaWNrbmVzcztcclxuICB9XHJcblxyXG59Il19
