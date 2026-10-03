import { describe, expect, it } from 'vitest';
import { EXERCISES, getExercise, searchExercises } from './index';

describe('exercise catalog', () => {
  it('has unique ids and original cues', () => {
    const ids = new Set(EXERCISES.map((exercise) => exercise.id));
    expect(ids.size).toBe(EXERCISES.length);
    expect(EXERCISES.length).toBeGreaterThan(30);
    expect(EXERCISES.every((exercise) => exercise.cues.length > 0)).toBe(true);
  });

  it('finds a bench variation and a muscle filter', () => {
    expect(searchExercises({ text: 'bench' }).map((exercise) => exercise.id)).toContain('bench-press');
    expect(getExercise('pull-up')?.primary).toContain('lats');
    const curls = searchExercises({ muscle: 'biceps', equipment: 'dumbbell' });
    expect(curls.every((exercise) => exercise.equipment === 'dumbbell')).toBe(true);
  });
});
