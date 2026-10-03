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
