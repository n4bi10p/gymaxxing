# Goals

Aman and Nabil own different slices so work does not collide. The product plan is `preplan/Gym_OS_Full_Plan.md`. This file is the **current assignment**, not the whole plan.

Do not start HealthKit, widgets, Live Activities, nutrition, recovery, or the AI coach until the lists below are done.

## Git (both)

- Never commit on `main`. Never push to `main`. Never force-push `main`.
- Land work with a pull request into `main`.
- Branches:
  - Aman: `aman/<short-topic>` (example: `aman/routine-editor`)
  - Nabil: `nabil/<short-topic>` (example: `nabil/exercise-picker`)
- Do not push to the other person's branch. Do not rebase or reset their commits.
- Pull `main` before you start a branch. Keep your branch updated from `main`.
- Shared files below are frozen unless you agree first.

**Frozen for this slice** (do not both edit): `DESIGN.md`, `packages/schemas/**`, `infra/**`, `apps/mobile/src/data/repository.ts`, `apps/mobile/src/data/db.ts`.

## Aman — routines, onboarding, finish summary

Make it possible to create a program and see what a session produced.

1. New / edit / start a routine (sets, rep range, rest, add/remove/reorder exercises).
2. Finish-workout summary screen (volume, PRs, the progression line `finishWorkout` already returns).
3. Onboarding: ask experience and training days instead of hardcoding them.

Own these paths:

- `apps/mobile/app/workout/routine/`
- `apps/mobile/app/(tabs)/workout.tsx`
- `apps/mobile/app/onboarding.tsx`
- `apps/mobile/app/workout/summary.tsx` (new)
- `apps/mobile/src/data/routines.ts` (new — do not pile onto `repository.ts`)

Do not edit Nabil's files.

## Nabil — picker speed and set kinds

Make logging faster without touching the routine editor.

1. Favorites and recently used exercises in the picker (search stays).
2. Warm-up / working / failure / drop set kind on the active workout screen (schema already has `kind`).
3. If favorites need a table, add it in `packages/schemas` **and** `infra/` in the same change. Tell Aman before you touch frozen files.

Own these paths:

- `apps/mobile/app/exercise/pick.tsx`
- `apps/mobile/app/workout/active.tsx`
- `apps/mobile/src/data/library.ts` (new — favorites, recents, set-kind writes)
- `packages/exercise-db/` only if search filters are required for (1)

Do not edit Aman's files.

## Done when

- I can build a routine from scratch and start it.
- I can favorite an exercise and see it first next time.
- I can mark a set as warm-up.
- Finishing a workout opens a summary, not only a toast and a back navigation.
- Setup asks for experience and training days.
- `pnpm test` and `pnpm typecheck` pass. Mobile lint if `apps/mobile` changed.
