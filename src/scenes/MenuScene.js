/** Main menu with direct play and stage-selection routes. */
class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.backdrop = addBackdrop(this);
    const cx = CONFIG.WIDTH / 2;

    this.add.text(cx, 105, 'STARBOUND', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '76px',
      color: '#ffe066', stroke: '#2a1b5e', strokeThickness: 10
    }).setOrigin(0.5);
    this.add.text(cx, 181, 'SPRINT', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '76px',
      color: '#5df2c0', stroke: '#2a1b5e', strokeThickness: 10
    }).setOrigin(0.5);

    const hero = this.add.image(cx, 278, 'player').setScale(1.8);
    this.tweens.add({ targets: hero, y: 262, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const highest = Progression.getHighestUnlocked();
    addTextButton(this, cx, 365, highest === 1 ? 'START' : `CONTINUE — STAGE ${highest}`, () => {
      this.scene.start('GameScene', { stage: highest, score: 0 });
    });
    addTextButton(this, cx, 430, 'STAGE SELECT', () => this.scene.start('StageSelectScene'), { backgroundColor: '#315f86' });

    this.add.text(cx, 500, 'AUTO-RUN   •   LEFT CLICK: Jump   •   LEFT CLICK AGAIN: Double jump', {
      fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#cfd6ff'
    }).setOrigin(0.5);
    this.add.text(18, 18, 'AUTO-RUN v19', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '18px', color: '#5df2c0'
    });

  }

  update() {
    this.backdrop.far.tilePositionX += 0.1;
    this.backdrop.near.tilePositionX += 0.3;
  }
}
