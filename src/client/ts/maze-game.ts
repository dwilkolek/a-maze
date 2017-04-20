// import { Maze } from './maze'
// import { MazeGenerator } from './maze-generator'
// import { TilePrinter } from './tile-printer'

class MazeGame {

    game: Phaser.Game;

    maze: Maze;

    tileSize: number;

    tilePrinter: TilePrinter;


    constructor() {

        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        this.game = new Phaser.Game(w, h, Phaser.AUTO, 'content',
            { preload: this.preload, create: this.create, update: this.update.bind(this), renderer: this.renderer });
        console.log("game started with:" + w + 'x' + h);
        this.maze = MazeGenerator.maze();
        this.tileSize = (h - 2 * Consts.margins) / this.maze.map.length;
        console.log(this.tileSize)
        this.tilePrinter = new TilePrinter(this.game, this.tileSize);
    }

    preload() { }

    create() { }

    update() {
        this.maze.map.forEach((row: number[], y: number) => {
            row.forEach((cell: number, x: number) => {
                this.tilePrinter.create(x, y, cell);
            })
        })
    }

    renderer() {
        this.game.debug.text(this.game.time.fps.toString() || '--', 2, 14, "#00ff00");
    }
}

window.onload = () => {
    let game = new MazeGame();
}