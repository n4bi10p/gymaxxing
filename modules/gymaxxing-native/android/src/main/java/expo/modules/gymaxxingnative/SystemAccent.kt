package expo.modules.gymaxxingnative

import android.content.Context
import android.content.res.Configuration
import android.os.Build

object SystemAccent {
  fun read(context: Context?): String? {
    if (context == null || Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return null
    val night = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK ==
      Configuration.UI_MODE_NIGHT_YES
    val id = if (night) android.R.color.system_accent1_200 else android.R.color.system_accent1_700
    val color = context.getColor(id)
    return String.format("#%06X", 0xFFFFFF and color)
  }
}
