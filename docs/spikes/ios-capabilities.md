# Spike: free Apple ID on iOS 26.6.2

The iPhone was not attached to this Linux machine, and there is no Xcode here, so this spike could not be executed on device. The default build follows the conservative outcome from the plan: ship without the entitlements a free Apple ID may refuse to sign.

## Decision

Keep these out of the default target until a sideloaded build on the iPhone proves they sign:

- HealthKit
- App Groups
- Widget extension
- Live Activities

`src/health/HealthProvider.ts` is the seam. The current provider reports health as unavailable. Widgets and the lock-screen rest timer stay unimplemented until the gate passes. The in-app rest timer and the mini workout bar do not need those entitlements.

## What to run on the iPhone

1. Install SideStore nightly with iLoader 2.3.1+ or Plume Impactor, plus LocalDevVPN.
2. Build a dev-client IPA from the `iOS unsigned IPA` workflow and sideload it.
3. Confirm the dev client launches and Metro reloads JavaScript.
4. Only then add one entitlement at a time (HealthKit read, App Group + widget, Live Activity) and rebuild. A free Apple ID allows 10 App IDs per week, and each extension consumes one.

If a capability fails to sign, leave it out. If none of the app itself signs, the fallback is the paid Apple Developer Program.

Hermes does not need JIT, so the iOS 26.6 JIT restriction does not block this app.
