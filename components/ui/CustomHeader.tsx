import { View, Text, Pressable } from "react-native";
import { ArrowUpDown, Plus, Filter } from "lucide-react-native";

interface HeaderAction {
  icon: "sort" | "plus" | "filter";
  onPress: () => void;
}

interface CustomHeaderProps {
  title: string;
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
}

const ICON_MAP = {
  sort: ArrowUpDown,
  plus: Plus,
  filter: Filter,
};

export function CustomHeader({ title, leftAction, rightAction }: CustomHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-14 pb-3 bg-[#0F0F0F]">
      {/* Left */}
      <View style={{ width: 40 }}>
        {leftAction && (
          <Pressable onPress={leftAction.onPress} hitSlop={8}>
            {(() => {
              const Icon = ICON_MAP[leftAction.icon];
              return <Icon size={20} color="#9CA3AF" />;
            })()}
          </Pressable>
        )}
      </View>

      {/* Center */}
      <Text className="text-white text-xl font-bold flex-1 text-center">
        {title}
      </Text>

      {/* Right */}
      <View style={{ width: 40, alignItems: "flex-end" }}>
        {rightAction && (
          <Pressable onPress={rightAction.onPress} hitSlop={8}>
            {(() => {
              const Icon = ICON_MAP[rightAction.icon];
              return <Icon size={22} color="#E63946" />;
            })()}
          </Pressable>
        )}
      </View>
    </View>
  );
}
