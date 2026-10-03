import { epley1RM } from './epley';

export interface HistorySet {
  weight: number;
  reps: number;
}

export interface PRFlags {
  weight: boolean;
  reps: boolean;
  estimated1RM: boolean;
}

const EMPTY: PRFlags = { weight: false, reps: false, estimated1RM: false };

function valid(set: HistorySet): boolean {
  return Number.isFinite(set.weight) && Number.isFinite(set.reps) && set.weight > 0 && set.reps > 0;
}

/** Compare one completed set with prior completed sets for the same exercise. */
export function detectPRs(candidate: HistorySet, history: readonly HistorySet[]): PRFlags {
  if (!valid(candidate)) return EMPTY;
  const prior = history.filter(valid);
  if (prior.length === 0) {
    return { weight: true, reps: true, estimated1RM: true };
  }

  const bestWeight = Math.max(...prior.map((set) => set.weight));
  const sameWeight = prior.filter((set) => Math.abs(set.weight - candidate.weight) < 1e-6);
  const bestRepsAtWeight = sameWeight.length === 0 ? 0 : Math.max(...sameWeight.map((set) => set.reps));
  const bestEstimate = Math.max(...prior.map((set) => epley1RM(set.weight, set.reps)));
  const estimate = epley1RM(candidate.weight, candidate.reps);

  return {
    weight: candidate.weight > bestWeight + 1e-9,
    reps: sameWeight.length > 0 && candidate.reps > bestRepsAtWeight,
    estimated1RM: estimate > bestEstimate + 1e-6,
  };
}

export function isAnyPR(flags: PRFlags): boolean {
  return flags.weight || flags.reps || flags.estimated1RM;
}
