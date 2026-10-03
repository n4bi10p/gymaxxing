import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Storage from 'expo-sqlite/kv-store';
import { PowerSyncContext } from '@powersync/react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { connectCloud } from '../src/data/sync';
import { database, openDatabase } from '../src/data/db';
import { ActiveWorkoutProvider } from '../src/state/active';
import { AppText } from '../src/ui/controls';
import { ThemeProvider, useTheme } from '../src/ui/ThemeProvider';

function Gate({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    openDatabase()
      .then(async () => {
        if (Storage.getItemSync('sync-mode') === 'cloud') {
          await connectCloud().catch(() => undefined);
        }
        setReady(true);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'The local database did not open.'));
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.color.background.primary, justifyContent: 'center', padding: theme.space.xl }}>
        <AppText>{error}</AppText>
      </View>
    );
  }
  if (!ready) return <View style={{ flex: 1, backgroundColor: theme.color.background.primary }} />;
  return (
    <PowerSyncContext.Provider value={database}>
      <ActiveWorkoutProvider>{children}</ActiveWorkoutProvider>
    </PowerSyncContext.Provider>
  );
}

function Root() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Gate>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.color.background.primary } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="workout/active" options={{ presentation: 'modal' }} />
          <Stack.Screen name="workout/routine/[id]" />
          <Stack.Screen name="exercise/pick" options={{ presentation: 'modal' }} />
          <Stack.Screen name="history" />
          <Stack.Screen name="body" />
          <Stack.Screen name="design-system" />
        </Stack>
      </Gate>
    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}
