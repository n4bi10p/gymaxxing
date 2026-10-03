import { loadLiquidGlassView } from '@gymaxxing/native';
import { OpaqueGlass, type GlassSurfaceProps } from './OpaqueGlass';
import { Plate, surfaceFill } from './chrome';
import { useTheme } from './ThemeProvider';
import { useGlassTier } from './useGlassTier';

const NativeGlass = loadLiquidGlassView();

export function GlassSurface({
  children,
  variant = 'regular',
  backdrop = false,
  radius,
  style,
  pressed = false,
}: GlassSurfaceProps) {
  const theme = useTheme();
  const tier = useGlassTier();
  const corner = radius ?? (backdrop ? theme.radii.xxl : theme.radii.xl);
  if (backdrop && tier === 'B' && NativeGlass) {
    return (
      <NativeGlass pressed={pressed} style={[{ borderRadius: corner, overflow: 'hidden' }, style]}>
        <Plate radius={corner} fill={surfaceFill(theme, 'elevated', false)} style={style}>
          {children}
        </Plate>
      </NativeGlass>
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
