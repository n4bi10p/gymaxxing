package expo.modules.gymaxxingnative

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GymaxxingNativeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("GymaxxingNative")

    Function("getSystemAccent") {
      SystemAccent.read(appContext.reactContext)
    }

    View(LiquidGlassView::class) {
      Name("LiquidGlassView")
      Prop("pressed") { view: LiquidGlassView, pressed: Boolean ->
        view.pressed = pressed
        view.invalidate()
      }
    }
  }
}
