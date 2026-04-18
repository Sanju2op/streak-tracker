import { View, Text, Pressable } from "react-native";
import { Flame } from "lucide-react-native";

interface EmptyStateProps {
  onCreatePress: () => void;
}

export function EmptyState({ onCreatePress }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="bg-[#1A1A2E] rounded-full w-24 h-24 items-center justify-center mb-6">
        <Flame size={40} color="#E63946" />
      </View>

      <Text className="text-white text-2xl font-bold text-center mb-3">
        Start a streak
      </Text>
      <Text className="text-gray-500 text-base text-center mb-8 leading-6">
        Track your habits and see how far you can go. Tap the button below to create your first streak.
      </Text>

      <Pressable
        onPress={onCreatePress}
        className="bg-[#E63946] rounded-2xl px-8 py-4 active:opacity-80"
      >
        <Text className="text-white text-base font-bold">
          Create Your First Streak
        </Text>
      </Pressable>
    </View>
  );
}
