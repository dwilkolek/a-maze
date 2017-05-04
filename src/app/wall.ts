/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { WithSriteInterface } from './with-srite-interface';
export class Wall implements WithSriteInterface {
  public sprite: Phaser.Sprite;
  public collide(a: any, b: any) {
    return;
  }

  constructor(sprite: Phaser.Sprite, private game: Phaser.Game) {
    this.sprite = sprite;
  }
}