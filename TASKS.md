# TASKS.md
> Running checklist. Read this at the start of every session. Update status as you go.
> Status: ✅ Done | 🔄 In Progress | ⬜ Not Started | 🚫 Blocked

---

## How To Use This File

**Starting a session:** Tell your AI — _"Read TASKS.md and ARCHITECTURE.md, then continue from where we left off."_
**Ending a session:** Mark completed tasks ✅, add new tasks discovered, update Session Notes.
**Switching tools (Cursor ↔ Claude Code ↔ Antigravity):** This file + ARCHITECTURE.md is all the context needed.

---

## Phase 0 — Project Scaffolding

> Goal: Runnable blank app with correct dependencies and folder structure.

- ✅ `0.1` Init Expo project
- ✅ `0.2` Install all dependencies
- ✅ `0.3` Configure NativeWind: `tailwind.config.js` + `babel.config.js` + `global.css`
- ✅ `0.4` Configure Drizzle: `drizzle.config.ts`
- ✅ `0.5` Set up Expo Router folder structure
- ✅ `0.6` Create all empty folders
- ✅ `0.7` Create `/types/index.ts` with all shared interfaces
- ✅ `0.8` Configure `tsconfig.json` path alias `@/`
- ✅ `0.9` Confirm app boots on Android emulator

---

## Phase 1 — Data Layer

> Goal: DB schema live, Zustand store wired, CRUD working. No UI yet.

- ✅ `1.1` Drizzle schema in `/db/schema.ts`
- ✅ `1.2` `/db/index.ts` — expo-sqlite connection + drizzle instance
- ✅ `1.3` Migration setup (using raw SQL in `_layout.tsx` for simplicity)
- ✅ `1.4` Wire migration to run on app start
- ✅ `1.5` `/lib/timeUtils.ts` — `getElapsed(startMs, nowMs)` → `ElapsedTime`
- ✅ `1.6` `/lib/statsUtils.ts` — `computeStats(counter, resets[])` → `Stats`
- ✅ `1.7` `/lib/formatUtils.ts` — formatting helpers
- ✅ `1.8` `/constants/colors.ts` — 75 accent colors, 5 palettes
- ✅ `1.9` `/store/counterStore.ts` — Zustand with full CRUD actions
- ✅ `1.10` `/store/calendarStore.ts` — filter state
- ✅ `1.11` Smoke test: add counter, reset twice, verify stats

---

## Phase 1B — Cross-Platform Data Layer (NEW)

> Goal: Replace the fragile web DB workaround with a proper adapter pattern.
> Reason: `expo-sqlite` crashes on web. The current workaround avoids `openDatabaseSync` but doesn't give web a real store.

- ⬜ `1B.1` Create `/db/adapter.ts` — define `DBAdapter` interface (see ARCHITECTURE.md)
- ⬜ `1B.2` Create `/db/sqliteAdapter.ts` — move existing expo-sqlite + Drizzle logic here, implement the `DBAdapter` interface
- ⬜ `1B.3` Create `/db/webAdapter.ts` — implement `DBAdapter` using `localStorage` JSON store
  - Key: `streak_tracker_data`
  - Shape: `{ counters: Counter[], resets: Reset[] }`
  - All methods return Promises
  - Handle missing/corrupted localStorage data gracefully (default to empty arrays)
- ⬜ `1B.4` Update `/db/index.ts` — platform routing: export `sqliteAdapter` on native, `webAdapter` on web
- ⬜ `1B.5` Update all Zustand store actions to call `db.method()` from `/db/index.ts` — remove any direct sqlite imports from store files
- ⬜ `1B.6` Test: create a counter on web, reload page, confirm it persists from localStorage
- ⬜ `1B.7` Test: create a counter on Android, confirm SQLite still works correctly

---

## Phase 2 — Shell UI (Layout + Navigation)

> Goal: Tab navigation working, custom header visible, correct pages rendering.

- ✅ `2.1` `app/_layout.tsx` with providers
- ✅ `2.2` `app/(tabs)/_layout.tsx` — 3 tabs with icons
- ✅ `2.3` `CustomHeader.tsx`
- ✅ `2.4` Stub pages for all tabs
- ⬜ `2.5` Confirm tab navigation + header on each tab (blocked by B4 safe area fix)

---

## Phase 3 — Counters Feature

> Goal: Full CRUD for counters. List, create, edit, detail, reset — all working.

### 3A — Counter List
- ✅ `3.1` `CounterCard.tsx`
- ✅ `3.2` `LiveTimeDisplay` ticking in card
- ✅ `3.3` Counter list with FlatList + empty state
- ✅ `3.4` `EmptyState.tsx`

### 3B — Create / Edit Sheet
- ✅ `3.5` `ColorPickerSheet.tsx`
- ✅ `3.6` `CreateCounterSheet.tsx`
- ✅ `3.7` Wire `+` button → open sheet

### 3C — Counter Detail
- ✅ `3.8` `counters/[id].tsx` detail page shell
- ✅ `3.9` `TimeTabSelector.tsx`
- ✅ `3.10` Current Streak card with live breakdown
- ✅ `3.11` `ResetCounterSheet.tsx`
- ✅ `3.12` Reset Counter button + haptics
- ✅ `3.13` `StatsCard.tsx`

---

## Phase 4 — Calendar Feature

> Goal: Calendar renders with colored streak lines, filter works.

- ⬜ `4.1` Build `app/(tabs)/calendar/index.tsx`:
  - Top half: `react-native-calendars` Calendar — half screen height
  - Current date header
  - Custom `dayComponent` with colored streak lines
  - Bottom half: scrollable list of CalendarStreakListItem
- ✅ `4.2` `/lib/calendarUtils.ts` — `buildCalendarDayColorMap(counters, resets, filterIds)`
- ✅ `4.3` `CalendarStreak.tsx` — custom day component with stacked colored lines + overflow indicator
- ⬜ `4.4` Calendar list items (bottom half):
  - Colored square bullet + counter title
  - Muted: "Day X of Y days, Z hours, W minutes"
  - If resets: "Reset N times" with last reset date
  - Tap → `/counters/[id]`
- ⬜ `4.5` `FilterSheet.tsx`:
  - Full-screen modal, "Done" top-right
  - "All Counters" reset option
  - Multi-select list with colored bullets
  - On Done: `calendarStore.setFilter(ids)`
- ⬜ `4.6` Wire filter icon → `FilterSheet`
- ⬜ `4.7` Persist filter selection (Zustand persist middleware + AsyncStorage)

---

## Phase 5 — Settings

> Goal: Settings page complete.

- ⬜ `5.1` `settings/index.tsx`:
  - Privacy Policy row → `Linking.openURL()`
  - About row → Alert with version info
- ⬜ `5.2` Host privacy policy (GitHub Pages or Notion)
- ⬜ `5.3` App version display at bottom (via `expo-constants`)

---

## Phase 6 — Android Widgets

> Goal: Small home screen widget showing a single counter.
> Note: All widget code must be gated with `Platform.OS === 'android'`.

- ⬜ `6.1` Read `react-native-android-widget` docs fully before starting
- ⬜ `6.2` `widgets/CounterWidget.tsx`:
  - Small (2×2): rounded card, accent color bg, big number, period label
- ⬜ `6.3` `widgets/widgetTaskHandler.ts`:
  - Queries `sqliteAdapter` directly (no Zustand)
  - Computes elapsed, updates widget
- ⬜ `6.4` Register widget in `app.json`
- ⬜ `6.5` Test on real Android device (widgets unreliable in emulator)
- ⬜ `6.6` (Stretch) Medium widget (4×2): 3 counters
- ⬜ `6.7` (Stretch) Lock screen widget

---

## Phase 7 — iOS Support

> Goal: App builds and runs correctly on iOS Simulator and real device.

- ⬜ `7.1` Add `ios` profile to `eas.json`
- ⬜ `7.2` Run `eas build --platform ios --profile development` (Simulator build — free)
- ⬜ `7.3` Verify all screens render correctly on iOS Simulator
- ⬜ `7.4` Verify safe area insets work on notch/Dynamic Island device shapes
- ⬜ `7.5` Verify haptics work on iOS (they're actually better than Android)
- ⬜ `7.6` Confirm `react-native-android-widget` import doesn't break iOS build (must be platform-gated)
- ⬜ `7.7` (Requires Apple Dev account — $99/yr) Test on real iPhone
- ⬜ `7.8` (Requires Apple Dev account) `eas submit --platform ios`

---

## Phase 8 — Polish & Pre-Launch

> Goal: App solid, no crashes, ready for both stores.

- ⬜ `8.1` Handle edge cases:
  - Reset date cannot be before streak start
  - Title max 50 chars
  - Interval resumes correctly after long background time
- ⬜ `8.2` Loading states (skeleton cards) for async DB reads
- ⬜ `8.3` Delete confirmation via Alert
- ⬜ `8.4` Test on real Android device
- ⬜ `8.5` Dark mode (NativeWind `dark:` classes)
- ⬜ `8.6` App icon + splash screen
- ⬜ `8.7` Configure `app.json`: package name, version, permissions
- ⬜ `8.8` `eas build --platform android --profile production`
- ⬜ `8.9` Google Play Console ($25 one-time) + submit
- ⬜ `8.10` Play Store listing: title, description, screenshots (no mention of "Days Since")

---

## Bugs / Fixes / Problems

> Fix these before moving forward on Calendar or Settings.

- ✅ `B1` **Color Picker Layout**
  - Palette label should be singular (from active page, not all shown at once)
  - Grid should be swipeable (not tab-based)
  - Fix color alignment — colors not centered, extra left padding

- ✅ `B2` **Create Counter "Done" Bug**
  - "Done" button in CreateCounterSheet not triggering save action
  - Investigate: is the `onPress` handler wired? Is the `disabled` state wrong?

- ⬜ `B3` **Web Compatibility — Full Audit**
  - After Phase 1B adapter is done, audit all screens on web
  - Check: no native-only imports leaking into shared components
  - Check: `expo-haptics` calls are gated with `Platform.OS !== 'web'`
  - Check: `react-native-calendars` renders on web (it does, but verify)

- ✅ `B4` **Safe Area / Navigation Overlap (Android)**
  - Bottom safe area not working — content overlapped by Android nav buttons
  - Fix: ensure `SafeAreaProvider` is at root, use `useSafeAreaInsets()` in tab bar
  - Icons not loading correctly in some areas — check `lucide-react-native` import paths

- ✅ `B5` **Date Picker Broken on Web** ← NEW
  - `@react-native-community/datetimepicker` is native-only — throws on web
  - Fix: build `/components/ui/DateTimePicker.tsx` platform wrapper (see ARCHITECTURE.md)
  - Replace all direct `DateTimePicker` imports in `CreateCounterSheet` and `ResetCounterSheet` with the wrapper
  - On web: `<input type="date">` and `<input type="time">` styled to match app theme
  - On native: existing `@react-native-community/datetimepicker`

- ✅ `B6` **Counter List Layout**
  - Show two cards in one row of the application (grid layout) instead of a single column list.

- ✅ `B7` **Form Data Persistence Bug**
  - When adding new streak, previous streaks data stays prefilled in the create form.
  - Fix: Reset form state when opening CreateCounterSheet.

- ✅ `B8` **Stats Card Formatting**
  - Stats card shows short form "17d", should show "17 Days" (Longest, Average, Days Since).

- ✅ `B9` **Sheet Height / Safe Area Fixes**
  - Reset Counter and Color Picker sheets are too low, content hidden by nav bar/unsafe zones.
  - Fix: Ensure half-screen sheets properly clear the bottom navigation bar.

- ✅ `B10` **Create Counter Full Screen**
  - Create Counter sheet should come up all the way (full screen) rather than half-height.

- ✅ `B11` **Color Picker Polish**
  - Restore swipeable grid (B1 regress/incomplete).
  - Move page indicator dots further from color sections (too crowded).
  - Fix height/safe area overlap with navigation bar.

- ✅ `B12` **Streak Edit Time Bug**
  - Editing a streak's time does not persist; only title and color were being updated.
  - Fix: Update `updateCounter` in store and sheet to include `startedAt`.

- ✅ `B13` **Form Reset on Color Pick**
  - Switching to color picker or dismissing it resets chosen time and title in Create/Edit sheet.
  - Root cause: `handleSheetChanges` in `CreateCounterSheet` resets state too aggressively.

- ✅ `B14` **Sheet Persistence in Background**
  - `CreateCounterSheet` should stay open and visible in background when color picker is active.

- ✅ `B15` **Sheet Safe Area (Top) Overflow**
  - Sliding sheets all the way up can overlap unsafe top areas (status bar/notch).
  - Fix: Add top safe area padding or cap maximum snap point.

- ✅ `B16` **Stats + Reset Consistency**
  - `daysSinceStart` now uses `counter.startedAt` (the entered/active streak start), not `createdAt`.
  - Counter detail "Started on" now reflects `startedAt`.
  - Reset flow now always restarts the active timer from current time (`Date.now()`), so streak time resets to 0s.
  - Reset query ordering stabilized (`resetAt` desc) for consistent latest reset + count rendering.

---

## Recommended Fix Order (Current Priority)

1. `B13` + `B14` — Fix form reset and sheet layering
2. `B15` — Safe area top overflow
3. `B3` — Full web audit (after adapter is in place)
4. `2.5` — Verify navigation/header
5. Resume Phase 4 (Calendar)

---

## Current Session Notes

```
Date: 2026-04-18
Session focus: Full scaffolding + data layer + shell UI + counters feature + web stability
Completed: Phase 0, Phase 1 (1.1–1.11), Phase 2 (2.1–2.4), Phase 3 (all)
Blockers: B2 (Done button), B4 (safe area), B5 (date picker web)
Next session should start with: Fix B2 → then Phase 1B (DB adapter) + B5 together

Implementation notes:
  - Using Expo SDK 54 + RN 0.81 (newer than original spec of SDK 52 + RN 0.76)
  - Raw SQL for table creation instead of drizzle-kit migrations (simpler for v1)
  - NativeWind v4 installed with --legacy-peer-deps (react-dom peer conflict)
  - TypeScript: 0 errors
  - Metro dev server starts successfully
  - Smoke test helper: runStreakSmokeTest() in console
  - Web DB fallback currently avoids openDatabaseSync — replace with webAdapter in Phase 1B
  - calendarUtils.ts added with buildCalendarDayColorMap()
  - CalendarStreak.tsx added with stacked colored lines + overflow indicator
```

---

## Known Decisions / Resolved Questions

| Question | Decision |
|---|---|
| iOS or Android first? | Both — Android primary, iOS via EAS Build (Phase 7) |
| Expo Go or dev build? | Dev build required (react-native-android-widget needs native code) |
| SQL or key-value? | expo-sqlite + Drizzle on native; localStorage JSON on web (adapter pattern) |
| Navigation? | Expo Router v3 |
| Styling? | NativeWind v4 only — no StyleSheet.create except dynamic values |
| Date picker on web? | Platform wrapper component: HTML input on web, native picker on iOS/Android |
| App name? | Do NOT use "Days Since" — pick something original |
| iOS cost? | Apple Developer account $99/year required for real device + App Store |
