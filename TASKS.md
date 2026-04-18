# TASKS.md
> Running checklist. Read this at the start of every session. Update status as you go.
> Status: ✅ Done | 🔄 In Progress | ⬜ Not Started | 🚫 Blocked

---

## How To Use This File

**Starting a session:** Tell your AI — *"Read TASKS.md and ARCHITECTURE.md, then continue from where we left off."*
**Ending a session:** Mark completed tasks ✅, add any new tasks discovered, note any blockers.
**Switching tools (Cursor ↔ Claude Code):** This file + ARCHITECTURE.md is all the context needed.

---

## Phase 0 — Project Scaffolding
> Goal: Runnable blank app with correct dependencies and folder structure.

- ⬜ `0.1` Init Expo project: `npx create-expo-app@latest streak-tracker --template blank-typescript`
- ⬜ `0.2` Install all dependencies (see ARCHITECTURE.md Tech Stack)
  ```bash
  npx expo install expo-sqlite expo-haptics expo-splash-screen
  npm install drizzle-orm
  npm install -D drizzle-kit
  npm install zustand
  npm install nativewind tailwindcss
  npm install react-native-reanimated
  npm install @gorhom/bottom-sheet
  npm install react-native-calendars
  npm install @react-native-community/datetimepicker
  npm install lucide-react-native
  npm install react-native-android-widget
  npm install react-native-gesture-handler
  npm install react-native-safe-area-context
  ```
- ⬜ `0.3` Configure NativeWind: `tailwind.config.js` + `babel.config.js` + `global.css`
- ⬜ `0.4` Configure Drizzle: `drizzle.config.ts` pointing to expo-sqlite
- ⬜ `0.5` Set up Expo Router: confirm `/app` folder structure matches ARCHITECTURE.md
- ⬜ `0.6` Create all empty folders: `/components`, `/db`, `/store`, `/constants`, `/lib`, `/widgets`, `/types`
- ⬜ `0.7` Create `/types/index.ts` with all shared interfaces:
  - `Counter`, `Reset`, `Palette`, `ColorSwatch`, `Period`, `Stats`, `ElapsedTime`
- ⬜ `0.8` Configure `tsconfig.json` path alias `@/` → project root
- ⬜ `0.9` Confirm app boots on Android emulator (Expo Go or dev build)

---

## Phase 1 — Data Layer
> Goal: DB schema live, Zustand store wired, CRUD operations working. No UI yet.

- ⬜ `1.1` Write Drizzle schema in `/db/schema.ts` — `counters` table + `resets` table (see ARCHITECTURE.md Data Models)
- ⬜ `1.2` Create `/db/index.ts` — open expo-sqlite connection, export drizzle instance
- ⬜ `1.3` Run `drizzle-kit generate` to create initial migration
- ⬜ `1.4` Wire migration to run on app start in `app/_layout.tsx`
- ⬜ `1.5` Write `/lib/timeUtils.ts`:
  - `getElapsed(startMs, nowMs)` → `ElapsedTime` object `{ seconds, minutes, hours, days, weeks, months, years }`
  - Use date-fns-style logic, no external lib needed — manual math is fine and fast
- ⬜ `1.6` Write `/lib/statsUtils.ts`:
  - `computeStats(counter, resets[])` → `Stats` object
  - Handles 0 resets case cleanly (longestStreak = current streak, average = current streak)
- ⬜ `1.7` Write `/lib/formatUtils.ts`:
  - `formatElapsedForPeriod(elapsed, period)` → display string (e.g. `"108 days, 4 hours, 27 minutes"`)
  - `formatStartedOn(timestamp)` → `"21 May 2025"`
  - `formatResetOn(timestamp)` → `"Reset on 7 Dec 2025"`
- ⬜ `1.8` Write `/constants/colors.ts` — define all 75 accent colors across 5 palettes
  - Structure: `export const PALETTES: Palette[]` where each palette has 15 `ColorSwatch[]`
  - `export const ALL_COLORS: ColorSwatch[]` — flat array of all 75 for random pick
  - `export function getRandomColor(): ColorSwatch`
- ⬜ `1.9` Write `/store/counterStore.ts` with Zustand:
  - State: `counters: Counter[]`, `sortOrder: 'asc' | 'desc'`
  - Actions: `loadCounters()`, `addCounter()`, `updateCounter()`, `deleteCounter()`, `resetCounter()`, `toggleSort()`
  - All actions write to DB first, then update local state
- ⬜ `1.10` Write `/store/calendarStore.ts`:
  - State: `activeFilterIds: string[]` (empty = show all)
  - Actions: `setFilter(ids)`, `clearFilter()`
- ⬜ `1.11` Smoke test: write a small test script or Expo dev tools console log to: create a counter, reset it twice, compute stats — verify values are correct

---

## Phase 2 — Shell UI (Layout + Navigation)
> Goal: Tab navigation working, custom header visible, correct pages rendering.

- ⬜ `2.1` Build `app/_layout.tsx`:
  - Wrap with `GestureHandlerRootView`, `BottomSheetModalProvider`, `SafeAreaProvider`
  - Init DB and run migrations here (before render)
  - Load `counterStore.loadCounters()` on mount
- ⬜ `2.2` Build `app/(tabs)/_layout.tsx`:
  - 3 tabs: Counters, Calendar, Settings
  - Custom `tabBarIcon` using lucide-react-native: `LayoutGrid`, `CalendarDays`, `Settings`
  - Tab bar style: minimal, white background, colored active icon
- ⬜ `2.3` Build `components/ui/CustomHeader.tsx`:
  - Props: `title`, `leftAction?`, `rightAction?`
  - Left: sort toggle button (Counters tab only) — `ArrowUpDown` icon, toggles `sortOrder` in store
  - Center: page title text
  - Right: `+` icon (Counters tab) | Filter icon (Calendar tab) | nothing (Settings tab)
  - Each tab page passes its own header config
- ⬜ `2.4` Stub out all 4 pages with correct header and placeholder text:
  - `app/(tabs)/counters/index.tsx`
  - `app/(tabs)/calendar/index.tsx`
  - `app/(tabs)/settings/index.tsx`
  - `app/(tabs)/counters/[id].tsx` (detail — stub for now)
- ⬜ `2.5` Confirm tab navigation works, header renders correctly on each tab

---

## Phase 3 — Counters Feature
> Goal: Full CRUD for counters. List, create, edit, detail, reset — all working.

### 3A — Counter List Page
- ⬜ `3.1` Build `components/counters/CounterCard.tsx`:
  - Accent color background (from `counter.color`)
  - Title text (white, bold)
  - Live ticking primary value for `counter.period` (e.g. "108" big, "weeks" small below)
  - Tap → navigate to `/counters/[id]`
  - Long press → context menu (Edit, Delete) — use `react-native` Alert for delete confirmation
- ⬜ `3.2` Wire `LiveTimeDisplay` into CounterCard:
  - `useEffect` with `setInterval(1000)` — recomputes every second
  - Only renders the single primary value (not full breakdown) on the card
- ⬜ `3.3` Render counter list in `counters/index.tsx`:
  - Read from `counterStore`
  - `FlatList` with `CounterCard` items
  - Empty state: `EmptyState.tsx` component with illustration text + "Tap + to create your first streak"
  - Sorted by `sortOrder` from store
- ⬜ `3.4` Build `components/ui/EmptyState.tsx`

### 3B — Create / Edit Sheet
- ⬜ `3.5` Build `components/counters/ColorPickerSheet.tsx`:
  - `BottomSheetModal` — half-screen
  - Header: "Pick a color" center, X close button top-right
  - Horizontally scrollable pages (5 palettes)
  - Each page: palette label ("Originals", "Earth Tones", etc.) + 5×3 grid of 15 color circles
  - Page indicator dots (5 dots, active highlighted)
  - Selected color gets a checkmark or ring indicator
  - On select: calls `onSelect(swatch)` callback, closes sheet
- ⬜ `3.6` Build `components/counters/CreateCounterSheet.tsx`:
  - Full-screen modal (use `router.push` with modal presentation, or `BottomSheetModal` with `snapPoints={['100%']}`)
  - Header: "Cancel" top-left, "Done" top-right (disabled until title + date filled)
  - Preview card (accent color bg): shows `0 days / 0 hours / 0 minutes / 0 seconds` live
  - Text input: title (placeholder "No Junk Food") — required
  - Date picker row: "Started on" label + `@react-native-community/datetimepicker` (date mode)
  - Time picker row: separate time picker
  - Color row: "Pick a color" label + colored circle on right → opens `ColorPickerSheet`
  - **Dual mode:** if `counterId` prop passed → pre-populate fields (edit mode), header shows "Edit"
  - On Done: call `counterStore.addCounter()` or `updateCounter()` → close sheet
  - Random color pre-selected on open (new mode)
- ⬜ `3.7` Wire `+` button in header → open `CreateCounterSheet` (new mode)

### 3C — Counter Detail Page
- ⬜ `3.8` Build `app/(tabs)/counters/[id].tsx`:
  - Back button top-left: `< Counters`
  - Edit button top-right → opens `CreateCounterSheet` in edit mode
  - Sticky header (shown when scrolled past title): accent-colored square bullet + truncated title
  - Streak title with left accent border (like a blockquote style)
  - "Started on [date]" muted text below title
- ⬜ `3.9` Build `components/counters/TimeTabSelector.tsx`:
  - Merged pill buttons: Hours | Days | Weeks | Months | Years
  - Saves selected tab to `counter.period` in store + DB on change
  - Active tab: accent color background
- ⬜ `3.10` "Current Streak" card in detail page:
  - Card header: "Current Streak" left, Share icon right
  - Muted text: "Reset on [date]" (last reset date, or nothing if never reset)
  - `TimeTabSelector` component
  - `LiveTimeDisplay` — full breakdown per selected tab:
    - Hours: Hours · Minutes · Seconds
    - Days: Days · Hours · Minutes · Seconds
    - Weeks: Weeks · Days · Hours · Minutes
    - Months: Months · Days · Hours · Minutes
    - Years: Years · Months · Days · Hours
  - Each value shown as: big number + muted label below
- ⬜ `3.11` Build `components/counters/ResetCounterSheet.tsx`:
  - `BottomSheetModal` — half-screen
  - Header: "Cancel" left, "Reset Counter" center, "Done" right
  - "Reset on" date picker + time picker (pre-filled with counter's current `startedAt`)
  - Note text input (optional)
  - On Done: call `counterStore.resetCounter(id, resetAt, note)` → closes sheet → updates detail page
- ⬜ `3.12` "Reset Counter" full-width button below current streak card:
  - Background = counter accent color
  - Opens `ResetCounterSheet` on tap
  - Haptic feedback on tap (`expo-haptics`)
- ⬜ `3.13` Build `components/counters/StatsCard.tsx`:
  - 2×2 grid layout
  - Row 1: Resets count | Days since started
  - Row 2: Longest streak (days) | Average streak (days)
  - Values from `computeStats()` — recomputed on every render of detail page
  - Wire into detail page below Reset button

---

## Phase 4 — Calendar Feature
> Goal: Calendar renders with colored streak lines, filter works.

- ⬜ `4.1` Build `app/(tabs)/calendar/index.tsx`:
  - Top half: `react-native-calendars` `Calendar` component — half screen height
  - Current date header above calendar (e.g. "18 April")
  - Custom `dayComponent` rendering streak color lines for each day
  - Logic: for each day, determine which counters were "active" (between their startedAt and either next reset or now) — show colored dot/line per active counter
  - Bottom half: scrollable list of `CalendarStreakListItem` components
- ⬜ `4.2` Build calendar day data transformer:
  - Function in `/lib/` that takes all counters + resets → returns a map of `{ [dateString]: ColorSwatch[] }` (which streak colors were active that day)
  - Respects `calendarStore.activeFilterIds` (empty = all)
- ⬜ `4.3` Build `CalendarStreak.tsx` custom day component:
  - Shows small colored horizontal lines (one per active counter) stacked below the date number
  - Color from counter's `color` field
- ⬜ `4.4` Build calendar list items (bottom half):
  - Square colored bullet + counter title
  - Below title: muted text — "Day X of Y days, Z hours, W minutes"
  - If resets: "Reset N times" with last reset date
  - Sorted by recent activity
  - Tap → navigates to `/counters/[id]` (same as card tap)
- ⬜ `4.5` Build `components/calendar/FilterSheet.tsx`:
  - Full-screen modal
  - "Done" button top-right
  - "All Counters" reset option at top (clears filter)
  - List of all counters: square colored bullet + title + checkbox
  - Multi-select
  - On Done: write selection to `calendarStore.setFilter(ids)` → calendar re-renders
- ⬜ `4.6` Wire filter icon in Calendar header → opens `FilterSheet`
- ⬜ `4.7` Persist filter selection across app restarts (store in Zustand + AsyncStorage or MMKV — simple persist)

---

## Phase 5 — Settings
> Goal: Settings page complete.

- ⬜ `5.1` Build `app/(tabs)/settings/index.tsx`:
  - Settings list with separator lines
  - "Privacy Policy" row → `Linking.openURL()` to hosted privacy policy page
  - "About" row → Alert with app name, version, brief description
- ⬜ `5.2` Host a privacy policy (required for Google Play):
  - Simplest option: GitHub Pages or Notion public page
  - Template: data stays on device, no collection, no third parties
- ⬜ `5.3` Add app version display at bottom of settings (from `expo-constants`)

---

## Phase 6 — Android Widgets
> Goal: At least small home screen widget showing a single counter.

- ⬜ `6.1` Read `react-native-android-widget` docs fully before starting
- ⬜ `6.2` Build `widgets/CounterWidget.tsx`:
  - Small (2×2): rounded card, accent color bg, big number center, period label below (e.g. "108 Days")
  - Use the counter's saved `period` to determine what number to show
- ⬜ `6.3` Build `widgets/widgetTaskHandler.ts`:
  - Queries DB directly (no Zustand — widgets are separate process)
  - Computes elapsed time for each counter
  - Updates widget UI
- ⬜ `6.4` Register widget in `app.json` / native config per library docs
- ⬜ `6.5` Test widget appears in Android widget picker and updates correctly
- ⬜ `6.6` (Stretch) Medium widget (4×2): show up to 3 counters stacked
- ⬜ `6.7` (Stretch) Lock screen widget — check library support, Android version requirements

---

## Phase 7 — Polish & Pre-Launch
> Goal: App is solid, no crashes, ready for Play Store.

- ⬜ `7.1` Handle edge cases:
  - Reset date cannot be before streak start date
  - Title max length (50 chars)
  - App re-opened after long background time — interval resumes correctly
- ⬜ `7.2` Add loading states where DB reads are async (skeleton cards or spinner)
- ⬜ `7.3` Add delete confirmation for counters (Alert dialog)
- ⬜ `7.4` Test on real Android device (not just emulator)
- ⬜ `7.5` Test widget on real device (widgets don't work in emulators reliably)
- ⬜ `7.6` Dark mode support (NativeWind dark: classes) — check if system dark mode works with color accents
- ⬜ `7.7` App icon + splash screen — design in Figma or use simple accent background with icon
- ⬜ `7.8` Set up `eas.json` with production build profile
- ⬜ `7.9` Configure `app.json`: package name, version, permissions (BOOT_COMPLETED only)
- ⬜ `7.10` Run `eas build --platform android --profile production`
- ⬜ `7.11` Create Google Play Console account ($25 one-time)
- ⬜ `7.12` Submit via `eas submit --platform android`
- ⬜ `7.13` Write Play Store listing: title, description (no mention of "Days Since" or other app names), screenshots

---

## Current Session Notes

_Use this section to jot notes at end of each session before closing._

```
Date: 
Session focus: 
Completed: 
Blockers: 
Next session should start with: 
```

---

## Known Decisions / Resolved Questions

| Question | Decision |
|---|---|
| iOS or Android first? | Android only (v1). Expo makes iOS later easy. |
| Expo Go or dev build? | Dev build required (react-native-android-widget needs native code) |
| SQL or key-value storage? | expo-sqlite + Drizzle (relational data is cleaner for counters + resets) |
| Navigation library? | Expo Router v3 (file-based, no setup) |
| Styling? | NativeWind v4 only — no StyleSheet.create except for dynamic values |
| App name on Play Store? | Do NOT use "Days Since" in name — pick something original |
