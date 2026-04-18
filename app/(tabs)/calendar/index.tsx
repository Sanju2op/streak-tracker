import { View, Text } from "react-native";
import { CustomHeader } from "@/components/ui/CustomHeader";

export default function CalendarScreen() {
  return (
    <View className="flex-1 bg-[#0F0F0F]">
      <CustomHeader title="Calendar" />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-gray-500 text-base text-center">
          Calendar view coming soon
        </Text>
      </View>
    </View>
  );
}
