import { z } from 'zod';

export const unitSchema = z.enum(['kg', 'lb']);
export const setKindSchema = z.enum(['normal', 'warmup', 'failure', 'drop']);
export const schemePreferenceSchema = z.enum(['system', 'dark', 'light']);
export const accentKindSchema = z.enum(['system', 'silver', 'ice', 'violet', 'mint', 'amber', 'rose', 'custom']);
export const syncModeSchema = z.enum(['local', 'cloud']);

export const setRecordSchema = z.object({
  id: z.string().min(1),
  workoutExerciseId: z.string().min(1),
  setIndex: z.number().int().nonnegative(),
  kind: setKindSchema,
  weight: z.number().nonnegative(),
  reps: z.number().int().nonnegative(),
  completed: z.boolean(),
  completedAt: z.string().nullable(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export const workoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  routineId: z.string().nullable(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export const profileSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  goal: z.string().nullable(),
  experience: z.enum(['new', 'intermediate', 'advanced']).nullable(),
  trainingDays: z.array(z.number().int().min(0).max(6)),
  unit: unitSchema,
  scheme: schemePreferenceSchema,
  accentKind: accentKindSchema,
  accentSeed: z.string().nullable(),
  restSeconds: z.number().int().positive(),
  updatedAt: z.string(),
});

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  profile: profileSchema.nullable(),
  routines: z.array(z.record(z.string(), z.unknown())),
  routineExercises: z.array(z.record(z.string(), z.unknown())),
  workouts: z.array(workoutSchema),
  workoutExercises: z.array(z.record(z.string(), z.unknown())),
  sets: z.array(setRecordSchema),
  bodyMetrics: z.array(z.record(z.string(), z.unknown())),
});

export type Unit = z.infer<typeof unitSchema>;
export type SetRecord = z.infer<typeof setRecordSchema>;
export type WorkoutRecord = z.infer<typeof workoutSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type BackupFile = z.infer<typeof backupSchema>;
export type SyncMode = z.infer<typeof syncModeSchema>;
