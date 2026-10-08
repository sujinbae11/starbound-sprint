/** Auto-running player. Left-click performs the normal and double jumps. */
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, runSpeed = CONFIG.PLAYER.RUN_SPEED, jumpSpeed = CONFIG.PLAYER.JUMP_SPEED) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const P = CONFIG.PLAYER;
    this.runSpeed = runSpeed;
    this.jumpSpeed = jumpSpeed;
    this.setDepth(10);
    this.setMaxVelocity(1000, P.MAX_FALL_SPEED);
    this.body.setSize(22, 38).setOffset(3, 2);

    this.health = P.MAX_HEALTH;
    this.grounded = false;
    this.jumpsUsed = 0;
    this.starJumpGranted = false;
    this.pendingJumps = 0;
    this.lastGroundedAt = -9999;
    this.invulnUntil = 0;
    this.controlLockUntil = 0;
    this.runPhase = 0;
    this.lastDustAt = -9999;

    // Listen directly on the canvas so every physical left-click produces
    // exactly one jump request, independent of Phaser scene input focus.
    this.onLeftClick = (event) => {
      if (event.button !== 0) return;
      this.pendingJumps = Math.min(2, this.pendingJumps + 1);
    };
    this.canvas = scene.game.canvas;
    this.canvas.addEventListener('pointerdown', this.onLeftClick, true);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.canvas.removeEventListener('pointerdown', this.onLeftClick, true);
    });
  }

  update(delta) {
    const P = CONFIG.PLAYER;
    const body = this.body;
    const now = this.scene.time.now;

    this.grounded = (body.blocked.down || body.touching.down) && body.velocity.y >= 0;
    if (this.grounded) {
      this.lastGroundedAt = now;
      this.jumpsUsed = 0;
      this.starJumpGranted = false;
    }

    const locked = now < this.controlLockUntil;

    // Starbound Sprint is now a true auto-runner: starting a stage always
    // moves the player forward without any keyboard input.
    if (!locked) {
      this.setVelocityX(this.runSpeed);
      this.setFlipX(false);
    }

    if (this.pendingJumps > 0) {
      this.pendingJumps -= 1;
      const canGroundJump = now - this.lastGroundedAt <= P.COYOTE_MS && this.jumpsUsed === 0;
      const canDoubleJump = !this.grounded && this.jumpsUsed < 2;
      if (!locked && (canGroundJump || canDoubleJump)) {
        this.setVelocityY(-this.jumpSpeed);
        this.jumpsUsed += 1;
        this.lastGroundedAt = -9999;
      }
    }

    // Running animation and dust remain visible after the camera catches up.
    if (this.grounded && Math.abs(body.velocity.x) > 1 && !locked) {
      this.runPhase += delta * 0.025;
      const bounce = Math.sin(this.runPhase);
      this.setScale(1 + bounce * 0.035, 1 - bounce * 0.035);
      this.setAngle(bounce * 2.5);
      if (now - this.lastDustAt >= 140) {
        this.lastDustAt = now;
        const dust = this.scene.add.circle(this.x - 12, this.y + 18, 4, 0xcfd6ff, 0.65).setDepth(9);
        this.scene.tweens.add({
          targets: dust,
          x: dust.x - 20,
          y: dust.y - 7,
          alpha: 0,
          scale: 1.8,
          duration: 280,
          onComplete: () => dust.destroy()
        });
      }
    } else {
      this.setScale(1);
      this.setAngle(0);
    }

    if (now < this.invulnUntil) {
      this.setAlpha(Math.floor(now / 90) % 2 ? 0.35 : 1);
    } else if (this.alpha !== 1) {
      this.setAlpha(1);
    }
  }

  /** Take one heart of damage from an enemy. Returns true if applied. */
  hurt(fromX) {
    const P = CONFIG.PLAYER;
    const now = this.scene.time.now;
    if (now < this.invulnUntil) return false;
    this.health = Math.max(0, this.health - 1);
    this.invulnUntil = now + P.INVULN_MS;
    // Damage should never interrupt the auto-run. Keep moving forward while
    // applying only the vertical knockback and invulnerability feedback.
    this.controlLockUntil = now;
    this.jumpsUsed = Math.max(1, this.jumpsUsed);
    this.setVelocity(this.runSpeed, -P.KNOCKBACK_Y);
    return true;
  }

  fallDamage() {
    this.health = Math.max(0, this.health - 1);
  }

  /** A star can restore exactly one jump after both normal jumps are spent. */
  rechargeJumpFromStar() {
    if (this.grounded || this.jumpsUsed < 2 || this.starJumpGranted) return false;
    this.jumpsUsed = 1;
    this.starJumpGranted = true;
    return true;
  }

  stompBounce() {
    this.setVelocityY(-CONFIG.PLAYER.STOMP_BOUNCE);
    this.lastGroundedAt = -9999;
    this.jumpsUsed = Math.max(1, this.jumpsUsed);
  }

  respawn(x, y) {
    const now = this.scene.time.now;
    this.body.reset(x, y);
    this.setVelocity(0, 0);
    this.invulnUntil = now + 1500;
    this.controlLockUntil = now + 100;
    this.jumpsUsed = 0;
    this.starJumpGranted = false;
    this.pendingJumps = 0;
  }
}
