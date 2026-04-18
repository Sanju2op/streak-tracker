import { View, Text, Pressable, Linking } from "react-native";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { ChevronRight } from "lucide-react-native";
import Constants from "expo-constants";

export default function SettingsScreen() {
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <View className="flex-1 bg-[#0F0F0F]">
      <CustomHeader title="Settings" />

      <View className="px-4 mt-4">
        {/* Privacy Policy */}
        <Pressable
          onPress={() => Linking.openURL("https://example.com/privacy")}
          className="flex-row items-center justify-between py-4 border-b border-[#1A1A2E]"
        >
          <Text className="text-white text-base">Privacy Policy</Text>
          <ChevronRight size={18} color="#6B7280" />
        </Pressable>

        {/* About */}
        <Pressable
          onPress={() => {
            // Simple about info — will wire to Alert later
          }}
          className="flex-row items-center justify-between py-4 border-b border-[#1A1A2E]"
        >
          <Text className="text-white text-base">About</Text>
          <ChevronRight size={18} color="#6B7280" />
        </Pressable>
      </View>

      {/* Version */}
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <Text className="text-gray-600 text-sm">v{appVersion}</Text>
      </View>
    </View>
  );
}
