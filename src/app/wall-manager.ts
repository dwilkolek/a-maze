/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { Consts } from './const';
import { Maze } from './maze';
import { Collisions } from './collisions';
import { Wall } from './wall';

export class WallManager {

  thickness: number = 0.1;

  public bg: Phaser.Group;
  public walls: Phaser.Group;
  palette = {
    color: 0xFF0000,
    opacity: 0.27,
  }

  constructor(private game: Phaser.Game) {
    this.bg = game.add.group();
    this.walls = game.add.group();
    this.walls.enableBody = true;
    this.walls.physicsBodyType = Phaser.Physics.P2JS;
  }

  public static get mazeOffset(): number {
    return Consts.tileSize * 8;
  }
  public draw(size: { x: number, y: number }) {
    var offsetForBorder = Consts.tileSize * this.thickness;
    var floor = this.game.add.tileSprite(WallManager.mazeOffset, WallManager.mazeOffset, size.x * Consts.tileSize, size.y * Consts.tileSize, 'maze-bg');
    this.bg.add(floor);


    this.addBorders(size);
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
    graphics.alpha = (opacity || opacity === 0 ? opacity : this.palette.opacity);
    graphics.endFill();
    graphics.boundsPadding = 0;
    var shapeSprite: Phaser.Sprite = this.walls.create(x,y);// this.game.add.sprite(x, y);
    this.game.physics.p2.enable(shapeSprite, true);
    shapeSprite.addChild(graphics);

    shapeSprite.body.clearShapes();
    shapeSprite.body.addRectangle(width, height, width / 2.0, height / 2.0);
    shapeSprite.body.kinematic = true;

    Collisions.getInstance().add('wall', new Wall(shapeSprite, this.game));

  }

  private offset(value: number) {
    return value * this.wallThickness();
  }

  private wallThickness() {
    return Consts.tileSize * this.thickness;
  }

}