import { memo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import type { Period } from "@/types";

const PERIODS: Period[] = ["hours", "days", "weeks", "months", "years"];

interface TimeTabSelectorProps {
  activePeriod: Period;
  onPeriodChange: (period: Period) => void;
  accentColor: string;
}

export const TimeTabSelector = memo(function TimeTabSelector({
  activePeriod,
  onPeriodChange,
  accentColor,
}: TimeTabSelectorProps) {
  return (
    <View className="flex-row bg-[#0F0F0F] rounded-xl p-1">
      {PERIODS.map((period) => {
        const isActive = period === activePeriod;
        return (
          <Pressable
            key={period}
            onPress={() => onPeriodChange(period)}
            className="flex-1 py-2 rounded-lg items-center"
            style={isActive ? { backgroundColor: accentColor } : undefined}
          >
            <Text
              className={`text-xs font-semibold capitalize ${
                isActive ? "text-white" : "text-gray-500"
              }`}
            >
              {period}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});
