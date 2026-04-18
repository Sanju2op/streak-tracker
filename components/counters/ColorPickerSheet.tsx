import { forwardRef, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Check } from "lucide-react-native";
import { PALETTES } from "@/constants/colors";
import type { ColorSwatch } from "@/types";

const { width: screenWidth } = Dimensions.get("window");
const SHEET_PADDING = 20;
const GRID_WIDTH = screenWidth - SHEET_PADDING * 2;

interface ColorPickerSheetProps {
  selectedColor: string;
  onSelect: (swatch: ColorSwatch) => void;
}

export const ColorPickerSheet = forwardRef<
  BottomSheetModal,
  ColorPickerSheetProps
>(function ColorPickerSheet({ selectedColor, onSelect }, ref) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["60%"], []);
  const [activePalette, setActivePalette] = useState(0);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    [],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / GRID_WIDTH);
      if (page !== activePalette && page >= 0 && page < PALETTES.length) {
        setActivePalette(page);
      }
    },
    [activePalette],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      stackBehavior="push"
      topInset={insets.top}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#1A1A2E" }}
      handleIndicatorStyle={{ backgroundColor: "#4B5563" }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: SHEET_PADDING, paddingBottom: insets.bottom }}>
        {/* Header */}
        <Text className="text-white text-lg font-bold text-center mb-4">
          Pick a color
        </Text>

        {/* Singular Palette Label */}
        <Text className="text-gray-400 text-sm font-semibold text-center uppercase tracking-wider mb-4">
          {PALETTES[activePalette].label}
        </Text>

        {/* Swipeable Grid */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          decelerationRate="fast"
          snapToInterval={GRID_WIDTH}
          className="flex-1"
        >
          {PALETTES.map((palette) => (
            <View
              key={palette.id}
              style={{ width: GRID_WIDTH }}
              className="flex-row flex-wrap justify-center"
            >
              <View
                className="flex-row flex-wrap"
                style={{ width: "100%", gap: 12, justifyContent: "center" }}
              >
                {palette.colors.map((swatch) => {
                  const isSelected = swatch.hex === selectedColor;
                  return (
                    <Pressable
                      key={swatch.id}
                      onPress={() => onSelect(swatch)}
                      className="items-center justify-center"
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor: swatch.hex,
                        borderWidth: isSelected ? 3 : 0,
                        borderColor: "#FFFFFF",
                      }}
                    >
                      {isSelected ? <Check size={22} color="#FFFFFF" /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Page indicator dots */}
        <View className="flex-row justify-center mt-6 mb-8" style={{ gap: 6 }}>
          {PALETTES.map((_, index) => (
            <View
              key={index}
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor:
                  index === activePalette ? "#E63946" : "#4B5563",
              }}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
