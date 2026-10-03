import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useState } from 'react';
import { View } from 'react-native';
import { AppText, Row } from './controls';
import { useTheme } from './ThemeProvider';

export function VolumeChart({ points }: { points: { label: string; volume: number }[] }) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const height = 140;
  const max = Math.max(1, ...points.map((point) => point.volume));
  const path = Skia.Path.Make();
  points.forEach((point, index) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * (width - 8) + 4;
    const y = height - 16 - (point.volume / max) * (height - 32);
    if (index === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  });
  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && points.length > 0 ? (
        <Canvas style={{ width, height }}>
          <Path path={path} style="stroke" strokeWidth={2.5} color={theme.color.accent.primary} />
        </Canvas>
      ) : (
        <AppText variant="bodySmall" color={theme.color.text.tertiary}>
          Volume shows up after the first finished workout.
        </AppText>
      )}
      <Row style={{ justifyContent: 'space-between' }}>
        {points.slice(0, 4).map((point) => (
          <AppText key={point.label} variant="micro" color={theme.color.text.tertiary}>
            {point.label}
          </AppText>
        ))}
      </Row>
    </View>
  );
}
