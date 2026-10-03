import { PRESET_SEEDS } from '@gymaxxing/theme';
import { AppText, Chip, GlassButton, PrimaryButton, Row, Screen } from '../src/ui/controls';
import { GlassSurface } from '../src/ui/GlassSurface';
import { useAppearance , useTheme } from '../src/ui/ThemeProvider';
import { useGlassTier } from '../src/ui/useGlassTier';

export default function DesignSystem() {
  const theme = useTheme();
  const tier = useGlassTier();
  const { appearance, setAppearance } = useAppearance();
  return (
    <Screen title="Design system">
      <AppText variant="bodySmall" color={theme.color.text.secondary}>
        Scheme {theme.scheme}. Glass tier {tier}. Accent {theme.color.accent.primary}.
      </AppText>
      <Row>
        <Chip label="System" selected={appearance.scheme === 'system'} onPress={() => setAppearance({ scheme: 'system' })} />
        <Chip label="Dark" selected={appearance.scheme === 'dark'} onPress={() => setAppearance({ scheme: 'dark' })} />
        <Chip label="Light" selected={appearance.scheme === 'light'} onPress={() => setAppearance({ scheme: 'light' })} />
      </Row>
      <Row>
        <Chip label="Silver" selected={appearance.accent.kind === 'silver'} onPress={() => setAppearance({ accent: { kind: 'silver' } })} />
        {(Object.keys(PRESET_SEEDS) as (keyof typeof PRESET_SEEDS)[]).map((id) => (
          <Chip key={id} label={id} selected={appearance.accent.kind === 'preset' && appearance.accent.id === id} onPress={() => setAppearance({ accent: { kind: 'preset', id } })} />
        ))}
      </Row>
      <Row>
        <Chip label="Auto glass" selected={appearance.glass === 'auto'} onPress={() => setAppearance({ glass: 'auto' })} />
        <Chip label="Reduced" selected={appearance.glass === 'reduced'} onPress={() => setAppearance({ glass: 'reduced' })} />
      </Row>
      <PrimaryButton label="Primary action" onPress={() => undefined} />
      <GlassButton label="Secondary" onPress={() => undefined} />
      <GlassSurface backdrop variant="elevated" style={{ padding: theme.space.lg }}>
        <AppText variant="cardTitle">Backdrop glass</AppText>
      </GlassSurface>
      <GlassSurface variant="regular" style={{ padding: theme.space.lg }}>
        <AppText>Surface card</AppText>
      </GlassSurface>
      <AppText variant="heroMetric" numeric>
        72.5
      </AppText>
    </Screen>
  );
}
