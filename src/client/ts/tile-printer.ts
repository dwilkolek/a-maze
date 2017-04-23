class TilePrinter {

  thickness: number = 0.1;

  bg: Phaser.Group;
  walls: Phaser.Group;

  constructor(private game: Phaser.Game, private tileSize: number) {
    this.bg = game.add.group();
    this.walls = game.add.group();
  }

  public create(x: number, y: number, value: number[], finishPosition: { x: number, y: number }) {
    // console.log('creating ', x, y)
    // if (this.maze.maze[i][j][0] == 0) { $('#' + selector).css('border-top', '2px solid black'); }
    // if (this.maze.maze[i][j][1] == 0) { $('#' + selector).css('border-right', '2px solid black'); }
    // if (this.maze.maze[i][j][2] == 0) { $('#' + selector).css('border-bottom', '2px solid black'); }
    // if (this.maze.maze[i][j][3] == 0) { $('#' + selector).css('border-left', '2px solid black'); }
    var graphics: Phaser.Graphics = this.game.add.graphics(Consts.margins, Consts.margins);
    var bord = 0x888888;
    var bg = 0x222222;
    var color = 0x0a4c51;
    var startbg = 0x008800;
    var endbg = 0xeeee00;

    if (x == 0 && y == 0) {
      bg = startbg;
      // graphics.lineStyle(1, bg, 1);
      // graphics.beginFill(bg);
      // graphics.drawRect(
      //   x * this.tileSize - x * this.tileSize * this.thickness,
      //   y * this.tileSize - y * this.tileSize * this.thickness,
      //   this.tileSize,
      //   this.tileSize
      // );
      graphics.endFill();
      this.bg.add(graphics);
    }
    if (x == finishPosition.x - 1 && y == finishPosition.y - 1) {
      bg = endbg;

      // );


    }
    graphics.lineStyle(1, bord, 1);
    graphics.beginFill(bg);
    graphics.drawRect(
      x * this.tileSize - x * this.tileSize * this.thickness,
      y * this.tileSize - y * this.tileSize * this.thickness,
      this.tileSize,
      this.tileSize
    );
    graphics.endFill();
    this.bg.add(graphics);


    // graphics.lineStyle(1, bord, 1);
    // graphics.beginFill(bg);
    // graphics.drawRect(
    //   x * this.tileSize - x * this.tileSize * this.thickness,
    //   y * this.tileSize - y * this.tileSize * this.thickness,
    //   this.tileSize,
    //   this.tileSize
    // );
    // graphics.endFill();

    // - x * this.tileSize * this.thickness
    // - y * this.tileSize * this.thickness
    if (value[0] == 0) {
      if (!(x == 0 && y == 0)) {
        graphics = this.game.add.graphics(Consts.margins, Consts.margins);
        graphics.lineStyle(2, color, 1);
        graphics.beginFill(color);
        graphics.drawRect(
          x * this.tileSize - x * this.tileSize * this.thickness,
          y * this.tileSize - y * this.tileSize * this.thickness,
          this.tileSize,// - this.tileSize * this.thickness,
          this.tileSize * this.thickness
        );
        graphics.endFill();
        this.walls.add(graphics);
      }
    }
    if (value[1] == 0) {
      if (!(x == finishPosition.x - 1 && y == finishPosition.y - 1)) {

        graphics = this.game.add.graphics(Consts.margins, Consts.margins);
        graphics.lineStyle(2, color, 1);
        graphics.beginFill(color);
        graphics.drawRect(
          (x + 1) * this.tileSize - this.tileSize * this.thickness - x * this.tileSize * this.thickness,
          y * this.tileSize - y * this.tileSize * this.thickness,
          this.tileSize * this.thickness,
          this.tileSize// - this.tileSize * this.thickness
        );
        graphics.endFill();
        this.walls.add(graphics);
      }
    }
    if (value[2] == 0) {
      graphics = this.game.add.graphics(Consts.margins, Consts.margins);
      graphics.lineStyle(2, color, 1);
      graphics.beginFill(color);
      graphics.drawRect(
        x * this.tileSize - x * this.tileSize * this.thickness,
        (y + 1) * this.tileSize - this.tileSize * this.thickness - y * this.tileSize * this.thickness,
        this.tileSize,// - this.tileSize * this.thickness,
        this.tileSize * this.thickness
      );
      graphics.endFill();
      this.walls.add(graphics);

    }
    if (value[3] == 0) {
      graphics = this.game.add.graphics(Consts.margins, Consts.margins);
      graphics.lineStyle(2, color, 1);
      graphics.beginFill(color);
      graphics.drawRect(
        x * this.tileSize - x * this.tileSize * this.thickness,
        y * this.tileSize - y * this.tileSize * this.thickness,
        this.tileSize * this.thickness,
        this.tileSize// - this.tileSize * this.thickness
      );
      graphics.endFill();
      this.walls.add(graphics);
    }
  }

  // private color(value) {
  //   return (value == 0 ? 0x0000FF : 0xFF0000);
  // }

}