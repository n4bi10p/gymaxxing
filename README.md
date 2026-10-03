# Gymaxxing

A personal training log for iOS and Android. It is free, open source (MIT), and works fully offline. Cloud sync is optional.

The interface follows the phone: pitch black or porcelain, a silver default accent, an accent picker on both platforms, Material You on Android, native Liquid Glass on iOS 26, and a glass dock on Android.

## Develop

Requirements: Node 22+, pnpm 10, a JDK 21, and the Android SDK.

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm --filter @gymaxxing/mobile start
pnpm --filter @gymaxxing/mobile android
```

`ANDROID_HOME` should point at the SDK (`$HOME/Android/Sdk` on this project machine). Java 21 is the JDK used for local and CI Android builds. Expo's Gradle 9.3.1 runs on that JDK.

There is no Xcode on Linux. JavaScript reloads over LAN Metro after a dev client is installed. Native changes need a new build.

Do not commit the generated `ios/` or `android/` directories.

## Install a release

Releases on GitHub include:

- an Android APK, signed with the keystore stored in GitHub Actions secrets
- an unsigned iOS IPA built on a `macos-26` runner

### Android

Download the APK from the release and install it. Enable install from the browser or files app if Android asks.

### iPhone (iOS 26.6.2, free Apple ID)

1. Install LocalDevVPN from the App Store.
2. Install SideStore **nightly** (the stable build fails to pair on iOS 26.6). Use iLoader 2.3.1 or newer, or Plume Impactor / Sideloader from Linux, to sideload SideStore once.
3. Sideload `Gymaxxing-unsigned.ipa` with SideStore and refresh with LocalDevVPN.

A free Apple ID signs for 7 days, allows 3 apps, and allows 10 App IDs per week. Export a backup from Settings before the signature expires so a reinstall does not drop training history.

Health, widgets, and Live Activities stay off until a sideloaded build proves a free Apple ID can sign those entitlements. See `docs/spikes/ios-capabilities.md`.

## Data

Local only is the default. Settings → Data & Sync can point the app at your own Supabase and PowerSync service. `infra/README.md` explains that setup. The coach API key never leaves the device keychain.

## Layout

`DESIGN.md` is the visual contract. `packages/engine` is the training math. `AGENTS.md` is the note for coding agents.
