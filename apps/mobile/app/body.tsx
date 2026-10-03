import { useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useCallback, useState } from 'react';
import { getProfile, listBodyWeight, logBodyWeight } from '../src/data/repository';
import { AppText, Field, PrimaryButton, Screen } from '../src/ui/controls';
import { useTheme } from '../src/ui/ThemeProvider';

export default function Body() {
  const theme = useTheme();
  const db = usePowerSync();
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [entries, setEntries] = useState<{ value: number; unit: string; recordedAt: string }[]>([]);
  const load = useCallback(() => {
    void Promise.all([getProfile(db), listBodyWeight(db)]).then(([profile, next]) => {
      if (profile) setUnit(profile.unit);
      setEntries(next);
    });
  }, [db]);
  useFocusEffect(load);
  return (
    <Screen title="Body">
      <Field value={value} onChangeText={setValue} placeholder={unit} keyboardType="decimal-pad" />
      <PrimaryButton
        label="Save weight"
        onPress={() => {
          const parsed = Number(value);
          if (!Number.isFinite(parsed) || parsed <= 0) return;
          void logBodyWeight(db, parsed, unit).then(() => {
            setValue('');
            load();
          });
        }}
      />
      {entries.map((entry) => (
        <AppText key={entry.recordedAt} color={theme.color.text.secondary}>
          {entry.value} {entry.unit} · {entry.recordedAt.slice(0, 10)}
        </AppText>
      ))}
    </Screen>
  );
}
