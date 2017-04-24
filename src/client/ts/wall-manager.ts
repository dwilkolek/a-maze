class WallManager {

  thickness: number = 0.1;

  public bg: Phaser.Group;
  public walls: Phaser.Group;
  colors = {
    bord: 0x888888,
    bg: 0x222222,
    color: 0x0a4c51,
    startbg: 0x000000,
    endbg: 0xeeee00
  }

  constructor(private game: Phaser.Game) {
    this.bg = game.add.group();
    this.walls = game.add.group();
  }

  public draw(maze: Maze, size: { x: number, y: number }) {
    this.game.paused = true;
    var t = new Date();
    console.log()
    for (var i = 0; i < maze.maze.length; i++) {
      for (var j = 0; j < maze.maze[i].length; j++) {
        this.create(j, i, maze.maze[i][j], size)
      }
    }
    this.game.paused = false;
    var t2 = new Date();
    console.log('Maze draw finished in:' + (t2.getMilliseconds() - t.getMilliseconds()), this.bg.length, this.walls.length)
    // setTimeout(() => {
    //   this.bg.cacheAsBitmap = true;
    //   this.walls.cacheAsBitmap = true;
    // })
  }

  private create(x: number, y: number, value: number[], finishPosition: { x: number, y: number }) {
    // console.log('creating ', x, y)
    // if (this.maze.maze[i][j][0] == 0) { $('#' + selector).css('border-top', '2px solid black'); }
    // if (this.maze.maze[i][j][1] == 0) { $('#' + selector).css('border-right', '2px solid black'); }
    // if (this.maze.maze[i][j][2] == 0) { $('#' + selector).css('border-bottom', '2px solid black'); }
    // if (this.maze.maze[i][j][3] == 0) { $('#' + selector).css('border-left', '2px solid black'); }

    this.drawFloor(x, y, finishPosition);

    // graphics.lineStyle(1, bord, 1);
    // graphics.beginFill(bg);
    // graphics.drawRect(
    //   x * Consts.tileSize - this.offset(x),
    //   y * Consts.tileSize - this.offset(y),
    //   Consts.tileSize,
    //   Consts.tileSize
    // );
    // graphics.endFill();
    // - this.offset(x)
    // - this.offset(y)
    if (value[0] == 0) {
      // if (!(x == 0 && y == 0)) {
      // graphics = this.game.add.graphics(Consts.margins, Consts.margins);
      // graphics.lineStyle(2, color, 1);
      // graphics.beginFill(color);
      // graphics.drawRect(
      this.addWall(
        x * Consts.tileSize - this.offset(x),
        y * Consts.tileSize - this.offset(y),
        Consts.tileSize,// - this.wallThickness(),
        this.wallThickness()
      )
      // );
      // graphics.endFill();
      // this.walls.add(graphics);
      // }
    }
    if (value[1] == 0) {
      // if (!(x == finishPosition.x - 1 && y == finishPosition.y - 1)) {

      // graphics = this.game.add.graphics(Consts.margins, Consts.margins);
      // graphics.lineStyle(2, color, 1);
      // graphics.beginFill(color);
      // graphics.drawRect(
      this.addWall(
        (x + 1) * Consts.tileSize - this.wallThickness() - this.offset(x),
        y * Consts.tileSize - this.offset(y),
        this.wallThickness(),
        Consts.tileSize// - this.wallThickness()
      );
      // graphics.endFill();
      // this.walls.add(graphics);
      // }
    }
    if (value[2] == 0) {
      // graphics = this.game.add.graphics(Consts.margins, Consts.margins);
      // graphics.lineStyle(2, color, 1);
      // graphics.beginFill(color);
      // graphics.drawRect(
      this.addWall(
        x * Consts.tileSize - this.offset(x),
        (y + 1) * Consts.tileSize - this.wallThickness() - this.offset(y),
        Consts.tileSize,// - this.wallThickness(),
        this.wallThickness()
      );
      // graphics.endFill();
      // this.walls.add(graphics);

    }
    if (value[3] == 0) {
      // graphics = this.game.add.graphics(Consts.margins, Consts.margins);
      // graphics.lineStyle(2, color, 1);
      // graphics.beginFill(color);
      // graphics.drawRect(
      this.addWall(
        x * Consts.tileSize - this.offset(x),
        y * Consts.tileSize - this.offset(y),
        this.wallThickness(),
        Consts.tileSize// - this.wallThickness()
      );
      // graphics.endFill();
      // this.walls.add(graphics);
    }
  }

  private addWall(x: number, y: number, width: number, height: number, color?: number) {

    // var sprite = game.add.sprite(100, 50);
    // //drawing
    // var graphic = game.add.graphics();
    // graphic.beginFill('0xff0000');
    // graphic.drawCircle(0, 0, 10);
    // graphic.endFill();    //switching these 2 lines makes the difference
    // //in 2.4 this works, switched it causes the graphic to gain a kind of default body at (0,0)

    // //in 2.3 this works, switched, it blows up with an errorTypeError: Cannot read property 'set' of undefined
    // //in 2.2.2 both work
    // game.physics.p2.enable(sprite, true);
    // sprite.addChild(graphic);
    // sprite.body.setCircle(18);}



    var graphics = this.game.add.graphics(Consts.margins, Consts.margins);
    graphics.lineStyle(2, color ? color : this.colors.color, 1);
    graphics.beginFill(color ? color : this.colors.color);
    graphics.drawRect(
      0,
      0,
      width,
      height
    );
    graphics.endFill();
    graphics.boundsPadding = 0;
    // console.log(x,y, width, height)
    var shapeSprite: Phaser.Sprite = this.game.add.sprite(x, y);
    this.game.physics.p2.enable(shapeSprite, true, true);
    shapeSprite.addChild(graphics);


    // this.game.physics.enable(shapeSprite, Phaser.Physics.ARCADE);
    shapeSprite.body.clearShapes();
    shapeSprite.body.addRectangle(width, height, width/2.0, height/2.0);
    // console.log(shapeSprite.body)
    shapeSprite.body.debug = true;
    shapeSprite.body.kinematic = true;
    // shapeSprite.body.setZeroRotation();
    // shapeSprite.body.setZeroVelocity();
    // shapeSprite.body.setZeroDamping();
    // shapeSprite.body.setZeroForce();
    this.walls.add(shapeSprite);
  }

  private drawFloor(x: number, y: number, finishPosition: { x: number, y: number }) {
    var graphics: Phaser.Graphics = this.game.add.graphics(Consts.margins, Consts.margins);

    var bg = this.colors.bg;

    if (x == 0 && y == 0) {
      bg = this.colors.startbg;
      graphics.endFill();
      this.bg.add(graphics);
    }
    if (x == finishPosition.x - 1 && y == finishPosition.y - 1) {
      bg = this.colors.endbg;
    }
    graphics.lineStyle(1, this.colors.bord, 1);
    graphics.beginFill(bg);
    graphics.drawRect(
      x * Consts.tileSize - this.offset(x),
      y * Consts.tileSize - this.offset(y),
      Consts.tileSize,
      Consts.tileSize
    );
    graphics.endFill();
    this.bg.add(graphics);
  }

  private offset(value: number) {
    return value * this.wallThickness();
  }

  private wallThickness() {
    return Consts.tileSize * this.thickness;
  }

}