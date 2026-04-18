import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ─── Counters Table ───────────────────────────────────────
export const counters = sqliteTable("counters", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  color: text("color").notNull(),
  startedAt: integer("started_at").notNull(), // Unix ms
  period: text("period").notNull().default("days"), // 'hours'|'days'|'weeks'|'months'|'years'
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// ─── Resets Table ─────────────────────────────────────────
export const resets = sqliteTable("resets", {
  id: text("id").primaryKey(),
  counterId: text("counter_id")
    .notNull()
    .references(() => counters.id, { onDelete: "cascade" }),
  resetAt: integer("reset_at").notNull(), // Unix ms
  note: text("note"),
  previousStartedAt: integer("previous_started_at").notNull(), // snapshot
  createdAt: integer("created_at").notNull(),
});
