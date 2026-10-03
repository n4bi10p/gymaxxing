import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Row } from './controls';
import { GlassSurface } from './GlassSurface';
import { restRemaining, useRest } from '../state/rest';
import { useTheme } from './ThemeProvider';

export function MiniWorkoutBar({ name, startedAt }: { name: string; startedAt: string }) {
  const theme = useTheme();
  const router = useRouter();
  const endsAt = useRest((state) => state.endsAt);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const immediate = setTimeout(tick, 0);
    const timer = setInterval(tick, 500);
    return () => {
      clearTimeout(immediate);
      clearInterval(timer);
    };
  }, []);
  const elapsed = now == null ? 0 : Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  const rest = restRemaining(endsAt, now ?? 0);
  return (
    <Pressable onPress={() => router.push('/workout/active')}>
      <GlassSurface backdrop variant="elevated" radius={theme.radii.lg} style={{ paddingHorizontal: theme.space.md, paddingVertical: theme.space.sm }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="cardTitle" numeric>
            {minutes}:{seconds}
          </AppText>
          <AppText variant="bodySmall" color={theme.color.text.secondary}>
            {name} · {rest > 0 ? `Rest ${rest}s` : 'In progress'}
          </AppText>
          <AppText variant="label" color={theme.color.accent.primary}>
            Resume
          </AppText>
        </Row>
      </GlassSurface>
    </Pressable>
  );
}
