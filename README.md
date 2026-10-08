# Starbound Sprint

**Play the Game:**  
https://sujinbae11.github.io/starbound-sprint/

**GitHub Repository:**  
https://github.com/sujinbae11/starbound-sprint

Starbound Sprint is a ten-stage auto-running browser platform game built with Phaser 3. The player collects stars, avoids enemies and pits, manages a three-heart health system, and completes increasingly difficult stages.

## How to Play

- Click **START** to begin the game.
- The character runs forward automatically.
- **Left-click or tap once:** Jump.
- **Left-click or tap again:** Double jump.
- **Escape:** Pause the game.
- The pause menu contains Resume, Restart Stage, and Main Menu.
- Reach the finish flag or the end of the map to complete a stage.

After the normal jump and double jump have been used, collecting a star while airborne grants one additional jump. Landing resets the jump count.

## Reward Damage End Gameplay Loop

### Reward

Collecting a star awards 10 points and plays the reward sound. Stars are positioned along intended single-jump, double-jump, and platform routes.

Collecting a star after both jumps have been used also grants one additional jump. Stomping an enemy awards 100 points, and completing a stage awards 500 points and unlocks the next stage.

### Damage

Enemies and pits remove one heart and play the damage sound. The player starts each stage with three hearts.

Enemy damage produces knockback, camera feedback, and temporary invincibility. Falling into a pit returns the player to the last safe position when health remains.

A recovery heart appears near the damage location. It restores one heart only when the player has fewer than three hearts.

### End

Reaching the finish flag or the far edge of the map completes the stage and plays the victory sound.

Completing Stages 1 through 9 unlocks and loads the next stage. Completing Stage 10 displays:

> YOU COMPLETED STARBOUND SPRINT!

When all three hearts are lost, the current run ends, the game displays a loss message, and the current stage restarts from its initial score and position.

## Scoring

| Action | Score | Result |
| --- | ---: | --- |
| Collect a star | 10 | May restore one jump |
| Stomp an enemy | 100 | Defeats the enemy |
| Complete a stage | 500 | Unlocks the next stage |

## Stage Progression

- The game contains ten stages.
- Only Stage 1 is initially unlocked.
- Completing a stage unlocks exactly the next stage.
- Previously unlocked stages remain replayable.
- Progress is saved using browser localStorage.
- Speed increases by 0.10x per stage.
- Later stages contain longer maps, more pits, more enemies, and harder platform sequences.
- Stage 10 contains twenty pits.
- Stages 9 and 10 contain a groundless platform section.
- Star routes are calculated from the same movement physics used by the player.
- The camera keeps the player centered during gameplay.

## Audio Pipeline

The game contains three custom AI-generated WAV sound effects.

| Role | File | Trigger | Volume |
| --- | --- | --- | ---: |
| Reward | `assets/audio/reward.wav` | Collecting a star or heart | 0.45–0.50 |
| Damage | `assets/audio/damage.wav` | Enemy collision or pit fall | 0.55 |
| End | `assets/audio/victory.wav` | Completing a stage | 0.55 |

The audio files are preloaded in `BootScene`. Phaser plays them directly from the gameplay event that changes score, health, or stage state.

### Audio Generation Tool

All three sound effects were generated with **ElevenLabs Sound Effects**.

The generated WAV files were used without post-processing. Only their playback volume was adjusted inside Phaser.

### Reward Sound Prompt

> A short, bright arcade reward chime for collecting a star, sparkling and cheerful, clean attack, under one second, no voice, no music.

### Damage Sound Prompt

> A short sci-fi arcade damage impact sound for losing health, sharp and punchy but not harsh, under one second, no voice, no music.

### End Sound Prompt

> A short triumphant space arcade victory stinger for completing a stage, uplifting and energetic, about two seconds, no voice.

### Audio Attribution

Sound effects generated with ElevenLabs Sound Effects for a non-commercial educational project.

Attribution: https://elevenlabs.io

The audio remains subject to the ElevenLabs terms that applied when it was generated. Free-plan output requires attribution and non-commercial use. Paid-plan output may include commercial rights subject to the ElevenLabs Terms of Service.

## Browser Audio Policy

Modern browsers block audio before the user interacts with a webpage. Starbound Sprint starts from a clickable START screen, so the first user interaction occurs before gameplay audio is played.

## Technology and AI Toolchain

- Phaser 3.90.0
- HTML5
- JavaScript
- Phaser Arcade Physics
- Browser localStorage
- OpenAI Codex
- ElevenLabs Sound Effects
- GitHub
- GitHub Pages
- PowerShell local server

OpenAI Codex was used for code generation, debugging, gameplay balancing, automated testing, documentation, and packaging.

ElevenLabs was used to generate the three custom gameplay sound effects.

## Code Architecture

The game uses reusable scenes and data modules instead of creating ten separate gameplay scenes.

```text
index.html
lib/
assets/audio/
src/config.js
src/progression.js
src/entities/Player.js
src/entities/Enemy.js
src/level/levelData.js
src/level/LevelBuilder.js
src/scenes/BootScene.js
src/scenes/MenuScene.js
src/scenes/StageSelectScene.js
src/scenes/GameScene.js
src/scenes/UIScene.js
src/scenes/PauseScene.js
src/scenes/EndScene.js
tests/smoke-tests.js
GameScene contains the shared Reward, Damage, and End systems. levelData.js supplies the layout and difficulty values for each stage.
Master AI Prompt Log
1 Ten Stage Progression
Prompt:
Add a ten-stage progression system without removing or breaking the reward, damage, health, enemy, star, scoring, or end-state mechanics.
Result:
Codex created modular menu, stage-selection, progression, and gameplay systems.
2 Double Jump
Prompt:
Allow exactly two jumps before landing. Each jump must require a separate input.
Result:
A jump counter was added and resets after landing.
3 Local Execution
Prompt:
Fix the game because index.html does not run correctly.
Result:
A dependency-free PowerShell local server and START_GAME.bat launcher were added.
4 Automatic Movement
Prompt:
Remove WASD and arrow-key movement. Make the character automatically move forward after pressing START.
Result:
The game was converted into an auto-running platform game.
5 Mouse Input
Prompt:
Use left mouse click for jump and another left click for double jump.
Result:
Left-click and mobile-tap jumping were implemented.
6 Difficulty Progression
Prompt:
Make later stages more difficult. Increase the speed by 1.10 and increase the map length.
Result:
Later stages received longer layouts, more enemies, additional pits, and harder platform sequences.
7 Camera and Completion
Prompt:
Keep the player centered in the camera and complete the stage at the end of the map even if the flag is missed.
Result:
Centered camera tracking and a map-edge completion condition were added.
8 Pause Menu
Prompt:
Add Resume, Restart Stage, and Main Menu buttons when Escape is pressed.
Result:
A separate pause scene was created.
9 Late Stage Enemies
Prompt:
Add enemies near the end of Stages 7 and 8.
Result:
Enemy placement was expanded across the longer maps.
10 Star Routes
Prompt:
Place stars along achievable normal-jump and occasional double-jump trajectories.
Result:
Stars were generated from the player’s movement physics.
11 Additional Jump Reward
Prompt:
After both jumps have been used, collecting a star should grant one additional jump.
Result:
A one-time airborne jump recharge was added.
12 Platform and Star Balance
Prompt:
Reduce excessive platforms and stars, prevent platforms from blocking stars, and require the player to land on ordinary ground.
Result:
Platform density was reduced and route-clearance rules were added.
13 Jump Physics
Prompt:
Lower the jump power and update the star trajectories to match it.
Result:
Jump force, pit spacing, and star routes were recalculated together.
14 Later Stage Platforms
Prompt:
Set specific platform counts and required platform-star routes for Stages 5 through 10.
Result:
Stage-specific platform sequences and groundless sections were added.
15 Stage 10 Balance
Prompt:
Add twenty pits to Stage 10, narrow excessive ground gaps, and enlarge the platforms inside groundless sections.
Result:
Stage 10 was rebalanced while keeping its jumps achievable.
16 Health Recovery
Prompt:
When damage occurs, create a recovery heart near the damaged area. Do not allow it to be collected at full health.
Result:
Conditional recovery hearts were added.
17 Final Star Adjustment
Prompt:
Keep the star trajectories unchanged but move every star 10 pixels lower.
Result:
All star routes were moved down exactly 10 pixels without changing their shape or horizontal position.
Error Recovery Log
Problem	Resolution
index.html did not run reliably	Added a local server and Windows launcher
The character stopped moving	Replaced directional movement with continuous auto-run logic
Mouse jump did not respond correctly	Changed jump input to left-click
Stages looked too similar	Added stage-specific layout and difficulty values
Missing the flag prevented completion	Added a map-edge completion condition
Late stages lacked enemies near the end	Extended enemy placement
Platforms blocked star routes	Added clearance checks
Too many platforms made the game easy	Reduced platform density
Pit spacing did not match jump physics	Recalculated obstacles and routes together
The first v19 ZIP did not run	Restored the missing launcher and Phaser library files


Final verification included smoke tests, JavaScript syntax checks, clean ZIP extraction, local HTTP requests, and browser testing.
Workflow Reflection
Developing Starbound Sprint showed me that conversational AI works best as an iterative coding partner rather than a one-prompt game generator. Codex quickly scaffolded Phaser scenes, reusable level data, localStorage progression, and collision systems. However, the first implementation of a feature was not always a good gameplay solution. Some generated layouts were technically playable but became too easy because the player could remain on platforms without returning to the ground. Other layouts placed stars behind platforms or created gaps that did not match the player's jump distance.
I reduced these errors by replacing subjective requests with measurable constraints. Instead of asking for a stage to feel harder, I specified platform counts, pit counts, a 1.10 speed progression, exact gap adjustments, and the required behavior of the jump counter. I tested each revision and described visible failures in plain language. Automated smoke tests confirmed progression and input rules, while browser testing exposed packaging, balance, and readability problems that code checks alone could not identify.
Human curation shaped the final game. I chose the auto-run format, changed jumping to left-click, decided that stars should communicate safe jump routes, and repeatedly adjusted speed, map length, hazards, platforms, and recovery rules. Codex handled implementation and repetitive revisions, but I evaluated whether each result was understandable and fair. The final project therefore follows a human-first, AI-in-the-middle, and human-last workflow: I defined the experience, used AI to build and troubleshoot it, and made the final creative and balancing decisions through playtesting.
Reflection word count: 245
Concept and Acoustic References
The gameplay direction is based on one-button auto-running platform games where obstacle readability and input timing replace free horizontal movement.
The visual mood uses a colorful arcade science-fiction setting with simple silhouettes that remain readable at speed.
The acoustic direction uses three short feedback cues:
- A bright reward chime
- A sharp damage warning
- A longer triumphant completion stinger
All visible game textures are drawn at runtime with Phaser Graphics. No external character, enemy, platform, or background image files are used.
Asset Attribution
Asset	Creator or Tool	License or Terms
Phaser 3.90.0	Phaser Studio	MIT License
Game code	Student-directed development with OpenAI Codex	Original coursework
Procedural game visuals	Phaser Graphics and OpenAI Codex	Original coursework
Reward sound	ElevenLabs Sound Effects	Educational, non-commercial use with attribution
Damage sound	ElevenLabs Sound Effects	Educational, non-commercial use with attribution
Victory sound	ElevenLabs Sound Effects	Educational, non-commercial use with attribution


Run Locally on Windows
1. Download or clone the repository.
2. Double-click START_GAME.bat.
3. Keep the server window open while playing.
4. Close the window or press Ctrl+C when finished.
No separate Python or Node.js installation is required.
Testing
The game was tested for:
- Initial Stage 1 unlock
- Locked-stage protection
- One-stage-at-a-time progression
- Replay of unlocked stages
- localStorage persistence
- Exactly two normal jumps before landing
- One conditional star jump recharge
- Stage 10 final victory behavior
- JavaScript syntax validity
- Clean packaged execution
- Browser execution without recorded console errors
License Notice
This repository was created for a non-commercial educational assignment. Third-party software and AI-generated assets remain subject to their original licenses and service terms.
