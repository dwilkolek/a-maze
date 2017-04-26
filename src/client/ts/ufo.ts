class Ufo {

  position = { x: 0, y: 0 }
  sprite: Phaser.Sprite;
  cursors: Phaser.CursorKeys;
  emitter: Phaser.Particles.Arcade.Emitter;
  particlesGroup: Phaser.Group;

  private scaleToTile = 0.5;
  constructor(private game: Phaser.Game, private wallManager: WallManager) {

    this.particlesGroup = this.game.add.group();

    this.sprite = game.add.sprite(this.position.x + Consts.tileSize * 0.5, this.position.y + Consts.tileSize * 0.5, 'ufo');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.setTo(Consts.tileSize / 512 * this.scaleToTile, Consts.tileSize / 512 * this.scaleToTile);
    // this.sprite.body = true;
    // this.game.physics.arcade.enable(this.sprite);
    game.physics.p2.enable(this.sprite);

    this.sprite.body.setCircle(Consts.tileSize * 0.5 * this.scaleToTile);
    this.cursors = game.input.keyboard.createCursorKeys();
    // this.sprite.body.debug = true;

    this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    this.game.time.events.loop(300, this.particles.bind(this), this)

    // var graphics = game.add.graphics(0, 0);

    // // graphics.lineStyle(2, 0xffd900, 1);

    // graphics.beginFill(0xFF0000, 1);
    // graphics.drawCircle(this.position.x + Consts.tileSize * 0.5, this.position.y + Consts.tileSize * 0.5, Consts.tileSize * 0.5);

  }

  moveObject: { up: boolean, down: boolean, left: boolean, right: boolean };
  update(moveObject: { up: boolean, down: boolean, left: boolean, right: boolean }) {
    this.moveObject = moveObject;
    this.move(moveObject);
  }

  move(moveObject: { up: boolean, down: boolean, left: boolean, right: boolean }) {
    this.sprite.body.setZeroRotation();
    this.sprite.body.setZeroVelocity();
    var step = Consts.tileSize * 2;
    if (this.cursors.left.isDown || moveObject.left) {
      this.sprite.body.moveLeft(step);
    }
    else if (this.cursors.right.isDown || moveObject.right) {
      this.sprite.body.moveRight(step);
    }

    if (this.cursors.up.isDown || moveObject.up) {
      this.sprite.body.moveUp(step);
    }
    else if (this.cursors.down.isDown || moveObject.down) {
      this.sprite.body.moveDown(step);
    }
  }
  particles() {
    if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown ||
      (this.moveObject ? (this.moveObject.left || this.moveObject.right || this.moveObject.up || this.moveObject.down) : false)) {

      var particle = this.game.add.sprite(1000, 1000, 'gold');
      particle.visible = false;
      particle.scale.setTo(Consts.tileSize / 32 * this.scaleToTile * 0.3);

      particle.anchor.set(0.5);
      particle.x = this.sprite.x;
      particle.y = this.sprite.y;
      // particle.alpha = 0.5;
      this.particlesGroup.add(particle);
      particle.visible = true;
      var time = 45000;
      var tween = this.game.add.tween(particle);
      var tweenScale = this.game.add.tween(particle.scale);
      tweenScale.to({ y: 0, x: 0 }, time - 2000, Phaser.Easing.Linear.None, true)

      tween.to({ alpha: 0, angle: 8000 }, time, Phaser.Easing.Linear.None);
      tween.onComplete.add((e) => {
        e.destroy();
      }, this);
      tween.start();

    }
  }

}