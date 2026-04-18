import { forwardRef, useCallback, useMemo, useState, useRef } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Check } from "lucide-react-native";
import { PALETTES } from "@/constants/colors";
import type { ColorSwatch } from "@/types";

interface ColorPickerSheetProps {
  selectedColor: string;
  onSelect: (swatch: ColorSwatch) => void;
}

export const ColorPickerSheet = forwardRef<BottomSheetModal, ColorPickerSheetProps>(
  function ColorPickerSheet({ selectedColor, onSelect }, ref) {
    const snapPoints = useMemo(() => ["55%"], []);
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
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#1A1A2E" }}
        handleIndicatorStyle={{ backgroundColor: "#4B5563" }}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 20 }}>
          {/* Header */}
          <Text className="text-white text-lg font-bold text-center mb-4">
            Pick a color
          </Text>

          {/* Palette tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ gap: 8 }}
          >
            {PALETTES.map((palette, index) => (
              <Pressable
                key={palette.id}
                onPress={() => setActivePalette(index)}
                className={`px-4 py-2 rounded-lg ${
                  index === activePalette ? "bg-[#2D2D44]" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    index === activePalette ? "text-white" : "text-gray-500"
                  }`}
                >
                  {palette.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Color grid — 5 columns × 3 rows */}
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {PALETTES[activePalette].colors.map((swatch) => {
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
                  {isSelected && <Check size={22} color="#FFFFFF" />}
                </Pressable>
              );
            })}
          </View>

          {/* Page indicator dots */}
          <View className="flex-row justify-center mt-5" style={{ gap: 6 }}>
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
  }
);
