import type { ElapsedTime, Period } from "@/types";

/**
 * Formats the elapsed time for display on the detail page per selected period tab.
 *
 * Layout per period:
 * - hours:  Hours · Minutes · Seconds
 * - days:   Days · Hours · Minutes · Seconds
 * - weeks:  Weeks · Days · Hours · Minutes
 * - months: Months · Days · Hours · Minutes
 * - years:  Years · Months · Days · Hours
 */
export function getDisplayUnits(
  elapsed: ElapsedTime,
  period: Period
): { value: number; label: string }[] {
  switch (period) {
    case "hours":
      return [
        { value: elapsed.hours + elapsed.days * 24 + elapsed.weeks * 168 + Math.floor(elapsed.months * 30.44 * 24) + Math.floor(elapsed.years * 365.25 * 24), label: "Hours" },
        { value: elapsed.minutes, label: "Minutes" },
        { value: elapsed.seconds, label: "Seconds" },
      ];
    case "days":
      return [
        { value: elapsed.days + elapsed.weeks * 7 + Math.floor(elapsed.months * 30.44) + Math.floor(elapsed.years * 365.25), label: "Days" },
        { value: elapsed.hours, label: "Hours" },
        { value: elapsed.minutes, label: "Minutes" },
        { value: elapsed.seconds, label: "Seconds" },
      ];
    case "weeks":
      return [
        { value: elapsed.weeks + Math.floor(elapsed.months * 4.35) + Math.floor(elapsed.years * 52.18), label: "Weeks" },
        { value: elapsed.days, label: "Days" },
        { value: elapsed.hours, label: "Hours" },
        { value: elapsed.minutes, label: "Minutes" },
      ];
    case "months":
      return [
        { value: elapsed.months + elapsed.years * 12, label: "Months" },
        { value: elapsed.days + elapsed.weeks * 7, label: "Days" },
        { value: elapsed.hours, label: "Hours" },
        { value: elapsed.minutes, label: "Minutes" },
      ];
    case "years":
      return [
        { value: elapsed.years, label: "Years" },
        { value: elapsed.months, label: "Months" },
        { value: elapsed.days + elapsed.weeks * 7, label: "Days" },
        { value: elapsed.hours, label: "Hours" },
      ];
  }
}

/**
 * Formats a timestamp as a human-readable date: "21 May 2025"
 */
export function formatStartedOn(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formats a reset timestamp: "Reset on 7 Dec 2025"
 */
export function formatResetOn(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `Reset on ${day} ${month} ${year}`;
}

/**
 * Short date for compact display: "7 Dec"
 */
export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}`;
}
