class SimpleGame {

    game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content',
            {preload: this.preload, create: this.create});
    }

    preload() {
        this.game.load.image('logo', 'assets/images.png');
    }

    create() {
        let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
}

window.onload = () => {
    let game = new SimpleGame();
}