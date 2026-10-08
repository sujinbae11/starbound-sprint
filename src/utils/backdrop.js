/**
 * Parallax night-sky backdrop shared by every scene.
 * Textures ('sky', 'stars_far', 'stars_near') are generated in BootScene.
 */
function addBackdrop(scene) {
  const sky = scene.add
    .image(0, 0, 'sky')
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(-30);

  const far = scene.add
    .tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'stars_far')
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(-20);

  const near = scene.add
    .tileSprite(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 'stars_near')
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(-10);

  return { sky, far, near };
}

/** Scroll the star layers at different speeds to fake depth. */
function scrollBackdrop(backdrop, scrollX) {
  backdrop.far.tilePositionX = scrollX * 0.05;
  backdrop.near.tilePositionX = scrollX * 0.15;
}
