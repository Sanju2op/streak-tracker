import type { Counter, Reset, Stats } from "@/types";
import { getElapsedDays } from "./timeUtils";

/**
 * Computes stats for a counter given its reset history.
 *
 * - resetCount: total number of resets
 * - daysSinceStart: days since the active streak start (`counter.startedAt`)
 * - longestStreak: the longest streak duration in days across all intervals
 * - averageStreak: mean streak duration in days
 *
 * When there are no resets, longestStreak and averageStreak equal the current streak.
 */
export function computeStats(counter: Counter, resetList: Reset[]): Stats {
  const now = Date.now();
  const resetCount = resetList.length;
  const daysSinceStart = Math.floor(getElapsedDays(counter.startedAt, now));

  if (resetCount === 0) {
    const currentStreak = Math.floor(getElapsedDays(counter.startedAt, now));
    return {
      resetCount: 0,
      daysSinceStart,
      longestStreak: currentStreak,
      averageStreak: currentStreak,
    };
  }

  // Sort resets chronologically by resetAt
  const sorted = [...resetList].sort((a, b) => a.resetAt - b.resetAt);

  // Collect all streak intervals:
  // Each reset has `previousStartedAt` → `resetAt` as one interval
  // Plus the current active interval: last reset's resetAt → now (which is counter.startedAt → now)
  const intervals: number[] = [];

  for (const reset of sorted) {
    const streakDays = getElapsedDays(reset.previousStartedAt, reset.resetAt);
    intervals.push(streakDays);
  }

  // Current active streak
  const currentStreak = getElapsedDays(counter.startedAt, now);
  intervals.push(currentStreak);

  const longestStreak = Math.floor(Math.max(...intervals));
  const averageStreak = Math.round(
    intervals.reduce((sum, d) => sum + d, 0) / intervals.length,
  );

  return { resetCount, daysSinceStart, longestStreak, averageStreak };
}
