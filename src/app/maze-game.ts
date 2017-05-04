/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { Consts } from './const';
import { Maze } from './maze';
import { MazeGenerator } from './maze-generator';
import { WallManager } from './wall-manager';
import { Pacman } from './pacman';
import { GemManager } from './gem-manager';
import { Collisions } from './collisions';
import { MobManager } from './mob-manager';

class MazeGame {

    game: Phaser.Game;

    maze: Maze;

    wallManager: WallManager;
    mobManager: MobManager;

    size: { x: number, y: number } = { x: 15, y: 15 };

    pacman: Pacman;
    w: number;
    h: number
    maxW: number;
    maxH: number;
    minW: number;
    minH: number;
    time: number;
    textTimer: Phaser.Text;
    timeInterval: any;
    constructor() {
        this.maxW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.maxH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.minH = 960 / this.maxW * this.maxH;
        this.minW = 960;

        this.game = new Phaser.Game(this.minW, this.minH, Phaser.CANVAS, 'content');

        this.maze = MazeGenerator.getInstance().generate(this.size);

        this.game.state.add('startState', {

            preload: () => {
                if (this.game.device.desktop) {
                    this.game.scale.setGameSize(this.maxW, this.maxH);
                }
                this.w = this.game.width;
                this.h = this.game.height;
                Consts.tileSize = this.w / 12;
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
            },
            create: () => {
                this.time = 3;
                this.timeInterval = setInterval(() => {
                    this.time -= 1;
                    if (this.time == 0) {
                        this.textTimer.text = 'START!!';
                    } else {
                        if (this.time == -1) {
                            this.game.state.start('gameState');
                            clearInterval(this.timeInterval);
                        } else {
                            this.textTimer.text = 'Game will start in ' + this.time + ' seconds';
                        }
                    }


                }, 1000);

                this.textTimer = this.game.add.text(this.w / 2.0, this.h / 2.0, 'Game will start in ' + this.time + ' seconds', '');

                //	Center align
                this.textTimer.anchor.set(0.5);
                this.textTimer.align = 'center';

                //	Font style
                this.textTimer.font = 'Arial Black';
                this.textTimer.fontSize = 50;
                this.textTimer.fontWeight = 'bold';

                //	Stroke color and thickness
                this.textTimer.stroke = '#000000';
                this.textTimer.strokeThickness = 6;
                this.textTimer.fill = '#43d637';


            }

        }, true);
        this.game.state.add('gameState', this, false);
        this.game.state.add('gameOverState', {
            create: () => {
                var text = this.game.add.text(this.w / 2.0, this.h / 2.0, 'Points: ' + this.pacman.getPoints(), '');

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


                var text = this.game.add.text(this.w / 2.0, this.h / 2.0 + 60, 'Click anything to restart', '');

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
                this.game.input.onDown.add(() => {
                    if (!started) {
                        this.game.state.start('startState');
                    }
                    started = true;
                }, this)
            }

        }, false);


    }

    preload() {
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

    }

    pointsText: Phaser.Text;

    create() {
        this.wallManager = new WallManager(this.game);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.world.setBounds(0, 0, this.size.x * Consts.tileSize + WallManager.mazeOffset * 2, this.size.y * Consts.tileSize + WallManager.mazeOffset * 2);
        this.game.physics.p2.restitution = 0.8;
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        this.game.physics.p2.updateBoundsCollisionGroup();

        this.pacman = new Pacman(this.game, this.wallManager);

        Collisions.getInstance().prepare(this.game, this.pacman);

        this.wallManager.draw(this.maze, this.size);

        new GemManager(this.game, this.size).start()
        this.mobManager = new MobManager(this.game, this.pacman, this.size);//
        this.mobManager.start()

        console.log(this.w, this.h)
        this.pointsText = this.game.add.text(Consts.tileSize / 8, Consts.tileSize / 8, ':' + this.pacman.getPoints(), '');
        this.pointsText.fixedToCamera = true;
        //	Center align
        // this.pointsText.anchor.set(0.5);
        this.pointsText.align = 'right';

        //	Font style
        this.pointsText.font = 'Arial Black';
        this.pointsText.fontSize = Consts.tileSize / 4.0;
        this.pointsText.fontWeight = 'bold';

        //	Stroke color and thickness
        this.pointsText.stroke = '#000000';
        this.pointsText.strokeThickness = 6;
        this.pointsText.fill = '#43d637';
        this.pointsText.bringToTop();
    }

    update() {
        this.pacman.update();
        this.mobManager.update();
        this.pointsText.setText(':' + this.pacman.getPoints());
        // this.pointsText.position.set(this.game.camera.position.x, this.game.camera.position.y)

    }

    render() {
    }

    startState() {
        alert('start')
    }

    gameState() {
        alert('game')
    }
    gameOverState() {
        alert('Points:' + this.pacman.getPoints());
    }

    moveObject = { left: false, right: false, up: false, down: false }

}

window.onload = () => {
    let game = new MazeGame();
}