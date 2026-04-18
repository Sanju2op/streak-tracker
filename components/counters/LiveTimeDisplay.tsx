import { useEffect, useState, memo } from "react";
import { View, Text } from "react-native";
import { getElapsed, getTotalInPeriod } from "@/lib/timeUtils";
import { getDisplayUnits } from "@/lib/formatUtils";
import type { Period } from "@/types";

interface LiveTimeDisplayProps {
  startedAt: number;
  period: Period;
  mode: "card" | "detail";
}

/**
 * Live ticking display. Updates every second.
 *
 * - "card" mode: shows a single large number (total in selected period)
 * - "detail" mode: shows full breakdown per the selected period tab
 */
export const LiveTimeDisplay = memo(function LiveTimeDisplay({
  startedAt,
  period,
  mode,
}: LiveTimeDisplayProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (mode === "card") {
    const total = getTotalInPeriod(startedAt, now, period);
    return (
      <View className="items-center">
        <Text className="text-white text-5xl font-bold" style={{ fontVariant: ["tabular-nums"] }}>
          {total.toLocaleString()}
        </Text>
        <Text className="text-white/60 text-sm font-medium mt-1 capitalize">
          {period}
        </Text>
      </View>
    );
  }

  // Detail mode
  const elapsed = getElapsed(startedAt, now);
  const units = getDisplayUnits(elapsed, period);

  return (
    <View className="flex-row justify-around">
      {units.map((unit) => (
        <View key={unit.label} className="items-center min-w-[60px]">
          <Text
            className="text-white text-3xl font-bold"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {unit.value}
          </Text>
          <Text className="text-gray-500 text-xs font-medium mt-1">
            {unit.label}
          </Text>
        </View>
      ))}
    </View>
  );
});
