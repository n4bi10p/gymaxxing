import { EXERCISES } from './catalog';
import type { CatalogExercise, Equipment, Muscle } from './types';

export interface ExerciseQuery {
  text?: string;
  muscle?: Muscle;
  equipment?: Equipment;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function getExercise(id: string): CatalogExercise | undefined {
  return EXERCISES.find((exercise) => exercise.id === id);
}

export function searchExercises(query: ExerciseQuery = {}): CatalogExercise[] {
  const text = normalize(query.text ?? '');
  const tokens = text.split(' ').filter(Boolean);

  const matches = EXERCISES.filter((exercise) => {
    if (query.muscle && !exercise.primary.includes(query.muscle) && !exercise.secondary.includes(query.muscle)) {
      return false;
    }
    if (query.equipment && exercise.equipment !== query.equipment) return false;
    if (tokens.length === 0) return true;
    const haystack = normalize(`${exercise.name} ${exercise.equipment} ${exercise.primary.join(' ')}`);
    return tokens.every((token) => haystack.includes(token));
  });

  return matches.sort((a, b) => score(b, text) - score(a, text) || a.name.localeCompare(b.name));
}

function score(exercise: CatalogExercise, text: string): number {
  if (!text) return 0;
  const name = normalize(exercise.name);
  if (name === text) return 100;
  if (name.startsWith(text)) return 80;
  if (name.includes(text)) return 60;
  return 10;
}
