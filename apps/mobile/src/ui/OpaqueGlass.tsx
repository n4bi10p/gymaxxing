import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Plate, surfaceFill } from './chrome';
import { useTheme } from './ThemeProvider';

export interface GlassSurfaceProps {
  children?: ReactNode;
  variant?: 'ghost' | 'regular' | 'elevated' | 'prominent';
  backdrop?: boolean;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  pressed?: boolean;
}

export function OpaqueGlass({ children, variant = 'regular', radius, style }: GlassSurfaceProps) {
  const theme = useTheme();
  const corner = radius ?? theme.radii.xl;
  return (
    <Plate radius={corner} fill={surfaceFill(theme, variant, true)} style={style}>
      {children}
    </Plate>
  );
}
