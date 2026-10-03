import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActiveWorkout } from '../../src/state/active';
import { FloatingTabBar } from '../../src/ui/FloatingTabBar';
import { MiniWorkoutBar } from '../../src/ui/MiniWorkoutBar';
import { useTheme } from '../../src/ui/ThemeProvider';

export default function AndroidTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const active = useActiveWorkout();
  return (
    <View style={{ flex: 1, backgroundColor: theme.color.background.primary }}>
      <Tabs
        tabBar={(props) => <FloatingTabBar state={props.state} navigation={props.navigation} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.color.background.primary } }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="workout" options={{ title: 'Workout' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
      {active ? (
        <View style={{ position: 'absolute', left: theme.space.lg, right: theme.space.lg, bottom: insets.bottom + 84 }}>
          <MiniWorkoutBar name={active.name} startedAt={active.startedAt} />
        </View>
      ) : null}
    </View>
  );
}
