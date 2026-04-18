import { forwardRef, useCallback, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useCounterStore } from "@/store/counterStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ResetCounterSheetProps {
  counterId: string;
  onDone?: () => void;
}

export const ResetCounterSheet = forwardRef<
  BottomSheetModal,
  ResetCounterSheetProps
>(function ResetCounterSheet({ counterId, onDone }, ref) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["45%"], []);
  const resetCounter = useCounterStore((s) => s.resetCounter);

  const [note, setNote] = useState("");

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

  const handleDone = useCallback(async () => {
    // Always reset from the current instant so the streak restarts at 0s.
    await resetCounter(counterId, Date.now(), note.trim() || null);
    setNote("");
    (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    onDone?.();
  }, [counterId, note, resetCounter, ref, onDone]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      topInset={insets.top}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#1A1A2E" }}
      handleIndicatorStyle={{ backgroundColor: "#4B5563" }}
    >
      <BottomSheetScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={() =>
              (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
            }
          >
            <Text className="text-gray-400 text-base">Cancel</Text>
          </Pressable>
          <Text className="text-white text-lg font-bold">Reset Counter</Text>
          <Pressable onPress={handleDone}>
            <Text className="text-[#E63946] text-base font-bold">Done</Text>
          </Pressable>
        </View>

        <View className="bg-[#0F0F0F] p-4 rounded-xl mb-3">
          <Text className="text-gray-500 text-xs font-semibold mb-1 tracking-wider uppercase">
            Reset behavior
          </Text>
          <Text className="text-white text-base">
            Counter will reset from current time.
          </Text>
        </View>

        {/* Note */}
        <View className="bg-[#0F0F0F] p-4 rounded-xl">
          <Text className="text-gray-500 text-xs font-semibold mb-1 tracking-wider uppercase">
            Note (optional)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Why did you reset?"
            placeholderTextColor="#4B5563"
            multiline
            numberOfLines={3}
            className="text-white text-base mt-1"
            style={{ minHeight: 60, textAlignVertical: "top" }}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
