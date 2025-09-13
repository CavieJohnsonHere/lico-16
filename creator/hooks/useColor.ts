import { create } from "zustand";

type ColorState = {
  selected: number;
  setSelected: (value: number) => void;
};

export const useColor = create<ColorState>((set) => ({
  selected: -1,
  setSelected: (value: number) => set({ selected: value }),
}));
