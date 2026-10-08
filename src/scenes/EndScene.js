/** Game-over and final-completion screens. */
class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  init(data) {
    this.mode = (data && data.mode) || 'gameover';
    this.finalScore = Number(data && data.score) || 0;
    this.stageNumber = Number(data && data.stage) || 1;
  }

  create() {
    this.backdrop = addBackdrop(this);
    const cx = CONFIG.WIDTH / 2;
    const final = this.mode === 'final';
    this.add.text(cx, 105, final ? 'YOU COMPLETED\nSTARBOUND SPRINT!' : 'GAME OVER', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: final ? '56px' : '72px',
      color: final ? '#5df2c0' : '#ff6b6b', stroke: '#2a1b5e', strokeThickness: 10, align: 'center'
    }).setOrigin(0.5);
    this.add.text(cx, final ? 245 : 210, `SCORE ${this.finalScore}`, {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '40px', color: '#ffe066', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    if (!final) {
      addTextButton(this, cx, 305, `RETRY STAGE ${this.stageNumber}`, () => {
        this.scene.start('GameScene', { stage: this.stageNumber, score: 0 });
      });
    }
    addTextButton(this, cx, final ? 330 : 380, 'STAGE SELECT', () => this.scene.start('StageSelectScene'), { backgroundColor: '#315f86' });
    addTextButton(this, cx, final ? 405 : 455, 'MAIN MENU', () => this.scene.start('MenuScene'), { backgroundColor: '#553957' });
  }

  update() {
    this.backdrop.far.tilePositionX += 0.1;
    this.backdrop.near.tilePositionX += 0.3;
  }
}
