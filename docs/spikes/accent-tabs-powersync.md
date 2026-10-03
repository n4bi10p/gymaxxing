# Spikes: accent, native tabs, PowerSync local boot

## Material You

`@gymaxxing/native` reads `system_accent1_200` in night mode and `system_accent1_700` otherwise (Android 12+). The JS theme uses that hex as the accent seed when the user picks System, then runs the same contrast check as every other accent. If the read returns null, the accent is Silver. Wallpaper changes recreate the activity; appearance is re-read on scheme changes.

This was not verified against a live wallpaper because no phone was connected.

## Native tabs

iOS uses `expo-router/unstable-native-tabs` (the SDK 57 path). `NativeTabs.BottomAccessory` hosts the mini workout bar. `minimizeBehavior` is `onScrollDown`. Android keeps the floating glass dock in `_layout.android.tsx`. A plain `_layout.tsx` re-exports the Android dock so a missing platform file still builds.

## PowerSync local-only

`src/data/db.ts` constructs `PowerSyncDatabase` with the Drizzle schema and `gymaxxing.sqlite`. `openDatabase()` calls `init()` and does not call `connect()`. Cloud sync calls `connect()` only after Settings is set to Cloud sync and a Supabase session exists. Create, read, and write go through `src/data/repository.ts`.

A phone boot of op-sqlite was not run here. The JS schema and repository typecheck against the installed PowerSync 2.3 packages. The first `pnpm android` on a device is the runtime check: start a workout, kill the app, reopen, and confirm the set is still there with sync still disconnected.
