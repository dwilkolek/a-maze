/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>

export interface WithSriteInterface {
  sprite: Phaser.Sprite;
  collide: (a: any, b: any) => void;
}