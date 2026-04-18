import type { ElapsedTime } from "@/types";

/**
 * Computes the elapsed time between two Unix ms timestamps.
 * Returns a breakdown into years, months, weeks, days, hours, minutes, seconds.
 *
 * Uses approximate month (30.44 days) and year (365.25 days) for consistency.
 */
export function getElapsed(startMs: number, nowMs: number): ElapsedTime {
  const totalMs = Math.max(0, nowMs - startMs);
  const totalSeconds = Math.floor(totalMs / 1000);

  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_DAY = 86400;
  const SECONDS_PER_WEEK = 604800;
  const DAYS_PER_MONTH = 30.44;
  const DAYS_PER_YEAR = 365.25;
  const SECONDS_PER_MONTH = Math.floor(DAYS_PER_MONTH * SECONDS_PER_DAY);
  const SECONDS_PER_YEAR = Math.floor(DAYS_PER_YEAR * SECONDS_PER_DAY);

  let remaining = totalSeconds;

  const years = Math.floor(remaining / SECONDS_PER_YEAR);
  remaining -= years * SECONDS_PER_YEAR;

  const months = Math.floor(remaining / SECONDS_PER_MONTH);
  remaining -= months * SECONDS_PER_MONTH;

  const weeks = Math.floor(remaining / SECONDS_PER_WEEK);
  remaining -= weeks * SECONDS_PER_WEEK;

  const days = Math.floor(remaining / SECONDS_PER_DAY);
  remaining -= days * SECONDS_PER_DAY;

  const hours = Math.floor(remaining / SECONDS_PER_HOUR);
  remaining -= hours * SECONDS_PER_HOUR;

  const minutes = Math.floor(remaining / SECONDS_PER_MINUTE);
  remaining -= minutes * SECONDS_PER_MINUTE;

  const seconds = remaining;

  return { years, months, weeks, days, hours, minutes, seconds };
}

/**
 * Returns total elapsed in a single unit (for card display).
 */
export function getTotalInPeriod(
  startMs: number,
  nowMs: number,
  period: string
): number {
  const totalMs = Math.max(0, nowMs - startMs);
  const totalSeconds = totalMs / 1000;

  switch (period) {
    case "hours":
      return Math.floor(totalSeconds / 3600);
    case "days":
      return Math.floor(totalSeconds / 86400);
    case "weeks":
      return Math.floor(totalSeconds / 604800);
    case "months":
      return Math.floor(totalSeconds / (30.44 * 86400));
    case "years":
      return Math.floor(totalSeconds / (365.25 * 86400));
    default:
      return Math.floor(totalSeconds / 86400);
  }
}

/**
 * Returns total elapsed days (for stats computation).
 */
export function getElapsedDays(startMs: number, endMs: number): number {
  return Math.max(0, (endMs - startMs) / (1000 * 60 * 60 * 24));
}
