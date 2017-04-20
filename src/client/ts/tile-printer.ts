class TilePrinter {

  constructor(private game: Phaser.Game, private tileSize: number) {

  }

  public create(x: number, y: number, value: number) {
    // console.log('creating ', x, y)
    var graphics: Phaser.Graphics = this.game.add.graphics(Consts.margins, Consts.margins);
    var color = (value == 0 ? 0x0000FF : 0xFF0000);
    graphics.lineStyle(2, color, 1);
    graphics.beginFill(color);
    graphics.drawRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
    graphics.endFill();
  }


}