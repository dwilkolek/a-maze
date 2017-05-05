/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { Consts } from './const';
import { WallManager } from './wall-manager';

export class Pacman {

  position = { x: 2, y: 3 }
  sprite: Phaser.Sprite;
  cursors: Phaser.CursorKeys;
  emitter: Phaser.Particles.Arcade.Emitter;
  particlesGroup: Phaser.Group;

  private points: number = 0;

  moveObject: { left: boolean, right: boolean, up: boolean, down: boolean }
  touching: boolean = false
  private scaleToTile = 0.4;
  constructor(private game: Phaser.Game, private wallManager: WallManager) {

    this.particlesGroup = this.game.add.group();

    this.sprite = game.add.sprite(this.position.x * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, this.position.y * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, 'ufo');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.setTo(Consts.tileSize / 96 * this.scaleToTile, Consts.tileSize / 96 * this.scaleToTile);

    game.physics.p2.enable(this.sprite, false);
    // this.sprite.body.enableBody = true;

    this.sprite.body.setCircle(Consts.tileSize * 0.5 * this.scaleToTile);
    this.cursors = game.input.keyboard.createCursorKeys();

    this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    // this.game.time.events.loop(300, this.particles.bind(this), this);
    if (!this.game.device.desktop) {
      this.game.input.addMoveCallback((e: any) => {
        this.game.physics.arcade.moveToXY(this.sprite, e.worldX, e.worldY, this.speed);
        this.touching = true;
      }, this)

      this.game.input.onUp.add(() => {
        this.touching = false;
        this.game.physics.arcade.moveToXY(this.sprite, this.sprite.position.x, this.sprite.position.y, 0);
      }, this)

    }

  }

  update() {
    if (this.game.device.desktop) {
      this.move();
    }
  }

  move() {
    this.sprite.body.setZeroRotation();
    this.sprite.body.setZeroVelocity();
    var step = Consts.tileSize * 2;

    this.stopMoving();

    if (this.cursors.left.isDown) {
      this.moveObject.left = true;
    }
    else if (this.cursors.right.isDown) {
      this.moveObject.right = true;
    }

    if (this.cursors.up.isDown) {
      this.moveObject.up = true;
    }
    else if (this.cursors.down.isDown) {
      this.moveObject.down = true;
    }



    this.makeMoveFromMoveObject();
  }

  stopMoving() {
    this.moveObject = { left: false, right: false, up: false, down: false }
  }

  get speed() {
    return Consts.tileSize * 2;
  }

  makeMoveFromMoveObject() {
    var x = 0;
    var y = 0;


    if (this.moveObject.left) {
      x = -500;
    }
    if (this.moveObject.right) {
      x = +500;
    }
    if (this.moveObject.up) {
      y = -500;
    }
    if (this.moveObject.down) {
      y = +500;
    }

    if (x != 0 || y != 0) {
      this.game.physics.arcade.moveToXY(this.sprite, this.sprite.position.x + x, this.sprite.position.y + y, this.speed);
    } else {
      this.game.physics.arcade.moveToXY(this.sprite, this.sprite.position.x, this.sprite.position.y, 0);
    }
  }

  particles() {
    if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown || this.touching) {

      var particle = this.game.add.sprite(1000, 1000, 'gold');
      particle.visible = false;
      particle.scale.setTo(Consts.tileSize / 32 * this.scaleToTile * 0.3);

      particle.anchor.set(0.5);
      particle.x = this.sprite.x;
      particle.y = this.sprite.y;
      this.particlesGroup.add(particle);
      particle.visible = true;
      var time = 45000;
      var tween = this.game.add.tween(particle);
      var tweenScale = this.game.add.tween(particle.scale);
      tweenScale.to({ y: 0, x: 0 }, time - 2000, Phaser.Easing.Linear.None, true)

      tween.to({ alpha: 0, angle: 8000 }, time, Phaser.Easing.Linear.None);
      tween.onComplete.add((e: any) => {
        e.destroy();
      }, this);
      tween.start();

    }
  }

  addPoints(points: number) {
    this.points += points;
  }

  getPoints() {
    return this.points;
  }

  _killingMode: any;
  isKillingMode: boolean = false;
  killingMode() {
    if (this.isKillingMode) {
      clearTimeout(this._killingMode);
    } else {
      this.isKillingMode = true;
    }

    this._killingMode = setTimeout(() => {
      this.isKillingMode = false;
    }, 10000);
  }



}