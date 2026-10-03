export const MUSCLES = [
  'chest',
  'upper_back',
  'lats',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'obliques',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'traps',
  'lower_back',
] as const;

export type Muscle = (typeof MUSCLES)[number];

export const EQUIPMENT = [
  'barbell',
  'dumbbell',
  'machine',
  'cable',
  'bodyweight',
  'kettlebell',
] as const;

export type Equipment = (typeof EQUIPMENT)[number];

export interface CatalogExercise {
  id: string;
  name: string;
  primary: Muscle[];
  secondary: Muscle[];
  equipment: Equipment;
  pattern: 'squat' | 'hinge' | 'horizontal_push' | 'vertical_push' | 'horizontal_pull' | 'vertical_pull' | 'carry' | 'isolation' | 'core';
  defaultRestSec: number;
  cues: string[];
}
