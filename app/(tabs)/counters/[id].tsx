import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Pencil } from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useCounterStore } from "@/store/counterStore";
import { LiveTimeDisplay } from "@/components/counters/LiveTimeDisplay";
import { TimeTabSelector } from "@/components/counters/TimeTabSelector";
import { StatsCard } from "@/components/counters/StatsCard";
import { ResetCounterSheet } from "@/components/counters/ResetCounterSheet";
import { CreateCounterSheet } from "@/components/counters/CreateCounterSheet";
import { formatStartedOn, formatResetOn } from "@/lib/formatUtils";
import { computeStats } from "@/lib/statsUtils";
import type { Reset, Period, Stats } from "@/types";

export default function CounterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const counters = useCounterStore((s) => s.counters);
  const getResetsForCounter = useCounterStore((s) => s.getResetsForCounter);
  const updateCounter = useCounterStore((s) => s.updateCounter);

  const counter = useMemo(
    () => counters.find((c) => c.id === id),
    [counters, id],
  );

  const [resets, setResets] = useState<Reset[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const resetSheetRef = useRef<BottomSheetModal>(null);
  const editSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const loadResets = useCallback(async () => {
    if (!id) return;
    const r = await getResetsForCounter(id);
    setResets(r);
  }, [id, getResetsForCounter]);

  useEffect(() => {
    loadResets();
  }, [loadResets]);

  useEffect(() => {
    if (counter) {
      setStats(computeStats(counter, resets));
    }
  }, [counter, resets]);

  const handlePeriodChange = useCallback(
    (period: Period) => {
      if (id) updateCounter(id, { period });
    },
    [id, updateCounter],
  );

  const handleResetPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetSheetRef.current?.present();
  }, []);

  const handleResetDone = useCallback(() => {
    void loadResets();
  }, [loadResets]);

  if (!counter) {
    return (
      <View className="flex-1 bg-[#0F0F0F] items-center justify-center">
        <Text className="text-white text-lg">Counter not found</Text>
      </View>
    );
  }

  const lastReset =
    resets.length > 0 ? [...resets].sort((a, b) => b.resetAt - a.resetAt)[0] : null;

  return (
    <View className="flex-1 bg-[#0F0F0F]">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-3"
        style={{ paddingTop: insets.top > 0 ? insets.top + 8 : 56 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
          hitSlop={8}
        >
          <ChevronLeft size={22} color="#E63946" />
          <Text className="text-[#E63946] text-base ml-1">Counters</Text>
        </Pressable>
        <Pressable onPress={() => editSheetRef.current?.present()} hitSlop={8}>
          <Pencil size={20} color="#9CA3AF" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title with accent border */}
        <View className="flex-row items-start mb-1 mt-2">
          <View
            style={{
              backgroundColor: counter.color,
              width: 4,
              borderRadius: 2,
            }}
            className="self-stretch mr-3"
          />
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">
              {counter.title}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Started on {formatStartedOn(counter.startedAt)}
            </Text>
          </View>
        </View>

        {/* Current Streak Card */}
        <View className="bg-[#1A1A2E] rounded-2xl p-5 mt-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-400 text-sm font-semibold tracking-wider uppercase">
              Current Streak
            </Text>
          </View>

          {lastReset && (
            <Text className="text-gray-600 text-xs mb-4">
              {formatResetOn(lastReset.resetAt)}
            </Text>
          )}

          <TimeTabSelector
            activePeriod={counter.period as Period}
            onPeriodChange={handlePeriodChange}
            accentColor={counter.color}
          />

          <View className="mt-5">
            <LiveTimeDisplay
              startedAt={counter.startedAt}
              period={counter.period as Period}
              mode="detail"
            />
          </View>
        </View>

        {/* Reset Button */}
        <Pressable
          onPress={handleResetPress}
          style={{ backgroundColor: counter.color }}
          className="rounded-2xl py-4 mt-4 items-center"
        >
          <Text className="text-white text-base font-bold">Reset Counter</Text>
        </Pressable>

        {/* Stats Card */}
        {stats && <StatsCard stats={stats} />}
      </ScrollView>

      <ResetCounterSheet
        ref={resetSheetRef}
        counterId={counter.id}
        onDone={handleResetDone}
      />
      <CreateCounterSheet ref={editSheetRef} counterId={counter.id} />
    </View>
  );
}
