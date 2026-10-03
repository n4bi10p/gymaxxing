import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useEffect, useState } from 'react';
import { getExercise } from '@gymaxxing/exercise-db';
import { startRoutine } from '../../../src/data/repository';
import { AppText, PrimaryButton, Screen } from '../../../src/ui/controls';
import { GlassSurface } from '../../../src/ui/GlassSurface';
import { useTheme } from '../../../src/ui/ThemeProvider';

export default function RoutineDetail() {
  const theme = useTheme();
  const router = useRouter();
  const db = usePowerSync();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState('Routine');
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    void db
      .getAll<{ name: string }>('select name from routines where id = ?', [id])
      .then(async (rows) => {
        setName(rows[0]?.name ?? 'Routine');
        const exercises = await db.getAll<{ exercise_id: string }>(
          'select exercise_id from routine_exercises where routine_id = ? and deleted_at is null order by position',
          [id],
        );
        setLines(exercises.map((row) => getExercise(row.exercise_id)?.name ?? row.exercise_id));
      });
  }, [db, id]);

  return (
    <Screen title={name}>
      {lines.map((line) => (
        <GlassSurface key={line} variant="regular" style={{ padding: theme.space.md }}>
          <AppText>{line}</AppText>
        </GlassSurface>
      ))}
      <PrimaryButton
        label="Start"
        onPress={() => {
          if (!id) return;
          void startRoutine(db, id).then(() => router.push('/workout/active'));
        }}
      />
    </Screen>
  );
}
