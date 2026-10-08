/**
 * A simple walker that patrols between minX and maxX.
 * Touching it from the side/below hurts the player; stomping it from above kills it.
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, minX, maxX) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(8);
    this.body.setSize(26, 24).setOffset(3, 4);

    this.minX = minX;
    this.maxX = maxX;
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.isDead = false;
  }

  update() {
    if (this.isDead) return;

    if (this.x <= this.minX) this.dir = 1;
    else if (this.x >= this.maxX) this.dir = -1;

    this.setVelocityX(this.dir * CONFIG.ENEMY.SPEED);
    this.setFlipX(this.dir > 0);
  }

  /** Called when the player stomps this enemy. */
  squash() {
    if (this.isDead) return;
    this.isDead = true;
    this.body.enable = false;

    this.scene.tweens.add({
      targets: this,
      scaleY: 0.2,
      y: this.y + 10,
      alpha: 0,
      duration: 260,
      onComplete: () => this.destroy()
    });
  }
}
