/** Shared gameplay scene used by all ten data-driven stages. */
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.stageNumber = Phaser.Math.Clamp(Number(data && data.stage) || 1, 1, CONFIG.LEVEL_COUNT);
    this.initialScore = Number(data && data.score) || 0;
    this.levelData = getLevelData(this.stageNumber);
  }

  create() {
    this.ended = false;
    if (this.input.mouse) this.input.mouse.disableContextMenu();
    this.registry.set('health', CONFIG.PLAYER.MAX_HEALTH);
    this.registry.set('score', this.initialScore);
    this.registry.set('stage', this.stageNumber);
    this.registry.set('speedMultiplier', this.levelData.speedMultiplier);
    this.registry.set('moving', false);
    this.backdrop = addBackdrop(this);

    this.physics.world.setBounds(0, 0, this.levelData.width, CONFIG.HEIGHT);
    this.physics.world.setBoundsCollision(true, true, true, false);
    this.level = buildLevel(this, this.levelData);
    this.droppedHearts = this.physics.add.group({ allowGravity: false, immovable: true });

    this.player = new Player(
      this,
      CONFIG.PLAYER.START_X,
      CONFIG.PLAYER.START_Y,
      this.levelData.runSpeed,
      this.levelData.jumpSpeed
    );
    this.player.setCollideWorldBounds(true);
    this.lastSafe = { x: CONFIG.PLAYER.START_X, y: CONFIG.PLAYER.START_Y };

    this.physics.add.collider(this.player, this.level.solids);
    this.physics.add.collider(this.player, this.level.platforms);
    this.physics.add.collider(this.level.enemies, this.level.solids);
    this.physics.add.overlap(this.player, this.level.stars, this.collectStar, undefined, this);
    this.physics.add.overlap(this.player, this.droppedHearts, this.collectHeart, undefined, this);
    this.physics.add.overlap(this.player, this.level.enemies, this.onEnemyTouch, undefined, this);
    this.physics.add.overlap(this.player, this.level.goalZone, this.reachGoal, undefined, this);

    const cam = this.cameras.main;
    // Give the camera half a screen of padding at both ends so the player can
    // remain centered even at the beginning and the very end of the map.
    cam.setBounds(-CONFIG.WIDTH / 2, 0, this.levelData.width + CONFIG.WIDTH, CONFIG.HEIGHT);
    cam.startFollow(this.player, true, 1, 1);
    cam.setRoundPixels(true);
    this.scene.launch('UIScene');

    this.onEscape = () => this.pauseGame();
    this.input.keyboard.on('keydown-ESC', this.onEscape);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard.off('keydown-ESC', this.onEscape);
    });
  }

  pauseGame() {
    if (this.ended || this.scene.isPaused()) return;
    this.scene.launch('PauseScene');
    this.scene.pause('UIScene');
    this.scene.pause();
  }

  update(time, delta) {
    if (this.ended) return;
    this.player.update(delta);
    if (this.player.body.right >= this.levelData.width - 4) {
      this.reachGoal();
      return;
    }
    const moving = Math.abs(this.player.body.velocity.x) > 1;
    if (this.registry.get('moving') !== moving) this.registry.set('moving', moving);
    this.level.enemies.getChildren().forEach((enemy) => enemy.update());
    scrollBackdrop(this.backdrop, this.cameras.main.scrollX);
    if (this.player.grounded && !this.isNearPit(this.player.x)) {
      this.lastSafe.x = this.player.x;
      this.lastSafe.y = this.player.y - 2;
    }
    if (this.player.y > CONFIG.FALL_DEATH_Y) this.handleFall();
  }

  isNearPit(x) {
    const margin = 90;
    return this.levelData.pits.some((pit) => x > pit.x - margin && x < pit.x + pit.w + margin);
  }

  collectStar(player, star) {
    if (this.ended || !star.active) return;
    this.tweens.killTweensOf(star);
    star.disableBody(true, true);
    this.sound.play('reward', { volume: 0.45 });
    this.addScore(CONFIG.SCORE.STAR);
    this.popText(star.x, star.y, `+${CONFIG.SCORE.STAR}`, '#ffe066');
    if (player.rechargeJumpFromStar()) {
      this.popText(player.x, player.y - 42, 'EXTRA JUMP!', '#5df2c0');
    }
  }

  addScore(amount) {
    this.registry.set('score', this.registry.get('score') + amount);
  }

  onEnemyTouch(player, enemy) {
    if (this.ended || enemy.isDead) return;
    const stomping = player.body.velocity.y > 0 && player.body.bottom <= enemy.body.top + 18;
    if (stomping) {
      enemy.squash();
      player.stompBounce();
      this.addScore(CONFIG.SCORE.STOMP);
      this.popText(enemy.x, enemy.y - 20, `+${CONFIG.SCORE.STOMP}`, '#ffffff');
      return;
    }
    const damageX = player.x;
    const damageY = player.y;
    if (player.hurt(enemy.x)) {
      this.sound.play('damage', { volume: 0.55 });
      this.registry.set('health', player.health);
      this.spawnHeart(damageX, CONFIG.GROUND_Y - 120, 110);
      this.cameras.main.shake(160, 0.008);
      this.cameras.main.flash(120, 255, 60, 60);
      if (player.health <= 0) this.lose();
    }
  }

  handleFall() {
    if (this.ended) return;
    const deathX = this.player.x;
    this.player.fallDamage();
    this.sound.play('damage', { volume: 0.55 });
    this.registry.set('health', this.player.health);
    this.spawnHeart(deathX, CONFIG.GROUND_Y - 100);
    if (this.player.health <= 0) return this.lose();
    this.cameras.main.flash(150, 255, 255, 255);
    this.player.respawn(this.lastSafe.x, this.lastSafe.y);
    this.popText(this.player.x, this.player.y - 40, 'Careful!', '#ff9aa8');
  }

  spawnHeart(x, y, forwardOffset = 0) {
    const heart = this.droppedHearts.create(x + forwardOffset, Math.min(y, CONFIG.GROUND_Y - 48), 'heart_full');
    heart.setDepth(7).setScale(0.9);
    heart.pickupReadyAt = this.time.now + 50;
    this.tweens.add({
      targets: heart,
      y: heart.y - 8,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  collectHeart(player, heart) {
    if (!heart.active || this.time.now < heart.pickupReadyAt) return;
    // Full health leaves the heart in the world so it can be collected later.
    if (player.health >= CONFIG.PLAYER.MAX_HEALTH) return;
    this.tweens.killTweensOf(heart);
    heart.disableBody(true, true);
    player.health = Math.min(CONFIG.PLAYER.MAX_HEALTH, player.health + 1);
    this.registry.set('health', player.health);
    this.sound.play('reward', { volume: 0.5 });
    this.popText(player.x, player.y - 42, '+1 HEART', '#ff6b8a');
  }

  reachGoal() {
    if (this.ended) return;
    this.ended = true;
    this.physics.pause();
    this.addScore(CONFIG.SCORE.WIN_BONUS);
    Progression.unlockAfter(this.stageNumber);
    this.sound.play('victory', { volume: 0.55 });
    this.showBanner('STAGE COMPLETE!', '#5df2c0');
    const score = this.registry.get('score');
    this.time.delayedCall(1500, () => {
      this.scene.stop('UIScene');
      if (this.stageNumber === CONFIG.LEVEL_COUNT) {
        this.scene.start('EndScene', { mode: 'final', score, stage: this.stageNumber });
      } else {
        this.scene.start('GameScene', { stage: this.stageNumber + 1, score });
      }
    });
  }

  lose() {
    if (this.ended) return;
    this.ended = true;
    this.physics.pause();
    this.player.setTint(0xff5555).setAlpha(1);
    this.tweens.add({ targets: this.player, angle: 360, duration: 900 });
    this.showBanner('RESTARTING STAGE', '#ff6b6b');
    this.time.delayedCall(1300, () => {
      this.scene.stop('UIScene');
      this.scene.restart({ stage: this.stageNumber, score: this.initialScore });
    });
  }

  popText(x, y, message, color) {
    const text = this.add.text(x, y, message, {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '18px', color,
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: text, y: y - 40, alpha: 0, duration: 700, ease: 'Cubic.easeOut', onComplete: () => text.destroy() });
  }

  showBanner(message, color) {
    const text = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 20, message, {
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold', fontSize: '60px', color,
      stroke: '#000000', strokeThickness: 8
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setScale(0.5).setAlpha(0);
    this.tweens.add({ targets: text, scale: 1, alpha: 1, duration: 300, ease: 'Back.easeOut' });
  }
}
