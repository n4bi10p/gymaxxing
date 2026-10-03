import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartNoAxesCombined, Dumbbell, House, UserRound } from 'lucide-react-native';
import { AppText } from './controls';
import { GlassSurface } from './GlassSurface';
import { useTheme } from './ThemeProvider';

const ICONS = {
  index: House,
  workout: Dumbbell,
  progress: ChartNoAxesCombined,
  profile: UserRound,
} as const;

interface FloatingTabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
}

export function FloatingTabBar({ state, navigation }: FloatingTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ position: 'absolute', left: theme.space.lg, right: theme.space.lg, bottom: insets.bottom + theme.space.xs }}>
      <GlassSurface backdrop variant="elevated" radius={theme.radii.xxl} style={{ flexDirection: 'row', padding: theme.space.xs }}>
        {state.routes.map((route, index) => {
          const active = state.index === index;
          const Icon = ICONS[route.name as keyof typeof ICONS] ?? House;
          const color = active ? theme.color.accent.primary : theme.color.text.tertiary;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              onPress={() => navigation.navigate(route.name)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: theme.space.sm,
                borderRadius: theme.radii.pill,
                backgroundColor: active ? theme.color.accent.soft : 'transparent',
              }}
            >
              <Icon color={color} size={22} strokeWidth={1.75} />
              <AppText variant="micro" color={color}>
                {route.name === 'index' ? 'Home' : route.name[0]?.toUpperCase() + route.name.slice(1)}
              </AppText>
            </Pressable>
          );
        })}
      </GlassSurface>
    </View>
  );
}
