import { contrastRatio, readableOn, toneForScheme, withAlpha } from './color';

export type Scheme = 'dark' | 'light';

export type AccentChoice =
  | { kind: 'system' }
  | { kind: 'silver' }
  | { kind: 'preset'; id: 'ice' | 'violet' | 'mint' | 'amber' | 'rose' }
  | { kind: 'custom'; seed: string };

export const PRESET_SEEDS = {
  ice: '#9CC3FF',
  violet: '#9B86FF',
  mint: '#7FE0B5',
  amber: '#F2C879',
  rose: '#F29BB1',
} as const;

export const SILVER = {
  dark: '#CDD1D8',
  light: '#4B5059',
} as const;

export const SILVER_METAL = ['#F7F8FA', '#BFC4CC', '#EEF0F3', '#8E949E'] as const;

export function resolveAccentSeed(
  choice: AccentChoice,
  scheme: Scheme,
  systemSeed: string | null,
): string {
  if (choice.kind === 'system') return systemSeed ?? SILVER[scheme];
  if (choice.kind === 'silver') return SILVER[scheme];
  if (choice.kind === 'custom') return choice.seed;
  return PRESET_SEEDS[choice.id];
}

const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40, huge: 48, section: 64 };
const radii = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 28, hero: 32, pill: 999 };

const type = {
  heroMetric: { size: 56, lineHeight: 60, weight: '700' as const, tracking: -1.8 },
  display: { size: 38, lineHeight: 42, weight: '700' as const, tracking: -1.1 },
  screenTitle: { size: 32, lineHeight: 38, weight: '700' as const, tracking: -0.8 },
  sectionTitle: { size: 22, lineHeight: 28, weight: '600' as const, tracking: -0.35 },
  cardTitle: { size: 17, lineHeight: 22, weight: '600' as const, tracking: 0 },
  body: { size: 16, lineHeight: 22, weight: '400' as const, tracking: 0 },
  bodySmall: { size: 14, lineHeight: 20, weight: '400' as const, tracking: 0 },
  label: { size: 12, lineHeight: 16, weight: '600' as const, tracking: 0.25 },
  micro: { size: 11, lineHeight: 14, weight: '500' as const, tracking: 0 },
};

export interface Theme {
  scheme: Scheme;
  color: {
    background: { primary: string; secondary: string; elevated: string };
    surface: Record<'ghost' | 'subtle' | 'regular' | 'elevated' | 'prominent' | 'pressed', string>;
    surfaceSolid: Record<'ghost' | 'subtle' | 'regular' | 'elevated' | 'prominent' | 'pressed', string>;
    text: { primary: string; secondary: string; tertiary: string; disabled: string; inverse: string };
    border: { faint: string; default: string; strong: string; accent: string };
    accent: {
      primary: string;
      bright: string;
      muted: string;
      soft: string;
      faint: string;
      glow: string;
      border: string;
      onAccent: string;
      metal: readonly string[];
    };
    semantic: { success: string; warning: string; danger: string; info: string };
    cta: { fill: string; onFill: string };
    rim: { start: string; end: string };
  };
  type: typeof type;
  space: typeof space;
  radii: typeof radii;
}

export function createTheme(scheme: Scheme, accentSeed: string): Theme {
  const dark = scheme === 'dark';
  const background = dark
    ? { primary: '#000000', secondary: '#050506', elevated: '#0A0A0C' }
    : { primary: '#F3F4F6', secondary: '#ECEEF1', elevated: '#FFFFFF' };

  const fixedSilver = accentSeed.toUpperCase() === SILVER[scheme].toUpperCase();
  const primary = fixedSilver ? SILVER[scheme] : toneForScheme(accentSeed, scheme, background.primary);
  const bright = fixedSilver
    ? dark
      ? '#F2F4F7'
      : '#24272C'
    : toneForScheme(accentSeed, dark ? 'dark' : 'light', background.primary);
  const muted = withAlpha(primary, dark ? 0.72 : 0.8);

  return {
    scheme,
    color: {
      background,
      surface: dark
        ? {
            ghost: 'rgba(255,255,255,0.025)',
            subtle: 'rgba(255,255,255,0.040)',
            regular: 'rgba(255,255,255,0.065)',
            elevated: 'rgba(255,255,255,0.090)',
            prominent: 'rgba(255,255,255,0.120)',
            pressed: 'rgba(255,255,255,0.150)',
          }
        : {
            ghost: 'rgba(255,255,255,0.35)',
            subtle: 'rgba(255,255,255,0.50)',
            regular: 'rgba(255,255,255,0.68)',
            elevated: 'rgba(255,255,255,0.80)',
            prominent: 'rgba(255,255,255,0.92)',
            pressed: 'rgba(235,237,241,0.90)',
          },
      surfaceSolid: dark
        ? {
            ghost: '#070708',
            subtle: '#0B0B0C',
            regular: '#101012',
            elevated: '#171719',
            prominent: '#1F1F22',
            pressed: '#262629',
          }
        : {
            ghost: '#F7F8F9',
            subtle: '#F9FAFB',
            regular: '#FCFCFD',
            elevated: '#FFFFFF',
            prominent: '#FFFFFF',
            pressed: '#E7E9ED',
          },
      text: dark
        ? {
            primary: '#F5F5F7',
            secondary: 'rgba(245,245,247,0.66)',
            tertiary: 'rgba(245,245,247,0.45)',
            disabled: 'rgba(245,245,247,0.28)',
            inverse: '#080809',
          }
        : {
            primary: '#0B0B0D',
            secondary: 'rgba(11,11,13,0.72)',
            tertiary: 'rgba(11,11,13,0.58)',
            disabled: 'rgba(11,11,13,0.32)',
            inverse: '#F5F5F7',
          },
      border: {
        faint: dark ? 'rgba(255,255,255,0.05)' : 'rgba(11,11,13,0.05)',
        default: dark ? 'rgba(255,255,255,0.09)' : 'rgba(11,11,13,0.08)',
        strong: dark ? 'rgba(255,255,255,0.14)' : 'rgba(11,11,13,0.14)',
        accent: withAlpha(primary, 0.35),
      },
      accent: {
        primary,
        bright,
        muted,
        soft: withAlpha(primary, 0.16),
        faint: withAlpha(primary, 0.07),
        glow: withAlpha(primary, dark ? 0.1 : 0.06),
        border: withAlpha(primary, 0.35),
        onAccent: readableOn(primary),
        metal: SILVER_METAL,
      },
      semantic: dark
        ? { success: '#66E3A3', warning: '#F3C969', danger: '#FF6B6B', info: '#7EA7FF' }
        : { success: '#0E8F55', warning: '#8A6410', danger: '#C43838', info: '#2457C5' },
      cta: dark ? { fill: '#F5F5F7', onFill: '#080809' } : { fill: '#0B0B0D', onFill: '#F5F5F7' },
      rim: dark
        ? { start: 'rgba(255,255,255,0.18)', end: 'rgba(255,255,255,0.04)' }
        : { start: 'rgba(255,255,255,0.95)', end: 'rgba(11,11,13,0.06)' },
    },
    type,
    space,
    radii,
  };
}

export function assertAccentContrast(theme: Theme): number {
  return contrastRatio(theme.color.accent.primary, theme.color.background.primary);
}
