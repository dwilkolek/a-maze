import { Consts } from './const'
import { Maze } from './maze'
import { MazeGenerator } from './maze-generator'
import { WallManager } from './wall-manager'
import { Ufo } from './ufo';
import * as Phaser from 'phaser';

class MazeGame {

    game: Phaser.Game;

    maze: Maze;

    wallManager: WallManager;

    size: { x: number, y: number } = { x: 16, y: 9 };

    ufo: Ufo;
    w: number;
    h: number
    maxW: number;
    maxH: number;
    minW: number;
    minH: number;
    constructor() {
        this.maxW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.maxH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.minH = 960 / this.maxW * this.maxH;
        this.minW = 960;

        this.game = new Phaser.Game(this.minW, this.minH, Phaser.CANVAS, 'content',
            { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });

        this.maze = MazeGenerator.getInstance().generate(this.size);

    }

    preload() {
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
        Consts.tileSize = this.w / 12;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    }

    create() {
        this.wallManager = new WallManager(this.game);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.world.setBounds(0, 0, this.size.x * Consts.tileSize + WallManager.mazeOffset * 2, this.size.y * Consts.tileSize + WallManager.mazeOffset * 2);
        this.game.physics.p2.restitution = 0.0;
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

        this.ufo = new Ufo(this.game, this.wallManager);
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

    }

    update() {
        this.ufo.update(this.moveObject);
    }

    render() {
    }

    moveObject = { left: false, right: false, up: false, down: false }
    buttons() {
        var scale = 2;
        var offsetX = 0;
        var offsetY = -40;
        var buttonleft = this.game.add.button(offsetX + 80, offsetY + this.h - 200, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonleft.fixedToCamera = true;
        buttonleft.events.onInputOver.add(() => { this.moveObject.left = true; });
        buttonleft.events.onInputOut.add(() => { this.moveObject.left = false; });
        buttonleft.events.onInputDown.add(() => { this.moveObject.left = true; });
        buttonleft.events.onInputUp.add(() => { this.moveObject.left = false; });
        buttonleft.scale.setTo(2);

        var buttonright = this.game.add.button(offsetX + 272, offsetY + this.h - 200, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonright.fixedToCamera = true;
        buttonright.events.onInputOver.add(() => { this.moveObject.right = true; });
        buttonright.events.onInputOut.add(() => { this.moveObject.right = false; });
        buttonright.events.onInputDown.add(() => { this.moveObject.right = true; });
        buttonright.events.onInputUp.add(() => { this.moveObject.right = false; });
        buttonright.scale.setTo(2);

        var buttondown = this.game.add.button(offsetX + 208, offsetY + this.h - 136, 'buttonvertical', null, this, 0, 1, 0, 1);
        buttondown.fixedToCamera = true;
        buttondown.events.onInputOver.add(() => { this.moveObject.down = true; });
        buttondown.events.onInputOut.add(() => { this.moveObject.down = false; });
        buttondown.events.onInputDown.add(() => { this.moveObject.down = true; });
        buttondown.events.onInputUp.add(() => { this.moveObject.down = false; });
        buttondown.scale.setTo(2);

        var buttonup = this.game.add.button(offsetX + 208, offsetY + this.h - 326, 'buttonvertical', null, this, 0, 1, 0, 1);
        buttonup.fixedToCamera = true;
        buttonup.events.onInputOver.add(() => { this.moveObject.up = true; });
        buttonup.events.onInputOut.add(() => { this.moveObject.up = false; });
        buttonup.events.onInputDown.add(() => { this.moveObject.up = true; });
        buttonup.events.onInputUp.add(() => { this.moveObject.up = false; });
        buttonup.scale.setTo(2);

        var buttonbottomleft = this.game.add.button(offsetX + 112, offsetY + this.h - 136, 'buttondiagonal', null, this, 6, 4, 6, 4);
        buttonbottomleft.fixedToCamera = true;
        buttonbottomleft.events.onInputOver.add(() => { this.moveObject.left = true; this.moveObject.down = true; });
        buttonbottomleft.events.onInputOut.add(() => { this.moveObject.left = false; this.moveObject.down = false; });
        buttonbottomleft.events.onInputDown.add(() => { this.moveObject.left = true; this.moveObject.down = true; });
        buttonbottomleft.events.onInputUp.add(() => { this.moveObject.left = false; this.moveObject.down = false; });
        buttonbottomleft.scale.setTo(2);

        var buttonbottomright = this.game.add.button(offsetX + 272, offsetY + this.h - 136, 'buttondiagonal', null, this, 7, 5, 7, 5);
        buttonbottomright.fixedToCamera = true;
        buttonbottomright.events.onInputOver.add(() => { this.moveObject.right = true; this.moveObject.down = true; });
        buttonbottomright.events.onInputOut.add(() => { this.moveObject.right = false; this.moveObject.down = false; });
        buttonbottomright.events.onInputDown.add(() => { this.moveObject.right = true; this.moveObject.down = true; });
        buttonbottomright.events.onInputUp.add(() => { this.moveObject.right = false; this.moveObject.down = false; });
        buttonbottomright.scale.setTo(2);

        var buttonupright = this.game.add.button(offsetX + 272, offsetY + this.h - 296, 'buttondiagonal', null, this, 3, 1, 3, 1);
        buttonupright.fixedToCamera = true;
        buttonupright.events.onInputOver.add(() => { this.moveObject.right = true; this.moveObject.up = true; });
        buttonupright.events.onInputOut.add(() => { this.moveObject.right = false; this.moveObject.up = false; });
        buttonupright.events.onInputDown.add(() => { this.moveObject.right = true; this.moveObject.up = true; });
        buttonupright.events.onInputUp.add(() => { this.moveObject.right = false; this.moveObject.up = false; });
        buttonupright.scale.setTo(2);

        var buttonupleft = this.game.add.button(offsetX + 112, offsetY + this.h - 296, 'buttondiagonal', null, this, 2, 0, 2, 0);
        buttonupleft.fixedToCamera = true;
        buttonupleft.events.onInputOver.add(() => { this.moveObject.left = true; this.moveObject.up = true; });
        buttonupleft.events.onInputOut.add(() => { this.moveObject.left = false; this.moveObject.up = false; });
        buttonupleft.events.onInputDown.add(() => { this.moveObject.left = true; this.moveObject.up = true; });
        buttonupleft.events.onInputUp.add(() => { this.moveObject.left = false; this.moveObject.up = false; });
        buttonupleft.scale.setTo(2);

    }
}

window.onload = () => {
    let game = new MazeGame();
}