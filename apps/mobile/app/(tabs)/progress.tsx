import { useRouter, useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useCallback, useState } from 'react';
import { muscleHeat, weeklyVolume } from '../../src/data/repository';
import { AppText, GlassButton, Screen } from '../../src/ui/controls';
import { GlassSurface } from '../../src/ui/GlassSurface';
import { MuscleMap } from '../../src/ui/MuscleMap';
import { useTheme } from '../../src/ui/ThemeProvider';
import { VolumeChart } from '../../src/ui/VolumeChart';

export default function Progress() {
  const theme = useTheme();
  const router = useRouter();
  const db = usePowerSync();
  const [points, setPoints] = useState<{ label: string; volume: number }[]>([]);
  const [heat, setHeat] = useState<Record<string, number>>({});
  const load = useCallback(() => {
    void Promise.all([weeklyVolume(db), muscleHeat(db)]).then(([nextPoints, nextHeat]) => {
      setPoints(nextPoints);
      setHeat(nextHeat);
    });
  }, [db]);
  useFocusEffect(load);

  return (
    <Screen title="Progress">
      <GlassSurface variant="regular" style={{ padding: theme.space.lg, gap: theme.space.sm }}>
        <AppText variant="cardTitle">Volume</AppText>
        <VolumeChart points={points} />
      </GlassSurface>
      <GlassSurface variant="regular" style={{ padding: theme.space.md }}>
        <AppText variant="cardTitle">Muscles</AppText>
        <MuscleMap heat={heat} />
      </GlassSurface>
      <GlassButton label="Body weight" onPress={() => router.push('/body')} />
    </Screen>
  );
}
