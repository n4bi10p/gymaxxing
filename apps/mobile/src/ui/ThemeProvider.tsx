import { createTheme, resolveAccentSeed, type AccentChoice, type Scheme, type Theme } from '@gymaxxing/theme';
import Storage from 'expo-sqlite/kv-store';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getSystemAccent } from '@gymaxxing/native';

export interface Appearance {
  scheme: 'system' | Scheme;
  accent: AccentChoice;
  glass: 'auto' | 'reduced';
  systemAccent: string | null;
}

const DEFAULT_APPEARANCE: Appearance = {
  scheme: 'system',
  accent: { kind: 'silver' },
  glass: 'auto',
  systemAccent: null,
};

interface ThemeContextValue {
  theme: Theme;
  appearance: Appearance;
  setAppearance: (next: Partial<Appearance>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'appearance';

function readStored(): Appearance {
  try {
    const raw = Storage.getItemSync(STORAGE_KEY);
    if (!raw) return DEFAULT_APPEARANCE;
    const parsed = JSON.parse(raw) as Appearance;
    return { ...DEFAULT_APPEARANCE, ...parsed, systemAccent: null };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [appearance, setAppearanceState] = useState<Appearance>(readStored);
  const systemAccent = getSystemAccent();

  const setAppearance = (next: Partial<Appearance>) => {
    setAppearanceState((current) => {
      const merged = { ...current, ...next };
      Storage.setItemSync(STORAGE_KEY, JSON.stringify({ ...merged, systemAccent: null }));
      return merged;
    });
  };

  const scheme: Scheme = appearance.scheme === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : appearance.scheme;
  const seed = resolveAccentSeed(appearance.accent, scheme, systemAccent);
  const theme = useMemo(() => createTheme(scheme, seed), [scheme, seed]);

  const value = useMemo(() => ({ theme, appearance, setAppearance }), [theme, appearance]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context.theme;
}

export function useAppearance(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppearance must be used inside ThemeProvider');
  return context;
}
