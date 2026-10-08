/** Ten hand-tuned stage specifications converted to one shared level format. */
const LEVELS = (() => {
  const G = CONFIG.GROUND_Y;
  const SPECS = [
    { width: 4200, pits: [[1180,110],[2480,120],[3440,120]], platforms: [[620,390,160],[900,360,144],[1510,385,160],[1870,350,144],[2780,380,144],[3120,345,128],[3700,380,144]], enemies: [520,1420,2180,2940,3820] },
    { width: 4400, pits: [[900,120],[1960,128],[3020,128],[3820,130]], platforms: [[560,385,144],[1120,380,144],[1440,340,128],[2190,380,128],[2540,340,112],[3260,375,128],[3540,335,112],[4080,375,112]], enemies: [430,1300,1740,2320,2780,3360] },
    { width: 4600, pits: [[780,128],[1680,136],[2580,136],[3540,142]], platforms: [[500,385,128],[980,380,128],[1250,340,112],[1900,375,120],[2180,330,104],[2820,375,120],[3100,330,104],[3780,370,112],[4050,325,96]], enemies: [360,1120,1480,2020,2400,2920,3320,4200] },
    { width: 4800, pits: [[700,136],[1450,142],[2300,145],[3240,150],[4100,145]], platforms: [[440,385,120],[900,375,120],[1130,330,104],[1700,370,112],[1950,320,96],[2550,370,112],[2820,325,96],[3490,365,104],[3750,315,88],[4350,365,104]], enemies: [320,1040,1320,1800,2120,2700,3050,3620,3920,4480] },
    { width: 5000, pits: [[620,142],[1340,148],[2110,150],[2920,155],[3760,150],[4500,145]], platforms: [[390,380,112],[820,370,112],[1040,325,96],[1570,365,104],[1810,315,88],[2350,365,104],[2600,310,88],[3170,360,96],[3400,305,80],[4000,360,96],[4220,310,80],[4720,360,96]], enemies: [300,920,1210,1680,1960,2470,2760,3290,3540,4140,4350] },
    { width: 5200, pits: [[560,148],[1260,152],[1980,158],[2740,160],[3500,160],[4240,155],[4860,120]], platforms: [[350,380,104],[780,365,104],[1000,315,88],[1490,360,96],[1710,305,80],[2210,360,96],[2440,300,80],[2980,355,88],[3200,300,80],[3740,355,88],[3960,300,80],[4470,350,88],[4680,300,80],[5030,370,80]], enemies: [260,880,1140,1600,1870,2320,2580,3090,3350,3850,4100,4590] },
    { width: 5400, pits: [[520,150],[1160,158],[1840,165],[2540,165],[3260,170],[3990,165],[4700,160]], platforms: [[320,375,96],[740,360,96],[940,305,80],[1380,355,88],[1590,300,80],[2070,350,88],[2290,295,76],[2780,350,88],[2990,295,76],[3500,345,84],[3710,290,76],[4220,345,84],[4430,290,76],[4930,340,84],[5140,290,76]], enemies: [240,820,1060,1490,1740,2180,2420,2890,3130,3610,3850,4330,4570,5050] },
    { width: 5700, pits: [[480,155],[1080,165],[1720,170],[2380,175],[3070,175],[3780,180],[4510,175],[5200,165]], platforms: [[290,375,92],[700,355,88],[890,300,76],[1280,350,84],[1470,295,76],[1950,345,84],[2140,290,72],[2610,345,80],[2810,285,72],[3310,340,80],[3510,285,72],[4020,340,80],[4230,285,72],[4750,335,80],[4960,285,72],[5440,335,80]], enemies: [230,780,990,1380,1620,2060,2280,2720,2960,3420,3660,4130,4370,4860,5090,5520] },
    { width: 6000, pits: [[450,160],[1020,170],[1620,178],[2240,180],[2890,185],[3560,185],[4250,180],[4940,175],[5560,160]], platforms: [[270,370,88],[670,350,84],[850,295,72],[1220,345,80],[1400,290,72],[1850,340,80],[2030,285,72],[2470,340,80],[2660,280,72],[3120,335,76],[3310,280,72],[3790,335,76],[3980,280,72],[4480,330,76],[4670,280,72],[5170,330,76],[5360,280,72],[5780,335,76]], enemies: [220,740,930,1320,1530,1950,2160,2570,2800,3230,3470,3900,4160,4590,4850,5280,5480,5840] },
    { width: 6400, pits: [[430,165],[980,175],[1560,182],[2160,185],[2780,190],[3420,190],[4080,185],[4760,182],[5420,178],[5980,165]], platforms: [[250,370,84],[650,345,80],[820,290,72],[1180,340,76],[1350,285,72],[1790,335,76],[1960,280,72],[2390,335,76],[2570,275,72],[3010,330,72],[3190,275,72],[3650,330,72],[3830,275,72],[4310,325,72],[4490,275,72],[4990,325,72],[5170,275,72],[5650,325,72],[5820,275,72],[6200,335,76]], enemies: [210,720,900,1280,1480,1890,2080,2490,2700,3120,3330,3760,3990,4420,4660,5100,5340,5750,5900,6260] }
  ];

  function buildStage(spec, index) {
    const stageNumber = index + 1;
    const speedMultiplier = 1 + index * 0.10;
    const runSpeed = CONFIG.PLAYER.RUN_SPEED * speedMultiplier;
    const jumpSpeed = CONFIG.PLAYER.JUMP_SPEED + index * 4;

    // Stage 1 keeps its original ground and pits. From Stage 2 onward, every
    // course gains a sizeable new challenge section.
    const pitLengthBonus = 0;
    let width = index === 0 ? spec.width : 4200 + index * 1000;
    const pits = spec.pits.map(([x, w]) => ({
      x,
      w: index === 0 ? w + pitLengthBonus : Math.min(390, w + index * 18 + pitLengthBonus)
    }));
    // Platforms are optional alternate routes, not a continuous bridge. Long
    // stages get a few more, but even Stage 10 has at most five before the
    // route-overlap safety pass below.
    const targetPlatformCount = stageNumber >= 9 ? 6 : stageNumber >= 7 ? 5 : stageNumber >= 5 ? 4 : 3;
    const keptPlatformCount = Math.min(spec.platforms.length, targetPlatformCount);
    const keptPlatformIndices = new Set();
    for (let n = 0; n < keptPlatformCount; n++) {
      keptPlatformIndices.add(Math.round(n * (spec.platforms.length - 1) / Math.max(1, keptPlatformCount - 1)));
    }
    let platforms = spec.platforms
      .filter((platform, platformIndex) => keptPlatformIndices.has(platformIndex))
      .map(([x, y, w]) => ({ x, y, w }));
    const extraEnemyPatrols = [];

    if (index > 0) {
      let sectionX = spec.width + 260;
      let section = 0;
      while (sectionX < width - 560) {
        const pitWidth = Math.min(430, 145 + index * 22 + (section % 2) * 24 + pitLengthBonus);

        pits.push({ x: sectionX, w: pitWidth });
        sectionX += Math.max(570, 760 - index * 18) + (section % 2) * 70;
        section += 1;
      }
    }

    // Compensate for every widened pit so later stages remain proportionally
    // longer instead of losing their safe running distance.
    width += pits.length * pitLengthBonus;

    pits.sort((a, b) => a.x - b.x);

    // Each gap between two ground sections is 10px narrower. Shift every
    // later pit by the accumulated reduction so all solid ground segments
    // retain their previous lengths. Stage 10 also retains v17's 20px tempo
    // shift, for a combined 30px positional shift per preceding pit.
    const accumulatedGapShift = stageNumber === 10 ? 30 : 10;
    pits.forEach((pit, pitIndex) => {
      pit.x -= pitIndex * accumulatedGapShift;
    });

    // Stages 9 and 10 replace one central ground stretch with a long void.
    // Its two required platforms are positioned from the actual jump physics.
    let platformOnlySection = null;
    if (stageNumber >= 9) {
      const middlePit = pits.reduce((best, pit) => (
        Math.abs((pit.x + pit.w / 2) - width / 2) < Math.abs((best.x + best.w / 2) - width / 2) ? pit : best
      ), pits[0]);
      const oldWidth = middlePit.w;
      const platformY = G - 86;
      const rise = G - platformY;
      const airTime = (2 * jumpSpeed) / CONFIG.GRAVITY;
      const groundToPlatformTime = (jumpSpeed + Math.sqrt(jumpSpeed * jumpSpeed - 2 * CONFIG.GRAVITY * rise)) / CONFIG.GRAVITY;
      const platformToGroundTime = (jumpSpeed + Math.sqrt(jumpSpeed * jumpSpeed + 2 * CONFIG.GRAVITY * rise)) / CONFIG.GRAVITY;
      const takeoffX = middlePit.x - 60;
      const firstPlatformX = takeoffX + runSpeed * groundToPlatformTime;
      const secondPlatformX = firstPlatformX + runSpeed * airTime;
      const landingX = secondPlatformX + runSpeed * platformToGroundTime;
      const expandedWidth = landingX - 60 - middlePit.x;
      const addedWidth = expandedWidth - oldWidth;

      pits.forEach((pit) => {
        if (pit !== middlePit && pit.x > middlePit.x) pit.x += addedWidth;
      });
      middlePit.w = expandedWidth;
      middlePit.platformOnlySection = true;
      width += addedWidth;
      platformOnlySection = {
        pit: middlePit,
        takeoffX,
        firstPlatformX,
        secondPlatformX,
        landingX,
        platformY,
        groundToPlatformTime,
        airTime,
        platformToGroundTime
      };
      pits.sort((a, b) => a.x - b.x);
    }
    const ground = [];
    let cursor = 0;
    pits.forEach((pit) => {
      ground.push({ x: cursor, w: pit.x - cursor });
      cursor = pit.x + pit.w;
    });
    ground.push({ x: cursor, w: width - cursor });

    // Populate every safe ground stretch in the extended part of the map.
    // This includes the final stretch before the flag, which prevents the
    // back halves of Stages 7–10 from becoming empty.
    if (index > 0) {
      ground.forEach((segment) => {
        const segmentEnd = segment.x + segment.w;
        const safeStart = Math.max(segment.x + 70, spec.width + 120);
        const safeEnd = Math.min(segmentEnd - 70, width - 170);
        if (safeEnd < safeStart) return;
        const spacing = Math.max(320, 470 - index * 12);
        let lastX = -Infinity;
        for (let x = safeStart; x <= safeEnd; x += spacing) {
          extraEnemyPatrols.push({
            minX: Math.max(segment.x + 38, x - 90),
            maxX: Math.min(segmentEnd - 38, x + 90, width - 180)
          });
          lastX = x;
        }
        if (safeEnd - lastX > 180) {
          extraEnemyPatrols.push({
            minX: Math.max(segment.x + 38, safeEnd - 90),
            maxX: Math.min(segmentEnd - 38, safeEnd + 90, width - 180)
          });
        }
      });
    }

    const stars = [];
    const isSafeGroundPoint = (x, padding = 42) => ground.some((segment) => (
      x >= segment.x + padding && x <= segment.x + segment.w - padding
    ));
    const requestedPlatformRoutes = stageNumber >= 9 ? 0 : stageNumber >= 7 ? 2 : stageNumber >= 5 ? 1 : 0;
    const platformRoutePits = new Set();
    for (let routeIndex = 1; routeIndex <= requestedPlatformRoutes; routeIndex++) {
      const pitIndex = Math.floor(routeIndex * pits.length / (requestedPlatformRoutes + 1));
      platformRoutePits.add(pits[pitIndex]);
    }

    const addPlatformArc = (startX, startY, duration, routeId, markLanding, skipFirst = false) => {
      const starCount = 5;
      for (let n = skipFirst ? 1 : 0; n < starCount; n++) {
        const t = duration * (n / (starCount - 1));
        const height = jumpSpeed * t - 0.5 * CONFIG.GRAVITY * t * t;
        stars.push({
          x: startX + runSpeed * t,
          y: startY - height,
          route: 'platform',
          platformRouteId: routeId,
          platformTarget: markLanding && n === starCount - 1
        });
      }
    };

    pits.forEach((pit, pitIndex) => {
      if (pit.platformOnlySection && platformOnlySection) {
        const section = platformOnlySection;
        const routeId = `stage-${stageNumber}-platform-section`;
        const platformWidth = 160;
        platforms.push(
          {
            x: section.firstPlatformX - platformWidth / 2,
            y: section.platformY,
            w: platformWidth,
            requiredRoute: true,
            platformRouteId: routeId
          },
          {
            x: section.secondPlatformX - platformWidth / 2,
            y: section.platformY,
            w: platformWidth,
            requiredRoute: true,
            platformRouteId: routeId
          }
        );
        addPlatformArc(section.takeoffX, G - 42, section.groundToPlatformTime, routeId, true);
        addPlatformArc(section.firstPlatformX, section.platformY - 42, section.airTime, routeId, true, true);
        addPlatformArc(section.secondPlatformX, section.platformY - 42, section.platformToGroundTime, routeId, false, true);
        return;
      }

      if (platformRoutePits.has(pit)) {
        const routeId = `stage-${stageNumber}-platform-${pitIndex}`;
        const platformRise = 70;
        const platformY = G - platformRise;
        const routeTime = (jumpSpeed + Math.sqrt(jumpSpeed * jumpSpeed - 2 * CONFIG.GRAVITY * platformRise)) / CONFIG.GRAVITY;
        const takeoffX = pit.x - 55;
        const landingX = takeoffX + runSpeed * routeTime;
        const platformWidth = 120;
        platforms.push({
          x: landingX - platformWidth / 2,
          y: platformY,
          w: platformWidth,
          requiredRoute: true,
          platformRouteId: routeId
        });
        addPlatformArc(takeoffX, G - 42, routeTime, routeId, true);
        return;
      }

      // Double-jump routes are only used when both their takeoff and landing
      // points are safely on ordinary ground. Otherwise this pit falls back
      // to a single-jump route so every path forces a real ground reset.
      const airTime = (2 * jumpSpeed) / CONFIG.GRAVITY;
      const secondJumpAt = airTime * 0.55;
      const heightAtSecondJump = jumpSpeed * secondJumpAt - 0.5 * CONFIG.GRAVITY * secondJumpAt * secondJumpAt;
      const secondLegTime = (jumpSpeed + Math.sqrt(jumpSpeed * jumpSpeed + 2 * CONFIG.GRAVITY * heightAtSecondJump)) / CONFIG.GRAVITY;
      const doubleRouteTime = secondJumpAt + secondLegTime;
      const doubleJumpDistance = runSpeed * doubleRouteTime;
      const doubleMargin = Math.max(36, (doubleJumpDistance - pit.w) / 2);
      const wantsDoubleJump = stageNumber >= 3 && (pitIndex + stageNumber) % 4 === 0;
      const isDoubleJump = wantsDoubleJump
        && isSafeGroundPoint(pit.x - doubleMargin)
        && isSafeGroundPoint(pit.x + pit.w + doubleMargin);
      const routeTime = isDoubleJump ? secondJumpAt + secondLegTime : airTime;
      const jumpDistance = runSpeed * routeTime;
      const margin = Math.max(36, (jumpDistance - pit.w) / 2);
      const starCount = isDoubleJump ? 10 : 6;
      for (let n = 0; n < starCount; n++) {
        const t = routeTime * (n / (starCount - 1));
        const secondLegT = Math.max(0, t - secondJumpAt);
        const height = isDoubleJump && t > secondJumpAt
          ? heightAtSecondJump + jumpSpeed * secondLegT - 0.5 * CONFIG.GRAVITY * secondLegT * secondLegT
          : jumpSpeed * t - 0.5 * CONFIG.GRAVITY * t * t;
        stars.push({
          x: pit.x - margin + runSpeed * t,
          y: G - 42 - height,
          route: isDoubleJump ? 'double' : 'single',
          boost: isDoubleJump && Math.abs(t - secondJumpAt) <= routeTime / (starCount - 1) / 2
        });
      }
    });

    // Keep every route shape and x-position intact while lowering the entire
    // star guide slightly so it aligns more comfortably with the player.
    stars.forEach((star) => {
      star.y += 10;
    });

    // A route star must never be hidden inside or blocked by a platform.
    const platformBlocksRoute = (platform) => stars.some((star) => (
      star.x >= platform.x - 24
      && star.x <= platform.x + platform.w + 24
      && star.y >= platform.y - 70
      && star.y <= platform.y + 24
    ));
    const requiredPlatforms = platforms.filter((platform) => platform.requiredRoute);
    const optionalPlatforms = platforms.filter((platform) => !platform.requiredRoute && !platformBlocksRoute(platform));
    platforms = requiredPlatforms.concat(optionalPlatforms.slice(0, Math.max(0, targetPlatformCount - requiredPlatforms.length)));

    // Restore a small guaranteed set of platforms on safe ground only. Try
    // several points on each ground segment so routes stay clear and the
    // platforms remain spread across the map.
    const safeGround = ground.filter((segment) => segment.w >= 220);
    const candidateRatios = [0.5, 0.3, 0.7];
    for (const ratio of candidateRatios) {
      for (let n = 0; n < safeGround.length && platforms.length < targetPlatformCount; n++) {
        const segment = safeGround[(n * 3 + index) % safeGround.length];
        const platformWidth = 96;
        const centerX = segment.x + segment.w * ratio;
        const candidate = {
          x: centerX - platformWidth / 2,
          y: 372 - ((n + index) % 2) * 18,
          w: platformWidth
        };
        const tooClose = platforms.some((platform) => (
          Math.abs((platform.x + platform.w / 2) - centerX) < 240
        ));
        if (!tooClose && !platformBlocksRoute(candidate)) platforms.push(candidate);
      }
    }
    const enemies = spec.enemies.map((x, enemyIndex) => ({
      minX: Math.max(40, x - (95 + (index % 3) * 10)),
      maxX: Math.min(width - 80, x + 95 + (enemyIndex % 2) * 20)
    }));
    enemies.push(...extraEnemyPatrols);

    return {
      number: stageNumber,
      width,
      speedMultiplier,
      runSpeed,
      jumpSpeed,
      pits,
      ground,
      platforms,
      stars,
      enemies,
      goal: { x: width - 90 }
    };
  }

  return SPECS.map(buildStage);
})();

function getLevelData(stageNumber) {
  const index = Phaser.Math.Clamp((stageNumber || 1) - 1, 0, LEVELS.length - 1);
  return LEVELS[index];
}
