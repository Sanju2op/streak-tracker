import { create } from "zustand";

interface CalendarStore {
  activeFilterIds: string[]; // empty = show all

  setFilter: (ids: string[]) => void;
  clearFilter: () => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  activeFilterIds: [],

  setFilter: (ids) => set({ activeFilterIds: ids }),
  clearFilter: () => set({ activeFilterIds: [] }),
}));
