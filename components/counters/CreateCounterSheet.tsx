import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useCounterStore } from "@/store/counterStore";
import { getRandomColor } from "@/constants/colors";
import { ColorPickerSheet } from "./ColorPickerSheet";
import { LiveTimeDisplay } from "./LiveTimeDisplay";
import type { ColorSwatch } from "@/types";

interface CreateCounterSheetProps {
  counterId?: string; // if provided, edit mode
}

export const CreateCounterSheet = forwardRef<
  BottomSheetModal,
  CreateCounterSheetProps
>(function CreateCounterSheet({ counterId }, ref) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["100%"], []);
  const counters = useCounterStore((s) => s.counters);
  const addCounter = useCounterStore((s) => s.addCounter);
  const updateCounter = useCounterStore((s) => s.updateCounter);

  const existingCounter = useMemo(
    () => (counterId ? counters.find((c) => c.id === counterId) : null),
    [counterId, counters],
  );
  const isEditMode = !!existingCounter;

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#E63946");
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const colorPickerRef = useRef<BottomSheetModal>(null);
  const previousSheetIndexRef = useRef(-1);

  const initializeForm = useCallback(() => {
    if (existingCounter) {
      setTitle(existingCounter.title);
      setColor(existingCounter.color);
      setStartDate(new Date(existingCounter.startedAt));
      return;
    }
    setTitle("");
    setColor(getRandomColor().hex);
    setStartDate(new Date());
  }, [existingCounter]);

  // Reset form only when opening from fully closed state.
  const handleSheetChanges = useCallback(
    (index: number) => {
      const wasClosed = previousSheetIndexRef.current === -1;
      if (index >= 0 && wasClosed) {
        initializeForm();
      }

      if (index === -1) {
        setShowDatePicker(false);
        setShowTimePicker(false);
      }

      previousSheetIndexRef.current = index;
    },
    [initializeForm],
  );

  useEffect(() => {
    if (existingCounter) {
      setTitle(existingCounter.title);
      setColor(existingCounter.color);
      setStartDate(new Date(existingCounter.startedAt));
    }
  }, [existingCounter]);

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
    if (!title.trim()) return;

    if (isEditMode && counterId) {
      await updateCounter(counterId, {
        title: title.trim(),
        color,
        startedAt: startDate.getTime(),
      });
    } else {
      await addCounter(title.trim(), color, startDate.getTime());
    }

    // Close sheet
    (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
  }, [
    title,
    color,
    startDate,
    isEditMode,
    counterId,
    addCounter,
    updateCounter,
    ref,
  ]);

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, date?: Date) => {
      setShowDatePicker(false);
      if (date) {
        const updated = new Date(startDate);
        updated.setFullYear(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        setStartDate(updated);
      }
    },
    [startDate],
  );

  const handleTimeChange = useCallback(
    (_event: DateTimePickerEvent, time?: Date) => {
      setShowTimePicker(false);
      if (time) {
        const updated = new Date(startDate);
        updated.setHours(time.getHours(), time.getMinutes());
        setStartDate(updated);
      }
    },
    [startDate],
  );

  const handleColorSelect = useCallback((swatch: ColorSwatch) => {
    setColor(swatch.hex);
    colorPickerRef.current?.dismiss();
  }, []);

  const canSave = title.trim().length > 0;

  return (
    <>
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        topInset={insets.top}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#0F0F0F" }}
        handleIndicatorStyle={{ backgroundColor: "#4B5563" }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
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
              <Text className="text-[#E63946] text-base">Cancel</Text>
            </Pressable>
            <Text className="text-white text-lg font-bold">
              {isEditMode ? "Edit Streak" : "New Streak"}
            </Text>
            <Pressable onPress={handleDone} disabled={!canSave}>
              <Text
                className={`text-base font-bold ${
                  canSave ? "text-[#E63946]" : "text-gray-600"
                }`}
              >
                Done
              </Text>
            </Pressable>
          </View>

          {/* Preview Card */}
          <View
            style={{ backgroundColor: color }}
            className="rounded-2xl p-5 min-h-[140px] justify-between mb-6"
          >
            <Text className="text-white text-lg font-bold" numberOfLines={1}>
              {title || "Streak Name"}
            </Text>
            <View className="mt-3">
              <LiveTimeDisplay
                startedAt={startDate.getTime()}
                period="days"
                mode="card"
              />
            </View>
          </View>

          {/* Title Input */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm font-semibold mb-2 tracking-wider uppercase">
              Name
            </Text>
            <TextInput
              value={title}
              onChangeText={(text) => setTitle(text.slice(0, 50))}
              placeholder="No Junk Food"
              placeholderTextColor="#4B5563"
              maxLength={50}
              className="bg-[#1A1A2E] text-white text-base p-4 rounded-xl"
            />
          </View>

          {/* Date Picker */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm font-semibold mb-2 tracking-wider uppercase">
              Started on
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="bg-[#1A1A2E] p-4 rounded-xl"
            >
              <Text className="text-white text-base">
                {startDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </Pressable>
            {showDatePicker ? (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            ) : null}
          </View>

          {/* Time Picker */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm font-semibold mb-2 tracking-wider uppercase">
              Time
            </Text>
            <Pressable
              onPress={() => setShowTimePicker(true)}
              className="bg-[#1A1A2E] p-4 rounded-xl"
            >
              <Text className="text-white text-base">
                {startDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>
            {showTimePicker ? (
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            ) : null}
          </View>

          {/* Color Picker */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm font-semibold mb-2 tracking-wider uppercase">
              Color
            </Text>
            <Pressable
              onPress={() => colorPickerRef.current?.present()}
              className="bg-[#1A1A2E] p-4 rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-white text-base">Pick a color</Text>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: color,
                }}
              />
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      <ColorPickerSheet
        ref={colorPickerRef}
        selectedColor={color}
        onSelect={handleColorSelect}
      />
    </>
  );
});
