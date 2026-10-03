export interface PerformanceSet {
  weight: number;
  reps: number;
  completed?: boolean;
}

export interface PreviousPerformance {
  performedAt: string;
  sets: PerformanceSet[];
}

/** Most recent prior session for an exercise, ignoring empty sessions. */
export function previousPerformance(
  sessions: readonly PreviousPerformance[],
): PreviousPerformance | null {
  const usable = sessions.filter((session) =>
    session.sets.some((set) => set.completed !== false && set.reps > 0),
  );
  if (usable.length === 0) return null;
  return [...usable].sort((a, b) => (a.performedAt < b.performedAt ? 1 : -1))[0] ?? null;
}

export interface MuscleVolume {
  muscle: string;
  sets: number;
}

/** Count completed working sets per muscle. Secondary muscles count as half a set. */
export function muscleSetCounts(
  entries: readonly { muscles: readonly string[]; secondary?: readonly string[]; completedSets: number }[],
): MuscleVolume[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    if (entry.completedSets <= 0) continue;
    for (const muscle of entry.muscles) {
      totals.set(muscle, (totals.get(muscle) ?? 0) + entry.completedSets);
    }
    for (const muscle of entry.secondary ?? []) {
      totals.set(muscle, (totals.get(muscle) ?? 0) + entry.completedSets * 0.5);
    }
  }
  return [...totals.entries()]
    .map(([muscle, sets]) => ({ muscle, sets }))
    .sort((a, b) => b.sets - a.sets);
}
