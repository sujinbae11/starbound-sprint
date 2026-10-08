/** Entry point: creates the Phaser game with all scenes registered. */
const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#070b24',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: CONFIG.GRAVITY },
      debug: false // set to true to see hitboxes while tuning
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, MenuScene, StageSelectScene, GameScene, UIScene, PauseScene, EndScene]
});
