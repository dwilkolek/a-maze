/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>

export interface WithSpriteInterface {
  sprite: Phaser.Sprite;
  collide: (a: any, b: any) => void;
}