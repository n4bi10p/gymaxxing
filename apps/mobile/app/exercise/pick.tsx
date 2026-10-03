import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { searchExercises } from '@gymaxxing/exercise-db';
import { addExercise } from '../../src/data/repository';
import { AppText, Field, Screen } from '../../src/ui/controls';
import { GlassSurface } from '../../src/ui/GlassSurface';
import { useTheme } from '../../src/ui/ThemeProvider';

export default function PickExercise() {
  const theme = useTheme();
  const router = useRouter();
  const db = usePowerSync();
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const [text, setText] = useState('');
  const results = useMemo(() => searchExercises({ text }).slice(0, 30), [text]);

  return (
    <Screen title="Add exercise">
      <Field value={text} onChangeText={setText} placeholder="Search" />
      {results.map((exercise) => (
        <Pressable
          key={exercise.id}
          onPress={() => {
            if (!workoutId) return;
            void addExercise(db, workoutId, exercise.id).then(() => router.back());
          }}
        >
          <GlassSurface variant="ghost" style={{ padding: theme.space.md, gap: theme.space.xxs }}>
            <AppText variant="cardTitle">{exercise.name}</AppText>
            <AppText variant="micro" color={theme.color.text.tertiary}>
              {exercise.equipment} · {exercise.primary.join(', ')}
            </AppText>
          </GlassSurface>
        </Pressable>
      ))}
    </Screen>
  );
}
