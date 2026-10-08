const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

// Progression and level-data checks.
const storage = new Map();
const dataContext = {
  console,
  localStorage: {
    getItem: (key) => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value))
  },
  Phaser: { Math: { Clamp: (value, min, max) => Math.max(min, Math.min(max, value)) } }
};
vm.createContext(dataContext);
vm.runInContext(
  read('src/config.js') + '\n' + read('src/progression.js') + '\n' + read('src/level/levelData.js') + `
    globalThis.testApi = {
      count: LEVELS.length,
      levels: LEVELS,
      highest: () => Progression.getHighestUnlocked(),
      unlocked: (stage) => Progression.isUnlocked(stage),
      complete: (stage) => Progression.unlockAfter(stage)
    };
  `,
  dataContext
);
const api = dataContext.testApi;
assert.strictEqual(api.count, 10);
assert.strictEqual(api.highest(), 1);
assert.strictEqual(api.unlocked(4), false);
assert.strictEqual(api.complete(1), 2);
assert.strictEqual(api.complete(2), 3);
assert.strictEqual(api.complete(3), 4);
assert.strictEqual(api.complete(1), 4);
assert.strictEqual(api.highest(), 4);
assert.ok(api.levels.every((level, i) => level.number === i + 1 && level.goal.x < level.width));
assert.ok(api.levels[9].pits.length > api.levels[0].pits.length);
assert.strictEqual(api.levels[0].width, 4200, 'Stage 1 ground lengths remain unchanged');
assert.strictEqual(api.levels[1].width, 5200, 'Stage 2 ground lengths remain unchanged');
assert.strictEqual(api.levels[9].pits.length, 20, 'Stage 10 has exactly twenty pits');
assert.strictEqual(api.levels[9].pits[0].w, 327, 'Stage 10 gaps are ten pixels narrower');
assert.strictEqual(api.levels[9].ground[1].w, 193, 'Stage 10 ground intervals are twenty pixels shorter');
assert.ok(api.levels[9].width > 14100, 'Stage 10 retains a long map and its platform-only section');
assert.deepStrictEqual(Array.from(api.levels, (level) => level.pits.length), [3, 4, 6, 8, 10, 12, 13, 16, 18, 20]);
assert.ok(api.levels.every((level, i, levels) => i === 0 || level.width > levels[i - 1].width));
assert.strictEqual(api.levels[0].speedMultiplier, 1);
assert.strictEqual(api.levels[1].speedMultiplier, 1.1);
assert.strictEqual(api.levels[9].speedMultiplier, 1.9);
assert.strictEqual(api.levels[0].jumpSpeed, 530);
assert.strictEqual(api.levels[9].jumpSpeed, 566);
assert.ok(api.levels.every((level) => {
  const singleJumpDistance = level.runSpeed * (2 * level.jumpSpeed / 1100);
  return level.pits.filter((pit) => !pit.platformOnlySection).every((pit) => singleJumpDistance >= pit.w + 60);
}), 'every pit remains safely reachable with the lower jump force');

const stageTwoJumpArc = api.levels[1].stars.slice(0, 6);
assert.strictEqual(stageTwoJumpArc.length, 6);
assert.ok(Math.abs(stageTwoJumpArc[0].y - stageTwoJumpArc.at(-1).y) < 0.001, 'single-jump route endpoints are level');
assert.ok(stageTwoJumpArc[2].y < stageTwoJumpArc[0].y - 100, 'stars form a reachable jump arc');
assert.ok(stageTwoJumpArc.every((star) => star.route === 'single'), 'single-jump stars are only placed on the pit route');
assert.strictEqual(api.levels[0].platforms.length, 3, 'Stage 1 restores three safe optional platforms');
assert.deepStrictEqual(Array.from(api.levels, (level) => level.platforms.length), [3, 3, 3, 3, 4, 4, 5, 5, 6, 6]);
assert.deepStrictEqual(Array.from(api.levels.slice(4), (level) => new Set(level.stars.filter((star) => star.route === 'platform').map((star) => star.platformRouteId)).size), [1, 1, 2, 2, 1, 1]);
assert.strictEqual(api.levels[8].pits.filter((pit) => pit.platformOnlySection).length, 1);
assert.strictEqual(api.levels[9].pits.filter((pit) => pit.platformOnlySection).length, 1);
assert.strictEqual(api.levels[8].platforms.filter((platform) => platform.requiredRoute).length, 2);
assert.strictEqual(api.levels[9].platforms.filter((platform) => platform.requiredRoute).length, 2);
assert.ok(api.levels.slice(8).every((level) => level.platforms.filter((platform) => platform.requiredRoute).every((platform) => platform.w === 160)), 'groundless-section platforms are widened to 160px');
assert.ok(api.levels[9].stars.length < 150, 'late-stage star count stays uncluttered');

const laterDoubleStars = api.levels[6].stars.filter((star) => star.route === 'double');
assert.ok(laterDoubleStars.length > 0, 'later stages include double-jump routes');
assert.ok(laterDoubleStars.some((star) => star.boost), 'double-jump routes mark the second jump point');
assert.ok(api.levels.every((level) => level.platforms.every((platform) => platform.requiredRoute || !level.stars.some((star) => (
  star.x >= platform.x - 24
  && star.x <= platform.x + platform.w + 24
  && star.y >= platform.y - 70
  && star.y <= platform.y + 24
)))), 'platforms never block a star route');

api.levels.forEach((level) => {
  const regularStars = level.stars.filter((star) => star.route !== 'platform');
  for (let i = 0; i < regularStars.length;) {
    const count = regularStars[i].route === 'double' ? 10 : 6;
    const route = regularStars.slice(i, i + count);
    const first = route[0];
    const last = route.at(-1);
    assert.ok(Math.abs(first.y - (476 - 42 + 10)) < 0.001, 'route starts 10px below its original ground-relative height');
    assert.ok(Math.abs(last.y - (476 - 42 + 10)) < 0.001, 'route lands 10px below its original ground-relative height');
    assert.ok(!level.pits.some((pit) => last.x > pit.x && last.x < pit.x + pit.w), 'route endpoint is not inside a pit');
    i += count;
  }
});
assert.ok(api.levels[6].enemies.some((enemy) => enemy.maxX > api.levels[6].width - 500), 'Stage 7 has late-map enemies');
assert.ok(api.levels[7].enemies.some((enemy) => enemy.maxX > api.levels[7].width - 500), 'Stage 8 has late-map enemies');
assert.ok(read('src/scenes/GameScene.js').includes("this.droppedHearts.create"), 'damage creates a recoverable heart');
assert.ok(read('src/scenes/GameScene.js').includes('player.health >= CONFIG.PLAYER.MAX_HEALTH'), 'full health cannot consume a heart');
assert.ok(read('src/scenes/GameScene.js').includes("this.scene.restart({ stage: this.stageNumber, score: this.initialScore })"), 'losing all hearts restarts the current stage');

// Auto-run and left-click double-jump checks with a minimal Phaser mock.
class Sprite {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.alpha = 1;
    this.body = {
      blocked: { down: true }, touching: { down: false }, velocity: { x: 0, y: 0 },
      setSize: () => this.body, setOffset: () => this.body,
      reset: (nx, ny) => { this.x = nx; this.y = ny; }
    };
  }
  setDepth() { return this; }
  setMaxVelocity() { return this; }
  setVelocityX(x) { this.body.velocity.x = x; return this; }
  setVelocityY(y) { this.body.velocity.y = y; return this; }
  setVelocity(x, y) { this.body.velocity.x = x; this.body.velocity.y = y; return this; }
  setFlipX() { return this; }
  setAlpha(value) { this.alpha = value; return this; }
  setScale() { return this; }
  setAngle() { return this; }
}

let pointerDownHandler = null;
const scene = {
  add: {
    existing: () => {},
    circle: (x, y) => ({ x, y, setDepth() { return this; }, destroy() {} })
  },
  tweens: { add: () => {} },
  physics: { add: { existing: () => {} } },
  time: { now: 0 },
  game: {
    canvas: {
      addEventListener: (event, handler) => { if (event === 'pointerdown') pointerDownHandler = handler; },
      removeEventListener: () => {}
    }
  },
  events: { once: () => {} }
};
const playerContext = {
  console,
  Phaser: {
    Physics: { Arcade: { Sprite } },
    Scenes: { Events: { SHUTDOWN: 'shutdown' } }
  }
};
vm.createContext(playerContext);
vm.runInContext(read('src/config.js') + '\n' + read('src/entities/Player.js') + '\nglobalThis.PlayerClass = Player;', playerContext);
const player = new playerContext.PlayerClass(scene, 96, 400);

player.update(16);
assert.strictEqual(player.body.velocity.x, 250, 'stage start automatically runs forward');
scene.time.now += 1000;
player.update(16);
assert.strictEqual(player.body.velocity.x, 250, 'auto-run remains active after one second');

pointerDownHandler({ button: 0, preventDefault: () => {} });
player.update(16);
assert.strictEqual(player.jumpsUsed, 1, 'first left-click jumps');
assert.strictEqual(player.body.velocity.y, -530);

player.body.blocked.down = false;
player.body.velocity.y = -300;
scene.time.now += 16;
pointerDownHandler({ button: 0, preventDefault: () => {} });
player.update(16);
assert.strictEqual(player.jumpsUsed, 2, 'second airborne left-click double jumps');

scene.time.now += 16;
pointerDownHandler({ button: 0, preventDefault: () => {} });
player.update(16);
assert.strictEqual(player.jumpsUsed, 2, 'third airborne left-click is ignored');

assert.strictEqual(player.rechargeJumpFromStar(), true, 'a star restores one jump after both jumps are spent');
assert.strictEqual(player.jumpsUsed, 1);
assert.strictEqual(player.rechargeJumpFromStar(), false, 'only one star jump is granted before landing');
scene.time.now += 16;
pointerDownHandler({ button: 0, preventDefault: () => {} });
player.update(16);
assert.strictEqual(player.jumpsUsed, 2, 'the restored jump can be used once');
scene.time.now += 16;
pointerDownHandler({ button: 0, preventDefault: () => {} });
player.update(16);
assert.strictEqual(player.jumpsUsed, 2, 'a fourth jump is blocked without landing');

player.body.blocked.down = true;
player.body.velocity.y = 0;
scene.time.now += 16;
player.update(16);
assert.strictEqual(player.jumpsUsed, 0, 'landing restores both jumps');
assert.strictEqual(player.starJumpGranted, false, 'landing resets the star-jump allowance');

scene.time.now += 2000;
assert.strictEqual(player.hurt(player.x + 20), true, 'enemy contact applies damage');
assert.strictEqual(player.body.velocity.x, 250, 'damage does not interrupt forward auto-run');

const fasterPlayer = new playerContext.PlayerClass(scene, 96, 400, 275, 534);
fasterPlayer.update(16);
assert.strictEqual(fasterPlayer.body.velocity.x, 275, 'Stage 2 runs at 1.10x speed');
pointerDownHandler({ button: 0, preventDefault: () => {} });
fasterPlayer.update(16);
assert.strictEqual(fasterPlayer.body.velocity.y, -534, 'jump force follows the stage star route');
scene.time.now += 2000;
assert.strictEqual(fasterPlayer.hurt(fasterPlayer.x + 20), true);
assert.strictEqual(fasterPlayer.body.velocity.x, 275, 'damage preserves the stage speed');

assert.ok(read('src/scenes/GameScene.js').includes('this.player.body.right >= this.levelData.width - 4'), 'map edge completes the stage');
assert.ok(read('src/scenes/PauseScene.js').includes('RESTART STAGE'), 'pause overlay includes restart');

console.log('Smoke tests passed: progression, increasing stages, pause wiring, auto-run, and left-click double jump.');
