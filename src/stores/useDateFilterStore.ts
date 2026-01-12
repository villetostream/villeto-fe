import { create } from "zustand";

interface DateFilterState {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFromDate: (date: Date | undefined) => void;
  setToDate: (date: Date | undefined) => void;
  resetDates: () => void;
}

export const useDateFilterStore = create<DateFilterState>((set) => ({
  fromDate: undefined,
  toDate: undefined,
  setFromDate: (date) => set({ fromDate: date }),
  setToDate: (date) => set({ toDate: date }),
  resetDates: () => set({ fromDate: undefined, toDate: undefined }),
}));
