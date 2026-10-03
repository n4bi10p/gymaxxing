import { getExercise, EXERCISES } from '@gymaxxing/exercise-db';
import {
  detectPRs,
  epley1RM,
  muscleSetCounts,
  previousPerformance,
  sessionVolume,
  suggestProgression,
  type PRFlags,
  type Unit,
} from '@gymaxxing/engine';
import { backupSchema, nowIso, uuidv7 } from '@gymaxxing/schemas';
import { database } from './db';
import { num, str, strOrNull, type Row } from './rows';

type DB = typeof database;

const ACCENT_KINDS = ['system', 'silver', 'ice', 'violet', 'mint', 'amber', 'rose', 'custom'] as const;
type AccentKind = (typeof ACCENT_KINDS)[number];

function asAccent(value: string): AccentKind {
  return ACCENT_KINDS.includes(value as AccentKind) ? (value as AccentKind) : 'silver';
}

function asExperience(value: string | null): 'new' | 'intermediate' | 'advanced' | null {
  if (value === 'new' || value === 'intermediate' || value === 'advanced') return value;
  return null;
}

function asKind(value: string): 'normal' | 'warmup' | 'failure' | 'drop' {
  if (value === 'warmup' || value === 'failure' || value === 'drop') return value;
  return 'normal';
}

const STARTER: { name: string; exerciseIds: string[] }[] = [
  { name: 'Push', exerciseIds: ['bench-press', 'overhead-press', 'lateral-raise', 'triceps-pushdown'] },
  { name: 'Pull', exerciseIds: ['pull-up', 'bent-over-row', 'face-pull', 'barbell-curl'] },
  { name: 'Legs', exerciseIds: ['barbell-back-squat', 'romanian-deadlift', 'leg-press', 'calf-raise'] },
];

export interface Profile {
  id: string;
  name: string;
  goal: string | null;
  experience: string | null;
  trainingDays: number[];
  unit: Unit;
  scheme: 'system' | 'dark' | 'light';
  accentKind: string;
  accentSeed: string | null;
  restSeconds: number;
}

export interface RoutineCard {
  id: string;
  name: string;
  count: number;
}

export interface SetRow {
  id: string;
  setIndex: number;
  weight: number;
  reps: number;
  completed: boolean;
  kind: string;
}

export interface ExerciseBlock {
  id: string;
  exerciseId: string;
  name: string;
  restSeconds: number;
  sets: SetRow[];
  previous: string | null;
}

export interface WorkoutDetail {
  id: string;
  name: string;
  startedAt: string;
  endedAt: string | null;
  exercises: ExerciseBlock[];
}

export interface HistoryItem {
  id: string;
  name: string;
  startedAt: string;
  endedAt: string;
  volume: number;
  sets: number;
}

function mapProfile(row: Row): Profile {
  let trainingDays: number[] = [];
  try {
    const parsed = JSON.parse(str(row, 'training_days') || '[]') as unknown;
    if (Array.isArray(parsed)) trainingDays = parsed.filter((day) => typeof day === 'number');
  } catch {
    trainingDays = [];
  }
  const unit = str(row, 'unit') === 'lb' ? 'lb' : 'kg';
  const scheme = str(row, 'scheme');
  return {
    id: str(row, 'id'),
    name: str(row, 'name'),
    goal: strOrNull(row, 'goal'),
    experience: strOrNull(row, 'experience'),
    trainingDays,
    unit,
    scheme: scheme === 'dark' || scheme === 'light' ? scheme : 'system',
    accentKind: str(row, 'accent_kind') || 'silver',
    accentSeed: strOrNull(row, 'accent_seed'),
    restSeconds: num(row, 'rest_seconds') || 120,
  };
}

export async function getProfile(db: DB): Promise<Profile | null> {
  const rows = await db.getAll<Row>('select * from profile where deleted_at is null limit 1');
  const row = rows[0];
  return row ? mapProfile(row) : null;
}

export async function saveProfile(
  db: DB,
  input: Omit<Profile, 'id'> & { id?: string },
  options: { seed?: boolean } = {},
): Promise<Profile> {
  const existing = await getProfile(db);
  const id = existing?.id ?? input.id ?? uuidv7();
  const updatedAt = nowIso();
  if (existing) {
    await db.execute(
      `update profile set name = ?, goal = ?, experience = ?, training_days = ?, unit = ?, scheme = ?, accent_kind = ?, accent_seed = ?, rest_seconds = ?, updated_at = ? where id = ?`,
      [
        input.name,
        input.goal,
        input.experience,
        JSON.stringify(input.trainingDays),
        input.unit,
        input.scheme,
        input.accentKind,
        input.accentSeed,
        input.restSeconds,
        updatedAt,
        id,
      ],
    );
  } else {
    await db.execute(
      `insert into profile (id, name, goal, experience, training_days, unit, scheme, accent_kind, accent_seed, rest_seconds, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name,
        input.goal,
        input.experience,
        JSON.stringify(input.trainingDays),
        input.unit,
        input.scheme,
        input.accentKind,
        input.accentSeed,
        input.restSeconds,
        updatedAt,
      ],
    );
    if (options.seed !== false) await seedRoutines(db);
  }
  const profile = await getProfile(db);
  if (!profile) throw new Error('Profile did not save');
  return profile;
}

async function seedRoutines(db: DB): Promise<void> {
  const existing = await db.getAll<Row>('select id from routines where deleted_at is null limit 1');
  if (existing.length > 0) return;
  const updatedAt = nowIso();
  for (const routine of STARTER) {
    const routineId = uuidv7();
    await db.execute('insert into routines (id, name, updated_at) values (?, ?, ?)', [routineId, routine.name, updatedAt]);
    for (const [position, exerciseId] of routine.exerciseIds.entries()) {
      const catalog = getExercise(exerciseId);
      await db.execute(
        `insert into routine_exercises (id, routine_id, exercise_id, position, target_sets, rep_min, rep_max, rest_seconds, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv7(), routineId, exerciseId, position, 3, 6, 10, catalog?.defaultRestSec ?? 120, updatedAt],
      );
    }
  }
}

export async function listRoutines(db: DB): Promise<RoutineCard[]> {
  const routines = await db.getAll<Row>('select id, name from routines where deleted_at is null order by name');
  const counts = await db.getAll<Row>(
    'select routine_id, count(*) as count from routine_exercises where deleted_at is null group by routine_id',
  );
  const byId = new Map(counts.map((row) => [str(row, 'routine_id'), num(row, 'count')]));
  return routines.map((row) => ({ id: str(row, 'id'), name: str(row, 'name'), count: byId.get(str(row, 'id')) ?? 0 }));
}

async function lastWeight(db: DB, exerciseId: string): Promise<number> {
  const rows = await db.getAll<Row>(
    `select s.weight as weight from sets s
     join workout_exercises we on we.id = s.workout_exercise_id
     join workouts w on w.id = we.workout_id
     where we.exercise_id = ? and s.completed = 1 and s.deleted_at is null and w.deleted_at is null
     order by w.started_at desc limit 1`,
    [exerciseId],
  );
  return rows[0] ? num(rows[0], 'weight') : 0;
}

export async function startEmptyWorkout(db: DB, name = 'Workout'): Promise<string> {
  const id = uuidv7();
  await db.execute('insert into workouts (id, name, started_at, updated_at) values (?, ?, ?, ?)', [id, name, nowIso(), nowIso()]);
  return id;
}

export async function startRoutine(db: DB, routineId: string): Promise<string> {
  const routines = await db.getAll<Row>('select name from routines where id = ? and deleted_at is null', [routineId]);
  const name = routines[0] ? str(routines[0], 'name') : 'Workout';
  const workoutId = uuidv7();
  const updatedAt = nowIso();
  await db.execute('insert into workouts (id, name, routine_id, started_at, updated_at) values (?, ?, ?, ?, ?)', [
    workoutId,
    name,
    routineId,
    updatedAt,
    updatedAt,
  ]);
  const exercises = await db.getAll<Row>(
    'select * from routine_exercises where routine_id = ? and deleted_at is null order by position',
    [routineId],
  );
  for (const exercise of exercises) {
    const exerciseId = str(exercise, 'exercise_id');
    const blockId = uuidv7();
    await db.execute(
      'insert into workout_exercises (id, workout_id, exercise_id, position, updated_at) values (?, ?, ?, ?, ?)',
      [blockId, workoutId, exerciseId, num(exercise, 'position'), updatedAt],
    );
    const weight = await lastWeight(db, exerciseId);
    const target = Math.max(1, num(exercise, 'target_sets') || 3);
    for (let index = 0; index < target; index += 1) {
      await db.execute(
        'insert into sets (id, workout_exercise_id, set_index, kind, weight, reps, completed, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv7(), blockId, index, 'normal', weight, 0, 0, updatedAt],
      );
    }
  }
  return workoutId;
}

export async function addExercise(db: DB, workoutId: string, exerciseId: string): Promise<void> {
  const positions = await db.getAll<Row>(
    'select position from workout_exercises where workout_id = ? and deleted_at is null order by position desc limit 1',
    [workoutId],
  );
  const position = positions[0] ? num(positions[0], 'position') + 1 : 0;
  const blockId = uuidv7();
  const updatedAt = nowIso();
  await db.execute(
    'insert into workout_exercises (id, workout_id, exercise_id, position, updated_at) values (?, ?, ?, ?, ?)',
    [blockId, workoutId, exerciseId, position, updatedAt],
  );
  const weight = await lastWeight(db, exerciseId);
  for (let index = 0; index < 3; index += 1) {
    await db.execute(
      'insert into sets (id, workout_exercise_id, set_index, kind, weight, reps, completed, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv7(), blockId, index, 'normal', weight, 0, 0, updatedAt],
    );
  }
}

export async function getOpenWorkoutId(db: DB): Promise<string | null> {
  const rows = await db.getAll<Row>(
    'select id from workouts where ended_at is null and deleted_at is null order by started_at desc limit 1',
  );
  return rows[0] ? str(rows[0], 'id') : null;
}

async function previousLabel(db: DB, exerciseId: string, workoutId: string): Promise<string | null> {
  const rows = await db.getAll<Row>(
    `select w.started_at as started_at, s.weight as weight, s.reps as reps, s.completed as completed
     from sets s
     join workout_exercises we on we.id = s.workout_exercise_id
     join workouts w on w.id = we.workout_id
     where we.exercise_id = ? and w.id != ? and s.deleted_at is null and w.deleted_at is null and w.ended_at is not null`,
    [exerciseId, workoutId],
  );
  const sessions = new Map<string, { weight: number; reps: number; completed: boolean }[]>();
  for (const row of rows) {
    const key = str(row, 'started_at');
    const list = sessions.get(key) ?? [];
    list.push({ weight: num(row, 'weight'), reps: num(row, 'reps'), completed: num(row, 'completed') === 1 });
    sessions.set(key, list);
  }
  const previous = previousPerformance(
    [...sessions.entries()].map(([performedAt, sets]) => ({ performedAt, sets })),
  );
  if (!previous) return null;
  return previous.sets
    .filter((set) => set.completed !== false && set.reps > 0)
    .map((set) => `${set.weight}×${set.reps}`)
    .join('  ');
}

export async function getWorkout(db: DB, workoutId: string): Promise<WorkoutDetail | null> {
  const workouts = await db.getAll<Row>('select * from workouts where id = ? and deleted_at is null', [workoutId]);
  const workout = workouts[0];
  if (!workout) return null;
  const exercises = await db.getAll<Row>(
    'select * from workout_exercises where workout_id = ? and deleted_at is null order by position',
    [workoutId],
  );
  const sets = await db.getAll<Row>(
    `select s.* from sets s
     join workout_exercises we on we.id = s.workout_exercise_id
     where we.workout_id = ? and s.deleted_at is null
     order by s.set_index`,
    [workoutId],
  );
  const blocks: ExerciseBlock[] = [];
  for (const exercise of exercises) {
    const exerciseId = str(exercise, 'exercise_id');
    const catalog = getExercise(exerciseId);
    blocks.push({
      id: str(exercise, 'id'),
      exerciseId,
      name: catalog?.name ?? exerciseId,
      restSeconds: catalog?.defaultRestSec ?? 120,
      previous: await previousLabel(db, exerciseId, workoutId),
      sets: sets
        .filter((set) => str(set, 'workout_exercise_id') === str(exercise, 'id'))
        .map((set) => ({
          id: str(set, 'id'),
          setIndex: num(set, 'set_index'),
          weight: num(set, 'weight'),
          reps: num(set, 'reps'),
          completed: num(set, 'completed') === 1,
          kind: str(set, 'kind') || 'normal',
        })),
    });
  }
  return {
    id: str(workout, 'id'),
    name: str(workout, 'name'),
    startedAt: str(workout, 'started_at'),
    endedAt: strOrNull(workout, 'ended_at'),
    exercises: blocks,
  };
}

export async function completeSet(
  db: DB,
  input: { setId: string; exerciseId: string; workoutId: string; weight: number; reps: number },
): Promise<PRFlags> {
  const updatedAt = nowIso();
  await db.execute(
    'update sets set weight = ?, reps = ?, completed = 1, completed_at = ?, updated_at = ? where id = ?',
    [input.weight, input.reps, updatedAt, updatedAt, input.setId],
  );
  const history = await db.getAll<Row>(
    `select s.weight as weight, s.reps as reps from sets s
     join workout_exercises we on we.id = s.workout_exercise_id
     where we.exercise_id = ? and s.id != ? and s.completed = 1 and s.deleted_at is null`,
    [input.exerciseId, input.setId],
  );
  return detectPRs(
    { weight: input.weight, reps: input.reps },
    history.map((row) => ({ weight: num(row, 'weight'), reps: num(row, 'reps') })),
  );
}

export async function finishWorkout(db: DB, workoutId: string): Promise<string> {
  const detail = await getWorkout(db, workoutId);
  await db.execute('update workouts set ended_at = ?, updated_at = ? where id = ?', [nowIso(), nowIso(), workoutId]);
  if (!detail) return 'Workout saved.';
  const notes: string[] = [];
  for (const exercise of detail.exercises) {
    const suggestion = suggestProgression({
      sets: exercise.sets.map((set) => ({ weight: set.weight, reps: set.reps, completed: set.completed })),
      repRange: { min: 6, max: 10 },
      increment: 2.5,
    });
    if (suggestion.action !== 'hold') notes.push(`${exercise.name}: ${suggestion.reason}`);
  }
  return notes[0] ?? 'Workout saved.';
}

export async function listHistory(db: DB): Promise<HistoryItem[]> {
  const rows = await db.getAll<Row>(
    `select w.id as id, w.name as name, w.started_at as started_at, w.ended_at as ended_at,
            s.weight as weight, s.reps as reps, s.completed as completed, s.kind as kind
     from workouts w
     left join workout_exercises we on we.workout_id = w.id and we.deleted_at is null
     left join sets s on s.workout_exercise_id = we.id and s.deleted_at is null
     where w.deleted_at is null and w.ended_at is not null
     order by w.started_at desc`,
  );
  const grouped = new Map<string, HistoryItem & { raw: { weight: number; reps: number; completed: boolean; kind: string }[] }>();
  for (const row of rows) {
    const id = str(row, 'id');
    const item = grouped.get(id) ?? {
      id,
      name: str(row, 'name'),
      startedAt: str(row, 'started_at'),
      endedAt: str(row, 'ended_at'),
      volume: 0,
      sets: 0,
      raw: [],
    };
    if (row.weight != null || row.reps != null) {
      item.raw.push({
        weight: num(row, 'weight'),
        reps: num(row, 'reps'),
        completed: num(row, 'completed') === 1,
        kind: str(row, 'kind') || 'normal',
      });
    }
    grouped.set(id, item);
  }
  return [...grouped.values()].map((item) => ({
    id: item.id,
    name: item.name,
    startedAt: item.startedAt,
    endedAt: item.endedAt,
    volume: sessionVolume(item.raw.map((set) => ({ ...set, kind: set.kind as 'normal' }))),
    sets: item.raw.filter((set) => set.completed && set.kind !== 'warmup').length,
  }));
}

export async function weeklyVolume(db: DB): Promise<{ label: string; volume: number }[]> {
  const history = await listHistory(db);
  const buckets = new Map<string, number>();
  for (const item of history) {
    const date = new Date(item.startedAt);
    if (Number.isNaN(date.getTime())) continue;
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    buckets.set(label, (buckets.get(label) ?? 0) + item.volume);
  }
  return [...buckets.entries()]
    .slice(0, 8)
    .reverse()
    .map(([label, volume]) => ({ label, volume }));
}

export async function trainedDays(db: DB): Promise<string[]> {
  const rows = await db.getAll<Row>(
    'select started_at from workouts where ended_at is not null and deleted_at is null',
  );
  return rows.map((row) => str(row, 'started_at').slice(0, 10)).filter(Boolean);
}

export async function muscleHeat(db: DB): Promise<Record<string, number>> {
  const rows = await db.getAll<Row>(
    `select we.exercise_id as exercise_id, count(s.id) as sets
     from workout_exercises we
     join sets s on s.workout_exercise_id = we.id and s.completed = 1 and s.deleted_at is null and s.kind != 'warmup'
     join workouts w on w.id = we.workout_id and w.deleted_at is null and w.ended_at is not null
     where we.deleted_at is null
     group by we.exercise_id`,
  );
  const counts = muscleSetCounts(
    rows.map((row) => {
      const catalog = getExercise(str(row, 'exercise_id'));
      return {
        muscles: catalog?.primary ?? [],
        secondary: catalog?.secondary ?? [],
        completedSets: num(row, 'sets'),
      };
    }),
  );
  return Object.fromEntries(counts.map((item) => [item.muscle, item.sets]));
}

export async function logBodyWeight(db: DB, value: number, unit: Unit): Promise<void> {
  await db.execute(
    'insert into body_metrics (id, kind, value, unit, recorded_at, updated_at) values (?, ?, ?, ?, ?, ?)',
    [uuidv7(), 'weight', value, unit, nowIso(), nowIso()],
  );
}

export async function listBodyWeight(db: DB): Promise<{ value: number; unit: string; recordedAt: string }[]> {
  const rows = await db.getAll<Row>(
    "select value, unit, recorded_at from body_metrics where kind = 'weight' and deleted_at is null order by recorded_at desc limit 30",
  );
  return rows.map((row) => ({ value: num(row, 'value'), unit: str(row, 'unit'), recordedAt: str(row, 'recorded_at') }));
}

export async function bestEstimate(db: DB, exerciseId: string): Promise<number> {
  const rows = await db.getAll<Row>(
    `select s.weight as weight, s.reps as reps from sets s
     join workout_exercises we on we.id = s.workout_exercise_id
     where we.exercise_id = ? and s.completed = 1 and s.deleted_at is null`,
    [exerciseId],
  );
  return rows.reduce((best, row) => Math.max(best, epley1RM(num(row, 'weight'), num(row, 'reps'))), 0);
}

export async function exportBackup(db: DB) {
  const profile = await getProfile(db);
  const [routines, routineExercises, workouts, workoutExercises, sets, bodyMetrics] = await Promise.all([
    db.getAll<Row>('select * from routines where deleted_at is null'),
    db.getAll<Row>('select * from routine_exercises where deleted_at is null'),
    db.getAll<Row>('select * from workouts where deleted_at is null'),
    db.getAll<Row>('select * from workout_exercises where deleted_at is null'),
    db.getAll<Row>('select * from sets where deleted_at is null'),
    db.getAll<Row>('select * from body_metrics where deleted_at is null'),
  ]);
  return {
    version: 1,
    exportedAt: nowIso(),
    profile: profile
      ? {
          id: profile.id,
          name: profile.name,
          goal: profile.goal,
          experience: asExperience(profile.experience),
          trainingDays: profile.trainingDays,
          unit: profile.unit,
          scheme: profile.scheme,
          accentKind: asAccent(profile.accentKind),
          accentSeed: profile.accentSeed,
          restSeconds: profile.restSeconds,
          updatedAt: nowIso(),
        }
      : null,
    routines,
    routineExercises,
    workouts: workouts.map((row) => ({
      id: str(row, 'id'),
      name: str(row, 'name') || 'Workout',
      routineId: strOrNull(row, 'routine_id'),
      startedAt: str(row, 'started_at'),
      endedAt: strOrNull(row, 'ended_at'),
      notes: strOrNull(row, 'notes'),
      updatedAt: str(row, 'updated_at') || nowIso(),
      deletedAt: null,
    })),
    workoutExercises,
    sets: sets.map((row) => ({
      id: str(row, 'id'),
      workoutExerciseId: str(row, 'workout_exercise_id'),
      setIndex: num(row, 'set_index'),
      kind: asKind(str(row, 'kind')),
      weight: num(row, 'weight'),
      reps: num(row, 'reps'),
      completed: num(row, 'completed') === 1,
      completedAt: strOrNull(row, 'completed_at'),
      updatedAt: str(row, 'updated_at') || nowIso(),
      deletedAt: null,
    })),
    bodyMetrics,
  };
}

const TABLES = ['sets', 'workout_exercises', 'workouts', 'routine_exercises', 'routines', 'body_metrics', 'profile'] as const;

export async function importBackup(db: DB, raw: unknown): Promise<void> {
  const backup = backupSchema.parse(raw);
  for (const table of TABLES) {
    await db.execute(`delete from ${table}`);
  }
  if (backup.profile) {
    await saveProfile(db, backup.profile, { seed: false });
  }
  for (const row of backup.routines) await insertRow(db, 'routines', row);
  for (const row of backup.routineExercises) await insertRow(db, 'routine_exercises', row);
  for (const workout of backup.workouts) {
    await db.execute(
      'insert into workouts (id, name, routine_id, started_at, ended_at, notes, updated_at) values (?, ?, ?, ?, ?, ?, ?)',
      [workout.id, workout.name, workout.routineId, workout.startedAt, workout.endedAt, workout.notes, workout.updatedAt],
    );
  }
  for (const row of backup.workoutExercises) await insertRow(db, 'workout_exercises', row);
  for (const set of backup.sets) {
    await db.execute(
      'insert into sets (id, workout_exercise_id, set_index, kind, weight, reps, completed, completed_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [set.id, set.workoutExerciseId, set.setIndex, set.kind, set.weight, set.reps, set.completed ? 1 : 0, set.completedAt, set.updatedAt],
    );
  }
  for (const row of backup.bodyMetrics) await insertRow(db, 'body_metrics', row);
}

async function insertRow(db: DB, table: string, row: Record<string, unknown>): Promise<void> {
  const keys = Object.keys(row).filter((key) => row[key] !== undefined);
  if (keys.length === 0) return;
  const columns = keys.join(', ');
  const marks = keys.map(() => '?').join(', ');
  await db.execute(`insert into ${table} (${columns}) values (${marks})`, keys.map((key) => row[key]));
}

export function catalogSize(): number {
  return EXERCISES.length;
}
