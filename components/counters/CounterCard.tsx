import { memo, useCallback } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { LiveTimeDisplay } from "./LiveTimeDisplay";
import { useCounterStore } from "@/store/counterStore";
import type { Counter, Period } from "@/types";

interface CounterCardProps {
  counter: Counter;
}

export const CounterCard = memo(function CounterCard({ counter }: CounterCardProps) {
  const router = useRouter();
  const deleteCounter = useCounterStore((s) => s.deleteCounter);

  const handlePress = useCallback(() => {
    router.push(`/counters/${counter.id}`);
  }, [counter.id, router]);

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(counter.title, "What would you like to do?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Delete Streak",
            `Are you sure you want to delete "${counter.title}"? This cannot be undone.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteCounter(counter.id),
              },
            ]
          );
        },
      },
    ]);
  }, [counter.id, counter.title, deleteCounter]);

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="rounded-2xl overflow-hidden active:scale-[0.98]"
      style={{ transform: [{ scale: 1 }] }}
    >
      <View
        style={{ backgroundColor: counter.color }}
        className="p-5 rounded-2xl min-h-[140px] justify-between"
      >
        {/* Title */}
        <Text className="text-white text-lg font-bold" numberOfLines={1}>
          {counter.title}
        </Text>

        {/* Live ticking value */}
        <View className="mt-3">
          <LiveTimeDisplay
            startedAt={counter.startedAt}
            period={counter.period as Period}
            mode="card"
          />
        </View>
      </View>
    </Pressable>
  );
});
