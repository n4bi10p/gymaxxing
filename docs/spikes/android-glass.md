# Spike: Android Liquid Glass

No Android phone was attached (`adb devices` was empty), so 60 fps was not measured. The module is in the tree and the UI falls back if it is absent.

## Comparison

- Community Expo modules (`@uginy/react-native-liquid-glass` and similar) wrap AGSL or native blur, but they also own the iOS path. Gymaxxing already uses `expo-glass-effect` on iOS 26, so a second iOS implementation would stack materials.
- Kyant0's Compose Backdrop can sample the backdrop. Vendoring it needs a license check and a Compose host inside React Native, which is more than this spike should take before a device is available.
- The in-house module `@gymaxxing/native` draws a translucent plate and an AGSL specular rim on Android 13+ (`LiquidGlassView`). It does not blur the text, and it does not sample the window backdrop. That keeps labels sharp. It is the Tier B stand-in until a device pass either accepts it or replaces the drawable with a backdrop blur.

## Gate

On the Android 15 phone, scroll a screen with one backdrop glass dock and the mini workout bar. The bar is 60 fps and a readable match to iOS glass. If it misses, `useGlassTier` already drops to Tier D on repeated slow frames, and Settings can force Reduced glass.

`GlassSurface` is the only component screens use, so the drawable can be swapped without rewriting screens.
