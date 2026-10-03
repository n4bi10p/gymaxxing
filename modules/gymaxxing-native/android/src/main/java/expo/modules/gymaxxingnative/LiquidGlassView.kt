package expo.modules.gymaxxingnative

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RuntimeShader
import android.os.Build
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

/**
 * Tier B glass: a translucent plate plus an AGSL specular rim.
 * The rim is drawn behind children so labels stay sharp.
 * Live backdrop sampling is intentionally not done here; blurring the view
 * itself would also blur the text. See docs/spikes/android-glass.md.
 */
class LiquidGlassView(context: android.content.Context, appContext: AppContext) : ExpoView(context, appContext) {
  var pressed: Boolean = false
  private val fill = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = 0x17FFFFFF }
  private val shaderPaint = Paint(Paint.ANTI_ALIAS_FLAG)
  private val shader: RuntimeShader? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    try {
    RuntimeShader(
      """
      uniform float2 size;
      uniform float pressed;
      half4 main(float2 coord) {
        float2 uv = coord / size;
        float edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
        float rim = smoothstep(0.045, 0.0, edge);
        float2 light = float2(0.18, 0.12);
        float spec = pow(clamp(1.0 - length((uv - light) * float2(1.4, 1.8)), 0.0, 1.0), 2.2);
        float chroma = pressed * rim * 0.15;
        half3 color = half3(1.0 + chroma, 1.0, 1.0 - chroma);
        return half4(color, rim * 0.42 + spec * 0.16);
      }
      """.trimIndent(),
    )
    } catch (_: Throwable) {
      null
    }
  } else {
    null
  }

  init {
    setWillNotDraw(false)
  }

  override fun onDraw(canvas: Canvas) {
    val radius = height.coerceAtMost(width) / 2f
    canvas.drawRoundRect(0f, 0f, width.toFloat(), height.toFloat(), radius, radius, fill)
    val agsl = shader
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && agsl != null && width > 0 && height > 0) {
      agsl.setFloatUniform("size", width.toFloat(), height.toFloat())
      agsl.setFloatUniform("pressed", if (pressed) 1f else 0f)
      shaderPaint.shader = agsl
      canvas.drawRoundRect(0f, 0f, width.toFloat(), height.toFloat(), radius, radius, shaderPaint)
    }
    super.onDraw(canvas)
  }
}
