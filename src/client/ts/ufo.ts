class Ufo {

  position = { x: 0, y: 0 }
  sprite: Phaser.Sprite;
  cursors: Phaser.CursorKeys;
  private scaleToTile = 0.5;
  constructor(private game: Phaser.Game, private wallManager: WallManager) {
    this.sprite = game.add.sprite(this.position.x + Consts.tileSize * 0.5, this.position.y + Consts.tileSize * 0.5, 'ufo');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.setTo(Consts.tileSize / 512 * this.scaleToTile, Consts.tileSize / 512 * this.scaleToTile);
    // this.sprite.body = true;
    // this.game.physics.arcade.enable(this.sprite);
    game.physics.p2.enable(this.sprite);

    this.sprite.body.setCircle(Consts.tileSize * 0.5 * this.scaleToTile);
    this.cursors = game.input.keyboard.createCursorKeys();
    this.sprite.body.debug = true;

    this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    // var graphics = game.add.graphics(0, 0);

    // // graphics.lineStyle(2, 0xffd900, 1);

    // graphics.beginFill(0xFF0000, 1);
    // graphics.drawCircle(this.position.x + Consts.tileSize * 0.5, this.position.y + Consts.tileSize * 0.5, Consts.tileSize * 0.5);

  }


  update() {
    this.move();
  }

  move() {
    this.sprite.body.setZeroRotation();
    this.sprite.body.setZeroVelocity();
    var step = Consts.tileSize*2;
    if (this.cursors.left.isDown)
    {
        this.sprite.body.moveLeft(step);
    }
    else if (this.cursors.right.isDown)
    {
        this.sprite.body.moveRight(step);
    }

    if (this.cursors.up.isDown)
    {
        this.sprite.body.moveUp(step);
    }
    else if (this.cursors.down.isDown)
    {
        this.sprite.body.moveDown(step);
    }
  }

}