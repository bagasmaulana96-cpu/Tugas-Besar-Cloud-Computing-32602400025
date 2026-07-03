// internal level table – not exported
const LEVELS = [
  { level: 1, title: "Pemula", minExp: 0 },
  { level: 2, title: "Apprentice", minExp: 100 },
  { level: 3, title: "Journeyman", minExp: 250 },
  { level: 4, title: "Expert", minExp: 500 },
  { level: 5, title: "Master", minExp: 900 },
  { level: 6, title: "Grandmaster", minExp: 1400 },
  { level: 7, title: "Legend", minExp: 2000 },
  { level: 8, title: "Mythic", minExp: 2800 },
  { level: 9, title: "Immortal", minExp: 3800 },
  { level: 10, title: "Ascendant", minExp: 5000 },
] as const;

/**
 * Convert total EXP to level data.
 */
export function getLevelFromExp(totalExp: number) {
  // find the highest level whose minExp is <= totalExp
  const current =
    LEVELS.slice()
      .reverse()
      .find((l) => totalExp >= l.minExp) ?? LEVELS[0];

  const currentIdx = LEVELS.findIndex((l) => l.level === current.level);
  const next = LEVELS[currentIdx + 1] ?? current;

  const currentLevelExp = current.minExp;
  const nextLevelExp = next.minExp;

  const progressPercent =
    currentLevelExp === nextLevelExp
      ? 100
      : Math.min(
          100,
          Math.round(
            ((totalExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) *
              100,
          ),
        );

  return {
    level: current.level,
    title: current.title,
    currentLevelExp,
    nextLevelExp,
    progressPercent,
  };
}

/**
 * EXP earned per session based on level and streak.
 */
export function getExpPerSession(level: number, streakDays: number): number {
  const base = 10 * level;
  const bonus = streakDays >= 7 ? 5 : 0;
  return base + bonus;
}

/**
 * Tailwind text color class for a given level.
 */
export function getLevelColor(level: number): string {
  if (level >= 1 && level <= 2) return "text-text-secondary";
  if (level >= 3 && level <= 4) return "text-blue-main";
  if (level >= 5 && level <= 6) return "text-purple-light";
  if (level >= 7 && level <= 8) return "text-purple-glow";
  if (level >= 9 && level <= 10) return "text-amber-main";
  return "text-text-secondary";
}

/**
 * Whether the user has already claimed today.
 */
export function hasClaimedToday(lastClaimedAt: string | null): boolean {
  if (!lastClaimedAt) return false;
  const today = new Date().toDateString();
  const claimed = new Date(lastClaimedAt).toDateString();
  return today === claimed;
}

/**
 * Calculate the new streak based on the last claim date.
 */
export function calculateStreak(
  lastClaimedAt: string | null,
  currentStreak: number,
): number {
  if (!lastClaimedAt) return 1; // first claim

  const last = new Date(lastClaimedAt);
  const now = new Date();

  const lastDateOnly = new Date(
    last.getFullYear(),
    last.getMonth(),
    last.getDate(),
  );
  const nowDateOnly = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const diffDays = Math.round(
    (nowDateOnly.getTime() - lastDateOnly.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return currentStreak; // already claimed today
  if (diffDays === 1) return currentStreak + 1; // continue streak
  return 1; // streak reset, start new at 1
}
