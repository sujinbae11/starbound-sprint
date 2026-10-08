/** Stage grid. Locked stages are visible but cannot be launched. */
class StageSelectScene extends Phaser.Scene {
  constructor() {
    super('StageSelectScene');
  }

  create() {
    this.backdrop = addBackdrop(this);
    const highest = Progression.getHighestUnlocked();
    this.add.text(CONFIG.WIDTH / 2, 70, 'STAGE SELECT', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '54px',
      color: '#ffe066', stroke: '#2a1b5e', strokeThickness: 8
    }).setOrigin(0.5);
    this.add.text(CONFIG.WIDTH / 2, 120, `Highest unlocked: Stage ${highest}`, {
      fontFamily: 'Arial, sans-serif', fontSize: '20px', color: '#cfd6ff'
    }).setOrigin(0.5);

    for (let stage = 1; stage <= CONFIG.LEVEL_COUNT; stage++) {
      const col = (stage - 1) % 5;
      const row = Math.floor((stage - 1) / 5);
      const x = 145 + col * 168;
      const y = 220 + row * 120;
      const unlocked = stage <= highest;
      if (unlocked) {
        addTextButton(this, x, y, `STAGE ${stage}`, () => {
          this.scene.start('GameScene', { stage, score: 0 });
        }, { fontSize: '22px', padding: { x: 18, y: 16 }, backgroundColor: stage === highest ? '#4b3fa6' : '#315f86' });
      } else {
        this.add.text(x, y, `STAGE ${stage}\nLOCKED`, {
          fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '20px',
          color: '#80869e', backgroundColor: '#24273b', align: 'center',
          padding: { x: 20, y: 10 }, stroke: '#111522', strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0.8);
      }
    }

    addTextButton(this, CONFIG.WIDTH / 2, 475, 'MAIN MENU', () => this.scene.start('MenuScene'), {
      fontSize: '22px', backgroundColor: '#553957'
    });
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('MenuScene'));
  }

  update() {
    this.backdrop.far.tilePositionX += 0.1;
    this.backdrop.near.tilePositionX += 0.3;
  }
}
