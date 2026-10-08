/** HUD shared by every stage. */
class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    this.hearts = [];
    for (let i = 0; i < CONFIG.PLAYER.MAX_HEALTH; i++) this.hearts.push(this.add.image(30 + i * 38, 28, 'heart_full'));
    this.stageText = this.add.text(CONFIG.WIDTH / 2, 14, `STAGE ${this.registry.get('stage')} / ${CONFIG.LEVEL_COUNT}`, {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '25px', color: '#5df2c0', stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5, 0);
    this.speedText = this.add.text(CONFIG.WIDTH / 2, 46, `SPEED ${this.registry.get('speedMultiplier').toFixed(2)}x`, {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '17px', color: '#cfd6ff', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5, 0);
    this.scoreText = this.add.text(CONFIG.WIDTH - 20, 14, '', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '28px', color: '#ffe066', stroke: '#000000', strokeThickness: 5
    }).setOrigin(1, 0);
    this.movementText = this.add.text(24, 62, 'AUTO-RUN v19  •  RUNNING →', {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '18px',
      color: '#ffffff', stroke: '#000000', strokeThickness: 4
    });

    this.refreshHearts(this.registry.get('health'), false);
    this.refreshScore(this.registry.get('score'));
    this.onHealth = (parent, value) => this.refreshHearts(value, true);
    this.onScore = (parent, value) => this.refreshScore(value);
    this.onMoving = (parent, value) => this.refreshMovement(value);
    this.registry.events.on('changedata-health', this.onHealth);
    this.registry.events.on('changedata-score', this.onScore);
    this.registry.events.on('changedata-moving', this.onMoving);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.registry.events.off('changedata-health', this.onHealth);
      this.registry.events.off('changedata-score', this.onScore);
      this.registry.events.off('changedata-moving', this.onMoving);
    });

    const hint = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 28, 'LEFT CLICK: JUMP  •  LEFT CLICK AGAIN: DOUBLE JUMP  •  ESC: PAUSE', {
      fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#ffffff', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);
    this.tweens.add({ targets: hint, alpha: 0, delay: 4000, duration: 800 });
  }

  refreshHearts(health, animate) {
    this.hearts.forEach((heart, i) => {
      const full = i < health;
      const wasFull = heart.texture.key === 'heart_full';
      heart.setTexture(full ? 'heart_full' : 'heart_empty');
      if (animate && wasFull && !full) {
        heart.setScale(1.6);
        this.tweens.add({ targets: heart, scale: 1, duration: 300, ease: 'Back.easeOut' });
      }
    });
  }

  refreshScore(score) {
    this.scoreText.setText(`SCORE ${score}`);
  }

  refreshMovement(moving) {
    this.movementText.setText(moving ? 'AUTO-RUN v19  •  RUNNING →' : 'AUTO-RUN v19  •  RESPAWNING…');
    this.movementText.setColor(moving ? '#5df2c0' : '#ffffff');
  }
}
