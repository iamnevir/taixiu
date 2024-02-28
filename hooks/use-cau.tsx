import { create } from "zustand";

type History = {
  history: string[];
  setHistory: (history: string[]) => void;
};

export const useHistory = create<History>((set, get) => ({
  history: [],
  setHistory: (history: string[]) => set({ history }),
}));
