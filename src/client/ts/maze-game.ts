// import { Maze } from './maze'
// import { MazeGenerator } from './maze-generator'
// import { TilePrinter } from './tile-printer'

class MazeGame {

    game: Phaser.Game;

    maze: Maze;

    wallManager: WallManager;

    size: { x: number, y: number } = { x: 15, y: 15 };

    ufo: Ufo;

    constructor() {
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        Consts.tileSize = w/10.0;

        this.game = new Phaser.Game(w, h, Phaser.AUTO, 'content',
            { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
        //


        this.maze = { maze: MazeGenerator.getInstance().generate(this.size) };

    }

    preload() {
        var t = new Date();
        this.game.load.image('ufo', 'assets/ufo.png');
        this.game.load.image('gold', 'assets/gold.png');
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        var t2 = new Date();
        console.log('Preaload:' + (t2.getMilliseconds() - t.getMilliseconds()))
    }

    create() {
        var t = new Date();

        this.game.time.advancedTiming = true;
        this.wallManager = new WallManager(this.game);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.world.setBounds(0, 0, this.size.x * Consts.tileSize, this.size.y * Consts.tileSize);
        this.game.physics.p2.restitution = 0.0;
        this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        // this.game.physics.p2.restitution = 1;
        // this.game.physics.p2.gravity.y = 1;

        this.ufo = new Ufo(this.game, this.wallManager);
        var t2 = new Date();
        console.log('Create:' + (t2.getMilliseconds() - t.getMilliseconds()))
        this.wallManager.draw(this.maze, this.size);
    }

    update() {
        this.ufo.update();
    }

    render() {
        this.wallManager.walls.forEach((c) => {
            this.game.debug.body(c);
        }, this);
        this.game.debug.body(this.ufo.sprite);
        this.game.debug.text(this.game.time.fps.toString() || '--', 2, 15, "#ff0000");
    }
}
var t = new Date();
window.onload = () => {
    console.log('Onload:' + (t2.getMilliseconds() - t.getMilliseconds()))
    let game = new MazeGame();
}
var t2 = new Date();
