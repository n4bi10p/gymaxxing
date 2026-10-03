import { useRouter, useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { getOpenWorkoutId, listRoutines, startEmptyWorkout, type RoutineCard } from '../../src/data/repository';
import { AppText, PrimaryButton, Screen } from '../../src/ui/controls';
import { GlassSurface } from '../../src/ui/GlassSurface';
import { useTheme } from '../../src/ui/ThemeProvider';

export default function WorkoutLibrary() {
  const theme = useTheme();
  const router = useRouter();
  const db = usePowerSync();
  const [routines, setRoutines] = useState<RoutineCard[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(() => {
    void Promise.all([listRoutines(db), getOpenWorkoutId(db)]).then(([next, open]) => {
      setRoutines(next);
      setOpenId(open);
    });
  }, [db]);
  useFocusEffect(load);

  return (
    <Screen title="Workout">
      {openId ? <PrimaryButton label="Resume workout" onPress={() => router.push('/workout/active')} /> : null}
      {routines.map((routine) => (
        <Pressable key={routine.id} onPress={() => router.push(`/workout/routine/${routine.id}`)}>
          <GlassSurface variant="regular" style={{ padding: theme.space.lg, gap: theme.space.xs }}>
            <AppText variant="cardTitle">{routine.name}</AppText>
            <AppText variant="bodySmall" color={theme.color.text.secondary}>
              {routine.count} exercises
            </AppText>
          </GlassSurface>
        </Pressable>
      ))}
      <PrimaryButton
        label="Empty workout"
        onPress={() => {
          void startEmptyWorkout(db).then(() => router.push('/workout/active'));
        }}
      />
    </Screen>
  );
}
