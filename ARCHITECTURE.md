# ARCHITECTURE.md

> Single source of truth for all technical decisions. Do not debate these in sessions — implement them.

---

## App Summary

A free, personal habit/streak tracker for Android, iOS, and Web. Users create named streaks with a start date/time, watch them count up in real-time, reset them with a note and date, and review history via a calendar and stats card. Key differentiator: Android home screen and lock screen widgets.

**Target platforms:** Android (primary), iOS, Web (secondary — testing + alternative usage)
**Out of scope (v1):** Cloud sync, social sharing, notifications/reminders, paid tiers.

---

## Tech Stack — Locked In

| Layer             | Choice                                       | Why                                                                    |
| ----------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| Framework         | **Expo SDK 54** + React Native 0.81          | Managed workflow, fast iteration, EAS Build for stores                 |
| Language          | **TypeScript** (strict mode)                 | Catch bugs early, AI generates better typed code                       |
| Router            | **Expo Router v3** (file-based)              | Well-known by AI, no manual navigator setup, deep linking free         |
| State             | **Zustand v4**                               | Zero boilerplate, works well with persistence                          |
| Database (native) | **expo-sqlite** + **Drizzle ORM**            | Relational data, type-safe queries, works offline                      |
| Database (web)    | **localStorage JSON adapter**                | Same interface as native adapter — no WASM complexity                  |
| Styling           | **NativeWind v4** (Tailwind for RN)          | Eliminates StyleSheet boilerplate, Tailwind classes AI knows perfectly |
| Animations        | **React Native Reanimated v3**               | Required by bottom-sheet, smooth 60fps gestures                        |
| Bottom Sheets     | **@gorhom/bottom-sheet v4**                  | Half-screen modals for reset, color picker, filter                     |
| Calendar          | **react-native-calendars**                   | Mature, supports custom day rendering (colored lines)                  |
| Date/Time Picker  | **Platform-conditional wrapper** (see below) | Native picker on iOS/Android, HTML input on web                        |
| Icons             | **lucide-react-native**                      | Clean, consistent, tree-shakeable                                      |
| Haptics           | **expo-haptics**                             | Polish on button taps and resets (native only — no-op on web)          |
| Widgets           | **react-native-android-widget**              | Android home + lock screen widgets (Android only)                      |
| Build/Deploy      | **EAS Build + EAS Submit**                   | Managed Play Store + App Store deployment                              |

> **Rule:** Do not swap any of these without updating this file first.

---

## Cross-Platform Data Storage — Adapter Pattern

`expo-sqlite` does not run on web. Rather than hacking around crashes, use a **single adapter interface** that both platforms implement identically. Zustand store actions never need a platform check.

### The interface — `/db/adapter.ts`

```ts
export interface DBAdapter {
  getCounters(): Promise<Counter[]>;
  getCounter(id: string): Promise<Counter | null>;
  insertCounter(counter: Counter): Promise<void>;
  updateCounter(id: string, data: Partial<Counter>): Promise<void>;
  deleteCounter(id: string): Promise<void>;
  getResets(counterId: string): Promise<Reset[]>;
  insertReset(reset: Reset): Promise<void>;
}
```

### Platform routing — `/db/index.ts`

```ts
import { Platform } from "react-native";
import { sqliteAdapter } from "./sqliteAdapter"; // native
import { localStorageAdapter } from "./webAdapter"; // web

export const db: DBAdapter =
  Platform.OS === "web" ? localStorageAdapter : sqliteAdapter;
```

### Native — `/db/sqliteAdapter.ts`

- Uses `expo-sqlite` + Drizzle ORM (existing implementation)
- Never call `openDatabaseSync` without a Platform guard

### Web — `/db/webAdapter.ts`

- Reads/writes a single JSON blob to `localStorage` under key `streak_tracker_data`
- Shape: `{ counters: Counter[], resets: Reset[] }`
- Parse on every read, stringify on every write
- Always return Promises (even though localStorage is sync) to match the interface
- Acceptable for web: personal use, small data, secondary platform

### Key rule

All Zustand store actions call `db.someMethod()`. Never import `sqliteAdapter` or `webAdapter` directly outside `/db/index.ts`.

---

## Date/Time Picker — Platform-Conditional Wrapper

`@react-native-community/datetimepicker` is native-only and does not work on web.

### Solution — `/components/ui/DateTimePicker.tsx`

```ts
interface DateTimePickerProps {
  value: Date;
  mode: "date" | "time";
  onChange: (date: Date) => void;
}

// Web: render <input type="date" /> or <input type="time" />
//   - Style to match app theme (no browser chrome showing through)
//   - Parse the string value back to a Date in onChange
// Native (iOS/Android): render @react-native-community/datetimepicker
```

**Always import `DateTimePicker` from `@/components/ui/DateTimePicker`** — never import the native library directly in feature components. The platform check lives in exactly one place.

---

## iOS — What's Needed

Building for iOS with Expo is straightforward. Blockers are account-level, not code-level.

| What                    | Cost                | Required for                       |
| ----------------------- | ------------------- | ---------------------------------- |
| Apple Developer Account | $99/year            | Real device + App Store submission |
| iOS Simulator           | Free (macOS only)   | Local testing without a device     |
| EAS Build (iOS profile) | Free tier available | Building the `.ipa`                |

**Code changes for iOS are minimal** — Expo handles most differences. Verify:

- `expo-haptics` — works on iOS (better than Android)
- `@gorhom/bottom-sheet` — works on iOS
- `react-native-android-widget` — Android only; all widget code must be inside `Platform.OS === 'android'` guards
- Safe area — test on notch/Dynamic Island devices

---

## Folder Structure

```
/app
  _layout.tsx                   # Root: fonts, DB init, providers (GestureHandler, BottomSheetModal)
  /(tabs)
    _layout.tsx                 # Tab navigator: Counters | Calendar | Settings
    counters/
      index.tsx                 # Counter list page
      [id].tsx                  # Counter detail page
    calendar/
      index.tsx                 # Calendar page
    settings/
      index.tsx                 # Settings page

/components
  /counters
    CounterCard.tsx
    CreateCounterSheet.tsx
    ResetCounterSheet.tsx
    ColorPickerSheet.tsx
    TimeTabSelector.tsx
    LiveTimeDisplay.tsx
    StatsCard.tsx
  /calendar
    FilterSheet.tsx
    CalendarStreak.tsx
  /ui
    CustomHeader.tsx
    EmptyState.tsx
    DateTimePicker.tsx          # ⚠️ Platform wrapper — ALWAYS use this, never the native lib directly

/db
  adapter.ts                   # DBAdapter interface
  index.ts                     # Platform routing: exports correct adapter
  sqliteAdapter.ts             # Native: expo-sqlite + Drizzle
  webAdapter.ts                # Web: localStorage JSON
  schema.ts                    # Drizzle schema (native only)
  migrations/                  # drizzle-kit output (native only)

/store
  counterStore.ts
  calendarStore.ts

/constants
  colors.ts                    # 75 accent colors across 5 palettes
  palettes.ts

/lib
  timeUtils.ts
  statsUtils.ts
  formatUtils.ts
  calendarUtils.ts

/widgets
  CounterWidget.tsx            # Android only
  widgetTaskHandler.ts         # Android only

/types
  index.ts
```

---

## Data Models

### `counters`

```ts
{
  id:         text (UUID, PK)
  title:      text NOT NULL
  color:      text NOT NULL         // hex e.g. "#E63946"
  startedAt:  integer NOT NULL      // Unix ms — streak start or last reset date
  period:     text NOT NULL         // 'hours'|'days'|'weeks'|'months'|'years'
  createdAt:  integer NOT NULL
  updatedAt:  integer NOT NULL
}
```

### `resets`

```ts
{
  id:                 text (UUID, PK)
  counterId:          text (FK → counters.id CASCADE DELETE)
  resetAt:            integer NOT NULL      // effective reset timestamp (clamped to now)
  note:               text nullable
  previousStartedAt:  integer NOT NULL   // snapshot before reset — needed for stats
  createdAt:          integer NOT NULL
}
```

> **How reset works:** Insert row in `resets` (capturing old `startedAt` as `previousStartedAt`), then update `counters.startedAt` to the effective reset timestamp. UI reset action passes `Date.now()` so the active streak restarts from 0s.

### Stats — always computed, never stored

```ts
computeStats(counter, resets) → { resetCount, daysSinceStart, longestStreak, averageStreak }
where `daysSinceStart` is computed from `counter.startedAt` (active streak start), not `counter.createdAt`.
```

---

## Color System

75 accent colors — 5 palettes × 15 colors: Originals, Earth Tones, Pastels, Landscapes, Metals.
Random color picked on new counter creation. Same color applied to: card bg, calendar line, detail accent, widget bg.

---

## Navigation Map

```
(tabs)
├── /counters → CounterList
│   └── /counters/[id] → CounterDetail
├── /calendar → Calendar
└── /settings → Settings

Sheets (BottomSheetModal — not routes):
├── CreateCounterSheet   (+ icon or Edit)
├── ResetCounterSheet    (Reset Counter button)
├── ColorPickerSheet     (color dot in CreateCounterSheet)
└── FilterSheet          (filter icon in Calendar)
```

---

## Real-Time Ticking Logic

- `LiveTimeDisplay` runs `setInterval(1000)` in `useEffect`, clears on unmount
- Computes `getElapsed(counter.startedAt, Date.now())` every second
- CounterCard: shows only primary value for `counter.period`
- Detail page: shows full breakdown for the active tab

---

## Android Widgets

- Library: `react-native-android-widget` — **all widget code gated with `Platform.OS === 'android'`**
- Small (2×2): single streak, big number + period label
- Medium (4×2): up to 3 streaks
- Widget process queries `sqliteAdapter` directly (no Zustand)
- Updates: on app foreground + every 30 min via WorkManager
- **iOS widgets:** out of scope for v1 (requires WidgetKit Swift extension)

---

## Key Conventions

1. **No StyleSheet.create** — NativeWind only. Exception: dynamic JS values (accent color) use inline style.
2. **All time logic in `/lib/timeUtils.ts`** — never in components.
3. **All date/time UI via `/components/ui/DateTimePicker.tsx`** — never import the native lib directly.
4. **All DB access via `db` from `/db/index.ts`** — never import platform adapters directly elsewhere.
5. **Bottom sheets via `BottomSheetModal`** — `BottomSheetModalProvider` must wrap root in `_layout.tsx`.
6. **Zustand = UI state. DB = persistence.** Hydrate Zustand from DB on app load.
7. **UUIDs via `generateUUID()` from `/lib/uuid.ts`** — avoid native-module coupling in Expo Go.
8. **Dates as Unix milliseconds** in DB. All formatting in `formatUtils.ts`.
9. **Barrel imports** — each folder has `index.ts`. Import `@/components/counters`, not deep paths.
10. **No `any` types** — define in `/types/index.ts`.
11. **Widget code always gated**: `if (Platform.OS === 'android') { ... }`
12. **Haptics gated**: `if (Platform.OS !== 'web') { await Haptics.impactAsync(...) }`

---

## Publishing Checklist

### Android (Google Play)

- [ ] `app.json` package: `com.[yourname].streaktracker`
- [ ] Privacy Policy URL (GitHub Pages or Notion)
- [ ] `eas.json` android production profile
- [ ] Permissions: `RECEIVE_BOOT_COMPLETED` only
- [ ] App icon + splash screen
- [ ] `eas build --platform android --profile production`
- [ ] Google Play Console ($25 one-time)
- [ ] `eas submit --platform android`

### iOS (App Store)

- [ ] Apple Developer account ($99/year)
- [ ] Bundle ID: `com.[yourname].streaktracker`
- [ ] `eas.json` ios production profile
- [ ] Test on Simulator first (free, macOS only)
- [ ] `eas build --platform ios --profile production`
- [ ] `eas submit --platform ios`
- [ ] App Store Connect listing (iPhone + iPad screenshots)
