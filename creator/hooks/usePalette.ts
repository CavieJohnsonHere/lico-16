import { create } from "zustand";

type PaletteState = {
  selected: number;
  setSelected: (value: number) => void;
};

export const usePalette = create<PaletteState>((set) => ({
  selected: -1,
  setSelected: (value: number) => set({ selected: value }),
}));
