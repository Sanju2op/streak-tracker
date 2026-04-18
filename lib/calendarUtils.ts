import type { ColorSwatch, Counter, Reset } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function appendColor(
  dayMap: Map<string, Map<string, ColorSwatch>>,
  dateKey: string,
  counter: Counter,
): void {
  if (!dayMap.has(dateKey)) {
    dayMap.set(dateKey, new Map<string, ColorSwatch>());
  }

  const dayColors = dayMap.get(dateKey);
  if (!dayColors) return;

  if (!dayColors.has(counter.id)) {
    dayColors.set(counter.id, {
      id: counter.id,
      hex: counter.color,
      label: counter.title,
    });
  }
}

/**
 * Builds day-level streak color data for the calendar.
 * Output shape: { "YYYY-MM-DD": ColorSwatch[] }
 */
export function buildCalendarDayColorMap(
  counters: Counter[],
  resets: Reset[],
  activeFilterIds: string[],
  nowMs: number = Date.now(),
): Record<string, ColorSwatch[]> {
  const filterSet =
    activeFilterIds.length > 0 ? new Set(activeFilterIds) : null;

  const resetsByCounter = new Map<string, Reset[]>();
  for (const reset of resets) {
    const list = resetsByCounter.get(reset.counterId) ?? [];
    list.push(reset);
    resetsByCounter.set(reset.counterId, list);
  }

  const dayMap = new Map<string, Map<string, ColorSwatch>>();

  for (const counter of counters) {
    if (filterSet && !filterSet.has(counter.id)) continue;

    const counterResets = [...(resetsByCounter.get(counter.id) ?? [])].sort(
      (a, b) => a.resetAt - b.resetAt,
    );

    const intervals: Array<{ startMs: number; endMs: number }> = [];

    for (const reset of counterResets) {
      intervals.push({
        startMs: reset.previousStartedAt,
        endMs: reset.resetAt,
      });
    }

    intervals.push({
      startMs: counter.startedAt,
      endMs: nowMs,
    });

    for (const interval of intervals) {
      if (interval.endMs < interval.startMs) continue;

      let cursor = startOfLocalDay(interval.startMs);
      const end = startOfLocalDay(interval.endMs);

      while (cursor <= end) {
        appendColor(dayMap, toDateKey(cursor), counter);
        cursor += DAY_MS;
      }
    }
  }

  const result: Record<string, ColorSwatch[]> = {};
  for (const [dateKey, counterMap] of dayMap.entries()) {
    result[dateKey] = Array.from(counterMap.values());
  }

  return result;
}
