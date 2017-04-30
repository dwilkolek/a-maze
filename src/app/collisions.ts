/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>
import { Pacman } from './pacman';

export class Collisions {

  private static _instance: Collisions;
  private game: Phaser.Game;
  private player: Pacman;

  private playerCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  private gemsCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  private goldCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  private mobsCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  private wallCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  // , gems:Phaser.Group, golds:Phaser.Group, mobs:Phaser.Group
  prepare(game: Phaser.Game, player: Pacman) {
    this.player = player;
    this.game = game;
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.gemsCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.goldCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.mobsCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.wallCollisionGroup = this.game.physics.p2.createCollisionGroup();

    player.sprite.body.setCollisionGroup(this.playerCollisionGroup);
    // player.sprite.body.setCollisionGroup(this.goldCollisionGroup);

    player.sprite.body.collides(this.gemsCollisionGroup, (a: any, b: any) => {
      b.sprite.destroy();
      this.player.addPoints(100);
    }, this);

    player.sprite.body.collides(this.goldCollisionGroup, (a: any, b: any) => {
      b.sprite.destroy();
      this.player.killingMode();
    }, this);

    player.sprite.body.collides(this.mobsCollisionGroup, (a: any, b: any) => {
      if (player.isKillingMode) {
        b.sprite.destroy();
        player.addPoints(150);
      } else {
        this.game.state.start('gameOverState');
      }
    }, this);

    player.sprite.body.collides(this.wallCollisionGroup, function (a: any, b: any) {
      // console.log('wall', a, b)
    }, this);

  }

  private constructor() {

  }

  public static getInstance(): Collisions {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  public add(group: string, sprite: Phaser.Sprite): void {
    // console.log('added', group)
    switch (group) {
      case 'gem':
        // console.log(1);
        sprite.body.setCollisionGroup(this.gemsCollisionGroup);
        sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup],
          this.collisionSolver.bind(this));
        break
      case 'gold':
        // console.log(2);
        sprite.body.setCollisionGroup(this.goldCollisionGroup);
        sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup],
          this.collisionSolver.bind(this));
        break
      case 'mob':
      case 'sick':
        // console.log(3);
        sprite.body.setCollisionGroup(this.mobsCollisionGroup);
        sprite.body.collides([this.mobsCollisionGroup, this.goldCollisionGroup, this.gemsCollisionGroup],
          this.collisionSolver.bind(this));
        break
      case 'wall':
        // console.log(4);
        sprite.body.setCollisionGroup(this.wallCollisionGroup);
        break
    }

    sprite.body.collides(this.playerCollisionGroup, function (a: any, b: any) {

    }, this);
  }

  public collisionSolver(a: any, b: any) {
    var getValue = function(key:string) {
        switch (key) {
          case 'ufo': return 1000;
          case 'mob': return 2;
          case 'gold': return 0;
          case 'gem': return 1;
        }
      }
      if (!a.sprite || !b.sprite) {
        return;
      }
      if (a.sprite.key == b.sprite.key) {
        a.sprite.destroy();
      } else {
        var av = getValue(a.sprite.key);
        var bv = getValue(b.sprite.key);
        if (av > bv) {
          b.sprite.destroy();
        } else {
          a.sprite.destroy();
        }
      }
  }

}