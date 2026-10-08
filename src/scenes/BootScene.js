/**
 * BootScene - draws every placeholder graphic with Phaser Graphics and
 * bakes it into a texture. To use real art later, replace this with
 * this.load.image(...) calls in preload() using the same texture keys:
 *   player, enemy, star, heart_full, heart_empty, dirt, grassTop,
 *   platform, goal, sky, stars_far, stars_near
 */
class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.audio('damage', 'assets/audio/damage.wav');
    this.load.audio('victory', 'assets/audio/victory.wav');
    this.load.audio('reward', 'assets/audio/reward.wav');
  }

  create() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    const bake = (key, w, h, draw) => {
      g.clear();
      draw(g);
      g.generateTexture(key, w, h);
    };

    // Player: little astronaut (visor on the right = facing right)
    bake('player', 28, 40, (g) => {
      g.fillStyle(0x1b4f9c, 1);
      g.fillRoundedRect(2, 34, 11, 6, 2);
      g.fillRoundedRect(15, 34, 11, 6, 2);
      g.fillStyle(0x2f7be0, 1);
      g.fillRoundedRect(0, 4, 28, 33, 9);
      g.fillStyle(0xcfeaff, 1);
      g.fillRoundedRect(10, 9, 16, 12, 5);
      g.fillStyle(0x10203a, 1);
      g.fillRect(20, 12, 4, 6);
      g.fillStyle(0xffd54a, 1);
      g.fillRect(13, 0, 3, 6);
      g.fillCircle(14.5, 2, 3);
    });

    // Enemy: spiky red blob
    bake('enemy', 32, 28, (g) => {
      g.fillStyle(0xff8099, 1);
      g.fillTriangle(6, 7, 10, 0, 14, 7);
      g.fillTriangle(18, 7, 22, 0, 26, 7);
      g.fillStyle(0xe0405a, 1);
      g.fillRoundedRect(0, 5, 32, 23, 10);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(10, 15, 4.5);
      g.fillCircle(22, 15, 4.5);
      g.fillStyle(0x000000, 1);
      g.fillCircle(11, 16, 2);
      g.fillCircle(21, 16, 2);
      g.lineStyle(2, 0x3a0010, 1);
      g.lineBetween(4, 8, 14, 12);
      g.lineBetween(28, 8, 18, 12);
    });

    // Star pickup: five-point star drawn as a triangle fan from the centre
    bake('star', 24, 24, (g) => {
      const cx = 12, cy = 12, outer = 11, inner = 4.7;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      }
      g.fillStyle(0xffd23f, 1);
      for (let i = 0; i < 10; i++) {
        const p = pts[i], q = pts[(i + 1) % 10];
        g.fillTriangle(cx, cy, p.x, p.y, q.x, q.y);
      }
      g.fillStyle(0xfff3b0, 1);
      g.fillCircle(10, 10, 2.5);
    });

    // Hearts (full / empty)
    const heart = (g, color) => {
      g.fillStyle(color, 1);
      g.fillCircle(8, 8, 7.5);
      g.fillCircle(20, 8, 7.5);
      g.fillTriangle(0.8, 10.5, 27.2, 10.5, 14, 25);
    };
    bake('heart_full', 28, 26, (g) => {
      heart(g, 0xff4d6d);
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(7, 6, 2);
    });
    bake('heart_empty', 28, 26, (g) => heart(g, 0x33384d));

    // Ground tiles
    bake('dirt', 32, 32, (g) => {
      g.fillStyle(0x3a2f63, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x4a3d7a, 1);
      g.fillRect(4, 6, 4, 3);
      g.fillRect(9, 22, 6, 3);
      g.fillStyle(0x2c2350, 1);
      g.fillRect(18, 12, 5, 3);
      g.fillRect(24, 26, 4, 3);
    });
    bake('grassTop', 32, 8, (g) => {
      g.fillStyle(0x5de0c4, 1);
      g.fillRect(0, 0, 32, 5);
      g.fillStyle(0x2bb59a, 1);
      g.fillRect(0, 5, 32, 3);
    });
    bake('platform', 32, 16, (g) => {
      g.fillStyle(0x6a5acd, 1);
      g.fillRect(0, 0, 32, 16);
      g.fillStyle(0x9d8fff, 1);
      g.fillRect(0, 0, 32, 4);
      g.fillStyle(0x4b3fa6, 1);
      g.fillRect(0, 12, 32, 4);
      g.fillRect(0, 4, 2, 8);
    });

    // Goal flag
    bake('goal', 48, 112, (g) => {
      g.fillStyle(0x8a93a6, 1);
      g.fillRect(2, 104, 18, 8);
      g.fillStyle(0xd0d6e0, 1);
      g.fillRect(8, 0, 6, 112);
      g.fillStyle(0xffd23f, 1);
      g.fillCircle(11, 4, 6);
      g.fillStyle(0x5df2c0, 1);
      g.fillTriangle(14, 10, 46, 24, 14, 38);
    });

    // Sky gradient (banded) with a planet and moon
    bake('sky', CONFIG.WIDTH, CONFIG.HEIGHT, (g) => {
      const top = Phaser.Display.Color.ValueToColor(0x070b24);
      const bottom = Phaser.Display.Color.ValueToColor(0x2a1b5e);
      const step = 12;
      const steps = Math.ceil(CONFIG.HEIGHT / step);
      for (let i = 0; i < steps; i++) {
        const c = Phaser.Display.Color.Interpolate.ColorWithColor(top, bottom, steps, i);
        g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
        g.fillRect(0, i * step, CONFIG.WIDTH, step + 1);
      }
      g.fillStyle(0xa67ad9, 1);
      g.fillCircle(790, 120, 48);
      g.fillStyle(0x7a52b3, 0.6);
      g.fillCircle(806, 134, 40);
      g.fillStyle(0xe8e8ff, 0.9);
      g.fillCircle(180, 90, 14);
    });

    // Star layers (tiled for parallax)
    const starfield = (key, count, minSize, maxSize, minAlpha, maxAlpha) => {
      bake(key, 512, 512, (g) => {
        for (let i = 0; i < count; i++) {
          g.fillStyle(0xffffff, Phaser.Math.FloatBetween(minAlpha, maxAlpha));
          const s = Phaser.Math.Between(minSize, maxSize);
          g.fillRect(Phaser.Math.Between(0, 510), Phaser.Math.Between(0, 510), s, s);
        }
      });
    };
    starfield('stars_far', 70, 1, 2, 0.3, 0.6);
    starfield('stars_near', 35, 2, 3, 0.6, 1);

    g.destroy();
    this.scene.start('MenuScene');
  }
}
