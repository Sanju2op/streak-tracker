import { useEffect, useState } from "react";
import { Slot, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { expoDb } from "@/db";
import { useCounterStore } from "@/store/counterStore";
import { computeStats } from "@/lib/statsUtils";
import "../global.css";

// Keep splash screen visible while we load
SplashScreen.preventAutoHideAsync();

type SmokeTestHost = typeof globalThis & {
  runStreakSmokeTest?: () => Promise<void>;
};

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const loadCounters = useCounterStore((s) => s.loadCounters);

  useEffect(() => {
    async function init() {
      try {
        // Run migrations via raw SQL (Drizzle schema creates tables if not exist)
        expoDb.execSync(`
          CREATE TABLE IF NOT EXISTS counters (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            color TEXT NOT NULL,
            started_at INTEGER NOT NULL,
            period TEXT NOT NULL DEFAULT 'days',
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
          );
          CREATE TABLE IF NOT EXISTS resets (
            id TEXT PRIMARY KEY NOT NULL,
            counter_id TEXT NOT NULL REFERENCES counters(id) ON DELETE CASCADE,
            reset_at INTEGER NOT NULL,
            note TEXT,
            previous_started_at INTEGER NOT NULL,
            created_at INTEGER NOT NULL
          );
        `);

        await loadCounters();
        setDbReady(true);
      } catch (e) {
        console.error("Failed to init DB:", e);
        setDbReady(true); // proceed anyway
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!__DEV__) return;

    const host = globalThis as SmokeTestHost;
    host.runStreakSmokeTest = async () => {
      const DAY_MS = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const startedAt = now - 5 * DAY_MS;
      const firstResetAt = startedAt + 2 * DAY_MS;
      const secondResetAt = startedAt + 4 * DAY_MS;
      const testTitle = `SMOKE-${now}`;

      try {
        const state = useCounterStore.getState();
        const created = await state.addCounter(testTitle, "#E63946", startedAt);
        await state.resetCounter(created.id, firstResetAt, "Smoke reset #1");
        await state.resetCounter(created.id, secondResetAt, "Smoke reset #2");

        const resets = await useCounterStore.getState().getResetsForCounter(created.id);
        const updatedCounter = useCounterStore
          .getState()
          .counters.find((counter) => counter.id === created.id);

        if (!updatedCounter) {
          throw new Error("Smoke test failed: counter not found after updates.");
        }

        const stats = computeStats(updatedCounter, resets);
        const passed = stats.resetCount === 2 && stats.longestStreak >= 2;

        console.log("SMOKE TEST RESULT", {
          passed,
          counterId: created.id,
          title: testTitle,
          resetCount: stats.resetCount,
          daysSinceStart: stats.daysSinceStart,
          longestStreak: stats.longestStreak,
          averageStreak: stats.averageStreak,
        });

        await useCounterStore.getState().deleteCounter(created.id);
        await useCounterStore.getState().loadCounters();
      } catch (error) {
        console.error("SMOKE TEST FAILED", error);
      }
    };

    console.log(
      "Dev smoke test ready. Run `runStreakSmokeTest()` in the console to validate add/reset/stats flow."
    );
  }, []);

  useEffect(() => {
    if (dbReady) {
      SplashScreen.hideAsync();
    }
  }, [dbReady]);

  if (!dbReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          <Slot />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
