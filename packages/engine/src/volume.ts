export type SetKind = 'normal' | 'warmup' | 'failure' | 'drop';

export interface VolumeSet {
  weight: number;
  reps: number;
  completed?: boolean;
  kind?: SetKind;
}

export interface VolumeOptions {
  includeWarmup?: boolean;
}

export function setVolume(set: VolumeSet, options: VolumeOptions = {}): number {
  if (set.completed === false) return 0;
  if (set.kind === 'warmup' && !options.includeWarmup) return 0;
  if (!Number.isFinite(set.weight) || !Number.isFinite(set.reps)) return 0;
  if (set.weight <= 0 || set.reps <= 0) return 0;
  return set.weight * set.reps;
}

export function sessionVolume(sets: readonly VolumeSet[], options: VolumeOptions = {}): number {
  return sets.reduce((sum, set) => sum + setVolume(set, options), 0);
}
