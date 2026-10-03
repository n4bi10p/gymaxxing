import { useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useCallback, useState } from 'react';
import { listHistory, type HistoryItem } from '../src/data/repository';
import { AppText, Screen } from '../src/ui/controls';
import { GlassSurface } from '../src/ui/GlassSurface';
import { useTheme } from '../src/ui/ThemeProvider';

export default function History() {
  const theme = useTheme();
  const db = usePowerSync();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const load = useCallback(() => {
    void listHistory(db).then(setItems);
  }, [db]);
  useFocusEffect(load);
  return (
    <Screen title="History">
      {items.length === 0 ? <AppText color={theme.color.text.secondary}>No workouts yet. Your training history starts with the first session.</AppText> : null}
      {items.map((item) => (
        <GlassSurface key={item.id} variant="regular" style={{ padding: theme.space.md, gap: theme.space.xxs }}>
          <AppText variant="cardTitle">{item.name}</AppText>
          <AppText variant="bodySmall" color={theme.color.text.secondary}>
            {item.sets} sets · {Math.round(item.volume)} volume
          </AppText>
        </GlassSurface>
      ))}
    </Screen>
  );
}
