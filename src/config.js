/**
 * Starbound Sprint - shared constants.
 * Tweak values here to change how the game feels.
 *
 * NOTE: This project uses classic <script> tags (no ES modules) so that
 * index.html also works when opened straight from disk (file://).
 * Each file declares top-level classes/constants that later files can use.
 */
const CONFIG = {
  WIDTH: 960,
  HEIGHT: 540,
  GRAVITY: 1100,

  LEVEL_WIDTH: 6400,
  LEVEL_COUNT: 10,
  GROUND_Y: 476,          // y of the top surface of the ground
  GROUND_THICKNESS: 64,
  FALL_DEATH_Y: 620,      // falling below this y counts as falling into a pit

  PLAYER: {
    START_X: 96,
    START_Y: 400,
    MAX_HEALTH: 3,
    RUN_SPEED: 250,
    GROUND_ACCEL: 2600,
    AIR_ACCEL: 1700,
    JUMP_SPEED: 530,      // slightly lower arc so airtime matches pit spacing
    JUMP_CUT: 0.45,       // velocity multiplier when jump is released early
    COYOTE_MS: 110,       // grace time to jump after leaving a ledge
    JUMP_BUFFER_MS: 120,  // grace time for pressing jump just before landing
    INVULN_MS: 1400,      // invulnerability after taking damage
    HURT_LOCK_MS: 280,    // input lock so knockback is visible
    KNOCKBACK_X: 260,
    KNOCKBACK_Y: 300,
    STOMP_BOUNCE: 400,
    MAX_FALL_SPEED: 900
  },

  ENEMY: {
    SPEED: 70
  },

  SCORE: {
    STAR: 10,
    STOMP: 100,
    WIN_BONUS: 500
  }
};
