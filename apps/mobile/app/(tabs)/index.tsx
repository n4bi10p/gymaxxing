import { useRouter , useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useCallback, useState } from 'react';
import { getProfile, listHistory, startEmptyWorkout, trainedDays, type HistoryItem, type Profile } from '../../src/data/repository';
import { AppText, GlassButton, PrimaryButton, Row, Screen } from '../../src/ui/controls';
import { GlassSurface } from '../../src/ui/GlassSurface';
import { useTheme } from '../../src/ui/ThemeProvider';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const db = usePowerSync();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [days, setDays] = useState<string[]>([]);

  const load = useCallback(() => {
    void Promise.all([getProfile(db), listHistory(db), trainedDays(db)]).then(([nextProfile, nextHistory, nextDays]) => {
      setProfile(nextProfile);
      setHistory(nextHistory);
      setDays(nextDays);
    });
  }, [db]);
  useFocusEffect(load);

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7) + index);
    const key = monday.toISOString().slice(0, 10);
    return { key, label: 'MTWTFSS'[index] ?? '', done: days.includes(key) };
  });

  return (
    <Screen title={profile?.name ? `Hello, ${profile.name}` : 'Today'}>
      <GlassSurface variant="elevated" style={{ padding: theme.space.lg, gap: theme.space.md }}>
        <AppText variant="sectionTitle">Start a session</AppText>
        <AppText variant="bodySmall" color={theme.color.text.secondary}>
          Log the work. The rest of the app stays out of the way.
        </AppText>
        <PrimaryButton
          label="Start workout"
          onPress={() => {
            void startEmptyWorkout(db).then(() => router.push('/workout/active'));
          }}
        />
      </GlassSurface>
      <Row style={{ justifyContent: 'space-between' }}>
        {week.map((day) => (
          <GlassSurface key={day.key} variant={day.done ? 'elevated' : 'ghost'} radius={theme.radii.pill} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <AppText variant="micro" color={day.done ? theme.color.accent.primary : theme.color.text.tertiary}>
              {day.label}
            </AppText>
          </GlassSurface>
        ))}
      </Row>
      <Row>
        <GlassSurface variant="regular" style={{ flex: 1, padding: theme.space.md }}>
          <AppText variant="heroMetric" numeric>
            {history.length}
          </AppText>
          <AppText variant="label" color={theme.color.text.secondary}>
            Workouts
          </AppText>
        </GlassSurface>
        <GlassSurface variant="regular" style={{ flex: 1, padding: theme.space.md }}>
          <AppText variant="heroMetric" numeric>
            {history.reduce((sum, item) => sum + item.sets, 0)}
          </AppText>
          <AppText variant="label" color={theme.color.text.secondary}>
            Sets
          </AppText>
        </GlassSurface>
      </Row>
      <GlassButton label="History" onPress={() => router.push('/history')} />
    </Screen>
  );
}
