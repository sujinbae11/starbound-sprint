/**
 * Builds all level objects in the given scene from the supplied stage data.
 * Returns the physics groups GameScene needs for colliders/overlaps.
 */
function buildLevel(scene, levelData) {
  const G = CONFIG.GROUND_Y;
  const solids = scene.physics.add.staticGroup();
  const platforms = scene.physics.add.staticGroup();

  // --- ground: one solid block per segment, with a decorative top strip ---
  levelData.ground.forEach((seg) => {
    const dirt = scene.add
      .tileSprite(seg.x, G, seg.w, CONFIG.GROUND_THICKNESS, 'dirt')
      .setOrigin(0, 0)
      .setDepth(1);
    scene.physics.add.existing(dirt, true);
    solids.add(dirt);

    scene.add
      .tileSprite(seg.x, G, seg.w, 8, 'grassTop')
      .setOrigin(0, 0)
      .setDepth(2);
  });

  // --- floating platforms: one-way (solid only when landing from above) ---
  levelData.platforms.forEach((p) => {
    const plat = scene.add
      .tileSprite(p.x, p.y, p.w, 16, 'platform')
      .setOrigin(0, 0)
      .setDepth(1);
    scene.physics.add.existing(plat, true);
    platforms.add(plat);
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
  });

  // --- star pickups (bobbing, no gravity) ---
  const stars = scene.physics.add.group({ allowGravity: false, immovable: true });
  levelData.stars.forEach((s, i) => {
    const star = stars.create(s.x, s.y, 'star');
    star.setDepth(5);
    if (s.route === 'double') star.setTint(0xa8dcff);
    if (s.boost) star.setTint(0x5df2c0).setScale(1.4);
    if (s.route === 'platform') star.setTint(0xffb45e);
    if (s.platformTarget) star.setTint(0xff7ac8).setScale(1.35);
    scene.tweens.add({
      targets: star,
      y: s.y - 6,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: (i % 6) * 100
    });
  });

  // --- enemies ---
  const enemies = scene.physics.add.group();
  levelData.enemies.forEach((e) => {
    const enemy = new Enemy(scene, (e.minX + e.maxX) / 2, G - 20, e.minX, e.maxX);
    enemies.add(enemy);
  });

  // --- goal flag + invisible trigger zone ---
  const goalX = levelData.goal.x;
  scene.add.image(goalX - 11, G, 'goal').setOrigin(0, 1).setDepth(3);
  const goalZone = scene.add.zone(goalX + 8, G - 56, 48, 112);
  scene.physics.add.existing(goalZone, true);

  return { solids, platforms, stars, enemies, goalZone };
}
