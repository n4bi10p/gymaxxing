import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { Theme } from '@gymaxxing/theme';
import { useTheme } from './ThemeProvider';

export function Rim({ radius }: { radius: number }) {
  const theme = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
      }}
    >
      {size.width > 0 ? (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <LinearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={theme.color.rim.start} />
              <Stop offset="1" stopColor={theme.color.rim.end} />
            </LinearGradient>
          </Defs>
          <Rect
            x={0.5}
            y={0.5}
            width={size.width - 1}
            height={size.height - 1}
            rx={radius}
            ry={radius}
            stroke="url(#rim)"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      ) : null}
    </View>
  );
}

export function surfaceFill(
  theme: Theme,
  kind: 'ghost' | 'regular' | 'elevated' | 'prominent',
  solid: boolean,
): string {
  const palette = solid ? theme.color.surfaceSolid : theme.color.surface;
  if (kind === 'ghost') return palette.ghost;
  if (kind === 'elevated') return palette.elevated;
  if (kind === 'prominent') return palette.prominent;
  return palette.regular;
}

export function Plate({
  children,
  radius,
  fill,
  style,
}: {
  children?: React.ReactNode;
  radius: number;
  fill: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ borderRadius: radius, backgroundColor: fill, overflow: 'hidden' }, style]}>
      {children}
      <Rim radius={radius} />
    </View>
  );
}
