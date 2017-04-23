// import { Maze } from './maze'
// import { MazeGenerator } from './maze-generator'
// import { TilePrinter } from './tile-printer'

class MazeGame {

    game: Phaser.Game;

    maze: Maze;

    tileSize: number;

    tilePrinter: TilePrinter;

    size: { x: number, y: number } = { x: 20, y: 15 };

    constructor() {

        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        this.game = new Phaser.Game(w, h, Phaser.AUTO, 'content',
            { preload: this.preload, create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
        console.log("game started with:" + w + 'x' + h);
        // this.maze = MazeGenerator.getInstance().maze();
        this.maze = { maze: MazeGenerator.getInstance().f(this.size) };
        this.tileSize = (h - 2 * Consts.margins) / this.size.y;
        console.log(this.tileSize)

    }

    preload() { }

    create() {
        this.tilePrinter = new TilePrinter(this.game, this.tileSize);
    }

    update() { // this.tilePrinter.create(x, y, cell);

        for (var i = 0; i < this.maze.maze.length; i++) {
            // $('#maze > tbody').append("<tr>");
            for (var j = 0; j < this.maze.maze[i].length; j++) {
                // var selector = i + "-" + j;
                // $('#maze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
                this.tilePrinter.create(j, i, this.maze.maze[i][j], this.size)
                // if (this.maze.maze[i][j][0] == 0) { $('#' + selector).css('border-top', '2px solid black'); }
                // if (this.maze.maze[i][j][1] == 0) { $('#' + selector).css('border-right', '2px solid black'); }
                // if (this.maze.maze[i][j][2] == 0) { $('#' + selector).css('border-bottom', '2px solid black'); }
                // if (this.maze.maze[i][j][3] == 0) { $('#' + selector).css('border-left', '2px solid black'); }
            }
            // $('#maze > tbody').append("</tr>");
        }
    }
    // }

    render() {
        this.game.debug.text(this.game.time.fps.toString() || '--', 2, 15, "#ff0000");
    }
}

window.onload = () => {
    let game = new MazeGame();
}