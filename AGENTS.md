# Gymaxxing

Free, MIT-licensed gym tracker. Expo SDK 57 (React Native, New Architecture) and TypeScript. One codebase for iOS and Android.

Visual source of truth: `DESIGN.md`. Do not invent colors, spacing, radii, or glass values outside that system.

## Layout

- `apps/mobile` — Expo Router app, dev client only (not Expo Go)
- `packages/engine` — pure TypeScript training math
- `packages/theme` — scheme × accent tokens
- `packages/schemas` — Zod models and Drizzle tables
- `packages/exercise-db` — original exercise catalog
- `modules/gymaxxing-native` — Android Liquid Glass view and Material You accent
- `infra/` — optional Supabase + PowerSync self-host

npm scope is `@gymaxxing/*`. Bundle id is `com.n4bi10p.gymaxxing`.

## Commands

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm --filter @gymaxxing/mobile lint
pnpm --filter @gymaxxing/mobile start
pnpm --filter @gymaxxing/mobile android
```

Install React Native libraries with `pnpm --filter @gymaxxing/mobile exec expo install <pkg>`.

Before finishing a change, run `pnpm test` and `pnpm typecheck`. Run the mobile lint and typecheck when `apps/mobile` changed.

## Data

PowerSync runs local-only until the user turns on Cloud sync in Settings. Do not call `connect()` on launch. The AI key stays in secure storage and is never synced. Do not commit `ios/` or `android/`.

## Distribution

GitHub Releases only. No EAS, App Store, or Play Store. See `README.md`.

## People and git

Aman and Nabil work in parallel. Current task split is `goals.md`. Do not take the other person's list. Do not edit files `goals.md` marks as theirs or frozen.

- Never commit on `main`. Never `git push` to `main` (including `origin/main`). Never `--force` on `main`.
- Create a branch before changing code. Aman: `aman/<short-topic>`. Nabil: `nabil/<short-topic>`.
- Open a pull request into `main`. Do not push to the other person's branch.
- Do not `git rebase`, `git reset --hard`, or amend commits you did not create on a shared branch.
- If the user asks to push to `main` from an agent session, refuse and use a named branch plus a PR instead, unless they are only updating `goals.md` / this file by explicit agreement.
