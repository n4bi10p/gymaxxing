-- Gymaxxing sync schema. The client stores the same rows locally in PowerSync.
-- user_id is server-owned. The upload connector sets it; clients do not sync it.

create extension if not exists pgcrypto;

create table if not exists profile (
  id text primary key,
  user_id uuid not null default auth.uid(),
  name text not null default '',
  goal text,
  experience text,
  training_days text not null default '[]',
  unit text not null default 'kg',
  scheme text not null default 'system',
  accent_kind text not null default 'silver',
  accent_seed text,
  rest_seconds integer not null default 120,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists custom_exercises (
  id text primary key,
  user_id uuid not null default auth.uid(),
  name text not null,
  primary_muscles text not null,
  secondary_muscles text not null default '[]',
  equipment text not null default 'other',
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists routines (
  id text primary key,
  user_id uuid not null default auth.uid(),
  name text not null,
  notes text,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists routine_exercises (
  id text primary key,
  user_id uuid not null default auth.uid(),
  routine_id text not null,
  exercise_id text not null,
  position integer not null,
  target_sets integer not null default 3,
  rep_min integer not null default 6,
  rep_max integer not null default 10,
  rest_seconds integer,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists workouts (
  id text primary key,
  user_id uuid not null default auth.uid(),
  name text not null,
  routine_id text,
  started_at timestamptz not null,
  ended_at timestamptz,
  notes text,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists workout_exercises (
  id text primary key,
  user_id uuid not null default auth.uid(),
  workout_id text not null,
  exercise_id text not null,
  position integer not null,
  notes text,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists sets (
  id text primary key,
  user_id uuid not null default auth.uid(),
  workout_exercise_id text not null,
  set_index integer not null,
  kind text not null default 'normal',
  weight double precision not null default 0,
  reps integer not null default 0,
  completed integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists body_metrics (
  id text primary key,
  user_id uuid not null default auth.uid(),
  kind text not null,
  value double precision not null,
  unit text not null,
  recorded_at timestamptz not null,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'profile', 'custom_exercises', 'routines', 'routine_exercises',
    'workouts', 'workout_exercises', 'sets', 'body_metrics'
  ]
  loop
    execute format('alter table %I enable row level security', tbl);
    execute format('drop policy if exists owner_all on %I', tbl);
    execute format(
      'create policy owner_all on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())',
      tbl
    );
  end loop;
end $$;
