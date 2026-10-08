/** Persistent stage progression. Only the highest unlocked stage is stored. */
const Progression = (() => {
  const STORAGE_KEY = 'starboundSprint.highestUnlockedStage';

  function clampStage(value) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n)) return 1;
    return Phaser.Math.Clamp(n, 1, CONFIG.LEVEL_COUNT);
  }

  function getHighestUnlocked() {
    try {
      return clampStage(localStorage.getItem(STORAGE_KEY) || 1);
    } catch (error) {
      console.warn('Progress could not be loaded; using Stage 1.', error);
      return 1;
    }
  }

  function unlockAfter(completedStage) {
    const current = getHighestUnlocked();
    const next = Math.min(CONFIG.LEVEL_COUNT, clampStage(completedStage) + 1);
    const unlocked = Math.max(current, next);
    try {
      localStorage.setItem(STORAGE_KEY, String(unlocked));
    } catch (error) {
      console.warn('Progress could not be saved for this browser session.', error);
    }
    return unlocked;
  }

  function isUnlocked(stage) {
    return clampStage(stage) <= getHighestUnlocked();
  }

  return { getHighestUnlocked, unlockAfter, isUnlocked };
})();
