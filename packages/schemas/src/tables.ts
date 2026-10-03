import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const sync = {
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
};

export const profile = sqliteTable('profile', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull().default(''),
  goal: text('goal'),
  experience: text('experience'),
  trainingDays: text('training_days').notNull().default('[]'),
  unit: text('unit').notNull().default('kg'),
  scheme: text('scheme').notNull().default('system'),
  accentKind: text('accent_kind').notNull().default('silver'),
  accentSeed: text('accent_seed'),
  restSeconds: integer('rest_seconds').notNull().default(120),
  ...sync,
});

export const customExercises = sqliteTable('custom_exercises', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  primaryMuscles: text('primary_muscles').notNull(),
  secondaryMuscles: text('secondary_muscles').notNull().default('[]'),
  equipment: text('equipment').notNull().default('other'),
  ...sync,
});

export const routines = sqliteTable('routines', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  notes: text('notes'),
  ...sync,
});

export const routineExercises = sqliteTable('routine_exercises', {
  id: text('id').primaryKey().notNull(),
  routineId: text('routine_id').notNull(),
  exerciseId: text('exercise_id').notNull(),
  position: integer('position').notNull(),
  targetSets: integer('target_sets').notNull().default(3),
  repMin: integer('rep_min').notNull().default(6),
  repMax: integer('rep_max').notNull().default(10),
  restSeconds: integer('rest_seconds'),
  ...sync,
});

export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  routineId: text('routine_id'),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  notes: text('notes'),
  ...sync,
});

export const workoutExercises = sqliteTable('workout_exercises', {
  id: text('id').primaryKey().notNull(),
  workoutId: text('workout_id').notNull(),
  exerciseId: text('exercise_id').notNull(),
  position: integer('position').notNull(),
  notes: text('notes'),
  ...sync,
});

export const sets = sqliteTable('sets', {
  id: text('id').primaryKey().notNull(),
  workoutExerciseId: text('workout_exercise_id').notNull(),
  setIndex: integer('set_index').notNull(),
  kind: text('kind').notNull().default('normal'),
  weight: real('weight').notNull().default(0),
  reps: integer('reps').notNull().default(0),
  completed: integer('completed').notNull().default(0),
  completedAt: text('completed_at'),
  ...sync,
});

export const bodyMetrics = sqliteTable('body_metrics', {
  id: text('id').primaryKey().notNull(),
  kind: text('kind').notNull(),
  value: real('value').notNull(),
  unit: text('unit').notNull(),
  recordedAt: text('recorded_at').notNull(),
  ...sync,
});

export const drizzleSchema = {
  profile,
  customExercises,
  routines,
  routineExercises,
  workouts,
  workoutExercises,
  sets,
  bodyMetrics,
};
