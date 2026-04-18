import { forwardRef, useCallback, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
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
  const snapPoints = useMemo(() => ["60%"], []);
  const resetCounter = useCounterStore((s) => s.resetCounter);

  const [resetDate, setResetDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
    await resetCounter(counterId, resetDate.getTime(), note.trim() || null);
    setNote("");
    setResetDate(new Date());
    (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    onDone?.();
  }, [counterId, resetDate, note, resetCounter, ref, onDone]);

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, date?: Date) => {
      setShowDatePicker(false);
      if (date) {
        const updated = new Date(resetDate);
        updated.setFullYear(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        setResetDate(updated);
      }
    },
    [resetDate],
  );

  const handleTimeChange = useCallback(
    (_event: DateTimePickerEvent, time?: Date) => {
      setShowTimePicker(false);
      if (time) {
        const updated = new Date(resetDate);
        updated.setHours(time.getHours(), time.getMinutes());
        setResetDate(updated);
      }
    },
    [resetDate],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#1A1A2E" }}
      handleIndicatorStyle={{ backgroundColor: "#4B5563" }}
    >
      <BottomSheetScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
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

        {/* Date */}
        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="bg-[#0F0F0F] p-4 rounded-xl mb-3"
        >
          <Text className="text-gray-500 text-xs font-semibold mb-1 tracking-wider uppercase">
            Reset on
          </Text>
          <Text className="text-white text-base">
            {resetDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </Pressable>
        {showDatePicker ? (
          <DateTimePicker
            value={resetDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        ) : null}

        {/* Time */}
        <Pressable
          onPress={() => setShowTimePicker(true)}
          className="bg-[#0F0F0F] p-4 rounded-xl mb-3"
        >
          <Text className="text-gray-500 text-xs font-semibold mb-1 tracking-wider uppercase">
            Time
          </Text>
          <Text className="text-white text-base">
            {resetDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Pressable>
        {showTimePicker ? (
          <DateTimePicker
            value={resetDate}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        ) : null}

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
