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
},{"./collisions":1,"./const":2,"./gem":4,"./wall-manager":9}],4:[function(require,module,exports){
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
var wall_manager_1 = require("./wall-manager");
var pacman_1 = require("./pacman");
var gem_manager_1 = require("./gem-manager");
var collisions_1 = require("./collisions");
var mob_manager_1 = require("./mob-manager");
var MazeGame = (function () {
    function MazeGame() {
        var _this = this;
        this.size = { x: 10, y: 10 };
        this.moveObject = { left: false, right: false, up: false, down: false };
        this.maxW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.maxH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.minH = 960 / this.maxW * this.maxH;
        this.minW = 960;
        this.game = new Phaser.Game(this.minW, this.minH, Phaser.CANVAS, 'content');
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
                            _this.textTimer.text = 'Game starts in ' + _this.time + ' seconds';
                        }
                    }
                }, 1000);
                _this.textTimer = _this.game.add.text(_this.w / 2.0, _this.h / 2.0, 'Game starts in ' + _this.time + ' seconds', '');
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
                _this.game.input.keyboard.onDownCallback = function () {
                    if (!started) {
                        _this.game.state.start('startState');
                    }
                    started = true;
                };
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
        this.wallManager.draw(this.size);
        new gem_manager_1.GemManager(this.game, this.size).start();
        this.mobManager = new mob_manager_1.MobManager(this.game, this.pacman, this.size); //
        this.mobManager.start();
        console.log(this.w, this.h);
        this.pointsText = this.game.add.text(const_1.Consts.tileSize / 8, const_1.Consts.tileSize / 8, this.pacman.getPoints() + '', '');
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
        this.pointsText.setText(this.pacman.getPoints() + '');
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
},{"./collisions":1,"./const":2,"./gem-manager":3,"./mob-manager":6,"./pacman":8,"./wall-manager":9}],6:[function(require,module,exports){
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
},{"./collisions":1,"./const":2,"./mob":7,"./wall-manager":9}],7:[function(require,module,exports){
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
},{"./collisions":1,"./const":2}],8:[function(require,module,exports){
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
},{"./const":2,"./wall-manager":9}],9:[function(require,module,exports){
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
    WallManager.prototype.draw = function (size) {
        var offsetForBorder = const_1.Consts.tileSize * this.thickness;
        var floor = this.game.add.tileSprite(WallManager.mazeOffset, WallManager.mazeOffset, size.x * const_1.Consts.tileSize, size.y * const_1.Consts.tileSize, 'maze-bg');
        this.bg.add(floor);
        this.addBorders(size);
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
        shapeSprite.body.kinematic = true;
        collisions_1.Collisions.getInstance().add('wall', new wall_1.Wall(shapeSprite, this.game));
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
},{"./collisions":1,"./const":2,"./wall":10}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2NvbGxpc2lvbnMudHMiLCJzcmMvYXBwL2NvbnN0LnRzIiwic3JjL2FwcC9nZW0tbWFuYWdlci50cyIsInNyYy9hcHAvZ2VtLnRzIiwic3JjL2FwcC9tYXplLWdhbWUudHMiLCJzcmMvYXBwL21vYi1tYW5hZ2VyLnRzIiwic3JjL2FwcC9tb2IudHMiLCJzcmMvYXBwL3BhY21hbi50cyIsInNyYy9hcHAvd2FsbC1tYW5hZ2VyLnRzIiwic3JjL2FwcC93YWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNHQTtJQWlERTtJQUVBLENBQUM7SUF4Q0QsNkRBQTZEO0lBQzdELDRCQUFPLEdBQVAsVUFBUSxJQUFpQixFQUFFLE1BQWM7UUFBekMsaUJBbUNDO1FBbENDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN4RSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN0RSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFFdEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDaEUsaUVBQWlFO1FBRWpFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsVUFBQyxDQUFNLEVBQUUsQ0FBTTtZQUNsRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25CLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVULE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsVUFBQyxDQUFNLEVBQUUsQ0FBTTtZQUNsRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25CLEtBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDNUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRVQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxVQUFDLENBQU0sRUFBRSxDQUFNO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNuQixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNILENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVULE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFNLEVBQUUsQ0FBTTtZQUMzRSw0QkFBNEI7UUFDOUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRVgsQ0FBQztJQU1hLHNCQUFXLEdBQXpCO1FBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDOUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFTSx3QkFBRyxHQUFWLFVBQVcsS0FBYSxFQUFFLEdBQXdCO1FBQ2hELDhCQUE4QjtRQUM5QixNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxLQUFLO2dCQUNSLGtCQUFrQjtnQkFDbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQzNELEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQ2xHLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLEtBQUssQ0FBQTtZQUNQLEtBQUssTUFBTTtnQkFDVCxrQkFBa0I7Z0JBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUNsRyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxLQUFLLENBQUE7WUFDUCxLQUFLLEtBQUssQ0FBQztZQUNYLEtBQUssTUFBTTtnQkFDVCxrQkFBa0I7Z0JBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQ3pFLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFDekUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDekIsS0FBSyxDQUFBO1lBQ1AsS0FBSyxNQUFNO2dCQUNULGtCQUFrQjtnQkFDbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQzNELEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUNoRCxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixLQUFLLENBQUE7UUFDVCxDQUFDO1FBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLENBQU0sRUFBRSxDQUFNO1FBRTVFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFTyxnQ0FBVyxHQUFuQixVQUFvQixDQUFNLEVBQUUsQ0FBTTtRQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVhLDBCQUFlLEdBQTdCLFVBQThCLENBQU0sRUFBRSxDQUFNO1FBQzFDLElBQUksUUFBUSxHQUFHLFVBQVUsR0FBVztZQUNsQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEtBQUssS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ3hCLEtBQUssS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEtBQUssTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdkIsQ0FBQztRQUNILENBQUMsQ0FBQTtRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDWixDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVILGlCQUFDO0FBQUQsQ0E5SEEsQUE4SEMsSUFBQTtBQTlIWSxnQ0FBVTs7OztBQ0h2QjtJQUFBO0lBR0EsQ0FBQztJQUFELGFBQUM7QUFBRCxDQUhBLEFBR0M7QUFGZSxjQUFPLEdBQVcsQ0FBQyxDQUFDO0FBQ3BCLGVBQVEsR0FBVyxDQUFDLENBQUM7QUFGeEIsd0JBQU07Ozs7QUNBbkIsd0VBQXdFO0FBQ3hFLCtDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsMkNBQTBDO0FBQzFDLDZCQUE0QjtBQUU1QjtJQUlFLG9CQUFvQixJQUFpQixFQUFVLElBQThCO1FBQXpELFNBQUksR0FBSixJQUFJLENBQWE7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUEwQjtRQUMzRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELDBCQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELDZCQUFRLEdBQVI7UUFDRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQztRQUN0TSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsY0FBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM5QyxnQ0FBZ0M7UUFDaEMsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUUsSUFBSSxTQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRW5GLENBQUM7SUFFSCxpQkFBQztBQUFELENBL0JBLEFBK0JDLElBQUE7QUEvQlksZ0NBQVU7Ozs7QUNKdkI7SUFNRSxhQUFZLE1BQXFCLEVBQVUsSUFBaUI7UUFBakIsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBTk0scUJBQU8sR0FBZCxVQUFlLENBQU0sRUFBRSxDQUFNO1FBQzNCLE1BQU0sQ0FBQztJQUNULENBQUM7SUFLSCxVQUFDO0FBQUQsQ0FUQSxBQVNDLElBQUE7QUFUWSxrQkFBRzs7OztBQ0ZoQix3RUFBd0U7QUFDeEUsaUNBQWlDO0FBRWpDLCtDQUE2QztBQUM3QyxtQ0FBa0M7QUFDbEMsNkNBQTJDO0FBQzNDLDJDQUEwQztBQUMxQyw2Q0FBMkM7QUFFM0M7SUFxQkk7UUFBQSxpQkFnSEM7UUE1SEQsU0FBSSxHQUE2QixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBMk1sRCxlQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7UUE5TDlELElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNuRyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDdEcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBRWhCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7WUFFOUIsT0FBTyxFQUFFO2dCQUNMLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEQsQ0FBQztnQkFDRCxLQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUN6QixLQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMxQixjQUFNLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUM5QixLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7Z0JBQ3pELEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztnQkFDN0MsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1lBQy9DLENBQUM7WUFDRCxNQUFNLEVBQUU7Z0JBQ0osS0FBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ2QsS0FBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7b0JBQzVCLEtBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO29CQUNmLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO29CQUNwQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ25DLGFBQWEsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3JDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7d0JBQ3JFLENBQUM7b0JBQ0wsQ0FBQztnQkFHTCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRVQsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsS0FBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRWhILGVBQWU7Z0JBQ2YsS0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7Z0JBRWhDLGFBQWE7Z0JBQ2IsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDO2dCQUNwQyxLQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQzdCLEtBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztnQkFFbkMsNkJBQTZCO2dCQUM3QixLQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQ2xDLEtBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztnQkFDbkMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBR3BDLENBQUM7U0FFSixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRTtZQUNqQyxNQUFNLEVBQUU7Z0JBQ0osSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEtBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLFVBQVUsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVwRyxlQUFlO2dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztnQkFFdEIsYUFBYTtnQkFDYixJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2dCQUV6Qiw2QkFBNkI7Z0JBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO2dCQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBR3RCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxLQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsMkJBQTJCLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRWhHLGVBQWU7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO2dCQUV0QixhQUFhO2dCQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDO2dCQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7Z0JBRXpCLDZCQUE2QjtnQkFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDdEIsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFFO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1gsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN4QyxDQUFDO29CQUNELE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUMsQ0FBQztnQkFDRixLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO29CQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1gsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN4QyxDQUFDO29CQUNELE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUMsRUFBRSxLQUFJLENBQUMsQ0FBQTtZQUNaLENBQUM7U0FFSixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBR2QsQ0FBQztJQUVELDBCQUFPLEdBQVA7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBR3BELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSw0QkFBNEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLDhCQUE4QixFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsNEJBQTRCLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXZGLENBQUM7SUFJRCx5QkFBTSxHQUFOO1FBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLDBCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRywwQkFBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRywwQkFBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4SixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBRWxELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEQsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFekQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpDLElBQUksd0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUM1QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksd0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsRUFBRTtRQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRXZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsY0FBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0csSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLGVBQWU7UUFDZixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBRWhDLGFBQWE7UUFDYixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBRXBDLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCx5QkFBTSxHQUFOO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQseUZBQXlGO0lBRTdGLENBQUM7SUFFRCx5QkFBTSxHQUFOO0lBQ0EsQ0FBQztJQUVELDZCQUFVLEdBQVY7UUFDSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDbEIsQ0FBQztJQUVELDRCQUFTLEdBQVQ7UUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDakIsQ0FBQztJQUNELGdDQUFhLEdBQWI7UUFDSSxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBSUwsZUFBQztBQUFELENBdE5BLEFBc05DLElBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHO0lBQ1osSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUM5QixDQUFDLENBQUE7Ozs7QUNuT0Qsd0VBQXdFO0FBQ3hFLCtDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsMkNBQTBDO0FBRTFDLDZCQUE0QjtBQUU1QjtJQUlFLG9CQUFvQixJQUFpQixFQUFVLE1BQWMsRUFBVSxJQUE4QjtRQUFqRixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFNBQUksR0FBSixJQUFJLENBQTBCO1FBRDlGLGtCQUFhLEdBQVUsRUFBRSxDQUFDO0lBRWpDLENBQUM7SUFFRCwwQkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELDZCQUFRLEdBQVI7UUFBQSxpQkEwQ0M7UUF4Q0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUNsQixDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRywwQkFBVyxDQUFDLFVBQVUsRUFDcEUsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUV4RSxPQUFPLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNsQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQ2xCLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLDBCQUFXLENBQUMsVUFBVSxFQUNwRSxDQUFDLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRywwQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEwsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLEdBQUcsR0FBRyxFQUFFLGNBQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQU07WUFDMUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ1osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLDBCQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLDBCQUFXLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JMLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBRSxjQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUUzRSxLQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLGdDQUFnQztZQUNoQyxJQUFJLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLHVCQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV6QyxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUvQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDVCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFaEIsQ0FBQztJQUVELDJCQUFNLEdBQU47UUFBQSxpQkFPQztRQU5DLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBUTtZQUNsQyxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3hFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUdWLENBQUM7SUFHSCxpQkFBQztBQUFELENBbkVBLEFBbUVDLElBQUE7QUFuRVksZ0NBQVU7Ozs7QUNQdkIsd0VBQXdFO0FBQ3hFLGlDQUFpQztBQUNqQywyQ0FBMEM7QUFHMUM7SUFHRSxhQUFZLE1BQXFCLEVBQVUsSUFBaUI7UUFBakIsU0FBSSxHQUFKLElBQUksQ0FBYTtRQURwRCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBRWhDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBR00sa0JBQUksR0FBWDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsY0FBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdkIsQ0FBQztJQUNILENBQUM7SUFFTSxxQkFBTyxHQUFkLFVBQWUsQ0FBTSxFQUFFLENBQU07UUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTix1QkFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRU8sNEJBQWMsR0FBdEI7UUFDRSxJQUFJLFFBQVEsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFL0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQzNHLENBQUM7SUFFTyx3QkFBVSxHQUFsQixVQUFtQixLQUFhO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2hELENBQUM7SUFFSCxVQUFDO0FBQUQsQ0ExQ0EsQUEwQ0MsSUFBQTtBQTFDWSxrQkFBRzs7OztBQ0xoQix3RUFBd0U7QUFDeEUsaUNBQWlDO0FBQ2pDLCtDQUE2QztBQUU3QztJQWFFLGdCQUFvQixJQUFpQixFQUFVLFdBQXdCO1FBQXZFLGlCQThCQztRQTlCbUIsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBWHZFLGFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFBO1FBTWpCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFHM0IsYUFBUSxHQUFZLEtBQUssQ0FBQTtRQUNqQixnQkFBVyxHQUFHLEdBQUcsQ0FBQztRQXNJMUIsa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFuSTdCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFNUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxjQUFNLENBQUMsUUFBUSxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLDBCQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsMEJBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN00sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUxRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxzQ0FBc0M7UUFFdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0s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QUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEdBQUcsR0FBRyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN4RSxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFbEMsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksV0FBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUV6RSxDQUFDO0lBRU8sNEJBQU0sR0FBZCxVQUFlLEtBQWE7UUFDMUIsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVPLG1DQUFhLEdBQXJCO1FBQ0UsTUFBTSxDQUFDLGNBQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQyxDQUFDO0lBRUgsa0JBQUM7QUFBRCxDQS9FQSxBQStFQyxJQUFBO0FBL0VZLGtDQUFXOzs7O0FDSnhCO0lBTUUsY0FBWSxNQUFxQixFQUFVLElBQWlCO1FBQWpCLFNBQUksR0FBSixJQUFJLENBQWE7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQU5NLHNCQUFPLEdBQWQsVUFBZSxDQUFNLEVBQUUsQ0FBTTtRQUMzQixNQUFNLENBQUM7SUFDVCxDQUFDO0lBS0gsV0FBQztBQUFELENBVEEsQUFTQyxJQUFBO0FBVFksb0JBQUkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9waGFzZXIvdHlwZXNjcmlwdC9waGFzZXIuZC50c1wiLz5cclxuaW1wb3J0IHsgUGFjbWFuIH0gZnJvbSAnLi9wYWNtYW4nO1xyXG5pbXBvcnQge1dpdGhTcHJpdGVJbnRlcmZhY2V9IGZyb20gJy4vd2l0aC1zcHJpdGUtaW50ZXJmYWNlJztcclxuZXhwb3J0IGNsYXNzIENvbGxpc2lvbnMge1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IENvbGxpc2lvbnM7XHJcbiAgcHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZTtcclxuICBwcml2YXRlIHBsYXllcjogUGFjbWFuO1xyXG5cclxuICBwcml2YXRlIHBsYXllckNvbGxpc2lvbkdyb3VwOiBQaGFzZXIuUGh5c2ljcy5QMi5Db2xsaXNpb25Hcm91cDtcclxuICBwcml2YXRlIGdlbXNDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXA7XHJcbiAgcHJpdmF0ZSBnb2xkQ29sbGlzaW9uR3JvdXA6IFBoYXNlci5QaHlzaWNzLlAyLkNvbGxpc2lvbkdyb3VwO1xyXG4gIHByaXZhdGUgbW9ic0NvbGxpc2lvbkdyb3VwOiBQaGFzZXIuUGh5c2ljcy5QMi5Db2xsaXNpb25Hcm91cDtcclxuICBwcml2YXRlIHdhbGxDb2xsaXNpb25Hcm91cDogUGhhc2VyLlBoeXNpY3MuUDIuQ29sbGlzaW9uR3JvdXA7XHJcbiAgLy8gLCBnZW1zOlBoYXNlci5Hcm91cCwgZ29sZHM6UGhhc2VyLkdyb3VwLCBtb2JzOlBoYXNlci5Hcm91cFxyXG4gIHByZXBhcmUoZ2FtZTogUGhhc2VyLkdhbWUsIHBsYXllcjogUGFjbWFuKSB7XHJcbiAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLnBsYXllckNvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMuZ2Vtc0NvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMubW9ic0NvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuICAgIHRoaXMud2FsbENvbGxpc2lvbkdyb3VwID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5wbGF5ZXJDb2xsaXNpb25Hcm91cCk7XHJcbiAgICAvLyBwbGF5ZXIuc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5nb2xkQ29sbGlzaW9uR3JvdXApO1xyXG5cclxuICAgIHBsYXllci5zcHJpdGUuYm9keS5jb2xsaWRlcyh0aGlzLmdlbXNDb2xsaXNpb25Hcm91cCwgKGE6IGFueSwgYjogYW55KSA9PiB7XHJcbiAgICAgIGIuc3ByaXRlLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5wbGF5ZXIuYWRkUG9pbnRzKDEwMCk7XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy5nb2xkQ29sbGlzaW9uR3JvdXAsIChhOiBhbnksIGI6IGFueSkgPT4ge1xyXG4gICAgICBiLnNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgIHRoaXMucGxheWVyLmtpbGxpbmdNb2RlKCk7XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy5tb2JzQ29sbGlzaW9uR3JvdXAsIChhOiBhbnksIGI6IGFueSkgPT4ge1xyXG4gICAgICBpZiAocGxheWVyLmlzS2lsbGluZ01vZGUpIHtcclxuICAgICAgICBiLnNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgICAgcGxheWVyLmFkZFBvaW50cygxNTApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZU92ZXJTdGF0ZScpO1xyXG4gICAgICB9XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgICBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy53YWxsQ29sbGlzaW9uR3JvdXAsIGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnd2FsbCcsIGEsIGIpXHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ29sbGlzaW9ucyB7XHJcbiAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IHRoaXMoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGQoZ3JvdXA6IHN0cmluZywgb2JqOiBXaXRoU3ByaXRlSW50ZXJmYWNlKTogdm9pZCB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnYWRkZWQnLCBncm91cClcclxuICAgIHN3aXRjaCAoZ3JvdXApIHtcclxuICAgICAgY2FzZSAnZ2VtJzpcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygxKTtcclxuICAgICAgICBvYmouc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5nZW1zQ29sbGlzaW9uR3JvdXApO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5jb2xsaWRlcyhbdGhpcy5tb2JzQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwLCB0aGlzLmdlbXNDb2xsaXNpb25Hcm91cF0sXHJcbiAgICAgICAgICBDb2xsaXNpb25zLmNvbGxpc2lvblNvbHZlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdnb2xkJzpcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygyKTtcclxuICAgICAgICBvYmouc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5nb2xkQ29sbGlzaW9uR3JvdXApO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5jb2xsaWRlcyhbdGhpcy5tb2JzQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ29sZENvbGxpc2lvbkdyb3VwLCB0aGlzLmdlbXNDb2xsaXNpb25Hcm91cF0sXHJcbiAgICAgICAgICBDb2xsaXNpb25zLmNvbGxpc2lvblNvbHZlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdtb2InOlxyXG4gICAgICBjYXNlICdzaWNrJzpcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygzKTtcclxuICAgICAgICBvYmouc3ByaXRlLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5tb2JzQ29sbGlzaW9uR3JvdXApO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5jb2xsaWRlcyhbdGhpcy5nb2xkQ29sbGlzaW9uR3JvdXAsIHRoaXMuZ2Vtc0NvbGxpc2lvbkdyb3VwXSxcclxuICAgICAgICAgIENvbGxpc2lvbnMuY29sbGlzaW9uU29sdmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIG9iai5zcHJpdGUuYm9keS5jb2xsaWRlcyhbdGhpcy5tb2JzQ29sbGlzaW9uR3JvdXAsIHRoaXMud2FsbENvbGxpc2lvbkdyb3VwXSxcclxuICAgICAgICAgIG9iai5jb2xsaWRlLmJpbmQob2JqKSk7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnd2FsbCc6XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coNCk7XHJcbiAgICAgICAgb2JqLnNwcml0ZS5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMud2FsbENvbGxpc2lvbkdyb3VwKTtcclxuICAgICAgICBvYmouc3ByaXRlLmJvZHkuY29sbGlkZXMoW3RoaXMubW9ic0NvbGxpc2lvbkdyb3VwXSxcclxuICAgICAgICAgIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuXHJcbiAgICBvYmouc3ByaXRlLmJvZHkuY29sbGlkZXModGhpcy5wbGF5ZXJDb2xsaXNpb25Hcm91cCwgZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XHJcblxyXG4gICAgfSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1vYkJvdW5jaW5nKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnbW9iIGJvdW5jZScsIGEsIGIpXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGNvbGxpc2lvblNvbHZlcihhOiBhbnksIGI6IGFueSkge1xyXG4gICAgdmFyIGdldFZhbHVlID0gZnVuY3Rpb24gKGtleTogc3RyaW5nKSB7XHJcbiAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgY2FzZSAndWZvJzogcmV0dXJuIDEwMDA7XHJcbiAgICAgICAgY2FzZSAnbW9iJzogcmV0dXJuIDI7XHJcbiAgICAgICAgY2FzZSAnZ29sZCc6IHJldHVybiAwO1xyXG4gICAgICAgIGNhc2UgJ2dlbSc6IHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIWEuc3ByaXRlIHx8ICFiLnNwcml0ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoYS5zcHJpdGUua2V5ID09IGIuc3ByaXRlLmtleSkge1xyXG4gICAgICBhLnNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgYXYgPSBnZXRWYWx1ZShhLnNwcml0ZS5rZXkpO1xyXG4gICAgICB2YXIgYnYgPSBnZXRWYWx1ZShiLnNwcml0ZS5rZXkpO1xyXG4gICAgICBpZiAoYXYgPiBidikge1xyXG4gICAgICAgIGIuc3ByaXRlLmRlc3Ryb3koKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhLnNwcml0ZS5kZXN0cm95KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG59IiwiZXhwb3J0IGNsYXNzIENvbnN0cyB7XHJcbiAgcHVibGljIHN0YXRpYyBtYXJnaW5zOiBudW1iZXIgPSAwO1xyXG4gIHB1YmxpYyBzdGF0aWMgdGlsZVNpemU6IG51bWJlciA9IDA7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBXYWxsTWFuYWdlciB9IGZyb20gJy4vd2FsbC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IENvbGxpc2lvbnMgfSBmcm9tICcuL2NvbGxpc2lvbnMnO1xyXG5pbXBvcnQgeyBHZW0gfSBmcm9tICcuL2dlbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgR2VtTWFuYWdlciB7XHJcblxyXG4gIHB1YmxpYyBnZW1zOiBQaGFzZXIuR3JvdXA7XHJcbiAgcHVibGljIGdvbGRzOiBQaGFzZXIuR3JvdXA7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSwgcHJpdmF0ZSBzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICAgIHRoaXMuZ2VtcyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMuZ29sZHMgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XHJcbiAgfVxyXG5cclxuICBzdGFydCgpIHtcclxuICAgIHRoaXMuc3Bhd25HZW0oKTsgdGhpcy5zcGF3bkdlbSgpOyB0aGlzLnNwYXduR2VtKCk7XHJcbiAgICB0aGlzLmdhbWUudGltZS5ldmVudHMubG9vcCgzMDAwLCB0aGlzLnNwYXduR2VtLmJpbmQodGhpcyksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc3Bhd25HZW0oKSB7XHJcbiAgICB2YXIgaXNHZW0gPSBNYXRoLnJhbmRvbSgpID49IDAuMztcclxuICAgIHZhciB4ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueCAtIDEpKSk7XHJcbiAgICB2YXIgeSA9IChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAodGhpcy5zaXplLnkgLSAxKSkpO1xyXG5cclxuICAgIHZhciBzcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgeSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIGlzR2VtID8gJ2dlbScgOiAnZ29sZCcpO1xyXG4gICAgc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHNwcml0ZS5zY2FsZS5zZXRUbyhDb25zdHMudGlsZVNpemUgLyAzMiAqIDAuMywgQ29uc3RzLnRpbGVTaXplIC8gMzIgKiAwLjMpO1xyXG5cclxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLmVuYWJsZShzcHJpdGUsIGZhbHNlKTtcclxuXHJcbiAgICBzcHJpdGUuYm9keS5zZXRDaXJjbGUoQ29uc3RzLnRpbGVTaXplICogMC4xNSk7XHJcbiAgICAvLyBzcHJpdGUuYm9keS5raW5lbWF0aWMgPSB0cnVlO1xyXG4gICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLmFkZChpc0dlbSA/ICdnZW0nIDogJ2dvbGQnLCBuZXcgR2VtKHNwcml0ZSwgdGhpcy5nYW1lKSk7XHJcblxyXG4gIH1cclxuXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBXaXRoU3ByaXRlSW50ZXJmYWNlIH0gZnJvbSAnLi93aXRoLXNwcml0ZS1pbnRlcmZhY2UnO1xyXG5leHBvcnQgY2xhc3MgR2VtIGltcGxlbWVudHMgV2l0aFNwcml0ZUludGVyZmFjZSB7XHJcbiAgcHVibGljIHNwcml0ZTogUGhhc2VyLlNwcml0ZTtcclxuICBwdWJsaWMgY29sbGlkZShhOiBhbnksIGI6IGFueSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3Ioc3ByaXRlOiBQaGFzZXIuU3ByaXRlLCBwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lKSB7XHJcbiAgICB0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIvPlxyXG5pbXBvcnQgeyBDb25zdHMgfSBmcm9tICcuL2NvbnN0JztcclxuaW1wb3J0IHsgTWF6ZSB9IGZyb20gJy4vbWF6ZSc7XHJcbmltcG9ydCB7IFdhbGxNYW5hZ2VyIH0gZnJvbSAnLi93YWxsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBQYWNtYW4gfSBmcm9tICcuL3BhY21hbic7XHJcbmltcG9ydCB7IEdlbU1hbmFnZXIgfSBmcm9tICcuL2dlbS1tYW5hZ2VyJztcclxuaW1wb3J0IHsgQ29sbGlzaW9ucyB9IGZyb20gJy4vY29sbGlzaW9ucyc7XHJcbmltcG9ydCB7IE1vYk1hbmFnZXIgfSBmcm9tICcuL21vYi1tYW5hZ2VyJztcclxuXHJcbmNsYXNzIE1hemVHYW1lIHtcclxuXHJcbiAgICBnYW1lOiBQaGFzZXIuR2FtZTtcclxuXHJcbiAgICBtYXplOiBNYXplO1xyXG5cclxuICAgIHdhbGxNYW5hZ2VyOiBXYWxsTWFuYWdlcjtcclxuICAgIG1vYk1hbmFnZXI6IE1vYk1hbmFnZXI7XHJcblxyXG4gICAgc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9ID0geyB4OiAxMCwgeTogMTAgfTtcclxuXHJcbiAgICBwYWNtYW46IFBhY21hbjtcclxuICAgIHc6IG51bWJlcjtcclxuICAgIGg6IG51bWJlclxyXG4gICAgbWF4VzogbnVtYmVyO1xyXG4gICAgbWF4SDogbnVtYmVyO1xyXG4gICAgbWluVzogbnVtYmVyO1xyXG4gICAgbWluSDogbnVtYmVyO1xyXG4gICAgdGltZTogbnVtYmVyO1xyXG4gICAgdGV4dFRpbWVyOiBQaGFzZXIuVGV4dDtcclxuICAgIHRpbWVJbnRlcnZhbDogYW55O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhXID0gd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgdGhpcy5tYXhIID0gd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5taW5IID0gOTYwIC8gdGhpcy5tYXhXICogdGhpcy5tYXhIO1xyXG4gICAgICAgIHRoaXMubWluVyA9IDk2MDtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lID0gbmV3IFBoYXNlci5HYW1lKHRoaXMubWluVywgdGhpcy5taW5ILCBQaGFzZXIuQ0FOVkFTLCAnY29udGVudCcpO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuYWRkKCdzdGFydFN0YXRlJywge1xyXG5cclxuICAgICAgICAgICAgcHJlbG9hZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5kZXZpY2UuZGVza3RvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zZXRHYW1lU2l6ZSh0aGlzLm1heFcsIHRoaXMubWF4SCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLncgPSB0aGlzLmdhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmggPSB0aGlzLmdhbWUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgQ29uc3RzLnRpbGVTaXplID0gdGhpcy53IC8gMTI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZSA9IDM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWUgLT0gMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50aW1lID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIudGV4dCA9ICdTVEFSVCEhJztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50aW1lID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2dhbWVTdGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci50ZXh0ID0gJ0dhbWUgc3RhcnRzIGluICcgKyB0aGlzLnRpbWUgKyAnIHNlY29uZHMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lciA9IHRoaXMuZ2FtZS5hZGQudGV4dCh0aGlzLncgLyAyLjAsIHRoaXMuaCAvIDIuMCwgJ0dhbWUgc3RhcnRzIGluICcgKyB0aGlzLnRpbWUgKyAnIHNlY29uZHMnLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9cdENlbnRlciBhbGlnblxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuYWxpZ24gPSAnY2VudGVyJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0Rm9udCBzdHlsZVxyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuZm9udCA9ICdBcmlhbCBCbGFjayc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci5mb250U2l6ZSA9IDUwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0VGltZXIuZm9udFdlaWdodCA9ICdib2xkJztcclxuXHJcbiAgICAgICAgICAgICAgICAvL1x0U3Ryb2tlIGNvbG9yIGFuZCB0aGlja25lc3NcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLnN0cm9rZSA9ICcjMDAwMDAwJztcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFRpbWVyLnN0cm9rZVRoaWNrbmVzcyA9IDY7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRUaW1lci5maWxsID0gJyM0M2Q2MzcnO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLmFkZCgnZ2FtZVN0YXRlJywgdGhpcywgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWVPdmVyU3RhdGUnLCB7XHJcbiAgICAgICAgICAgIGNyZWF0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQodGhpcy53IC8gMi4wLCB0aGlzLmggLyAyLjAsICdQb2ludHM6ICcgKyB0aGlzLnBhY21hbi5nZXRQb2ludHMoKSwgJycpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRDZW50ZXIgYWxpZ25cclxuICAgICAgICAgICAgICAgIHRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5hbGlnbiA9ICdjZW50ZXInO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRGb250IHN0eWxlXHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZvbnQgPSAnQXJpYWwgQmxhY2snO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250U2l6ZSA9IDUwO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250V2VpZ2h0ID0gJ2JvbGQnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRTdHJva2UgY29sb3IgYW5kIHRoaWNrbmVzc1xyXG4gICAgICAgICAgICAgICAgdGV4dC5zdHJva2UgPSAnIzAwMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LnN0cm9rZVRoaWNrbmVzcyA9IDY7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZpbGwgPSAnIzQzZDYzNyc7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KHRoaXMudyAvIDIuMCwgdGhpcy5oIC8gMi4wICsgNjAsICdDbGljayBhbnl0aGluZyB0byByZXN0YXJ0JywgJycpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRDZW50ZXIgYWxpZ25cclxuICAgICAgICAgICAgICAgIHRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5hbGlnbiA9ICdjZW50ZXInO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRGb250IHN0eWxlXHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZvbnQgPSAnQXJpYWwgQmxhY2snO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250U2l6ZSA9IDUwO1xyXG4gICAgICAgICAgICAgICAgdGV4dC5mb250V2VpZ2h0ID0gJ2JvbGQnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHRTdHJva2UgY29sb3IgYW5kIHRoaWNrbmVzc1xyXG4gICAgICAgICAgICAgICAgdGV4dC5zdHJva2UgPSAnIzAwMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LnN0cm9rZVRoaWNrbmVzcyA9IDY7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LmZpbGwgPSAnIzQzZDYzNyc7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLm9uRG93bkNhbGxiYWNrPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnc3RhcnRTdGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQub25Eb3duLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnc3RhcnRTdGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJlbG9hZCgpIHtcclxuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSgndWZvJywgJ2Fzc2V0cy91Zm8ucG5nJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2dlbScsICdhc3NldHMvZ2VtLnBuZycpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdnb2xkJywgJ2Fzc2V0cy9nb2xkLnBuZycpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdtYXplLWJnJywgJ2Fzc2V0cy9tYXplLWJnLnBuZycpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KCdtb2InLCAnYXNzZXRzL21vYi5wbmcnLCAzMiwgMzIpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdoYXphcmQnLCAnYXNzZXRzL2hhemFyZC5wbmcnKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KCdidXR0b252ZXJ0aWNhbCcsICdhc3NldHMvYnV0dG9uLXZlcnRpY2FsLnBuZycsIDMyLCA2NCk7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2J1dHRvbmhvcml6b250YWwnLCAnYXNzZXRzL2J1dHRvbi1ob3Jpem9udGFsLnBuZycsIDY0LCAzMik7XHJcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2J1dHRvbmRpYWdvbmFsJywgJ2Fzc2V0cy9idXR0b24tZGlhZ29uYWwucG5nJywgNDgsIDQ4KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcG9pbnRzVGV4dDogUGhhc2VyLlRleHQ7XHJcblxyXG4gICAgY3JlYXRlKCkge1xyXG4gICAgICAgIHRoaXMud2FsbE1hbmFnZXIgPSBuZXcgV2FsbE1hbmFnZXIodGhpcy5nYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5QMkpTKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLnNldEJvdW5kcygwLCAwLCB0aGlzLnNpemUueCAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyLCB0aGlzLnNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAyKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5yZXN0aXR1dGlvbiA9IDAuODtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5zZXRCb3VuZHNUb1dvcmxkKHRydWUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi51cGRhdGVCb3VuZHNDb2xsaXNpb25Hcm91cCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBhY21hbiA9IG5ldyBQYWNtYW4odGhpcy5nYW1lLCB0aGlzLndhbGxNYW5hZ2VyKTtcclxuXHJcbiAgICAgICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLnByZXBhcmUodGhpcy5nYW1lLCB0aGlzLnBhY21hbik7XHJcblxyXG4gICAgICAgIHRoaXMud2FsbE1hbmFnZXIuZHJhdyh0aGlzLnNpemUpO1xyXG5cclxuICAgICAgICBuZXcgR2VtTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuc2l6ZSkuc3RhcnQoKVxyXG4gICAgICAgIHRoaXMubW9iTWFuYWdlciA9IG5ldyBNb2JNYW5hZ2VyKHRoaXMuZ2FtZSwgdGhpcy5wYWNtYW4sIHRoaXMuc2l6ZSk7Ly9cclxuICAgICAgICB0aGlzLm1vYk1hbmFnZXIuc3RhcnQoKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLncsIHRoaXMuaClcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoQ29uc3RzLnRpbGVTaXplIC8gOCwgQ29uc3RzLnRpbGVTaXplIC8gOCwgdGhpcy5wYWNtYW4uZ2V0UG9pbnRzKCkrJycsICcnKTtcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgLy9cdENlbnRlciBhbGlnblxyXG4gICAgICAgIC8vIHRoaXMucG9pbnRzVGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgICAgdGhpcy5wb2ludHNUZXh0LmFsaWduID0gJ3JpZ2h0JztcclxuXHJcbiAgICAgICAgLy9cdEZvbnQgc3R5bGVcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuZm9udCA9ICdBcmlhbCBCbGFjayc7XHJcbiAgICAgICAgdGhpcy5wb2ludHNUZXh0LmZvbnRTaXplID0gQ29uc3RzLnRpbGVTaXplIC8gNC4wO1xyXG4gICAgICAgIHRoaXMucG9pbnRzVGV4dC5mb250V2VpZ2h0ID0gJ2JvbGQnO1xyXG5cclxuICAgICAgICAvL1x0U3Ryb2tlIGNvbG9yIGFuZCB0aGlja25lc3NcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuc3Ryb2tlID0gJyMwMDAwMDAnO1xyXG4gICAgICAgIHRoaXMucG9pbnRzVGV4dC5zdHJva2VUaGlja25lc3MgPSA2O1xyXG4gICAgICAgIHRoaXMucG9pbnRzVGV4dC5maWxsID0gJyM0M2Q2MzcnO1xyXG4gICAgICAgIHRoaXMucG9pbnRzVGV4dC5icmluZ1RvVG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMucGFjbWFuLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMubW9iTWFuYWdlci51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLnBvaW50c1RleHQuc2V0VGV4dCh0aGlzLnBhY21hbi5nZXRQb2ludHMoKSsnJyk7XHJcbiAgICAgICAgLy8gdGhpcy5wb2ludHNUZXh0LnBvc2l0aW9uLnNldCh0aGlzLmdhbWUuY2FtZXJhLnBvc2l0aW9uLngsIHRoaXMuZ2FtZS5jYW1lcmEucG9zaXRpb24ueSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0U3RhdGUoKSB7XHJcbiAgICAgICAgYWxlcnQoJ3N0YXJ0JylcclxuICAgIH1cclxuXHJcbiAgICBnYW1lU3RhdGUoKSB7XHJcbiAgICAgICAgYWxlcnQoJ2dhbWUnKVxyXG4gICAgfVxyXG4gICAgZ2FtZU92ZXJTdGF0ZSgpIHtcclxuICAgICAgICBhbGVydCgnUG9pbnRzOicgKyB0aGlzLnBhY21hbi5nZXRQb2ludHMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZU9iamVjdCA9IHsgbGVmdDogZmFsc2UsIHJpZ2h0OiBmYWxzZSwgdXA6IGZhbHNlLCBkb3duOiBmYWxzZSB9XHJcblxyXG59XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gICAgbGV0IGdhbWUgPSBuZXcgTWF6ZUdhbWUoKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IFdhbGxNYW5hZ2VyIH0gZnJvbSAnLi93YWxsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBDb25zdHMgfSBmcm9tICcuL2NvbnN0JztcclxuaW1wb3J0IHsgQ29sbGlzaW9ucyB9IGZyb20gJy4vY29sbGlzaW9ucyc7XHJcbmltcG9ydCB7IFBhY21hbiB9IGZyb20gJy4vcGFjbWFuJztcclxuaW1wb3J0IHsgTW9iIH0gZnJvbSAnLi9tb2InO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vYk1hbmFnZXIge1xyXG5cclxuICBwdWJsaWMgbW9iczogUGhhc2VyLkdyb3VwO1xyXG4gIHB1YmxpYyBtb2JzSW5zdGFuY2VzOiBNb2JbXSA9IFtdO1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWUsIHByaXZhdGUgcGFjbWFuOiBQYWNtYW4sIHByaXZhdGUgc2l6ZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XHJcbiAgfVxyXG5cclxuICBzdGFydCgpIHtcclxuICAgIHRoaXMubW9icyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMuc3Bhd25Nb2IoKTsgdGhpcy5zcGF3bk1vYigpOyB0aGlzLnNwYXduTW9iKCk7XHJcbiAgICB0aGlzLmdhbWUudGltZS5ldmVudHMubG9vcCgxMDAwLCB0aGlzLnNwYXduTW9iLmJpbmQodGhpcyksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc3Bhd25Nb2IoKSB7XHJcblxyXG4gICAgdmFyIHggPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKHRoaXMuc2l6ZS54IC0gMSkpKTtcclxuICAgIHZhciB5ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueSAtIDEpKSk7XHJcbiAgICB2YXIgZGlzdCA9IHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5kaXN0YW5jZVRvWFkoXHJcbiAgICAgIHRoaXMucGFjbWFuLnNwcml0ZSxcclxuICAgICAgeCAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsXHJcbiAgICAgIHkgKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0KTtcclxuXHJcbiAgICB3aGlsZSAoQ29uc3RzLnRpbGVTaXplICogMi41ID49IGRpc3QpIHtcclxuICAgICAgY29uc29sZS5sb2coZGlzdCwgQ29uc3RzLnRpbGVTaXplKVxyXG4gICAgICB4ID0gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICh0aGlzLnNpemUueCAtIDEpKSk7XHJcbiAgICAgIHkgPSAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKHRoaXMuc2l6ZS55IC0gMSkpKTtcclxuICAgICAgZGlzdCA9IHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5kaXN0YW5jZVRvWFkoXHJcbiAgICAgICAgdGhpcy5wYWNtYW4uc3ByaXRlLFxyXG4gICAgICAgIHggKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LFxyXG4gICAgICAgIHkgKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0KTtcclxuICAgIH1cclxuICAgIHZhciBzcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgeSAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsICdoYXphcmQnKTtcclxuICAgIHNwcml0ZS5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICBzcHJpdGUuc2NhbGUuc2V0VG8oQ29uc3RzLnRpbGVTaXplIC8gOTYgKiAwLjMsIENvbnN0cy50aWxlU2l6ZSAvIDk2ICogMC4zKTtcclxuICAgIHZhciB0d2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4oc3ByaXRlKTtcclxuICAgIHR3ZWVuLnRvKHsgYWxwaGE6IDAgfSwgMzAwMCwgUGhhc2VyLkVhc2luZy5MaW5lYXIuTm9uZSk7XHJcbiAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoZTogYW55KSA9PiB7XHJcbiAgICAgIGUuZGVzdHJveSgpO1xyXG4gICAgICB2YXIgc3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoeCAqIENvbnN0cy50aWxlU2l6ZSArIENvbnN0cy50aWxlU2l6ZSAqIDAuNSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIHkgKiBDb25zdHMudGlsZVNpemUgKyBDb25zdHMudGlsZVNpemUgKiAwLjUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCAnbW9iJyk7XHJcbiAgICAgIHNwcml0ZS5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgIHNwcml0ZS5zY2FsZS5zZXRUbyhDb25zdHMudGlsZVNpemUgLyAzMiAqIDAuMywgQ29uc3RzLnRpbGVTaXplIC8gMzIgKiAwLjMpO1xyXG5cclxuICAgICAgdGhpcy5nYW1lLnBoeXNpY3MucDIuZW5hYmxlKHNwcml0ZSwgZmFsc2UpO1xyXG5cclxuICAgICAgc3ByaXRlLmJvZHkuc2V0Q2lyY2xlKENvbnN0cy50aWxlU2l6ZSAqIDAuMik7XHJcbiAgICAgIHRoaXMubW9icy5hZGQoc3ByaXRlKTtcclxuICAgICAgLy8gc3ByaXRlLmJvZHkua2luZW1hdGljID0gdHJ1ZTtcclxuICAgICAgdmFyIG1vYiA9IG5ldyBNb2Ioc3ByaXRlLCB0aGlzLmdhbWUpO1xyXG4gICAgICBDb2xsaXNpb25zLmdldEluc3RhbmNlKCkuYWRkKCdtb2InLCBtb2IpO1xyXG5cclxuICAgICAgdGhpcy5tb2JzSW5zdGFuY2VzLnB1c2gobW9iKTtcclxuXHJcbiAgICB9LCB0aGlzKTtcclxuICAgIHR3ZWVuLnN0YXJ0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5tb2JzSW5zdGFuY2VzLmZvckVhY2goKG1vYjogTW9iKSA9PiB7XHJcbiAgICAgIHRoaXMucGFjbWFuLmlzS2lsbGluZ01vZGUgPyBtb2Iuc3ByaXRlLmZyYW1lID0gMSA6IG1vYi5zcHJpdGUuZnJhbWUgPSAwO1xyXG4gICAgICBtb2IubW92ZSgpO1xyXG4gICAgfSwgdGhpcylcclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9waGFzZXIvdHlwZXNjcmlwdC9waGFzZXIuZC50c1wiLz5cclxuaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IENvbGxpc2lvbnMgfSBmcm9tICcuL2NvbGxpc2lvbnMnO1xyXG5pbXBvcnQgeyBXaXRoU3ByaXRlSW50ZXJmYWNlIH0gZnJvbSAnLi93aXRoLXNwcml0ZS1pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vYiBpbXBsZW1lbnRzIFdpdGhTcHJpdGVJbnRlcmZhY2Uge1xyXG4gIHB1YmxpYyBzcHJpdGU6IFBoYXNlci5TcHJpdGU7XHJcbiAgcHJpdmF0ZSBpc01vdmluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGNvbnN0cnVjdG9yKHNwcml0ZTogUGhhc2VyLlNwcml0ZSwgcHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZSkge1xyXG4gICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICBzZXRJbnRlcnZhbCh0aGlzLmNvbGxpZGUuYmluZCh0aGlzKSwgMzAwMClcclxuICB9XHJcblxyXG4gIHBvczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9XHJcbiAgcHVibGljIG1vdmUoKSB7XHJcbiAgICBpZiAodGhpcy5zcHJpdGUgJiYgdGhpcy5zcHJpdGUuYm9keSAmJiAhdGhpcy5wb3MpIHtcclxuICAgICAgdGhpcy5zcHJpdGUuYm9keS5zZXRaZXJvUm90YXRpb24oKTtcclxuICAgICAgdGhpcy5zcHJpdGUuYm9keS5zZXRaZXJvVmVsb2NpdHkoKTtcclxuICAgICAgdGhpcy5wb3MgPSB0aGlzLnJhbmRvbVBvc2l0aW9uKCk7XHJcbiAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgdGhpcy5wb3MueCwgdGhpcy5wb3MueSwgQ29uc3RzLnRpbGVTaXplIC8gMywgMzAwMCk7XHJcbiAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbGxpZGUoYTogYW55LCBiOiBhbnkpIHtcclxuICAgIGlmICh0aGlzLnNwcml0ZSAmJiB0aGlzLnNwcml0ZS5ib2R5KSB7XHJcbiAgICAgIGlmICh0aGlzLnBvcykge1xyXG4gICAgICAgIHRoaXMucG9zID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1vdmUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBDb2xsaXNpb25zLmNvbGxpc2lvblNvbHZlcihhLCBiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByYW5kb21Qb3NpdGlvbigpOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0ge1xyXG4gICAgdmFyIGRpc3RhbmNlID0gQ29uc3RzLnRpbGVTaXplICogNTtcclxuICAgIHZhciB4ID0gTWF0aC5yYW5kb20oKSAqIGRpc3RhbmNlO1xyXG4gICAgdmFyIHkgPSBNYXRoLnNxcnQoZGlzdGFuY2UgKiBkaXN0YW5jZSAtIHggKiB4KTtcclxuXHJcbiAgICByZXR1cm4geyB4OiB0aGlzLnNwcml0ZS5wb3NpdGlvbi54ICsgdGhpcy5yYW5kb21TaWduKHgpLCB5OiB0aGlzLnNwcml0ZS5wb3NpdGlvbi55ICsgdGhpcy5yYW5kb21TaWduKHkpIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmFuZG9tU2lnbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgPiAwLjUgPyAxIDogLTEpICogdmFsdWU7XHJcbiAgfVxyXG5cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIi8+XHJcbmltcG9ydCB7IENvbnN0cyB9IGZyb20gJy4vY29uc3QnO1xyXG5pbXBvcnQgeyBXYWxsTWFuYWdlciB9IGZyb20gJy4vd2FsbC1tYW5hZ2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYWNtYW4ge1xyXG5cclxuICBwb3NpdGlvbiA9IHsgeDogMiwgeTogMyB9XHJcbiAgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xyXG4gIGN1cnNvcnM6IFBoYXNlci5DdXJzb3JLZXlzO1xyXG4gIGVtaXR0ZXI6IFBoYXNlci5QYXJ0aWNsZXMuQXJjYWRlLkVtaXR0ZXI7XHJcbiAgcGFydGljbGVzR3JvdXA6IFBoYXNlci5Hcm91cDtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludHM6IG51bWJlciA9IDA7XHJcblxyXG4gIG1vdmVPYmplY3Q6IHsgbGVmdDogYm9vbGVhbiwgcmlnaHQ6IGJvb2xlYW4sIHVwOiBib29sZWFuLCBkb3duOiBib29sZWFuIH1cclxuICB0b3VjaGluZzogYm9vbGVhbiA9IGZhbHNlXHJcbiAgcHJpdmF0ZSBzY2FsZVRvVGlsZSA9IDAuNDtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lLCBwcml2YXRlIHdhbGxNYW5hZ2VyOiBXYWxsTWFuYWdlcikge1xyXG5cclxuICAgIHRoaXMucGFydGljbGVzR3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XHJcblxyXG4gICAgdGhpcy5zcHJpdGUgPSBnYW1lLmFkZC5zcHJpdGUodGhpcy5wb3NpdGlvbi54ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgdGhpcy5wb3NpdGlvbi55ICogQ29uc3RzLnRpbGVTaXplICsgQ29uc3RzLnRpbGVTaXplICogMC41ICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgJ3VmbycpO1xyXG4gICAgdGhpcy5zcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgdGhpcy5zcHJpdGUuc2NhbGUuc2V0VG8oQ29uc3RzLnRpbGVTaXplIC8gOTYgKiB0aGlzLnNjYWxlVG9UaWxlLCBDb25zdHMudGlsZVNpemUgLyA5NiAqIHRoaXMuc2NhbGVUb1RpbGUpO1xyXG5cclxuICAgIGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIGZhbHNlKTtcclxuICAgIC8vIHRoaXMuc3ByaXRlLmJvZHkuZW5hYmxlQm9keSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zcHJpdGUuYm9keS5zZXRDaXJjbGUoQ29uc3RzLnRpbGVTaXplICogMC41ICogdGhpcy5zY2FsZVRvVGlsZSk7XHJcbiAgICB0aGlzLmN1cnNvcnMgPSBnYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcclxuXHJcbiAgICB0aGlzLmdhbWUuY2FtZXJhLmZvbGxvdyh0aGlzLnNwcml0ZSwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OLCAwLjEsIDAuMSk7XHJcblxyXG4gICAgLy8gdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmxvb3AoMzAwLCB0aGlzLnBhcnRpY2xlcy5iaW5kKHRoaXMpLCB0aGlzKTtcclxuICAgIGlmICghdGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XHJcbiAgICAgIHRoaXMuZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2soKGU6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgZS53b3JsZFgsIGUud29ybGRZLCB0aGlzLnNwZWVkKTtcclxuICAgICAgICB0aGlzLnRvdWNoaW5nID0gdHJ1ZTtcclxuICAgICAgfSwgdGhpcylcclxuXHJcbiAgICAgIHRoaXMuZ2FtZS5pbnB1dC5vblVwLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b3VjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgdGhpcy5zcHJpdGUucG9zaXRpb24ueCwgdGhpcy5zcHJpdGUucG9zaXRpb24ueSwgMCk7XHJcbiAgICAgIH0sIHRoaXMpXHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmdhbWUuZGV2aWNlLmRlc2t0b3ApIHtcclxuICAgICAgdGhpcy5tb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBtb3ZlKCkge1xyXG4gICAgdGhpcy5zcHJpdGUuYm9keS5zZXRaZXJvUm90YXRpb24oKTtcclxuICAgIHRoaXMuc3ByaXRlLmJvZHkuc2V0WmVyb1ZlbG9jaXR5KCk7XHJcbiAgICB2YXIgc3RlcCA9IENvbnN0cy50aWxlU2l6ZSAqIDI7XHJcblxyXG4gICAgdGhpcy5zdG9wTW92aW5nKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuY3Vyc29ycy5sZWZ0LmlzRG93bikge1xyXG4gICAgICB0aGlzLm1vdmVPYmplY3QubGVmdCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLmN1cnNvcnMucmlnaHQuaXNEb3duKSB7XHJcbiAgICAgIHRoaXMubW92ZU9iamVjdC5yaWdodCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3Vyc29ycy51cC5pc0Rvd24pIHtcclxuICAgICAgdGhpcy5tb3ZlT2JqZWN0LnVwID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY3Vyc29ycy5kb3duLmlzRG93bikge1xyXG4gICAgICB0aGlzLm1vdmVPYmplY3QuZG93biA9IHRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICB0aGlzLm1ha2VNb3ZlRnJvbU1vdmVPYmplY3QoKTtcclxuICB9XHJcblxyXG4gIHN0b3BNb3ZpbmcoKSB7XHJcbiAgICB0aGlzLm1vdmVPYmplY3QgPSB7IGxlZnQ6IGZhbHNlLCByaWdodDogZmFsc2UsIHVwOiBmYWxzZSwgZG93bjogZmFsc2UgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IHNwZWVkKCkge1xyXG4gICAgcmV0dXJuIENvbnN0cy50aWxlU2l6ZSAqIDI7XHJcbiAgfVxyXG5cclxuICBtYWtlTW92ZUZyb21Nb3ZlT2JqZWN0KCkge1xyXG4gICAgdmFyIHggPSAwO1xyXG4gICAgdmFyIHkgPSAwO1xyXG5cclxuXHJcbiAgICBpZiAodGhpcy5tb3ZlT2JqZWN0LmxlZnQpIHtcclxuICAgICAgeCA9IC01MDA7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5tb3ZlT2JqZWN0LnJpZ2h0KSB7XHJcbiAgICAgIHggPSArNTAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMubW92ZU9iamVjdC51cCkge1xyXG4gICAgICB5ID0gLTUwMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm1vdmVPYmplY3QuZG93bikge1xyXG4gICAgICB5ID0gKzUwMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeCAhPSAwIHx8IHkgIT0gMCkge1xyXG4gICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUubW92ZVRvWFkodGhpcy5zcHJpdGUsIHRoaXMuc3ByaXRlLnBvc2l0aW9uLnggKyB4LCB0aGlzLnNwcml0ZS5wb3NpdGlvbi55ICsgeSwgdGhpcy5zcGVlZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUubW92ZVRvWFkodGhpcy5zcHJpdGUsIHRoaXMuc3ByaXRlLnBvc2l0aW9uLngsIHRoaXMuc3ByaXRlLnBvc2l0aW9uLnksIDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGFydGljbGVzKCkge1xyXG4gICAgaWYgKHRoaXMuY3Vyc29ycy5sZWZ0LmlzRG93biB8fCB0aGlzLmN1cnNvcnMucmlnaHQuaXNEb3duIHx8IHRoaXMuY3Vyc29ycy51cC5pc0Rvd24gfHwgdGhpcy5jdXJzb3JzLmRvd24uaXNEb3duIHx8IHRoaXMudG91Y2hpbmcpIHtcclxuXHJcbiAgICAgIHZhciBwYXJ0aWNsZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDEwMDAsIDEwMDAsICdnb2xkJyk7XHJcbiAgICAgIHBhcnRpY2xlLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgcGFydGljbGUuc2NhbGUuc2V0VG8oQ29uc3RzLnRpbGVTaXplIC8gMzIgKiB0aGlzLnNjYWxlVG9UaWxlICogMC4zKTtcclxuXHJcbiAgICAgIHBhcnRpY2xlLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgcGFydGljbGUueCA9IHRoaXMuc3ByaXRlLng7XHJcbiAgICAgIHBhcnRpY2xlLnkgPSB0aGlzLnNwcml0ZS55O1xyXG4gICAgICB0aGlzLnBhcnRpY2xlc0dyb3VwLmFkZChwYXJ0aWNsZSk7XHJcbiAgICAgIHBhcnRpY2xlLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB2YXIgdGltZSA9IDQ1MDAwO1xyXG4gICAgICB2YXIgdHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHBhcnRpY2xlKTtcclxuICAgICAgdmFyIHR3ZWVuU2NhbGUgPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHBhcnRpY2xlLnNjYWxlKTtcclxuICAgICAgdHdlZW5TY2FsZS50byh7IHk6IDAsIHg6IDAgfSwgdGltZSAtIDIwMDAsIFBoYXNlci5FYXNpbmcuTGluZWFyLk5vbmUsIHRydWUpXHJcblxyXG4gICAgICB0d2Vlbi50byh7IGFscGhhOiAwLCBhbmdsZTogODAwMCB9LCB0aW1lLCBQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lKTtcclxuICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKGU6IGFueSkgPT4ge1xyXG4gICAgICAgIGUuZGVzdHJveSgpO1xyXG4gICAgICB9LCB0aGlzKTtcclxuICAgICAgdHdlZW4uc3RhcnQoKTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRQb2ludHMocG9pbnRzOiBudW1iZXIpIHtcclxuICAgIHRoaXMucG9pbnRzICs9IHBvaW50cztcclxuICAgIGNvbnNvbGUubG9nKHRoaXMucG9pbnRzKVxyXG4gIH1cclxuXHJcbiAgZ2V0UG9pbnRzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRzO1xyXG4gIH1cclxuXHJcbiAgX2tpbGxpbmdNb2RlOiBhbnk7XHJcbiAgaXNLaWxsaW5nTW9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGtpbGxpbmdNb2RlKCkge1xyXG4gICAgaWYgKHRoaXMuaXNLaWxsaW5nTW9kZSkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fa2lsbGluZ01vZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc0tpbGxpbmdNb2RlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdraWxsaW5nIG1vZGUnLCB0aGlzLmlzS2lsbGluZ01vZGUpXHJcblxyXG4gICAgdGhpcy5fa2lsbGluZ01vZGUgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5pc0tpbGxpbmdNb2RlID0gZmFsc2U7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdraWxsaW5nIG1vZGUnLCB0aGlzLmlzS2lsbGluZ01vZGUpXHJcbiAgICB9LCAxNTAwMCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9waGFzZXIvdHlwZXNjcmlwdC9waGFzZXIuZC50c1wiLz5cclxuaW1wb3J0IHsgQ29uc3RzIH0gZnJvbSAnLi9jb25zdCc7XHJcbmltcG9ydCB7IE1hemUgfSBmcm9tICcuL21hemUnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb25zIH0gZnJvbSAnLi9jb2xsaXNpb25zJztcclxuaW1wb3J0IHsgV2FsbCB9IGZyb20gJy4vd2FsbCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2FsbE1hbmFnZXIge1xyXG5cclxuICB0aGlja25lc3M6IG51bWJlciA9IDAuMTtcclxuXHJcbiAgcHVibGljIGJnOiBQaGFzZXIuR3JvdXA7XHJcbiAgcHVibGljIHdhbGxzOiBQaGFzZXIuR3JvdXA7XHJcbiAgcGFsZXR0ZSA9IHtcclxuICAgIGNvbG9yOiAweEZGMDAwMCxcclxuICAgIG9wYWNpdHk6IDAuMjcsXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lKSB7XHJcbiAgICB0aGlzLmJnID0gZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMud2FsbHMgPSBnYW1lLmFkZC5ncm91cCgpO1xyXG4gICAgdGhpcy53YWxscy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgIHRoaXMud2FsbHMucGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuUDJKUztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IG1hemVPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiA4O1xyXG4gIH1cclxuICBwdWJsaWMgZHJhdyhzaXplOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICAgIHZhciBvZmZzZXRGb3JCb3JkZXIgPSBDb25zdHMudGlsZVNpemUgKiB0aGlzLnRoaWNrbmVzcztcclxuICAgIHZhciBmbG9vciA9IHRoaXMuZ2FtZS5hZGQudGlsZVNwcml0ZShXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBXYWxsTWFuYWdlci5tYXplT2Zmc2V0LCBzaXplLnggKiBDb25zdHMudGlsZVNpemUsIHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSwgJ21hemUtYmcnKTtcclxuICAgIHRoaXMuYmcuYWRkKGZsb29yKTtcclxuXHJcblxyXG4gICAgdGhpcy5hZGRCb3JkZXJzKHNpemUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRCb3JkZXJzKHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xyXG4gICAgdmFyIGNvbG9yID0gMHgwMDAwMDA7XHJcbiAgICB2YXIgb3BhY2l0eSA9IDE7XHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgMCwgMCwgc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcbiAgICB0aGlzLmFkZFdhbGwoc2l6ZSwgMCwgc2l6ZS55ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCwgc2l6ZS54ICogQ29uc3RzLnRpbGVTaXplICsgV2FsbE1hbmFnZXIubWF6ZU9mZnNldCAqIDIsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCB0cnVlLCBjb2xvciwgb3BhY2l0eSk7XHJcblxyXG4gICAgdGhpcy5hZGRXYWxsKHNpemUsIDAsIDAsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCBzaXplLnkgKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgdHJ1ZSwgY29sb3IsIG9wYWNpdHkpO1xyXG4gICAgdGhpcy5hZGRXYWxsKHNpemUsIHNpemUueCAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQsIDAsIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQgKiAxLCBzaXplLnkgKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0ICogMiwgdHJ1ZSwgY29sb3IsIG9wYWNpdHkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRXYWxsKHNpemU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBpc0JvcmRlcjogYm9vbGVhbiwgY29sb3I/OiBudW1iZXIsIG9wYWNpdHk/OiBudW1iZXIpIHtcclxuICAgIGlmICghaXNCb3JkZXIpIHtcclxuICAgICAgeCArPSBXYWxsTWFuYWdlci5tYXplT2Zmc2V0O1xyXG4gICAgICB5ICs9IFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICB9XHJcbiAgICB2YXIgbWF4V2lkdGggPSBzaXplLnggKiBDb25zdHMudGlsZVNpemUgKyBXYWxsTWFuYWdlci5tYXplT2Zmc2V0O1xyXG4gICAgdmFyIG1heEhlaWdodCA9IHNpemUueSAqIENvbnN0cy50aWxlU2l6ZSArIFdhbGxNYW5hZ2VyLm1hemVPZmZzZXQ7XHJcbiAgICB2YXIgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKENvbnN0cy5tYXJnaW5zLCBDb25zdHMubWFyZ2lucyk7XHJcbiAgICBncmFwaGljcy5saW5lU3R5bGUoMiwgY29sb3IgfHwgY29sb3IgPT09IDAgPyBjb2xvciA6IHRoaXMucGFsZXR0ZS5jb2xvciwgMSk7XHJcbiAgICBncmFwaGljcy5iZWdpbkZpbGwoY29sb3IgfHwgY29sb3IgPT09IDAgPyBjb2xvciA6IHRoaXMucGFsZXR0ZS5jb2xvcik7XHJcbiAgICBncmFwaGljcy5kcmF3UmVjdChcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgeCArIHdpZHRoID4gbWF4V2lkdGggJiYgIWlzQm9yZGVyID8gbWF4V2lkdGggLSAoeCkgOiB3aWR0aCxcclxuICAgICAgeSArIGhlaWdodCA+IG1heEhlaWdodCAmJiAhaXNCb3JkZXIgPyBtYXhIZWlnaHQgLSAoeSkgOiBoZWlnaHQsXHJcbiAgICApO1xyXG4gICAgZ3JhcGhpY3MuYWxwaGEgPSAob3BhY2l0eSB8fCBvcGFjaXR5ID09PSAwID8gb3BhY2l0eSA6IHRoaXMucGFsZXR0ZS5vcGFjaXR5KTtcclxuICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcclxuICAgIGdyYXBoaWNzLmJvdW5kc1BhZGRpbmcgPSAwO1xyXG4gICAgdmFyIHNoYXBlU3ByaXRlOiBQaGFzZXIuU3ByaXRlID0gdGhpcy53YWxscy5jcmVhdGUoeCx5KTsvLyB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4LCB5KTtcclxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLmVuYWJsZShzaGFwZVNwcml0ZSwgdHJ1ZSk7XHJcbiAgICBzaGFwZVNwcml0ZS5hZGRDaGlsZChncmFwaGljcyk7XHJcblxyXG4gICAgc2hhcGVTcHJpdGUuYm9keS5jbGVhclNoYXBlcygpO1xyXG4gICAgc2hhcGVTcHJpdGUuYm9keS5hZGRSZWN0YW5nbGUod2lkdGgsIGhlaWdodCwgd2lkdGggLyAyLjAsIGhlaWdodCAvIDIuMCk7XHJcbiAgICBzaGFwZVNwcml0ZS5ib2R5LmtpbmVtYXRpYyA9IHRydWU7XHJcblxyXG4gICAgQ29sbGlzaW9ucy5nZXRJbnN0YW5jZSgpLmFkZCgnd2FsbCcsIG5ldyBXYWxsKHNoYXBlU3ByaXRlLCB0aGlzLmdhbWUpKTtcclxuXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9mZnNldCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgKiB0aGlzLndhbGxUaGlja25lc3MoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgd2FsbFRoaWNrbmVzcygpIHtcclxuICAgIHJldHVybiBDb25zdHMudGlsZVNpemUgKiB0aGlzLnRoaWNrbmVzcztcclxuICB9XHJcblxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9waGFzZXIvdHlwZXNjcmlwdC9waGFzZXIuZC50c1wiLz5cclxuaW1wb3J0IHsgV2l0aFNwcml0ZUludGVyZmFjZSB9IGZyb20gJy4vd2l0aC1zcHJpdGUtaW50ZXJmYWNlJztcclxuZXhwb3J0IGNsYXNzIFdhbGwgaW1wbGVtZW50cyBXaXRoU3ByaXRlSW50ZXJmYWNlIHtcclxuICBwdWJsaWMgc3ByaXRlOiBQaGFzZXIuU3ByaXRlO1xyXG4gIHB1YmxpYyBjb2xsaWRlKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihzcHJpdGU6IFBoYXNlci5TcHJpdGUsIHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWUpIHtcclxuICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG4gIH1cclxufSJdfQ==
