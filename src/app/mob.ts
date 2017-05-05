/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { Consts } from './const';
import { Collisions } from './collisions';
import { WithSpriteInterface } from './with-sprite-interface';

export class Mob implements WithSpriteInterface {
  public sprite: Phaser.Sprite;
  private isMoving: boolean = false;
  constructor(sprite: Phaser.Sprite, private game: Phaser.Game) {
    this.sprite = sprite;
    setInterval(this.collide.bind(this), 3000)
  }

  pos: { x: number, y: number }
  public move() {
    if (this.sprite && this.sprite.body && !this.pos) {
      this.sprite.body.setZeroRotation();
      this.sprite.body.setZeroVelocity();
      this.pos = this.randomPosition();
      this.game.physics.arcade.moveToXY(this.sprite, this.pos.x, this.pos.y, Consts.tileSize / 3, 3000);
      this.isMoving = true;
    }
  }

  public collide(a: any, b: any) {
    if (this.sprite && this.sprite.body) {
      if (this.pos) {
        this.pos = null;
        this.move();
      } else {
        Collisions.collisionSolver(a, b);
      }
    }
  }

  private randomPosition(): { x: number, y: number } {
    var distance = Consts.tileSize * 5;
    var x = Math.random() * distance;
    var y = Math.sqrt(distance * distance - x * x);

    return { x: this.sprite.position.x + this.randomSign(x), y: this.sprite.position.y + this.randomSign(y) }
  }

  private randomSign(value: number) {
    return (Math.random() > 0.5 ? 1 : -1) * value;
  }

}