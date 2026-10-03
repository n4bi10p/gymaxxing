import { create } from 'zustand';

interface RestState {
  endsAt: number | null;
  start: (seconds: number) => void;
  clear: () => void;
}

export const useRest = create<RestState>((set) => ({
  endsAt: null,
  start: (seconds) => set({ endsAt: Date.now() + seconds * 1000 }),
  clear: () => set({ endsAt: null }),
}));

export function restRemaining(endsAt: number | null, now = Date.now()): number {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}
