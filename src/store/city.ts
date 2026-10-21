"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./safe-storage";

type CityState = {
  citySlug: string | null;
  setCity: (slug: string) => void;
};

export const useCity = create<CityState>()(
  persist((set) => ({ citySlug: null, setCity: (citySlug) => set({ citySlug }) }), {
    name: "wm-city",
    storage: safeStorage,
    skipHydration: true,
  }),
);
