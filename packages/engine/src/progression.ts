import { roundToIncrement } from './units';

export interface LoggedSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ProgressionInput {
  sets: readonly LoggedSet[];
  repRange: { min: number; max: number };
  increment: number;
  /** Failures already recorded before this session. */
  consecutiveFailures?: number;
}

export type ProgressionAction = 'increase' | 'hold' | 'deload';

export interface ProgressionSuggestion {
  action: ProgressionAction;
  nextWeight: number;
  reason: string;
}

export function suggestProgression(input: ProgressionInput): ProgressionSuggestion {
  const working = input.sets.filter((set) => set.completed && set.weight > 0);
  const fallback = input.sets.find((set) => set.weight > 0)?.weight ?? 0;
  if (working.length === 0) {
    return {
      action: 'hold',
      nextWeight: fallback,
      reason: 'No completed sets. Keep the same weight.',
    };
  }

  const weight = working[0]?.weight ?? fallback;
  const allHitTop = working.every((set) => set.reps >= input.repRange.max);
  const anyBelowMin = working.some((set) => set.reps < input.repRange.min);
  const priorFailures = input.consecutiveFailures ?? 0;

  if (allHitTop) {
    const next = roundToIncrement(weight + input.increment, input.increment);
    return {
      action: 'increase',
      nextWeight: next,
      reason: `All sets reached ${input.repRange.max} reps. Add ${input.increment}.`,
    };
  }

  if (anyBelowMin && priorFailures >= 1) {
    const reduced = roundToIncrement(weight * 0.9, input.increment);
    return {
      action: 'deload',
      nextWeight: Math.max(reduced, input.increment),
      reason: 'Below the rep range twice. Reduce the weight by about 10%.',
    };
  }

  if (anyBelowMin) {
    return {
      action: 'hold',
      nextWeight: weight,
      reason: 'Below the rep range. Repeat this weight once more before a deload.',
    };
  }

  return {
    action: 'hold',
    nextWeight: weight,
    reason: 'Stay at this weight and aim for the top of the rep range.',
  };
}
