import { create } from "zustand";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { counters as countersTable, resets as resetsTable } from "@/db/schema";
import { getRandomColor } from "@/constants/colors";
import type { Counter, Reset, Period, SortOrder } from "@/types";

interface CounterStore {
  counters: Counter[];
  sortOrder: SortOrder;
  isLoaded: boolean;

  // Actions
  loadCounters: () => Promise<void>;
  addCounter: (title: string, color: string, startedAt: number) => Promise<Counter>;
  updateCounter: (id: string, updates: Partial<Pick<Counter, "title" | "color" | "period">>) => Promise<void>;
  deleteCounter: (id: string) => Promise<void>;
  resetCounter: (id: string, resetAt: number, note: string | null) => Promise<void>;
  toggleSort: () => void;
  getResetsForCounter: (counterId: string) => Promise<Reset[]>;
}

export const useCounterStore = create<CounterStore>((set, get) => ({
  counters: [],
  sortOrder: "desc",
  isLoaded: false,

  loadCounters: async () => {
    const rows = await db.select().from(countersTable);
    const mapped: Counter[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      color: row.color,
      startedAt: row.startedAt,
      period: row.period as Period,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
    set({ counters: mapped, isLoaded: true });
  },

  addCounter: async (title, color, startedAt) => {
    const now = Date.now();
    const id = crypto.randomUUID();
    const newCounter: Counter = {
      id,
      title,
      color,
      startedAt,
      period: "days",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(countersTable).values({
      id: newCounter.id,
      title: newCounter.title,
      color: newCounter.color,
      startedAt: newCounter.startedAt,
      period: newCounter.period,
      createdAt: newCounter.createdAt,
      updatedAt: newCounter.updatedAt,
    });

    set((state) => ({ counters: [...state.counters, newCounter] }));
    return newCounter;
  },

  updateCounter: async (id, updates) => {
    const now = Date.now();
    const updateData: Record<string, unknown> = { updatedAt: now };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.period !== undefined) updateData.period = updates.period;

    await db
      .update(countersTable)
      .set(updateData)
      .where(eq(countersTable.id, id));

    set((state) => ({
      counters: state.counters.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: now } : c
      ),
    }));
  },

  deleteCounter: async (id) => {
    await db.delete(countersTable).where(eq(countersTable.id, id));
    set((state) => ({
      counters: state.counters.filter((c) => c.id !== id),
    }));
  },

  resetCounter: async (id, resetAt, note) => {
    const counter = get().counters.find((c) => c.id === id);
    if (!counter) return;

    const resetId = crypto.randomUUID();
    const now = Date.now();

    // Insert reset record capturing the old startedAt
    await db.insert(resetsTable).values({
      id: resetId,
      counterId: id,
      resetAt,
      note,
      previousStartedAt: counter.startedAt,
      createdAt: now,
    });

    // Update counter's startedAt to the reset date
    await db
      .update(countersTable)
      .set({ startedAt: resetAt, updatedAt: now })
      .where(eq(countersTable.id, id));

    set((state) => ({
      counters: state.counters.map((c) =>
        c.id === id ? { ...c, startedAt: resetAt, updatedAt: now } : c
      ),
    }));
  },

  toggleSort: () => {
    set((state) => ({
      sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
    }));
  },

  getResetsForCounter: async (counterId) => {
    const rows = await db
      .select()
      .from(resetsTable)
      .where(eq(resetsTable.counterId, counterId));
    return rows.map((row) => ({
      id: row.id,
      counterId: row.counterId,
      resetAt: row.resetAt,
      note: row.note,
      previousStartedAt: row.previousStartedAt,
      createdAt: row.createdAt,
    }));
  },
}));
