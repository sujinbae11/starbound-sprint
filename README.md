# Starbound Sprint

Build: AUTO-RUN v19

A ten-stage side-scrolling platformer built with Phaser 3.90.0. Phaser and all game assets are bundled, so no package installation is required.

## Run on Windows

1. Extract the ZIP first. Do not run files from inside the ZIP preview.
2. Open the extracted `starbound-sprint` folder.
3. Double-click `START_GAME.bat`.
4. Keep the small server window open while playing. Close it or press Ctrl+C when finished.

No Python, Node.js, or package installation is required for this launcher.

## Other ways to run

For reliable audio playback, serve the folder locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly is not recommended because some browsers restrict local JavaScript or WAV playback.

## Controls

- Start: click `START`
- Movement: automatic forward running
- Jump: left-click once
- Double jump: left-click one additional time while airborne
- Bonus jump: after using both jumps, collect a star in midair to earn exactly one extra jump before landing
- Lost-heart pickup: taking damage leaves a heart at the incident location; it restores one heart only when health is below three
- Pause: `Esc` (then choose RESUME, RESTART STAGE, or MAIN MENU)
- Menus: mouse

Keyboard movement and keyboard jumping are disabled. Each jump requires a separate left-click. Landing resets the jump counter.

## Progression

- Ten increasingly difficult stages share one modular `GameScene`.
- Stage 1 keeps its original layout and speed.
- From Stage 2 onward, speed increases by 0.10x per stage and each map becomes about 1,000 pixels longer.
- Later maps add wider pits, smaller/higher platforms, extra platform sequences, and enemies throughout the extended late-map sections.
- Stars now appear only on cliff-jump routes: 6 for a normal jump and 10 for a double jump.
- Some routes from Stage 3 onward require a double jump; their stars are blue and the second-click point is a larger green star.
- Normal and double-jump routes both finish on ordinary ground so jump charges must reset between obstacle sequences.
- Jump force and every star trajectory are recalculated together; the lower arc now matches the pit spacing more closely.
- All star routes retain their shape and horizontal position while rendering 10 pixels lower.
- Stages 5–6 have four platforms and one required platform-star route.
- Stages 7–8 have five platforms and two required platform-star routes.
- Stages 9–10 have six platforms and one central required platform route.
- The middle of Stages 9 and 10 contains one long groundless section crossed via two physics-positioned platforms and orange/pink route stars.
- Any platform that would overlap or block a star route is removed automatically.
- Every ground-to-ground gap is 10 pixels narrower while the solid ground segment lengths remain unchanged.
- Stage 10 has exactly 20 pits and keeps its existing solid-ground pacing.
- Pit counts progress from 3 in Stage 1 to 18 in Stage 9 and 20 in Stage 10, preserving the difficulty curve.
- The two platforms inside the groundless sections of Stages 9 and 10 are widened from 112px to 160px.
- Losing all three hearts automatically restarts the current stage from its initial score and position.
- Reaching the far edge of a map completes the stage even if the flag trigger is missed.
- The gameplay camera keeps the player centered from the beginning through the map edge.
- Only Stage 1 is initially unlocked.
- Completing a stage unlocks exactly the next stage and transitions automatically.
- Unlocked stages remain replayable from Stage Select.
- The highest unlocked stage is saved in browser `localStorage` under `starboundSprint.highestUnlockedStage`.
- Stage 10 ends with the final `YOU COMPLETED STARBOUND SPRINT!` screen.

## Audio

- `assets/audio/reward.wav`: collecting a star
- `assets/audio/damage.wav`: enemy damage or falling into a pit
- `assets/audio/victory.wav`: completing a stage

## Project layout

```text
index.html
lib/                         bundled Phaser 3
assets/audio/                reward, damage, and victory WAV files
src/config.js                shared tuning values
src/progression.js           localStorage unlock logic
src/level/levelData.js       ten stage specifications
src/level/LevelBuilder.js    shared stage object builder
src/entities/                player and enemy behavior
src/scenes/MenuScene.js      PLAY and STAGE SELECT
src/scenes/StageSelectScene.js
src/scenes/GameScene.js      shared gameplay for every stage
src/scenes/UIScene.js        stage, health, and score HUD
src/scenes/PauseScene.js     ESC pause, resume, and main-menu overlay
src/scenes/EndScene.js       game over and final victory screens
tests/smoke-tests.js         progression and double-jump checks
```

## Test

With Node.js installed:

```bash
node tests/smoke-tests.js
```
