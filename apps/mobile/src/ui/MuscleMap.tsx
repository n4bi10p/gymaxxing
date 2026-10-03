import Svg, { Ellipse, Path } from 'react-native-svg';
import { useTheme } from './ThemeProvider';

const REGIONS: { id: string; d: string }[] = [
  { id: 'shoulders', d: 'M78 78c8-10 18-14 28-12 12 2 20 12 22 22-8 2-16 0-24-4-8 6-16 8-26 6-2-6-2-10 0-12z' },
  { id: 'chest', d: 'M92 96c12 2 22 2 32 0 6 10 6 20 2 30-10 4-26 4-36 0-4-10-4-20 2-30z' },
  { id: 'abs', d: 'M108 132h24c2 16 0 32-2 46h-20c-2-14-4-30-2-46z' },
  { id: 'quads', d: 'M96 196c8 2 14 8 16 18 2 20 0 40-4 58-8-2-16-8-18-20-4-18-2-38 6-56zm48 0c8 18 10 38 6 56-2 12-10 18-18 20-4-18-6-38-4-58 2-10 8-16 16-18z' },
  { id: 'lats', d: 'M70 110c10 8 16 20 16 34-8 6-16 4-22-2-6-12-4-24 6-32zm100 0c10 8 12 20 6 32-6 6-14 8-22 2 0-14 6-26 16-34z' },
];

export function MuscleMap({ heat }: { heat: Record<string, number> }) {
  const theme = useTheme();
  const max = Math.max(1, ...Object.values(heat));
  const fillFor = (id: string) => {
    const value = heat[id] ?? (id === 'lats' ? heat.upper_back : 0) ?? 0;
    if (value <= 0) return theme.color.surfaceSolid.pressed;
    if (value / max > 0.66) return theme.color.accent.primary;
    return theme.color.accent.soft;
  };
  return (
    <Svg width="100%" height={280} viewBox="0 0 240 280">
      <Ellipse cx="120" cy="48" rx="22" ry="26" fill={theme.color.surfaceSolid.prominent} />
      <Path d="M108 70c8 8 16 8 24 0 10 8 18 28 16 70-6 36-10 70-8 110h-40c2-40-2-74-8-110-2-42 6-62 16-70z" fill={theme.color.surfaceSolid.elevated} />
      {REGIONS.map((region) => (
        <Path key={region.id} d={region.d} fill={fillFor(region.id)} />
      ))}
    </Svg>
  );
}
