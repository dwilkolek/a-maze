/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { WallManager } from './wall-manager';
import { Consts } from './const';
import { Collisions } from './collisions';
import { Pacman } from './pacman';
import { Mob } from './mob';

export class MobManager {

  public mobs: Phaser.Group;
  public mobsInstances: Mob[] = [];
  constructor(private game: Phaser.Game, private pacman: Pacman, private size: { x: number, y: number }) {
  }

  start() {
    this.mobs = this.game.add.group();
    this.spawnMob(); this.spawnMob(); this.spawnMob();
    this.game.time.events.loop(1000, this.spawnMob.bind(this), this);
  }

  spawnMob() {

    var x = (Math.round(Math.random() * (this.size.x - 1)));
    var y = (Math.round(Math.random() * (this.size.y - 1)));
    var dist = this.game.physics.arcade.distanceToXY(
      this.pacman.sprite,
      x * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset,
      y * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset);

    while (Consts.tileSize * 2.5 >= dist) {
      x = (Math.round(Math.random() * (this.size.x - 1)));
      y = (Math.round(Math.random() * (this.size.y - 1)));
      dist = this.game.physics.arcade.distanceToXY(
        this.pacman.sprite,
        x * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset,
        y * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset);
    }
    var sprite = this.game.add.sprite(x * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, y * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, 'hazard');
    sprite.anchor.set(0.5);
    sprite.scale.setTo(Consts.tileSize / 96 * 0.3, Consts.tileSize / 96 * 0.3);
    var tween = this.game.add.tween(sprite);
    tween.to({ alpha: 0 }, 3000, Phaser.Easing.Linear.None);
    tween.onComplete.add((e: any) => {
      e.destroy();
      var sprite = this.game.add.sprite(x * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, y * Consts.tileSize + Consts.tileSize * 0.5 + WallManager.mazeOffset, 'mob');
      sprite.anchor.set(0.5);
      sprite.scale.setTo(Consts.tileSize / 32 * 0.3, Consts.tileSize / 32 * 0.3);

      this.game.physics.p2.enable(sprite, false);

      sprite.body.setCircle(Consts.tileSize * 0.2);
      this.mobs.add(sprite);
      // sprite.body.kinematic = true;
      var mob = new Mob(sprite, this.game);
      Collisions.getInstance().add('mob', mob);

      this.mobsInstances.push(mob);

    }, this);
    tween.start();

  }

  update() {
    this.mobsInstances.forEach((mob: Mob) => {
      this.pacman.isKillingMode ? mob.sprite.frame = 1 : mob.sprite.frame = 0;
      mob.move();
    }, this)


  }


}