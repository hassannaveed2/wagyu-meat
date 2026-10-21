import { createJSONStorage, type StateStorage } from "zustand/middleware";

const memory = new Map<string, string>();
const memoryStorage: StateStorage = {
  getItem: (name) => memory.get(name) ?? null,
  setItem: (name, value) => void memory.set(name, value),
  removeItem: (name) => void memory.delete(name),
};

/** localStorage when it works; an in-memory fallback in private mode or when blocked. */
export const safeStorage = createJSONStorage(() => {
  try {
    const probe = "__wm_probe__";
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memoryStorage;
  }
});
