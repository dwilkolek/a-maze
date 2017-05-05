/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { WithSpriteInterface } from './with-sprite-interface';
export class Wall implements WithSpriteInterface {
  public sprite: Phaser.Sprite;
  public collide(a: any, b: any) {
    return;
  }

  constructor(sprite: Phaser.Sprite, private game: Phaser.Game) {
    this.sprite = sprite;
  }
}