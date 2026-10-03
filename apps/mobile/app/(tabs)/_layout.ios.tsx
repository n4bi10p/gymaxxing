import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { MiniWorkoutBar } from '../../src/ui/MiniWorkoutBar';
import { useActiveWorkout } from '../../src/state/active';
import { useTheme } from '../../src/ui/ThemeProvider';

function Accessory() {
  const active = useActiveWorkout();
  if (!active) return null;
  return <MiniWorkoutBar name={active.name} startedAt={active.startedAt} />;
}

export default function IosTabs() {
  const theme = useTheme();
  const active = useActiveWorkout();
  return (
    <NativeTabs tintColor={theme.color.accent.primary} minimizeBehavior="onScrollDown">
      {active ? (
        <NativeTabs.BottomAccessory>
          <Accessory />
        </NativeTabs.BottomAccessory>
      ) : null}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="workout">
        <NativeTabs.Trigger.Label>Workout</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="dumbbell.fill" md="fitness_center" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar.fill" md="insights" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
