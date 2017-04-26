var Consts = (function () {
    function Consts() {
    }
    return Consts;
}());
Consts.margins = 0;
Consts.tileSize = 0;
// import { Maze } from './maze'
// import { MazeGenerator } from './maze-generator'
// import { TilePrinter } from './tile-printer'
var MazeGame = (function () {
    function MazeGame() {
        this.size = { x: 20, y: 20 };
        // addButton(field) {
        //     var buttonleft = this.game.add.button(offsetX+0, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        //     buttonleft.fixedToCamera = true;
        //     buttonleft.events.onInputOver.add(function () { left = true; });
        //     buttonleft.events.onInputOut.add(function () { left = false; });
        //     buttonleft.events.onInputDown.add(function () { left = true; });
        //     buttonleft.events.onInputUp.add(function () { left = false; });
        // }
        this.moveObject = { left: false, right: false, up: false, down: false };
        this.maxW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.maxH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.minH = 960 / this.maxW * this.maxH;
        this.minW = 960;
        this.game = new Phaser.Game(this.minW, this.minH, Phaser.CANVAS, 'content', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
        //
        this.maze = MazeGenerator.getInstance().generate(this.size);
        //console.log(JSON.stringify(this.maze.maze))
    }
    MazeGame.prototype.preload = function () {
        var t = new Date();
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
        Consts.tileSize = this.w / 15;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        var t2 = new Date();
        console.log('Preaload:' + (t2.getMilliseconds() - t.getMilliseconds()));
    };
    MazeGame.prototype.create = function () {
        var t = new Date();
        // this.game.time.advancedTiming = true;
        this.wallManager = new WallManager(this.game);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.world.setBounds(0, 0, this.size.x * Consts.tileSize + WallManager.mazeOffset * 2, this.size.y * Consts.tileSize + WallManager.mazeOffset * 2);
        this.game.physics.p2.restitution = 0.0;
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        // this.game.physics.p2.restitution = 1;
        // this.game.physics.p2.gravity.y = 1;
        this.ufo = new Ufo(this.game, this.wallManager);
        var t2 = new Date();
        console.log('Create:' + (t2.getMilliseconds() - t.getMilliseconds()));
        this.wallManager.draw(this.maze, this.size);
        if (!this.game.device.desktop) {
            // this.game.input.onDown.add(() => {
            //     this.game.scale.startFullScreen(false);
            // }, this);
            this.buttons();
        }
    };
    MazeGame.prototype.update = function () {
        this.ufo.update(this.moveObject);
    };
    MazeGame.prototype.render = function () {
        // this.wallManager.walls.forEach((c) => {
        //     this.game.debug.body(c);
        // }, this);
        // this.game.debug.body(this.ufo.sprite);
        // this.game.debug.text(this.game.time.fps.toString() || '--', 2, 15, "#ff0000");
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
        var t = new Date();
        var x = size.x;
        var y = size.y;
        // function newMaze(x, y) {
        // Establish variables and starting grid
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
        var t2 = new Date();
        console.log('Maze generation finished in:' + (t2.getMilliseconds() - t.getMilliseconds()));
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
var Ufo = (function () {
    function Ufo(game, wallManager) {
        this.game = game;
        this.wallManager = wallManager;
        this.position = { x: 0, y: 0 };
        this.scaleToTile = 0.5;
        this.particlesGroup = this.game.add.group();
        this.sprite = game.add.sprite(this.position.x + Consts.tileSize * 0.5, this.position.y + Consts.tileSize * 0.5, 'ufo');
        this.sprite.anchor.set(0.5);
        this.sprite.scale.setTo(Consts.tileSize / 512 * this.scaleToTile, Consts.tileSize / 512 * this.scaleToTile);
        // this.sprite.body = true;
        // this.game.physics.arcade.enable(this.sprite);
        game.physics.p2.enable(this.sprite);
        this.sprite.body.setCircle(Consts.tileSize * 0.5 * this.scaleToTile);
        this.cursors = game.input.keyboard.createCursorKeys();
        // this.sprite.body.debug = true;
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        this.game.time.events.loop(300, this.particles.bind(this), this);
        // var graphics = game.add.graphics(0, 0);
        // // graphics.lineStyle(2, 0xffd900, 1);
        // graphics.beginFill(0xFF0000, 1);
        // graphics.drawCircle(this.position.x + Consts.tileSize * 0.5, this.position.y + Consts.tileSize * 0.5, Consts.tileSize * 0.5);
    }
    Ufo.prototype.update = function (moveObject) {
        this.moveObject = moveObject;
        this.move(moveObject);
    };
    Ufo.prototype.move = function (moveObject) {
        this.sprite.body.setZeroRotation();
        this.sprite.body.setZeroVelocity();
        var step = Consts.tileSize * 2;
        if (this.cursors.left.isDown || moveObject.left) {
            this.sprite.body.moveLeft(step);
        }
        else if (this.cursors.right.isDown || moveObject.right) {
            this.sprite.body.moveRight(step);
        }
        if (this.cursors.up.isDown || moveObject.up) {
            this.sprite.body.moveUp(step);
        }
        else if (this.cursors.down.isDown || moveObject.down) {
            this.sprite.body.moveDown(step);
        }
    };
    Ufo.prototype.particles = function () {
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown ||
            (this.moveObject ? (this.moveObject.left || this.moveObject.right || this.moveObject.up || this.moveObject.down) : false)) {
            var particle = this.game.add.sprite(1000, 1000, 'gold');
            particle.visible = false;
            particle.scale.setTo(Consts.tileSize / 32 * this.scaleToTile * 0.3);
            particle.anchor.set(0.5);
            particle.x = this.sprite.x;
            particle.y = this.sprite.y;
            // particle.alpha = 0.5;
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
var WallManager = (function () {
    function WallManager(game) {
        this.game = game;
        this.thickness = 0.1;
        this.palette = {
            bord: 0x888888,
            bg: 0x222222,
            color: 0xFF0000,
            opacity: 0.27,
            startbg: 0x000000,
            endbg: 0xeeee00
        };
        this.bg = game.add.group();
        this.walls = game.add.group();
    }
    Object.defineProperty(WallManager, "mazeOffset", {
        get: function () {
            return Consts.tileSize / 15;
        },
        enumerable: true,
        configurable: true
    });
    WallManager.prototype.draw = function (maze, size) {
        var _this = this;
        var offsetForBorder = Consts.tileSize * this.thickness;
        var floor = this.game.add.tileSprite(WallManager.mazeOffset, WallManager.mazeOffset, size.x * Consts.tileSize, size.y * Consts.tileSize, 'maze-bg');
        this.bg.add(floor);
        this.addBorders(size);
        maze.cols.forEach(function (col, colIndex) {
            var offset = 0;
            col.forEach(function (wall) {
                if (!wall.wall) {
                    _this.addWall(size, (colIndex + 1) * Consts.tileSize, offset * Consts.tileSize, _this.thickness * Consts.tileSize, wall.count * Consts.tileSize + offsetForBorder, false);
                }
                offset += wall.count;
            });
        });
        maze.rows.forEach(function (row, rowIndex) {
            var offset = 0;
            row.forEach(function (wall) {
                if (!wall.wall) {
                    _this.addWall(size, offset * Consts.tileSize, (rowIndex + 1) * Consts.tileSize, wall.count * Consts.tileSize + offsetForBorder, _this.thickness * Consts.tileSize, false);
                }
                offset += wall.count;
            });
        });
    };
    WallManager.prototype.addBorders = function (size) {
        var color = 0x000000;
        var opacity = 1;
        this.addWall(size, 0, 0, size.x * Consts.tileSize + WallManager.mazeOffset * 2, WallManager.mazeOffset * 1, true, color, opacity);
        this.addWall(size, 0, size.y * Consts.tileSize + WallManager.mazeOffset, size.x * Consts.tileSize + WallManager.mazeOffset * 2, WallManager.mazeOffset * 1, true, color, opacity);
        this.addWall(size, 0, 0, WallManager.mazeOffset * 1, size.y * Consts.tileSize + WallManager.mazeOffset * 2, true, color, opacity);
        this.addWall(size, size.x * Consts.tileSize + WallManager.mazeOffset, 0, WallManager.mazeOffset * 1, size.y * Consts.tileSize + WallManager.mazeOffset * 2, true, color, opacity);
    };
    WallManager.prototype.addWall = function (size, x, y, width, height, isBorder, color, opacity) {
        if (!isBorder) {
            x += WallManager.mazeOffset;
            y += WallManager.mazeOffset;
        }
        var maxWidth = size.x * Consts.tileSize + WallManager.mazeOffset;
        var maxHeight = size.y * Consts.tileSize + WallManager.mazeOffset;
        var graphics = this.game.add.graphics(Consts.margins, Consts.margins);
        graphics.lineStyle(2, color || color === 0 ? color : this.palette.color, 1);
        graphics.beginFill(color || color === 0 ? color : this.palette.color);
        graphics.drawRect(0, 0, x + width > maxWidth && !isBorder ? maxWidth - (x) : width, y + height > maxHeight && !isBorder ? maxHeight - (y) : height);
        // if (!isBorder) {
        graphics.alpha = (opacity || opacity === 0 ? opacity : this.palette.opacity);
        // }
        graphics.endFill();
        graphics.boundsPadding = 0;
        var shapeSprite = this.game.add.sprite(x, y);
        this.game.physics.p2.enable(shapeSprite, false, true);
        shapeSprite.addChild(graphics);
        shapeSprite.body.clearShapes();
        shapeSprite.body.addRectangle(width, height, width / 2.0, height / 2.0);
        // shapeSprite.body.debug = true;
        shapeSprite.body.kinematic = true;
        this.walls.add(shapeSprite);
    };
    // private drawFloor(x: number, y: number, finishPosition: { x: number, y: number }) {
    //   var graphics: Phaser.Graphics = this.game.add.graphics(Consts.margins, Consts.margins);
    //   var bg = this.colors.bg;
    //   if (x == 0 && y == 0) {
    //     bg = this.colors.startbg;
    //     graphics.endFill();
    //     this.bg.add(graphics);
    //   }
    //   if (x == finishPosition.x - 1 && y == finishPosition.y - 1) {
    //     bg = this.colors.endbg;
    //   }
    //   graphics.lineStyle(1, this.colors.bord, 1);
    //   graphics.beginFill(bg);
    //   graphics.drawRect(
    //     x * Consts.tileSize,// - this.offset(x),
    //     y * Consts.tileSize,// - this.offset(y),
    //     Consts.tileSize,
    //     Consts.tileSize
    //   );
    //   graphics.endFill();
    //   this.bg.add(graphics);
    // }
    WallManager.prototype.offset = function (value) {
        return value * this.wallThickness();
    };
    WallManager.prototype.wallThickness = function () {
        return Consts.tileSize * this.thickness;
    };
    return WallManager;
}());
