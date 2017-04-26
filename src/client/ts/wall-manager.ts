class WallManager {

  thickness: number = 0.1;

  public bg: Phaser.Group;
  public walls: Phaser.Group;
  palette = {
    bord: 0x888888,
    bg: 0x222222,
    color: 0xFF0000,
    opacity: 0.27,
    startbg: 0x000000,
    endbg: 0xeeee00
  }

  constructor(private game: Phaser.Game) {
    this.bg = game.add.group();
    this.walls = game.add.group();
  }

  public static get mazeOffset() {
    return Consts.tileSize / 15;
  }
  public draw(maze: Maze, size: { x: number, y: number }) {
    var offsetForBorder = Consts.tileSize * this.thickness;
    var floor = this.game.add.tileSprite(WallManager.mazeOffset, WallManager.mazeOffset, size.x * Consts.tileSize, size.y * Consts.tileSize, 'maze-bg');
    this.bg.add(floor);


    this.addBorders(size);

    maze.cols.forEach((col, colIndex) => {
      var offset = 0;
      col.forEach(wall => {
        if (!wall.wall) {
          this.addWall(size,
            (colIndex + 1) * Consts.tileSize,
            offset * Consts.tileSize,
            this.thickness * Consts.tileSize,
            wall.count * Consts.tileSize + offsetForBorder,
            false
          )
        }
        offset += wall.count
      })
    })

    maze.rows.forEach((row, rowIndex) => {
      var offset = 0;
      row.forEach(wall => {
        if (!wall.wall) {
          this.addWall(size,
            offset * Consts.tileSize,
            (rowIndex + 1) * Consts.tileSize,
            wall.count * Consts.tileSize + offsetForBorder,
            this.thickness * Consts.tileSize,
            false
          )
        }
        offset += wall.count
      })
    })


  }

  private addBorders(size: { x: number, y: number }) {
    var color = 0x000000;
    var opacity = 1;
    this.addWall(size, 0, 0, size.x * Consts.tileSize + WallManager.mazeOffset * 2, WallManager.mazeOffset * 1, true, color, opacity);
    this.addWall(size, 0, size.y * Consts.tileSize + WallManager.mazeOffset, size.x * Consts.tileSize + WallManager.mazeOffset * 2, WallManager.mazeOffset * 1, true, color, opacity);

    this.addWall(size, 0, 0, WallManager.mazeOffset * 1, size.y * Consts.tileSize + WallManager.mazeOffset * 2, true, color, opacity);
    this.addWall(size, size.x * Consts.tileSize + WallManager.mazeOffset, 0, WallManager.mazeOffset * 1, size.y * Consts.tileSize + WallManager.mazeOffset * 2, true, color, opacity);


  }

  private addWall(size: { x: number, y: number }, x: number, y: number, width: number, height: number, isBorder: boolean, color?: number, opacity?: number) {
    if (!isBorder) {
      x += WallManager.mazeOffset;
      y += WallManager.mazeOffset;
    }
    var maxWidth = size.x * Consts.tileSize + WallManager.mazeOffset;
    var maxHeight = size.y * Consts.tileSize + WallManager.mazeOffset;
    var graphics = this.game.add.graphics(Consts.margins, Consts.margins);
    graphics.lineStyle(2, color || color === 0 ? color : this.palette.color, 1);
    graphics.beginFill(color || color === 0 ? color : this.palette.color);
    graphics.drawRect(
      0,
      0,
      x + width > maxWidth && !isBorder ? maxWidth - (x) : width,
      y + height > maxHeight && !isBorder ? maxHeight - (y) : height,
    );
    // if (!isBorder) {
    graphics.alpha = (opacity || opacity === 0 ? opacity : this.palette.opacity);
    // }
    graphics.endFill();
    graphics.boundsPadding = 0;
    var shapeSprite: Phaser.Sprite = this.game.add.sprite(x, y);
    this.game.physics.p2.enable(shapeSprite, false, true);
    shapeSprite.addChild(graphics);

    shapeSprite.body.clearShapes();
    shapeSprite.body.addRectangle(width, height, width / 2.0, height / 2.0);
    // shapeSprite.body.debug = true;
    shapeSprite.body.kinematic = true;
    this.walls.add(shapeSprite);
  }

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

  private offset(value: number) {
    return value * this.wallThickness();
  }

  private wallThickness() {
    return Consts.tileSize * this.thickness;
  }

}