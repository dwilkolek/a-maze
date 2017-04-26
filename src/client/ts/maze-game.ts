// import { Maze } from './maze'
// import { MazeGenerator } from './maze-generator'
// import { TilePrinter } from './tile-printer'

class MazeGame {

    game: Phaser.Game;

    maze: Maze;

    wallManager: WallManager;

    size: { x: number, y: number } = { x: 20, y: 20 };

    ufo: Ufo;
    w: number;
    h: number

    constructor() {
        this.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        Consts.tileSize = this.w / 15;

        this.game = new Phaser.Game(this.w, this.h, Phaser.AUTO, 'content',
            { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
        //


        this.maze = MazeGenerator.getInstance().generate(this.size) ;
        //console.log(JSON.stringify(this.maze.maze))
    }

    preload() {
        var t = new Date();
        this.game.load.image('ufo', 'assets/ufo.png');
        this.game.load.image('gold', 'assets/gold.png');
        this.game.load.image('maze-bg', 'assets/maze-bg.png');

        this.game.load.spritesheet('buttonvertical', 'assets/button-vertical.png', 32, 64);
        this.game.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png', 64, 32);
        this.game.load.spritesheet('buttondiagonal', 'assets/button-diagonal.png', 48, 48);

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        var t2 = new Date();
        console.log('Preaload:' + (t2.getMilliseconds() - t.getMilliseconds()))
    }

    create() {
        var t = new Date();

        // this.game.time.advancedTiming = true;
        this.wallManager = new WallManager(this.game);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.world.setBounds(0, 0, this.size.x * Consts.tileSize + WallManager.mazeOffset*2, this.size.y * Consts.tileSize + WallManager.mazeOffset*2);
        this.game.physics.p2.restitution = 0.0;
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        // this.game.physics.p2.restitution = 1;
        // this.game.physics.p2.gravity.y = 1;

        this.ufo = new Ufo(this.game, this.wallManager);
        var t2 = new Date();
        console.log('Create:' + (t2.getMilliseconds() - t.getMilliseconds()))
        this.wallManager.draw(this.maze, this.size);
        if (!this.game.device.desktop) {
            this.game.input.onDown.add(() => {
                this.game.scale.startFullScreen(false);
            }, this);
            this.buttons();
        }

    }

    update() {
        this.ufo.update(this.moveObject);
    }

    render() {
        // this.wallManager.walls.forEach((c) => {
        //     this.game.debug.body(c);
        // }, this);
        // this.game.debug.body(this.ufo.sprite);
        // this.game.debug.text(this.game.time.fps.toString() || '--', 2, 15, "#ff0000");
    }

    // addButton(field) {
    //     var buttonleft = this.game.add.button(0, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    //     buttonleft.fixedToCamera = true;
    //     buttonleft.events.onInputOver.add(function () { left = true; });
    //     buttonleft.events.onInputOut.add(function () { left = false; });
    //     buttonleft.events.onInputDown.add(function () { left = true; });
    //     buttonleft.events.onInputUp.add(function () { left = false; });
    // }

    moveObject = { left: false, right: false, up: false, down: false }
    buttons() {
        var buttonSize = 50;
        var buttonleft = this.game.add.button(20, this.h - 100, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonleft.fixedToCamera = true;
        buttonleft.events.onInputOver.add(() => { this.moveObject.left = true; });
        buttonleft.events.onInputOut.add(() => { this.moveObject.left = false; });
        buttonleft.events.onInputDown.add(() => { this.moveObject.left = true; });
        buttonleft.events.onInputUp.add(() => { this.moveObject.left = false; });

        var buttonright = this.game.add.button(20 + 80, this.h - 100, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonright.fixedToCamera = true;
        buttonright.events.onInputOver.add(() => { this.moveObject.right = true; });
        buttonright.events.onInputOut.add(() => { this.moveObject.right = false; });
        buttonright.events.onInputDown.add(() => { this.moveObject.right = true; });
        buttonright.events.onInputUp.add(() => { this.moveObject.right = false; });


        var buttondown = this.game.add.button(20 + 64 - 8, this.h - 76, 'buttonvertical', null, this, 0, 1, 0, 1);
        buttondown.fixedToCamera = true;
        buttondown.events.onInputOver.add(() => { this.moveObject.down = true; });
        buttondown.events.onInputOut.add(() => { this.moveObject.down = false; });
        buttondown.events.onInputDown.add(() => { this.moveObject.down = true; });
        buttondown.events.onInputUp.add(() => { this.moveObject.down = false; });

        var buttonup = this.game.add.button(20 + 64 - 8, this.h - 92 - 64, 'buttonvertical', null, this, 0, 1, 0, 1);
        buttonup.fixedToCamera = true;
        buttonup.events.onInputOver.add(() => { this.moveObject.up = true; });
        buttonup.events.onInputOut.add(() => { this.moveObject.up = false; });
        buttonup.events.onInputDown.add(() => { this.moveObject.up = true; });
        buttonup.events.onInputUp.add(() => { this.moveObject.up = false; });

        var buttonbottomleft = this.game.add.button(20 + 8, this.h - 100 + 32, 'buttondiagonal', null, this, 6, 4, 6, 4);
        buttonbottomleft.fixedToCamera = true;
        buttonbottomleft.events.onInputOver.add(() => { this.moveObject.left = true; this.moveObject.down = true; });
        buttonbottomleft.events.onInputOut.add(() => { this.moveObject.left = false; this.moveObject.down = false; });
        buttonbottomleft.events.onInputDown.add(() => { this.moveObject.left = true; this.moveObject.down = true; });
        buttonbottomleft.events.onInputUp.add(() => { this.moveObject.left = false; this.moveObject.down = false; });

        var buttonbottomright = this.game.add.button(20 + 8 + 32 + 48, this.h - 100 + 32, 'buttondiagonal', null, this, 7, 5, 7, 5);
        buttonbottomright.fixedToCamera = true;
        buttonbottomright.events.onInputOver.add(() => { this.moveObject.right = true; this.moveObject.down = true; });
        buttonbottomright.events.onInputOut.add(() => { this.moveObject.right = false; this.moveObject.down = false; });
        buttonbottomright.events.onInputDown.add(() => { this.moveObject.right = true; this.moveObject.down = true; });
        buttonbottomright.events.onInputUp.add(() => { this.moveObject.right = false; this.moveObject.down = false; });

        var buttonupright = this.game.add.button(20 + 8 + 32 + 48, this.h - 100 - 32 - 16, 'buttondiagonal', null, this, 3, 1, 3, 1);
        buttonupright.fixedToCamera = true;
        buttonupright.events.onInputOver.add(() => { this.moveObject.right = true; this.moveObject.up = true; });
        buttonupright.events.onInputOut.add(() => { this.moveObject.right = false; this.moveObject.up = false; });
        buttonupright.events.onInputDown.add(() => { this.moveObject.right = true; this.moveObject.up = true; });
        buttonupright.events.onInputUp.add(() => { this.moveObject.right = false; this.moveObject.up = false; });

        var buttonupleft = this.game.add.button(20 + 8, this.h - 100 - 32 - 16, 'buttondiagonal', null, this, 2, 0, 2, 0);
        buttonupleft.fixedToCamera = true;
        buttonupleft.events.onInputOver.add(() => { this.moveObject.left = true; this.moveObject.up = true; });
        buttonupleft.events.onInputOut.add(() => { this.moveObject.left = false; this.moveObject.up = false; });
        buttonupleft.events.onInputDown.add(() => { this.moveObject.left = true; this.moveObject.up = true; });
        buttonupleft.events.onInputUp.add(() => { this.moveObject.left = false; this.moveObject.up = false; });


    }
}

window.onload = () => {
    let game = new MazeGame();
}