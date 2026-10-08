/** Pause overlay opened with Escape during a stage. */
class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    const cx = CONFIG.WIDTH / 2;
    const cy = CONFIG.HEIGHT / 2;

    this.add.rectangle(cx, cy, CONFIG.WIDTH, CONFIG.HEIGHT, 0x05071a, 0.82);
    this.add.text(cx, cy - 115, 'PAUSED', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '64px',
      color: '#ffe066', stroke: '#2a1b5e', strokeThickness: 9
    }).setOrigin(0.5);

    addTextButton(this, cx, cy - 40, 'RESUME', () => this.resumeGame(), {
      backgroundColor: '#3a986f'
    });
    addTextButton(this, cx, cy + 25, 'RESTART STAGE', () => this.restartStage(), {
      backgroundColor: '#7661b9'
    });
    addTextButton(this, cx, cy + 90, 'MAIN MENU', () => this.mainMenu(), {
      backgroundColor: '#315f86'
    });
    this.add.text(cx, cy + 155, 'ESC: RESUME', {
      fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#cfd6ff'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-ESC', () => this.resumeGame());
  }

  resumeGame() {
    this.scene.resume('GameScene');
    this.scene.resume('UIScene');
    this.scene.stop();
  }

  restartStage() {
    const gameScene = this.scene.get('GameScene');
    const stage = gameScene.stageNumber;
    const score = gameScene.initialScore;
    this.scene.stop('UIScene');
    this.scene.stop('GameScene');
    // Start on the following scene-manager tick. This guarantees the paused
    // GameScene has fully shut down instead of Phaser interpreting Start as
    // Resume when both operations are queued in the same tick.
    this.time.delayedCall(0, () => {
      this.scene.start('GameScene', { stage, score });
    });
  }

  mainMenu() {
    this.scene.stop('UIScene');
    this.scene.stop('GameScene');
    this.scene.start('MenuScene');
  }
}
