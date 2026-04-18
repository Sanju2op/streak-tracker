import { memo } from "react";
import { View, Text } from "react-native";
import type { Stats } from "@/types";

interface StatsCardProps {
  stats: Stats;
}

export const StatsCard = memo(function StatsCard({ stats }: StatsCardProps) {
  return (
    <View className="bg-[#1A1A2E] rounded-2xl p-5 mt-4">
      <Text className="text-gray-400 text-sm font-semibold tracking-wider uppercase mb-4">
        Statistics
      </Text>

      <View className="flex-row">
        {/* Left column */}
        <View className="flex-1">
          <StatItem label="Resets" value={stats.resetCount.toString()} />
          <View className="h-4" />
          <StatItem label="Longest Streak" value={`${stats.longestStreak}d`} />
        </View>

        {/* Right column */}
        <View className="flex-1">
          <StatItem label="Days Since Start" value={stats.daysSinceStart.toString()} />
          <View className="h-4" />
          <StatItem label="Average Streak" value={`${stats.averageStreak}d`} />
        </View>
      </View>
    </View>
  );
});

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-white text-2xl font-bold" style={{ fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
      <Text className="text-gray-500 text-xs font-medium mt-1">{label}</Text>
    </View>
  );
}
