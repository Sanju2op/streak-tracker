import { Pressable, Text, View } from "react-native";
import type { ColorSwatch } from "@/types";

interface CalendarStreakProps {
  day: {
    day: number;
    dateString: string;
  };
  state?: "disabled" | "today" | "";
  colors: ColorSwatch[];
  onPress?: (dateString: string) => void;
}

export function CalendarStreak({
  day,
  state,
  colors,
  onPress,
}: CalendarStreakProps) {
  const isDisabled = state === "disabled";
  const visibleColors = colors.slice(0, 4);
  const extraCount = Math.max(0, colors.length - visibleColors.length);

  return (
    <Pressable
      onPress={() => onPress?.(day.dateString)}
      className="items-center justify-start pt-1 pb-0.5 min-h-[44px]"
      disabled={!onPress}
    >
      <Text
        className={`text-xs ${
          isDisabled ? "text-gray-700" : "text-white"
        }`}
      >
        {day.day}
      </Text>

      <View className="mt-1 w-full px-1">
        {visibleColors.map((swatch) => (
          <View
            key={`${day.dateString}-${swatch.id}`}
            className="h-1 rounded-full mb-0.5"
            style={{ backgroundColor: swatch.hex }}
          />
        ))}

        {extraCount > 0 ? (
          <Text className="text-[9px] text-gray-500 leading-[10px] text-center">
            +{extraCount}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
