// ─── Period ───────────────────────────────────────────────
export type Period = "hours" | "days" | "weeks" | "months" | "years";

// ─── Counter ──────────────────────────────────────────────
export interface Counter {
  id: string;
  title: string;
  color: string; // hex e.g. "#E63946"
  startedAt: number; // Unix ms
  period: Period;
  createdAt: number; // Unix ms
  updatedAt: number; // Unix ms
}

// ─── Reset ────────────────────────────────────────────────
export interface Reset {
  id: string;
  counterId: string;
  resetAt: number; // Unix ms — also becomes the new startedAt
  note: string | null;
  previousStartedAt: number; // snapshot before reset
  createdAt: number; // Unix ms
}

// ─── Color ────────────────────────────────────────────────
export interface ColorSwatch {
  id: string;
  hex: string;
  label: string;
}

export interface Palette {
  id: string;
  label: string;
  colors: ColorSwatch[];
}

// ─── Elapsed Time ─────────────────────────────────────────
export interface ElapsedTime {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
}

// ─── Stats ────────────────────────────────────────────────
export interface Stats {
  resetCount: number;
  daysSinceStart: number;
  longestStreak: number; // days
  averageStreak: number; // days
}

// ─── Sort ─────────────────────────────────────────────────
export type SortOrder = "asc" | "desc";
