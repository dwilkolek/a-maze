(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var maze_generator_1 = require("./maze-generator");
var wall_manager_1 = require("./wall-manager");
var ufo_1 = require("./ufo");
var MazeGame = (function () {
    function MazeGame() {
        this.size = { x: 16, y: 9 };
        this.moveObject = { left: false, right: false, up: false, down: false };
        this.maxW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.maxH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.minH = 960 / this.maxW * this.maxH;
        this.minW = 960;
        this.game = new Phaser.Game(this.minW, this.minH, Phaser.CANVAS, 'content', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
        this.maze = maze_generator_1.MazeGenerator.getInstance().generate(this.size);
    }
    MazeGame.prototype.preload = function () {
        this.game.load.image('ufo', 'assets/ufo.png');
        this.game.load.image('gold', 'assets/gold.png');
        this.game.load.image('maze-bg', 'assets/maze-bg.png');
        this.game.load.spritesheet('buttonvertical', 'assets/button-vertical.png', 32, 64);
        this.game.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png', 64, 32);
        this.game.load.spritesheet('buttondiagonal', 'assets/button-diagonal.png', 48, 48);
        if (this.game.device.desktop) {
            this.game.scale.setGameSize(this.maxW, this.maxH);
        }
        this.w = this.game.width;
        this.h = this.game.height;
        const_1.Consts.tileSize = this.w / 15;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    };
    MazeGame.prototype.create = function () {
        this.wallManager = new wall_manager_1.WallManager(this.game);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.world.setBounds(0, 0, this.size.x * const_1.Consts.tileSize + wall_manager_1.WallManager.mazeOffset * 2, this.size.y * const_1.Consts.tileSize + wall_manager_1.WallManager.mazeOffset * 2);
        this.game.physics.p2.restitution = 0.0;
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        this.ufo = new ufo_1.Ufo(this.game, this.wallManager);
        this.wallManager.draw(this.maze, this.size);
        // if (!this.game.device.desktop) {
        //     // this.buttons();
        //     // this.game.input.touch.((event:any) => {
        //     //     console.log('m',event)
        //     // })
        //     // this.game.input.touch.onTouchStart((event:any) => {
        //     //     console.log('s',event)
        //     // })
        //     // this.game.input.touch.onTouchEnd((event:any) => {
        //     //     console.log('e',event)
        //     // })
        // }
    };
    MazeGame.prototype.update = function () {
        this.ufo.update(this.moveObject);
    };
    MazeGame.prototype.render = function () {
    };
    MazeGame.prototype.buttons = function () {
        var _this = this;
        var scale = 2;
        var offsetX = 0;
        var offsetY = -40;
        var buttonleft = this.game.add.button(offsetX + 80, offsetY + this.h - 200, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonleft.fixedToCamera = true;
        buttonleft.events.onInputOver.add(function () { _this.moveObject.left = true; });
        buttonleft.events.onInputOut.add(function () { _this.moveObject.left = false; });
        buttonleft.events.onInputDown.add(function () { _this.moveObject.left = true; });
        buttonleft.events.onInputUp.add(function () { _this.moveObject.left = false; });
        buttonleft.scale.setTo(2);
        var buttonright = this.game.add.button(offsetX + 272, offsetY + this.h - 200, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonright.fixedToCamera = true;
        buttonright.events.onInputOver.add(function () { _this.moveObject.right = true; });
        buttonright.events.onInputOut.add(function () { _this.moveObject.right = false; });
        buttonright.events.onInputDown.add(function () { _this.moveObject.right = true; });
        buttonright.events.onInputUp.add(function () { _this.moveObject.right = false; });
        buttonright.scale.setTo(2);
        var buttondown = this.game.add.button(offsetX + 208, offsetY + this.h - 136, 'buttonvertical', null, this, 0, 1, 0, 1);
        buttondown.fixedToCamera = true;
        buttondown.events.onInputOver.add(function () { _this.moveObject.down = true; });
        buttondown.events.onInputOut.add(function () { _this.moveObject.down = false; });
        buttondown.events.onInputDown.add(function () { _this.moveObject.down = true; });
        buttondown.events.onInputUp.add(function () { _this.moveObject.down = false; });
        buttondown.scale.setTo(2);
        var buttonup = this.game.add.button(offsetX + 208, offsetY + this.h - 326, 'buttonvertical', null, this, 0, 1, 0, 1);
        buttonup.fixedToCamera = true;
        buttonup.events.onInputOver.add(function () { _this.moveObject.up = true; });
        buttonup.events.onInputOut.add(function () { _this.moveObject.up = false; });
        buttonup.events.onInputDown.add(function () { _this.moveObject.up = true; });
        buttonup.events.onInputUp.add(function () { _this.moveObject.up = false; });
        buttonup.scale.setTo(2);
        var buttonbottomleft = this.game.add.button(offsetX + 112, offsetY + this.h - 136, 'buttondiagonal', null, this, 6, 4, 6, 4);
        buttonbottomleft.fixedToCamera = true;
        buttonbottomleft.events.onInputOver.add(function () { _this.moveObject.left = true; _this.moveObject.down = true; });
        buttonbottomleft.events.onInputOut.add(function () { _this.moveObject.left = false; _this.moveObject.down = false; });
        buttonbottomleft.events.onInputDown.add(function () { _this.moveObject.left = true; _this.moveObject.down = true; });
        buttonbottomleft.events.onInputUp.add(function () { _this.moveObject.left = false; _this.moveObject.down = false; });
        buttonbottomleft.scale.setTo(2);
        var buttonbottomright = this.game.add.button(offsetX + 272, offsetY + this.h - 136, 'buttondiagonal', null, this, 7, 5, 7, 5);
        buttonbottomright.fixedToCamera = true;
        buttonbottomright.events.onInputOver.add(function () { _this.moveObject.right = true; _this.moveObject.down = true; });
        buttonbottomright.events.onInputOut.add(function () { _this.moveObject.right = false; _this.moveObject.down = false; });
        buttonbottomright.events.onInputDown.add(function () { _this.moveObject.right = true; _this.moveObject.down = true; });
        buttonbottomright.events.onInputUp.add(function () { _this.moveObject.right = false; _this.moveObject.down = false; });
        buttonbottomright.scale.setTo(2);
        var buttonupright = this.game.add.button(offsetX + 272, offsetY + this.h - 296, 'buttondiagonal', null, this, 3, 1, 3, 1);
        buttonupright.fixedToCamera = true;
        buttonupright.events.onInputOver.add(function () { _this.moveObject.right = true; _this.moveObject.up = true; });
        buttonupright.events.onInputOut.add(function () { _this.moveObject.right = false; _this.moveObject.up = false; });
        buttonupright.events.onInputDown.add(function () { _this.moveObject.right = true; _this.moveObject.up = true; });
        buttonupright.events.onInputUp.add(function () { _this.moveObject.right = false; _this.moveObject.up = false; });
        buttonupright.scale.setTo(2);
        var buttonupleft = this.game.add.button(offsetX + 112, offsetY + this.h - 296, 'buttondiagonal', null, this, 2, 0, 2, 0);
        buttonupleft.fixedToCamera = true;
        buttonupleft.events.onInputOver.add(function () { _this.moveObject.left = true; _this.moveObject.up = true; });
        buttonupleft.events.onInputOut.add(function () { _this.moveObject.left = false; _this.moveObject.up = false; });
        buttonupleft.events.onInputDown.add(function () { _this.moveObject.left = true; _this.moveObject.up = true; });
        buttonupleft.events.onInputUp.add(function () { _this.moveObject.left = false; _this.moveObject.up = false; });
        buttonupleft.scale.setTo(2);
    };
    return MazeGame;
}());
window.onload = function () {
    var game = new MazeGame();
};
},{"./const":1,"./maze-generator":3,"./ufo":4,"./wall-manager":5}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var wall_manager_1 = require("./wall-manager");
var Ufo = (function () {
    function Ufo(game, wallManager) {
        var _this = this;
        this.game = game;
        this.wallManager = wallManager;
        this.position = { x: 0, y: 0 };
        this.touching = false;
        this.scaleToTile = 0.5;
        this.particlesGroup = this.game.add.group();
        this.sprite = game.add.sprite(this.position.x + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, this.position.y + const_1.Consts.tileSize * 0.5 + wall_manager_1.WallManager.mazeOffset, 'ufo');
        this.sprite.anchor.set(0.5);
        this.sprite.scale.setTo(const_1.Consts.tileSize / 512 * this.scaleToTile, const_1.Consts.tileSize / 512 * this.scaleToTile);
        game.physics.p2.enable(this.sprite);
        this.sprite.body.setCircle(const_1.Consts.tileSize * 0.5 * this.scaleToTile);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        this.game.time.events.loop(300, this.particles.bind(this), this);
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
        // this.cursors.down.onUp.add(() => {
        //   this.stopMoving();
        // }, this)
    }
    Ufo.prototype.update = function (moveObject) {
        if (this.game.device.desktop) {
            this.move();
        }
    };
    Ufo.prototype.move = function () {
        this.sprite.body.setZeroRotation();
        this.sprite.body.setZeroVelocity();
        var step = const_1.Consts.tileSize * 2;
        if (!this.moveObject) {
            this.stopMoving();
        }
        this.stopMoving();
        // console.log(this.game.physics.arcade.overlap(this.sprite, this.wallManager.walls)
        // if (!)) {
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
    Ufo.prototype.stopMoving = function () {
        this.moveObject = { left: false, right: false, up: false, down: false };
    };
    Object.defineProperty(Ufo.prototype, "speed", {
        get: function () {
            return const_1.Consts.tileSize * 2;
        },
        enumerable: true,
        configurable: true
    });
    Ufo.prototype.makeMoveFromMoveObject = function () {
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
    Ufo.prototype.particles = function () {
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
    return Ufo;
}());
exports.Ufo = Ufo;
},{"./const":1,"./wall-manager":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
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
        var shapeSprite = this.game.add.sprite(x, y);
        this.game.physics.p2.enable(shapeSprite);
        shapeSprite.addChild(graphics);
        shapeSprite.body.clearShapes();
        shapeSprite.body.addRectangle(width, height, width / 2.0, height / 2.0);
        shapeSprite.body.kinematic = true;
        this.walls.add(shapeSprite);
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
},{"./const":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2NvbnN0LnRzIiwic3JjL2FwcC9tYXplLWdhbWUudHMiLCJzcmMvYXBwL21hemUtZ2VuZXJhdG9yLnRzIiwic3JjL2FwcC91Zm8udHMiLCJzcmMvYXBwL3dhbGwtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFBQTtJQUdBLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FIQSxBQUdDO0FBRmUsY0FBTyxHQUFXLENBQUMsQ0FBQztBQUNwQixlQUFRLEdBQVcsQ0FBQyxDQUFDO0FBRnhCLHdCQUFNOzs7O0FDQW5CLGlDQUFnQztBQUVoQyxtREFBZ0Q7QUFDaEQsK0NBQTRDO0FBQzVDLDZCQUE0QjtBQUU1QjtJQWlCSTtRQVRBLFNBQUksR0FBNkIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQXlFakQsZUFBVSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFBO1FBL0Q5RCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbkcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3RHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUVoQixJQUFJLENBQUMsSUFB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QUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4SCxVQUFVLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUNoQyxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxSCxXQUFXLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUNqQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2SCxVQUFVLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUNoQyxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNySCxRQUFRLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUM5QixRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRSxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4QixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdILGdCQUFnQixDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDdEMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxjQUFRLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUgsaUJBQWlCLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUN2QyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxjQUFRLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9HLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBUSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFRLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9HLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakMsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUgsYUFBYSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDbkMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekcsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekgsWUFBWSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDbEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQVEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkcsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEMsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQXZKQSxBQXVKQyxJQUFBO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNaLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDOUIsQ0FBQyxDQUFBOzs7O0FDL0pEO0lBSUU7SUFBd0IsQ0FBQztJQUVYLHlCQUFXLEdBQXpCO1FBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDdkMsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFBO0lBQ3ZCLENBQUM7SUFFTSxnQ0FBUSxHQUFmLFVBQWdCLElBQThCO1FBQzVDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWYsSUFBSSxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3hCLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDeEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMzQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN2QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUMzQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNyQixDQUFDO1FBQ0gsQ0FBQztRQUVELHNDQUFzQztRQUN0QyxJQUFJLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzlDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUVoQiw0Q0FBNEM7UUFDNUMsT0FBTyxPQUFPLEdBQUcsVUFBVSxFQUFFLENBQUM7WUFDNUIsOEJBQThCO1lBQzlCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDMUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBRTVCLDhGQUE4RjtZQUM5RixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsQ0FBQztZQUNwSSxDQUFDO1lBRUQseURBQXlEO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNyQix3Q0FBd0M7Z0JBQ3hDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFFbkUsMkVBQTJFO2dCQUMzRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVyQywrREFBK0Q7Z0JBQy9ELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ2hDLE9BQU8sRUFBRSxDQUFDO2dCQUNWLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBRUQsSUFBSSxDQUFDLENBQUM7Z0JBQ0osV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU8scUNBQWEsR0FBckIsVUFBc0IsS0FBbUI7UUFDdkMsSUFBSSxlQUFlLEdBQXlDLEVBQUUsQ0FBQztRQUUvRCxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFckIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSTtZQUM1QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdCLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0IsSUFBSSxZQUFZLEdBQVksSUFBSSxDQUFDO1lBQ2pDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztZQUNqQixHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsTUFBTSxDQUFDO2dCQUNULENBQUM7Z0JBQ0QsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssY0FBYyxJQUFJLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUM3RCxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDekIsWUFBWSxHQUFHLGNBQWMsQ0FBQztvQkFDaEMsQ0FBQztvQkFDRCxRQUFRLEVBQUUsQ0FBQztnQkFDYixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUNwRSxZQUFZLEdBQUcsY0FBYyxDQUFDO29CQUM5QixRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUM7WUFFSCxDQUFDLENBQUMsQ0FBQTtZQUNGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN0RSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFHSCxJQUFJLGdCQUFnQixHQUFnQixFQUFFLENBQUM7UUFDdkMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFHRCxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJO1lBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLO2dCQUNoQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sQ0FBQyxZQUFZLENBQUE7WUFDckIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQTtRQUVsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2pELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3BELElBQUksS0FBSyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDZixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFBO1lBQ3BCLENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBSSxhQUFhLEdBQXlDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFRLEVBQUUsSUFBUyxFQUFFLElBQVM7WUFDaEcsSUFBSSxTQUFTLEdBQVksSUFBSSxDQUFDO1lBQzlCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksR0FBRyxHQUF1QyxFQUFFLENBQUM7WUFDakQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVMsRUFBRSxLQUFVLEVBQUUsS0FBVTtnQkFDNUMsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2pCLEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUM1QyxTQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUNqQixLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNaLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sS0FBSyxFQUFFLENBQUM7b0JBQ1YsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUE7WUFDRixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUM5QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFBO1FBRUYsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBR3BCLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFHSCxvQkFBQztBQUFELENBeEtBLEFBd0tDLElBQUE7QUF4S1ksc0NBQWE7Ozs7QUNGMUIsaUNBQWlDO0FBQ2pDLCtDQUE2QztBQUU3QztJQVdFLGFBQW9CLElBQWlCLEVBQVUsV0FBd0I7UUFBdkUsaUJBaUNDO1FBakNtQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFUdkUsYUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUE7UUFPekIsYUFBUSxHQUFZLEtBQUssQ0FBQTtRQUNqQixnQkFBVyxHQUFHLEdBQUcsQ0FBQztRQUd4QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTVDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekssSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1RyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXRELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU1RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQUMsQ0FBTTtnQkFDckMsS0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JFLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUVSLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ3ZCLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixLQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFFVixDQUFDO1FBRUQscUNBQXFDO1FBQ3JDLHVCQUF1QjtRQUN2QixXQUFXO0lBRWIsQ0FBQztJQUVELG9CQUFNLEdBQU4sVUFBTyxVQUF5RTtRQUM5RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBRUQsa0JBQUksR0FBSjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ25DLElBQUksSUFBSSxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsb0ZBQW9GO1FBQ3BGLFlBQVk7UUFHWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUM5QixDQUFDO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUM1QixDQUFDO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUM7UUFJRCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsd0JBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7SUFDekUsQ0FBQztJQUVELHNCQUFJLHNCQUFLO2FBQVQ7WUFDRSxNQUFNLENBQUMsY0FBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUFFRCxvQ0FBc0IsR0FBdEI7UUFDRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHVixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ1gsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDWCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNYLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ1gsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckgsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEcsQ0FBQztJQUNILENBQUM7SUFFRCx1QkFBUyxHQUFUO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRWpJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELFFBQVEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFcEUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzQixRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNqQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyRCxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFM0UsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRSxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQU07Z0JBQzFCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNULEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoQixDQUFDO0lBQ0gsQ0FBQztJQUVILFVBQUM7QUFBRCxDQS9JQSxBQStJQyxJQUFBO0FBL0lZLGtCQUFHOzs7O0FDSGhCLGlDQUFpQztBQUdqQztJQVdFLHFCQUFvQixJQUFpQjtRQUFqQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBVHJDLGNBQVMsR0FBVyxHQUFHLENBQUM7UUFJeEIsWUFBTyxHQUFHO1lBQ1IsS0FBSyxFQUFFLFFBQVE7WUFDZixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUE7UUFHQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxzQkFBa0IseUJBQVU7YUFBNUI7WUFDRSxNQUFNLENBQUMsY0FBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUFDTSwwQkFBSSxHQUFYLFVBQVksSUFBVSxFQUFFLElBQThCO1FBQXRELGlCQXVDQztRQXRDQyxJQUFJLGVBQWUsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BKLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBR25CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsUUFBUTtZQUM5QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDZixHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtnQkFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNmLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUNmLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEVBQ2hDLE1BQU0sR0FBRyxjQUFNLENBQUMsUUFBUSxFQUN4QixLQUFJLENBQUMsU0FBUyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEVBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxlQUFlLEVBQzlDLEtBQUssQ0FDTixDQUFBO2dCQUNILENBQUM7Z0JBQ0QsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUE7WUFDdEIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLFFBQVE7WUFDOUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDZixLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDZixNQUFNLEdBQUcsY0FBTSxDQUFDLFFBQVEsRUFDeEIsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsRUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLGVBQWUsRUFDOUMsS0FBSSxDQUFDLFNBQVMsR0FBRyxjQUFNLENBQUMsUUFBUSxFQUNoQyxLQUFLLENBQ04sQ0FBQTtnQkFDSCxDQUFDO2dCQUNELE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFBO1lBQ3RCLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU8sZ0NBQVUsR0FBbEIsVUFBbUIsSUFBOEI7UUFDL0MsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQ3JCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsTCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxXQUFXLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwTCxDQUFDO0lBRU8sNkJBQU8sR0FBZixVQUFnQixJQUE4QixFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFBRSxRQUFpQixFQUFFLEtBQWMsRUFBRSxPQUFnQjtRQUN0SixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDZCxDQUFDLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQztZQUM1QixDQUFDLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQztRQUM5QixDQUFDO1FBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDakUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDbEUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQU0sQ0FBQyxPQUFPLEVBQUUsY0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RSxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RFLFFBQVEsQ0FBQyxRQUFRLENBQ2YsQ0FBQyxFQUNELENBQUMsRUFDRCxDQUFDLEdBQUcsS0FBSyxHQUFHLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQzFELENBQUMsR0FBRyxNQUFNLEdBQUcsU0FBUyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FDL0QsQ0FBQztRQUNGLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxPQUFPLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3RSxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsUUFBUSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDM0IsSUFBSSxXQUFXLEdBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9CLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0IsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEdBQUcsR0FBRyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN4RSxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVPLDRCQUFNLEdBQWQsVUFBZSxLQUFhO1FBQzFCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFTyxtQ0FBYSxHQUFyQjtRQUNFLE1BQU0sQ0FBQyxjQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUMsQ0FBQztJQUVILGtCQUFDO0FBQUQsQ0EzR0EsQUEyR0MsSUFBQTtBQTNHWSxrQ0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgY2xhc3MgQ29uc3RzIHtcclxuICBwdWJsaWMgc3RhdGljIG1hcmdpbnM6IG51bWJlciA9IDA7XHJcbiAgcHVibGljIHN0YXRpYyB0aWxlU2l6ZTogbnVtYmVyID0gMDtcclxufSIsImltcG9ydCB7IENvbnN0cyB9IGZyb20gJy4vY29uc3QnXHJcbmltcG9ydCB7IE1hemUgfSBmcm9tICcuL21hemUnXHJcbmltcG9ydCB7IE1hemVHZW5lcmF0b3IgfSBmcm9tICcuL21hemUtZ2VuZXJhdG9yJ1xyXG5pbXBvcnQgeyBXYWxsTWFuYWdlciB9IGZyb20gJy4vd2FsbC1tYW5hZ2VyJ1xyXG5pbXBvcnQgeyBVZm8gfSBmcm9tICcuL3Vmbyc7XHJcblxyXG5jbGFzcyBNYXplR2FtZSB7XHJcblxyXG4gICAgZ2FtZTogUGhhc2VyLkdhbWU7XHJcblxyXG4gICAgbWF6ZTogTWF6ZTtcclxuXHJcbiAgICB3YWxsTWFuYWdlcjogV2FsbE1hbmFnZXI7XHJcblxyXG4gICAgc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9ID0geyB4OiAxNiwgeTogOSB9O1xyXG5cclxuICAgIHVmbzogVWZvO1xyXG4gICAgdzogbnVtYmVyO1xyXG4gICAgaDogbnVtYmVyXHJcbiAgICBtYXhXOiBudW1iZXI7XHJcbiAgICBtYXhIOiBudW1iZXI7XHJcbiAgICBtaW5XOiBudW1iZXI7XHJcbiAgICBtaW5IOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLm1heFcgPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuICAgICAgICB0aGlzLm1heEggPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcclxuICAgICAgICB0aGlzLm1pbkggPSA5NjAgLyB0aGlzLm1heFcgKiB0aGlzLm1heEg7XHJcbiAgICAgICAgdGhpcy5taW5XID0gOTYwO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUgPSBuZXcgUGhhc2VyLkdhbWUodGhpcy5taW5XLCB0aGlzLm1pbkgsIFBoYXNlci5DQU5WQVMsICdjb250ZW50JyxcclxuICAgICAgICAgICAgeyBwcmVsb2FkOiB0aGlzLnByZWxvYWQuYmluZCh0aGlzKSwgY3JlYXRlOiB0aGlzLmNyZWF0ZS5iaW5kKHRoaXMpLCB1cGRhdGU6IHRoaXMudXBkYXRlLmJpbmQodGhpcyksIHJlbmRlcjogdGhpcy5yZW5kZXIuYmluZCh0aGlzKSB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXplID0gTWF6ZUdlbmVyYXRvci5nZXRJbnN0YW5jZSgpLmdlbmVyYXRlKHRoaXMuc2l6ZSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByZWxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ3VmbycsICdhc3NldHMvdWZvLnBuZycpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdnb2xkJywgJ2Fzc2V0cy9nb2xkLnBuZycpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdtYXplLWJnJywgJ2Fzc2V0cy9tYXplLWJnLnBuZycpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUubG9hZC5zcHJpdGVzaGVldCgnYnV0dG9udmVydGljYWwnLCAnYXNzZXRzL2J1dHRvbi12ZXJ0aWNhbC5wbmcnLCAzMiwgNjQpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KCdidXR0b25ob3Jpem9udGFsJywgJ2Fzc2V0cy9idXR0b24taG9yaXpvbnRhbC5wbmcnLCA2NCwgMzIpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KCdidXR0b25kaWFnb25hbCcsICdhc3NldHMvYnV0dG9uLWRpYWdvbmFsLnBuZycsIDQ4LCA0OCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5kZXZpY2UuZGVza3RvcCkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2V0R2FtZVNpemUodGhpcy5tYXhXLCB0aGlzLm1heEgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLncgPSB0aGlzLmdhbWUud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oID0gdGhpcy5nYW1lLmhlaWdodDtcclxuICAgICAgICBDb25zdHMudGlsZVNpemUgPSB0aGlzLncgLyAxNTtcclxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcclxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlKCkge1xyXG4gICAgICAgIHRoaXMud2FsbE1hbmFnZXIgPSBuZXcgV2FsbE1hbmFnZXIodGhpcy5nYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5QMkpTKTtcclxuICAgICAgICB0aGlzLmdhbWUud29ybGQuc2V0Qm91bmRzKDAsIDAsIHRoaXMuc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIsIHRoaXMuc2l6ZS55ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnJlc3RpdHV0aW9uID0gMC4wO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnNldEJvdW5kc1RvV29ybGQodHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLnVmbyA9IG5ldyBVZm8odGhpcy5nYW1lLCB0aGlzLndhbGxNYW5hZ2VyKTtcclxuICAgICAgICB0aGlzLndhbGxNYW5hZ2VyLmRyYXcodGhpcy5tYXplLCB0aGlzLnNpemUpO1xyXG4gICAgICAgIC8vIGlmICghdGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XHJcblxyXG4gICAgICAgIC8vICAgICAvLyB0aGlzLmJ1dHRvbnMoKTtcclxuICAgICAgICAvLyAgICAgLy8gdGhpcy5nYW1lLmlucHV0LnRvdWNoLigoZXZlbnQ6YW55KSA9PiB7XHJcbiAgICAgICAgLy8gICAgIC8vICAgICBjb25zb2xlLmxvZygnbScsZXZlbnQpXHJcbiAgICAgICAgLy8gICAgIC8vIH0pXHJcbiAgICAgICAgLy8gICAgIC8vIHRoaXMuZ2FtZS5pbnB1dC50b3VjaC5vblRvdWNoU3RhcnQoKGV2ZW50OmFueSkgPT4ge1xyXG4gICAgICAgIC8vICAgICAvLyAgICAgY29uc29sZS5sb2coJ3MnLGV2ZW50KVxyXG4gICAgICAgIC8vICAgICAvLyB9KVxyXG4gICAgICAgIC8vICAgICAvLyB0aGlzLmdhbWUuaW5wdXQudG91Y2gub25Ub3VjaEVuZCgoZXZlbnQ6YW55KSA9PiB7XHJcbiAgICAgICAgLy8gICAgIC8vICAgICBjb25zb2xlLmxvZygnZScsZXZlbnQpXHJcbiAgICAgICAgLy8gICAgIC8vIH0pXHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy51Zm8udXBkYXRlKHRoaXMubW92ZU9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVPYmplY3QgPSB7IGxlZnQ6IGZhbHNlLCByaWdodDogZmFsc2UsIHVwOiBmYWxzZSwgZG93bjogZmFsc2UgfVxyXG4gICAgYnV0dG9ucygpIHtcclxuICAgICAgICB2YXIgc2NhbGUgPSAyO1xyXG4gICAgICAgIHZhciBvZmZzZXRYID0gMDtcclxuICAgICAgICB2YXIgb2Zmc2V0WSA9IC00MDtcclxuICAgICAgICB2YXIgYnV0dG9ubGVmdCA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKG9mZnNldFggKyA4MCwgb2Zmc2V0WSArIHRoaXMuaCAtIDIwMCwgJ2J1dHRvbmhvcml6b250YWwnLCBudWxsLCB0aGlzLCAwLCAxLCAwLCAxKTtcclxuICAgICAgICBidXR0b25sZWZ0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIGJ1dHRvbmxlZnQuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5sZWZ0ID0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgYnV0dG9ubGVmdC5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QubGVmdCA9IGZhbHNlOyB9KTtcclxuICAgICAgICBidXR0b25sZWZ0LmV2ZW50cy5vbklucHV0RG93bi5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QubGVmdCA9IHRydWU7IH0pO1xyXG4gICAgICAgIGJ1dHRvbmxlZnQuZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QubGVmdCA9IGZhbHNlOyB9KTtcclxuICAgICAgICBidXR0b25sZWZ0LnNjYWxlLnNldFRvKDIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9ucmlnaHQgPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbihvZmZzZXRYICsgMjcyLCBvZmZzZXRZICsgdGhpcy5oIC0gMjAwLCAnYnV0dG9uaG9yaXpvbnRhbCcsIG51bGwsIHRoaXMsIDAsIDEsIDAsIDEpO1xyXG4gICAgICAgIGJ1dHRvbnJpZ2h0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIGJ1dHRvbnJpZ2h0LmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QucmlnaHQgPSB0cnVlOyB9KTtcclxuICAgICAgICBidXR0b25yaWdodC5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QucmlnaHQgPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgYnV0dG9ucmlnaHQuZXZlbnRzLm9uSW5wdXREb3duLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5yaWdodCA9IHRydWU7IH0pO1xyXG4gICAgICAgIGJ1dHRvbnJpZ2h0LmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LnJpZ2h0ID0gZmFsc2U7IH0pO1xyXG4gICAgICAgIGJ1dHRvbnJpZ2h0LnNjYWxlLnNldFRvKDIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uZG93biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKG9mZnNldFggKyAyMDgsIG9mZnNldFkgKyB0aGlzLmggLSAxMzYsICdidXR0b252ZXJ0aWNhbCcsIG51bGwsIHRoaXMsIDAsIDEsIDAsIDEpO1xyXG4gICAgICAgIGJ1dHRvbmRvd24uZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgYnV0dG9uZG93bi5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LmRvd24gPSB0cnVlOyB9KTtcclxuICAgICAgICBidXR0b25kb3duLmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5kb3duID0gZmFsc2U7IH0pO1xyXG4gICAgICAgIGJ1dHRvbmRvd24uZXZlbnRzLm9uSW5wdXREb3duLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5kb3duID0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgYnV0dG9uZG93bi5ldmVudHMub25JbnB1dFVwLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5kb3duID0gZmFsc2U7IH0pO1xyXG4gICAgICAgIGJ1dHRvbmRvd24uc2NhbGUuc2V0VG8oMik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b251cCA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKG9mZnNldFggKyAyMDgsIG9mZnNldFkgKyB0aGlzLmggLSAzMjYsICdidXR0b252ZXJ0aWNhbCcsIG51bGwsIHRoaXMsIDAsIDEsIDAsIDEpO1xyXG4gICAgICAgIGJ1dHRvbnVwLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIGJ1dHRvbnVwLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QudXAgPSB0cnVlOyB9KTtcclxuICAgICAgICBidXR0b251cC5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QudXAgPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgYnV0dG9udXAuZXZlbnRzLm9uSW5wdXREb3duLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC51cCA9IHRydWU7IH0pO1xyXG4gICAgICAgIGJ1dHRvbnVwLmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LnVwID0gZmFsc2U7IH0pO1xyXG4gICAgICAgIGJ1dHRvbnVwLnNjYWxlLnNldFRvKDIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uYm90dG9tbGVmdCA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKG9mZnNldFggKyAxMTIsIG9mZnNldFkgKyB0aGlzLmggLSAxMzYsICdidXR0b25kaWFnb25hbCcsIG51bGwsIHRoaXMsIDYsIDQsIDYsIDQpO1xyXG4gICAgICAgIGJ1dHRvbmJvdHRvbWxlZnQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgYnV0dG9uYm90dG9tbGVmdC5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LmxlZnQgPSB0cnVlOyB0aGlzLm1vdmVPYmplY3QuZG93biA9IHRydWU7IH0pO1xyXG4gICAgICAgIGJ1dHRvbmJvdHRvbWxlZnQuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LmxlZnQgPSBmYWxzZTsgdGhpcy5tb3ZlT2JqZWN0LmRvd24gPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgYnV0dG9uYm90dG9tbGVmdC5ldmVudHMub25JbnB1dERvd24uYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LmxlZnQgPSB0cnVlOyB0aGlzLm1vdmVPYmplY3QuZG93biA9IHRydWU7IH0pO1xyXG4gICAgICAgIGJ1dHRvbmJvdHRvbWxlZnQuZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QubGVmdCA9IGZhbHNlOyB0aGlzLm1vdmVPYmplY3QuZG93biA9IGZhbHNlOyB9KTtcclxuICAgICAgICBidXR0b25ib3R0b21sZWZ0LnNjYWxlLnNldFRvKDIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uYm90dG9tcmlnaHQgPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbihvZmZzZXRYICsgMjcyLCBvZmZzZXRZICsgdGhpcy5oIC0gMTM2LCAnYnV0dG9uZGlhZ29uYWwnLCBudWxsLCB0aGlzLCA3LCA1LCA3LCA1KTtcclxuICAgICAgICBidXR0b25ib3R0b21yaWdodC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICBidXR0b25ib3R0b21yaWdodC5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LnJpZ2h0ID0gdHJ1ZTsgdGhpcy5tb3ZlT2JqZWN0LmRvd24gPSB0cnVlOyB9KTtcclxuICAgICAgICBidXR0b25ib3R0b21yaWdodC5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QucmlnaHQgPSBmYWxzZTsgdGhpcy5tb3ZlT2JqZWN0LmRvd24gPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgYnV0dG9uYm90dG9tcmlnaHQuZXZlbnRzLm9uSW5wdXREb3duLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5yaWdodCA9IHRydWU7IHRoaXMubW92ZU9iamVjdC5kb3duID0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgYnV0dG9uYm90dG9tcmlnaHQuZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QucmlnaHQgPSBmYWxzZTsgdGhpcy5tb3ZlT2JqZWN0LmRvd24gPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgYnV0dG9uYm90dG9tcmlnaHQuc2NhbGUuc2V0VG8oMik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b251cHJpZ2h0ID0gdGhpcy5nYW1lLmFkZC5idXR0b24ob2Zmc2V0WCArIDI3Miwgb2Zmc2V0WSArIHRoaXMuaCAtIDI5NiwgJ2J1dHRvbmRpYWdvbmFsJywgbnVsbCwgdGhpcywgMywgMSwgMywgMSk7XHJcbiAgICAgICAgYnV0dG9udXByaWdodC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICBidXR0b251cHJpZ2h0LmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4geyB0aGlzLm1vdmVPYmplY3QucmlnaHQgPSB0cnVlOyB0aGlzLm1vdmVPYmplY3QudXAgPSB0cnVlOyB9KTtcclxuICAgICAgICBidXR0b251cHJpZ2h0LmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5yaWdodCA9IGZhbHNlOyB0aGlzLm1vdmVPYmplY3QudXAgPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgYnV0dG9udXByaWdodC5ldmVudHMub25JbnB1dERvd24uYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LnJpZ2h0ID0gdHJ1ZTsgdGhpcy5tb3ZlT2JqZWN0LnVwID0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgYnV0dG9udXByaWdodC5ldmVudHMub25JbnB1dFVwLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5yaWdodCA9IGZhbHNlOyB0aGlzLm1vdmVPYmplY3QudXAgPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgYnV0dG9udXByaWdodC5zY2FsZS5zZXRUbygyKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbnVwbGVmdCA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKG9mZnNldFggKyAxMTIsIG9mZnNldFkgKyB0aGlzLmggLSAyOTYsICdidXR0b25kaWFnb25hbCcsIG51bGwsIHRoaXMsIDIsIDAsIDIsIDApO1xyXG4gICAgICAgIGJ1dHRvbnVwbGVmdC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICBidXR0b251cGxlZnQuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5sZWZ0ID0gdHJ1ZTsgdGhpcy5tb3ZlT2JqZWN0LnVwID0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgYnV0dG9udXBsZWZ0LmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5sZWZ0ID0gZmFsc2U7IHRoaXMubW92ZU9iamVjdC51cCA9IGZhbHNlOyB9KTtcclxuICAgICAgICBidXR0b251cGxlZnQuZXZlbnRzLm9uSW5wdXREb3duLmFkZCgoKSA9PiB7IHRoaXMubW92ZU9iamVjdC5sZWZ0ID0gdHJ1ZTsgdGhpcy5tb3ZlT2JqZWN0LnVwID0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgYnV0dG9udXBsZWZ0LmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHsgdGhpcy5tb3ZlT2JqZWN0LmxlZnQgPSBmYWxzZTsgdGhpcy5tb3ZlT2JqZWN0LnVwID0gZmFsc2U7IH0pO1xyXG4gICAgICAgIGJ1dHRvbnVwbGVmdC5zY2FsZS5zZXRUbygyKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBsZXQgZ2FtZSA9IG5ldyBNYXplR2FtZSgpO1xyXG59IiwiaW1wb3J0IHsgTWF6ZSB9IGZyb20gJy4vbWF6ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWF6ZUdlbmVyYXRvciB7XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogTWF6ZUdlbmVyYXRvcjtcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xyXG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBNYXplR2VuZXJhdG9yKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2VcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZW5lcmF0ZShzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICAgIHZhciB4ID0gc2l6ZS54O1xyXG4gICAgdmFyIHkgPSBzaXplLnk7XHJcblxyXG4gICAgdmFyIHRvdGFsQ2VsbHMgPSB4ICogeTtcclxuICAgIHZhciBjZWxscyA9IG5ldyBBcnJheSgpO1xyXG4gICAgdmFyIHVudmlzID0gbmV3IEFycmF5KCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHk7IGkrKykge1xyXG4gICAgICBjZWxsc1tpXSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICB1bnZpc1tpXSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHg7IGorKykge1xyXG4gICAgICAgIGNlbGxzW2ldW2pdID0gWzAsIDAsIDAsIDBdO1xyXG4gICAgICAgIHVudmlzW2ldW2pdID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCBhIHJhbmRvbSBwb3NpdGlvbiB0byBzdGFydCBmcm9tXHJcbiAgICB2YXIgY3VycmVudENlbGwgPSBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogeSksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHgpXTtcclxuICAgIHZhciBwYXRoID0gW2N1cnJlbnRDZWxsXTtcclxuICAgIHVudmlzW2N1cnJlbnRDZWxsWzBdXVtjdXJyZW50Q2VsbFsxXV0gPSBmYWxzZTtcclxuICAgIHZhciB2aXNpdGVkID0gMTtcclxuXHJcbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIGF2YWlsYWJsZSBjZWxsIHBvc2l0aW9uc1xyXG4gICAgd2hpbGUgKHZpc2l0ZWQgPCB0b3RhbENlbGxzKSB7XHJcbiAgICAgIC8vIERldGVybWluZSBuZWlnaGJvcmluZyBjZWxsc1xyXG4gICAgICB2YXIgcG90ID0gW1tjdXJyZW50Q2VsbFswXSAtIDEsIGN1cnJlbnRDZWxsWzFdLCAwLCAyXSxcclxuICAgICAgW2N1cnJlbnRDZWxsWzBdLCBjdXJyZW50Q2VsbFsxXSArIDEsIDEsIDNdLFxyXG4gICAgICBbY3VycmVudENlbGxbMF0gKyAxLCBjdXJyZW50Q2VsbFsxXSwgMiwgMF0sXHJcbiAgICAgIFtjdXJyZW50Q2VsbFswXSwgY3VycmVudENlbGxbMV0gLSAxLCAzLCAxXV07XHJcbiAgICAgIHZhciBuZWlnaGJvcnMgPSBuZXcgQXJyYXkoKTtcclxuXHJcbiAgICAgIC8vIERldGVybWluZSBpZiBlYWNoIG5laWdoYm9yaW5nIGNlbGwgaXMgaW4gZ2FtZSBncmlkLCBhbmQgd2hldGhlciBpdCBoYXMgYWxyZWFkeSBiZWVuIGNoZWNrZWRcclxuICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCA0OyBsKyspIHtcclxuICAgICAgICBpZiAocG90W2xdWzBdID4gLTEgJiYgcG90W2xdWzBdIDwgeSAmJiBwb3RbbF1bMV0gPiAtMSAmJiBwb3RbbF1bMV0gPCB4ICYmIHVudmlzW3BvdFtsXVswXV1bcG90W2xdWzFdXSkgeyBuZWlnaGJvcnMucHVzaChwb3RbbF0pOyB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIGF0IGxlYXN0IG9uZSBhY3RpdmUgbmVpZ2hib3JpbmcgY2VsbCBoYXMgYmVlbiBmb3VuZFxyXG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCkge1xyXG4gICAgICAgIC8vIENob29zZSBvbmUgb2YgdGhlIG5laWdoYm9ycyBhdCByYW5kb21cclxuICAgICAgICB2YXIgbmV4dCA9IG5laWdoYm9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKV07XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgd2FsbCBiZXR3ZWVuIHRoZSBjdXJyZW50IGNlbGwgYW5kIHRoZSBjaG9zZW4gbmVpZ2hib3JpbmcgY2VsbFxyXG4gICAgICAgIGNlbGxzW2N1cnJlbnRDZWxsWzBdXVtjdXJyZW50Q2VsbFsxXV1bbmV4dFsyXV0gPSAxO1xyXG4gICAgICAgIGNlbGxzW25leHRbMF1dW25leHRbMV1dW25leHRbM11dID0gMTtcclxuXHJcbiAgICAgICAgLy8gTWFyayB0aGUgbmVpZ2hib3IgYXMgdmlzaXRlZCwgYW5kIHNldCBpdCBhcyB0aGUgY3VycmVudCBjZWxsXHJcbiAgICAgICAgdW52aXNbbmV4dFswXV1bbmV4dFsxXV0gPSBmYWxzZTtcclxuICAgICAgICB2aXNpdGVkKys7XHJcbiAgICAgICAgY3VycmVudENlbGwgPSBbbmV4dFswXSwgbmV4dFsxXV07XHJcbiAgICAgICAgcGF0aC5wdXNoKGN1cnJlbnRDZWxsKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBPdGhlcndpc2UgZ28gYmFjayB1cCBhIHN0ZXAgYW5kIGtlZXAgZ29pbmdcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY3VycmVudENlbGwgPSBwYXRoLnBvcCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMub3B0aW1pemVXYWxscyhjZWxscyk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb3B0aW1pemVXYWxscyhjZWxsczogbnVtYmVyW11bXVtdKTogTWF6ZSB7XHJcbiAgICB2YXIgaG9yaXpvbnRhbFdhbGxzOiB7IHdhbGw6IGJvb2xlYW4sIGNvdW50OiBudW1iZXIgfVtdW10gPSBbXTtcclxuXHJcbiAgICB2YXIgcHJlcGZvclZlcnQgPSBbXTtcclxuXHJcbiAgICBjZWxscy5mb3JFYWNoKChyb3csIHJvd0ksIHJvd3MpID0+IHtcclxuICAgICAgdmFyIG5leHRSb3cgPSByb3dzW3Jvd0kgKyAxXTtcclxuICAgICAgaG9yaXpvbnRhbFdhbGxzW3Jvd0ldID0gW107XHJcbiAgICAgIHZhciBsYXN0Um93VmFsdWU6IGJvb2xlYW4gPSBudWxsO1xyXG4gICAgICB2YXIgcm93Q2FjaGUgPSAwO1xyXG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY2VsbEksIGNlbGxzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFuZXh0Um93KSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBob3Jpem9udGFsV2FsbCA9ICEhY2VsbFsyXSB8fCAhIW5leHRSb3dbY2VsbEldWzBdO1xyXG4gICAgICAgIGlmIChsYXN0Um93VmFsdWUgPT09IGhvcml6b250YWxXYWxsIHx8IGxhc3RSb3dWYWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYgKGxhc3RSb3dWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxhc3RSb3dWYWx1ZSA9IGhvcml6b250YWxXYWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcm93Q2FjaGUrKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaG9yaXpvbnRhbFdhbGxzW3Jvd0ldLnB1c2goeyB3YWxsOiBsYXN0Um93VmFsdWUsIGNvdW50OiByb3dDYWNoZSB9KTtcclxuICAgICAgICAgIGxhc3RSb3dWYWx1ZSA9IGhvcml6b250YWxXYWxsO1xyXG4gICAgICAgICAgcm93Q2FjaGUgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0pXHJcbiAgICAgIGlmIChyb3dDYWNoZSA+IDApIHtcclxuICAgICAgICBob3Jpem9udGFsV2FsbHNbcm93SV0ucHVzaCh7IHdhbGw6IGxhc3RSb3dWYWx1ZSwgY291bnQ6IHJvd0NhY2hlIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgdmFyIHZlcnRpY2FsV2FsbHNUbXA6IGJvb2xlYW5bXVtdID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZlcnRpY2FsV2FsbHNUbXBbaV0gPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmVydGljYWxXYWxsc1RtcCA9IGNlbGxzLm1hcCgocm93LCByb3dJLCByb3dzKSA9PiB7XHJcbiAgICAgIHJldHVybiByb3cubWFwKChjZWxsLCBjZWxsSSwgY2VsbHMpID0+IHtcclxuICAgICAgICB2YXIgbmV4dENlbGwgPSBjZWxsc1tjZWxsSSArIDFdO1xyXG4gICAgICAgIHZhciB2ZXJ0aWNhbFdhbGwgPSAhIWNlbGxbMV0gfHwgKG5leHRDZWxsID8gISFuZXh0Q2VsbFszXSA6IGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdmVydGljYWxXYWxsXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIHZhciBjb2xzOiBhbnkgPSBbXVxyXG5cclxuICAgIGZvciAodmFyIHIgPSAwOyByIDwgdmVydGljYWxXYWxsc1RtcC5sZW5ndGg7IHIrKykge1xyXG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHZlcnRpY2FsV2FsbHNUbXBbcl0ubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSB2ZXJ0aWNhbFdhbGxzVG1wW3JdW2NdO1xyXG4gICAgICAgIGlmICghY29sc1tjXSkge1xyXG4gICAgICAgICAgY29sc1tjXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNvbHNbY11bcl0pIHtcclxuICAgICAgICAgIGNvbHNbY11bcl0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29sc1tjXVtyXSA9IHZhbHVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgdmVydGljYWxXYWxsczogeyB3YWxsOiBib29sZWFuLCBjb3VudDogbnVtYmVyIH1bXVtdID0gY29scy5tYXAoKGNvbDogYW55LCBjb2xJOiBhbnksIGNvbEE6IGFueSkgPT4ge1xyXG4gICAgICB2YXIgbGFzdFZhbHVlOiBib29sZWFuID0gbnVsbDtcclxuICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgdmFyIHJlczogeyB3YWxsOiBib29sZWFuLCBjb3VudDogbnVtYmVyIH1bXSA9IFtdO1xyXG4gICAgICBjb2wuZm9yRWFjaCgod2FsbDogYW55LCB3YWxsSTogYW55LCB3YWxsQTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGxhc3RWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICBsYXN0VmFsdWUgPSB3YWxsO1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHdhbGwgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICByZXMucHVzaCh7IHdhbGw6IGxhc3RWYWx1ZSwgY291bnQ6IGNvdW50IH0pO1xyXG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB3YWxsO1xyXG4gICAgICAgICAgICBjb3VudCA9IDE7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICAgIHJlcy5wdXNoKHsgd2FsbDogbGFzdFZhbHVlLCBjb3VudDogY291bnQgfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0pXHJcblxyXG4gICAgdmVydGljYWxXYWxscy5wb3AoKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIHsgY29sczogdmVydGljYWxXYWxscywgcm93czogaG9yaXpvbnRhbFdhbGxzIH07XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IFdhbGxNYW5hZ2VyIH0gZnJvbSAnLi93YWxsLW1hbmFnZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVmbyB7XHJcblxyXG4gIHBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH1cclxuICBzcHJpdGU6IFBoYXNlci5TcHJpdGU7XHJcbiAgY3Vyc29yczogUGhhc2VyLkN1cnNvcktleXM7XHJcbiAgZW1pdHRlcjogUGhhc2VyLlBhcnRpY2xlcy5BcmNhZGUuRW1pdHRlcjtcclxuICBwYXJ0aWNsZXNHcm91cDogUGhhc2VyLkdyb3VwO1xyXG5cclxuICBtb3ZlT2JqZWN0OiB7IGxlZnQ6IGJvb2xlYW4sIHJpZ2h0OiBib29sZWFuLCB1cDogYm9vbGVhbiwgZG93bjogYm9vbGVhbiB9XHJcbiAgdG91Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHByaXZhdGUgc2NhbGVUb1RpbGUgPSAwLjU7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSwgcHJpdmF0ZSB3YWxsTWFuYWdlcjogV2FsbE1hbmFnZXIpIHtcclxuXHJcbiAgICB0aGlzLnBhcnRpY2xlc0dyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xyXG5cclxuICAgIHRoaXMuc3ByaXRlID0gZ2FtZS5hZGQuc3ByaXRlKHRoaXMucG9zaXRpb24ueCArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIHRoaXMucG9zaXRpb24ueSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsICd1Zm8nKTtcclxuICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKENvbnN0cy50aWxlU2l6ZSAvIDUxMiAqIHRoaXMuc2NhbGVUb1RpbGUsIENvbnN0cy50aWxlU2l6ZSAvIDUxMiAqIHRoaXMuc2NhbGVUb1RpbGUpO1xyXG5cclxuICAgIGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUpO1xyXG5cclxuICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0Q2lyY2xlKENvbnN0cy50aWxlU2l6ZSAqIDAuNSAqIHRoaXMuc2NhbGVUb1RpbGUpO1xyXG4gICAgdGhpcy5jdXJzb3JzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XHJcblxyXG4gICAgdGhpcy5nYW1lLmNhbWVyYS5mb2xsb3codGhpcy5zcHJpdGUsIFBoYXNlci5DYW1lcmEuRk9MTE9XX0xPQ0tPTiwgMC4xLCAwLjEpO1xyXG5cclxuICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5sb29wKDMwMCwgdGhpcy5wYXJ0aWNsZXMuYmluZCh0aGlzKSwgdGhpcyk7XHJcbiAgICBpZiAoIXRoaXMuZ2FtZS5kZXZpY2UuZGVza3RvcCkge1xyXG4gICAgICB0aGlzLmdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKChlOiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUubW92ZVRvWFkodGhpcy5zcHJpdGUsIGUueCwgZS55LCB0aGlzLnNwZWVkKTtcclxuICAgICAgICB0aGlzLnRvdWNoaW5nID0gdHJ1ZTtcclxuICAgICAgfSwgdGhpcylcclxuXHJcbiAgICAgIHRoaXMuZ2FtZS5pbnB1dC5vblVwLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b3VjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGUucG9zaXRpb24ueCwgdGhpcy5zcHJpdGUucG9zaXRpb24ueSwgMCk7XHJcbiAgICAgIH0sIHRoaXMpXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMuY3Vyc29ycy5kb3duLm9uVXAuYWRkKCgpID0+IHtcclxuICAgIC8vICAgdGhpcy5zdG9wTW92aW5nKCk7XHJcbiAgICAvLyB9LCB0aGlzKVxyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZShtb3ZlT2JqZWN0OiB7IHVwOiBib29sZWFuLCBkb3duOiBib29sZWFuLCBsZWZ0OiBib29sZWFuLCByaWdodDogYm9vbGVhbiB9KSB7XHJcbiAgICBpZiAodGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XHJcbiAgICAgIHRoaXMubW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW92ZSgpIHtcclxuICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XHJcbiAgICB0aGlzLnNwcml0ZS5ib2R5LnNldFplcm9WZWxvY2l0eSgpO1xyXG4gICAgdmFyIHN0ZXAgPSBDb25zdHMudGlsZVNpemUgKiAyO1xyXG5cclxuICAgIGlmICghdGhpcy5tb3ZlT2JqZWN0KSB7XHJcbiAgICAgIHRoaXMuc3RvcE1vdmluZygpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdG9wTW92aW5nKCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLnNwcml0ZSwgdGhpcy53YWxsTWFuYWdlci53YWxscylcclxuICAgIC8vIGlmICghKSkge1xyXG5cclxuXHJcbiAgICBpZiAodGhpcy5jdXJzb3JzLmxlZnQuaXNEb3duKSB7XHJcbiAgICAgIHRoaXMubW92ZU9iamVjdC5sZWZ0ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY3Vyc29ycy5yaWdodC5pc0Rvd24pIHtcclxuICAgICAgdGhpcy5tb3ZlT2JqZWN0LnJpZ2h0ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jdXJzb3JzLnVwLmlzRG93bikge1xyXG4gICAgICB0aGlzLm1vdmVPYmplY3QudXAgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5jdXJzb3JzLmRvd24uaXNEb3duKSB7XHJcbiAgICAgIHRoaXMubW92ZU9iamVjdC5kb3duID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHRoaXMubWFrZU1vdmVGcm9tTW92ZU9iamVjdCgpO1xyXG4gIH1cclxuXHJcbiAgc3RvcE1vdmluZygpIHtcclxuICAgIHRoaXMubW92ZU9iamVjdCA9IHsgbGVmdDogZmFsc2UsIHJpZ2h0OiBmYWxzZSwgdXA6IGZhbHNlLCBkb3duOiBmYWxzZSB9XHJcbiAgfVxyXG5cclxuICBnZXQgc3BlZWQoKSB7XHJcbiAgICByZXR1cm4gQ29uc3RzLnRpbGVTaXplICogMjtcclxuICB9XHJcblxyXG4gIG1ha2VNb3ZlRnJvbU1vdmVPYmplY3QoKSB7XHJcbiAgICB2YXIgeCA9IDA7XHJcbiAgICB2YXIgeSA9IDA7XHJcblxyXG5cclxuICAgIGlmICh0aGlzLm1vdmVPYmplY3QubGVmdCkge1xyXG4gICAgICB4ID0gLTUwMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1vdmVPYmplY3QucmlnaHQpIHtcclxuICAgICAgeCA9ICs1MDA7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5tb3ZlT2JqZWN0LnVwKSB7XHJcbiAgICAgIHkgPSAtNTAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubW92ZU9iamVjdC5kb3duKSB7XHJcbiAgICAgIHkgPSArNTAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh4ICE9IDAgfHwgeSAhPSAwKSB7XHJcbiAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGUucG9zaXRpb24ueCArIHgsIHRoaXMuc3ByaXRlLnBvc2l0aW9uLnkgKyB5LCB0aGlzLnNwZWVkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGUucG9zaXRpb24ueCwgdGhpcy5zcHJpdGUucG9zaXRpb24ueSwgMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwYXJ0aWNsZXMoKSB7XHJcbiAgICBpZiAodGhpcy5jdXJzb3JzLmxlZnQuaXNEb3duIHx8IHRoaXMuY3Vyc29ycy5yaWdodC5pc0Rvd24gfHwgdGhpcy5jdXJzb3JzLnVwLmlzRG93biB8fCB0aGlzLmN1cnNvcnMuZG93bi5pc0Rvd24gfHwgdGhpcy50b3VjaGluZykge1xyXG5cclxuICAgICAgdmFyIHBhcnRpY2xlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMTAwMCwgMTAwMCwgJ2dvbGQnKTtcclxuICAgICAgcGFydGljbGUudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICBwYXJ0aWNsZS5zY2FsZS5zZXRUbyhDb25zdHMudGlsZVNpemUgLyAzMiAqIHRoaXMuc2NhbGVUb1RpbGUgKiAwLjMpO1xyXG5cclxuICAgICAgcGFydGljbGUuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICBwYXJ0aWNsZS54ID0gdGhpcy5zcHJpdGUueDtcclxuICAgICAgcGFydGljbGUueSA9IHRoaXMuc3ByaXRlLnk7XHJcbiAgICAgIHRoaXMucGFydGljbGVzR3JvdXAuYWRkKHBhcnRpY2xlKTtcclxuICAgICAgcGFydGljbGUudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIHZhciB0aW1lID0gNDUwMDA7XHJcbiAgICAgIHZhciB0d2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4ocGFydGljbGUpO1xyXG4gICAgICB2YXIgdHdlZW5TY2FsZSA9IHRoaXMuZ2FtZS5hZGQudHdlZW4ocGFydGljbGUuc2NhbGUpO1xyXG4gICAgICB0d2VlblNjYWxlLnRvKHsgeTogMCwgeDogMCB9LCB0aW1lIC0gMjAwMCwgUGhhc2VyLkVhc2luZy5MaW5lYXIuTm9uZSwgdHJ1ZSlcclxuXHJcbiAgICAgIHR3ZWVuLnRvKHsgYWxwaGE6IDAsIGFuZ2xlOiA4MDAwIH0sIHRpbWUsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUpO1xyXG4gICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoZTogYW55KSA9PiB7XHJcbiAgICAgICAgZS5kZXN0cm95KCk7XHJcbiAgICAgIH0sIHRoaXMpO1xyXG4gICAgICB0d2Vlbi5zdGFydCgpO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG59IiwiaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IE1hemUgfSBmcm9tICcuL21hemUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdhbGxNYW5hZ2VyIHtcclxuXHJcbiAgdGhpY2tuZXNzOiBudW1iZXIgPSAwLjE7XHJcblxyXG4gIHB1YmxpYyBiZzogUGhhc2VyLkdyb3VwO1xyXG4gIHB1YmxpYyB3YWxsczogUGhhc2VyLkdyb3VwO1xyXG4gIHBhbGV0dGUgPSB7XHJcbiAgICBjb2xvcjogMHhGRjAwMDAsXHJcbiAgICBvcGFjaXR5OiAwLjI3LFxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSkge1xyXG4gICAgdGhpcy5iZyA9IGdhbWUuYWRkLmdyb3VwKCk7XHJcbiAgICB0aGlzLndhbGxzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IG1hemVPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiA4O1xyXG4gIH1cclxuICBwdWJsaWMgZHJhdyhtYXplOiBNYXplLCBzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICAgIHZhciBvZmZzZXRGb3JCb3JkZXIgPSBDb25zdHMudGlsZVNpemUgKiB0aGlzLnRoaWNrbmVzcztcclxuICAgIHZhciBmbG9vciA9IHRoaXMuZ2FtZS5hZGQudGlsZVNwcml0ZShXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBzaXplLnggKiBDb25zdHMudGlsZVNpemUsIHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSwgJ21hemUtYmcnKTtcclxuICAgIHRoaXMuYmcuYWRkKGZsb29yKTtcclxuXHJcblxyXG4gICAgdGhpcy5hZGRCb3JkZXJzKHNpemUpO1xyXG5cclxuICAgIG1hemUuY29scy5mb3JFYWNoKChjb2wsIGNvbEluZGV4KSA9PiB7XHJcbiAgICAgIHZhciBvZmZzZXQgPSAwO1xyXG4gICAgICBjb2wuZm9yRWFjaCh3YWxsID0+IHtcclxuICAgICAgICBpZiAoIXdhbGwud2FsbCkge1xyXG4gICAgICAgICAgdGhpcy5hZGRXYWxsKHNpemUsXHJcbiAgICAgICAgICAgIChjb2xJbmRleCArIDEpICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICBvZmZzZXQgKiBDb25zdHMudGlsZVNpemUsXHJcbiAgICAgICAgICAgIHRoaXMudGhpY2tuZXNzICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICB3YWxsLmNvdW50ICogQ29uc3RzLnRpbGVTaXplICsgb2Zmc2V0Rm9yQm9yZGVyLFxyXG4gICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBvZmZzZXQgKz0gd2FsbC5jb3VudFxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICBtYXplLnJvd3MuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xyXG4gICAgICB2YXIgb2Zmc2V0ID0gMDtcclxuICAgICAgcm93LmZvckVhY2god2FsbCA9PiB7XHJcbiAgICAgICAgaWYgKCF3YWxsLndhbGwpIHtcclxuICAgICAgICAgIHRoaXMuYWRkV2FsbChzaXplLFxyXG4gICAgICAgICAgICBvZmZzZXQgKiBDb25zdHMudGlsZVNpemUsXHJcbiAgICAgICAgICAgIChyb3dJbmRleCArIDEpICogQ29uc3RzLnRpbGVTaXplLFxyXG4gICAgICAgICAgICB3YWxsLmNvdW50ICogQ29uc3RzLnRpbGVTaXplICsgb2Zmc2V0Rm9yQm9yZGVyLFxyXG4gICAgICAgICAgICB0aGlzLnRoaWNrbmVzcyAqIENvbnN0cy50aWxlU2l6ZSxcclxuICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgb2Zmc2V0ICs9IHdhbGwuY291bnRcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZEJvcmRlcnMoc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XHJcbiAgICB2YXIgY29sb3IgPSAweDAwMDAwMDtcclxuICAgIHZhciBvcGFjaXR5ID0gMTtcclxuICAgIHRoaXMuYWRkV2FsbChzaXplLCAwLCAwLCBzaXplLnggKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHRydWUsIGNvbG9yLCBvcGFjaXR5KTtcclxuICAgIHRoaXMuYWRkV2FsbChzaXplLCAwLCBzaXplLnkgKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBzaXplLnggKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHRydWUsIGNvbG9yLCBvcGFjaXR5KTtcclxuXHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgMCwgMCwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgMCwgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDEsIHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZFdhbGwoc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGlzQm9yZGVyOiBib29sZWFuLCBjb2xvcj86IG51bWJlciwgb3BhY2l0eT86IG51bWJlcikge1xyXG4gICAgaWYgKCFpc0JvcmRlcikge1xyXG4gICAgICB4ICs9IFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICAgIHkgKz0gV2FsbE1hbmFnZXIubWF6ZU9mZnNldDtcclxuICAgIH1cclxuICAgIHZhciBtYXhXaWR0aCA9IHNpemUueCAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICB2YXIgbWF4SGVpZ2h0ID0gc2l6ZS55ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldDtcclxuICAgIHZhciBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoQ29uc3RzLm1hcmdpbnMsIENvbnN0cy5tYXJnaW5zKTtcclxuICAgIGdyYXBoaWNzLmxpbmVTdHlsZSgyLCBjb2xvciB8fCBjb2xvciA9PT0gMCA/IGNvbG9yIDogdGhpcy5wYWxldHRlLmNvbG9yLCAxKTtcclxuICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvciB8fCBjb2xvciA9PT0gMCA/IGNvbG9yIDogdGhpcy5wYWxldHRlLmNvbG9yKTtcclxuICAgIGdyYXBoaWNzLmRyYXdSZWN0KFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB4ICsgd2lkdGggPiBtYXhXaWR0aCAmJiAhaXNCb3JkZXIgPyBtYXhXaWR0aCAtICh4KSA6IHdpZHRoLFxyXG4gICAgICB5ICsgaGVpZ2h0ID4gbWF4SGVpZ2h0ICYmICFpc0JvcmRlciA/IG1heEhlaWdodCAtICh5KSA6IGhlaWdodCxcclxuICAgICk7XHJcbiAgICBncmFwaGljcy5hbHBoYSA9IChvcGFjaXR5IHx8IG9wYWNpdHkgPT09IDAgPyBvcGFjaXR5IDogdGhpcy5wYWxldHRlLm9wYWNpdHkpO1xyXG4gICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xyXG4gICAgZ3JhcGhpY3MuYm91bmRzUGFkZGluZyA9IDA7XHJcbiAgICB2YXIgc2hhcGVTcHJpdGU6IFBoYXNlci5TcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4LCB5KTtcclxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLmVuYWJsZShzaGFwZVNwcml0ZSk7XHJcbiAgICBzaGFwZVNwcml0ZS5hZGRDaGlsZChncmFwaGljcyk7XHJcblxyXG4gICAgc2hhcGVTcHJpdGUuYm9keS5jbGVhclNoYXBlcygpO1xyXG4gICAgc2hhcGVTcHJpdGUuYm9keS5hZGRSZWN0YW5nbGUod2lkdGgsIGhlaWdodCwgd2lkdGggLyAyLjAsIGhlaWdodCAvIDIuMCk7XHJcbiAgICBzaGFwZVNwcml0ZS5ib2R5LmtpbmVtYXRpYyA9IHRydWU7XHJcbiAgICB0aGlzLndhbGxzLmFkZChzaGFwZVNwcml0ZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9mZnNldCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgKiB0aGlzLndhbGxUaGlja25lc3MoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgd2FsbFRoaWNrbmVzcygpIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiB0aGlzLnRoaWNrbmVzcztcclxuICB9XHJcblxyXG59Il19
