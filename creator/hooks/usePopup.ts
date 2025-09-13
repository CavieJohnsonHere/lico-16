import { create } from "zustand";

type PopupState = {
  popup: string;
  setPopup: (value: string) => void;
};

export const usePopup = create<PopupState>((set) => ({
  popup: "none",
  setPopup: (value: string) => set({ popup: value }),
}));
