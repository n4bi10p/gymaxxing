import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Theme } from '@gymaxxing/theme';
import { GlassSurface } from './GlassSurface';
import { useTheme } from './ThemeProvider';

type Variant = keyof Theme['type'];

export function AppText({
  children,
  variant = 'body',
  color,
  style,
  numeric,
}: {
  children: ReactNode;
  variant?: Variant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numeric?: boolean;
}) {
  const theme = useTheme();
  const spec = theme.type[variant];
  return (
    <Text
      maxFontSizeMultiplier={variant === 'heroMetric' || variant === 'display' ? 1.2 : 1.6}
      style={[
        {
          color: color ?? theme.color.text.primary,
          fontSize: spec.size,
          lineHeight: spec.lineHeight,
          fontWeight: spec.weight,
          letterSpacing: spec.tracking,
          fontVariant: numeric ? ['tabular-nums'] : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Screen({
  children,
  scroll = true,
  title,
}: {
  children: ReactNode;
  scroll?: boolean;
  title?: string;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const content = (
    <View style={{ paddingHorizontal: theme.space.lg, paddingBottom: insets.bottom + theme.space.section + theme.space.xl, gap: theme.space.lg }}>
      {title ? (
        <AppText variant="screenTitle" style={{ paddingTop: insets.top + theme.space.sm }}>
          {title}
        </AppText>
      ) : (
        <View style={{ height: insets.top }} />
      )}
      {children}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: theme.color.background.primary }}>
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.color.accent.glow, opacity: 0.35 }]}
      />
      {scroll ? <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{content}</ScrollView> : content}
    </View>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: theme.color.cta.fill,
          borderRadius: theme.radii.pill,
          minHeight: 54,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.space.xl,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <AppText variant="cardTitle" color={theme.color.cta.onFill}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function GlassButton({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <GlassSurface variant="regular" radius={theme.radii.pill} style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.space.lg }}>
        <AppText variant="bodySmall">{label}</AppText>
      </GlassSurface>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <GlassSurface
        variant={selected ? 'elevated' : 'ghost'}
        radius={theme.radii.pill}
        style={{
          paddingHorizontal: theme.space.md,
          paddingVertical: theme.space.xs,
          backgroundColor: selected ? theme.color.accent.soft : undefined,
        }}
      >
        <AppText variant="bodySmall" color={selected ? theme.color.text.primary : theme.color.text.secondary}>
          {label}
        </AppText>
      </GlassSurface>
    </Pressable>
  );
}

export function Field({
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'decimal-pad' | 'number-pad';
}) {
  const theme = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.color.text.disabled}
      keyboardType={keyboardType}
      autoCapitalize="none"
      style={{
        color: theme.color.text.primary,
        backgroundColor: theme.color.surface.regular,
        borderRadius: theme.radii.md,
        paddingHorizontal: theme.space.md,
        paddingVertical: theme.space.sm,
        fontSize: theme.type.body.size,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.color.border.default,
      }}
    />
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }, style]}>{children}</View>;
}
