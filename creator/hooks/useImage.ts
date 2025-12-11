import { create } from "zustand";

type ImageState = {
  pixels: number[][];
  clear: () => void;
  setPixel: (x: number, y: number, colorIndex: number) => void;
};

export const useImage = create<ImageState>((set) => ({
  clear: () =>
    set(() => ({
      pixels: Array(8)
        .fill(0)
        .map(() => Array(8).fill(0)),
    })),
  pixels: Array(8)
    .fill(0)
    .map(() => Array(8).fill(0)),
  setPixel: (x, y, colorIndex) => {
    set((state) => {
      const newPixels = state.pixels.map((row) => [...row]); // Deep copy
      if (newPixels[y] && newPixels[y][x] !== undefined) {
        newPixels[y][x] = colorIndex;
      }
      return { pixels: newPixels };
    });
  },
}));
