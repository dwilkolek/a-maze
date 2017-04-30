/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { WallManager } from './wall-manager';
import { Consts } from './const';
import { Collisions } from './collisions';

export class GemManager {

  public gems: Phaser.Group;
  public golds: Phaser.Group;
  constructor(private game: Phaser.Game, private size: { x: number, y: number }) {
    this.gems = this.game.add.group();
    this.golds = this.game.add.group();
  }

  start() {
    this.spawnGem(); this.spawnGem(); this.spawnGem();
    this.game.time.events.loop(3000, this.spawnGem.bind(this), this);
  }

  spawnGem() {
    var isGem = Math.random() >= 0.2;
    var x = (Math.round(Math.random() * (this.size.x - 1)));
    var y = (Math.round(Math.random() * (this.size.y - 1)));

    var sprite = this.game.add.sprite(x * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, y * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, isGem ? 'gem' : 'gold');
    sprite.anchor.set(0.5);
    sprite.scale.setTo(Consts.tileSize / 16 * 0.3, Consts.tileSize / 16 * 0.3);

    this.game.physics.p2.enable(sprite, false);

    sprite.body.setCircle(Consts.tileSize * 0.15);
    // sprite.body.kinematic = true;
    Collisions.getInstance().add(isGem ? 'gem' : 'gold', sprite);

  }

}