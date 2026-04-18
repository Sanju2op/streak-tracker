import { useCallback, useMemo, useRef } from "react";
import { View, FlatList, Pressable } from "react-native";
import { useCounterStore } from "@/store/counterStore";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { CounterCard } from "@/components/counters/CounterCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CreateCounterSheet } from "@/components/counters/CreateCounterSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { Counter } from "@/types";

export default function CountersScreen() {
  const counters = useCounterStore((s) => s.counters);
  const sortOrder = useCounterStore((s) => s.sortOrder);
  const toggleSort = useCounterStore((s) => s.toggleSort);
  const createSheetRef = useRef<BottomSheetModal>(null);

  const sortedCounters = useMemo(() => {
    const sorted = [...counters].sort((a, b) => {
      return sortOrder === "desc"
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt;
    });
    return sorted;
  }, [counters, sortOrder]);

  const handleOpenCreate = useCallback(() => {
    createSheetRef.current?.present();
  }, []);

  const renderItem = useCallback(({ item }: { item: Counter }) => {
    return <CounterCard counter={item} />;
  }, []);

  return (
    <View className="flex-1 bg-[#0F0F0F]">
      <CustomHeader
        title="Counters"
        leftAction={{ icon: "sort", onPress: toggleSort }}
        rightAction={{ icon: "plus", onPress: handleOpenCreate }}
      />

      {sortedCounters.length === 0 ? (
        <EmptyState onCreatePress={handleOpenCreate} />
      ) : (
        <FlatList
          data={sortedCounters}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      <CreateCounterSheet ref={createSheetRef} />
    </View>
  );
}
