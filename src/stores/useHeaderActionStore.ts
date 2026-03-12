import { create } from "zustand";

export interface HeaderActionItem {
  label: string;
  onClick: () => void;
}

export interface HeaderAction {
  label: string;
  /** Simple button — provide onClick */
  onClick?: () => void;
  /** Dropdown button — provide items array instead */
  items?: HeaderActionItem[];
}

interface HeaderActionStore {
  action: HeaderAction | null;
  setAction: (action: HeaderAction | null) => void;
  clearAction: () => void;
}

export const useHeaderActionStore = create<HeaderActionStore>((set) => ({
  action: null,
  setAction: (action) => set({ action }),
  clearAction: () => set({ action: null }),
}));