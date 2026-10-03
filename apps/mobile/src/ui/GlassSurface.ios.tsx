import { GlassView } from 'expo-glass-effect';
import { OpaqueGlass, type GlassSurfaceProps } from './OpaqueGlass';
import { Plate, surfaceFill } from './chrome';
import { useTheme } from './ThemeProvider';
import { useGlassTier } from './useGlassTier';

export function GlassSurface({
  children,
  variant = 'regular',
  backdrop = false,
  radius,
  style,
}: GlassSurfaceProps) {
  const theme = useTheme();
  const tier = useGlassTier();
  const corner = radius ?? (backdrop ? theme.radii.xxl : theme.radii.xl);
  if (backdrop && tier === 'A') {
    return (
      <GlassView
        glassEffectStyle={variant === 'prominent' ? 'regular' : 'clear'}
        colorScheme={theme.scheme}
        isInteractive
        style={[{ borderRadius: corner, overflow: 'hidden' }, style]}
      >
        {children}
      </GlassView>
    );
  }
  if (!backdrop) {
    return (
      <Plate radius={corner} fill={surfaceFill(theme, variant, false)} style={style}>
        {children}
      </Plate>
    );
  }
  return (
    <OpaqueGlass variant={variant} radius={corner} style={style}>
      {children}
    </OpaqueGlass>
  );
}
