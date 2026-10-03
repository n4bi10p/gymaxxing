import { describe, expect, it } from 'vitest';
import { contrastRatio } from './color';
import { PRESET_SEEDS, SILVER, assertAccentContrast, createTheme, resolveAccentSeed } from './createTheme';

describe('createTheme', () => {
  it('uses the silver ramp exactly', () => {
    expect(createTheme('dark', SILVER.dark).color.accent.primary).toBe(SILVER.dark);
    expect(createTheme('light', SILVER.light).color.accent.primary).toBe(SILVER.light);
    expect(createTheme('dark', SILVER.dark).color.background.primary).toBe('#000000');
    expect(createTheme('light', SILVER.light).color.background.primary).toBe('#F3F4F6');
  });

  it('keeps the CTA independent of the accent', () => {
    const dark = createTheme('dark', PRESET_SEEDS.violet);
    const light = createTheme('light', PRESET_SEEDS.rose);
    expect(dark.color.cta).toEqual({ fill: '#F5F5F7', onFill: '#080809' });
    expect(light.color.cta).toEqual({ fill: '#0B0B0D', onFill: '#F5F5F7' });
  });

  it('enforces 4.5:1 for preset accents on both schemes', () => {
    for (const seed of Object.values(PRESET_SEEDS)) {
      expect(assertAccentContrast(createTheme('dark', seed))).toBeGreaterThanOrEqual(4.5);
      expect(assertAccentContrast(createTheme('light', seed))).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrastRatio(SILVER.dark, '#000000')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(SILVER.light, '#F3F4F6')).toBeGreaterThanOrEqual(4.5);
  });

  it('falls back to silver when system accent is missing', () => {
    expect(resolveAccentSeed({ kind: 'system' }, 'dark', null)).toBe(SILVER.dark);
    expect(resolveAccentSeed({ kind: 'preset', id: 'mint' }, 'light', null)).toBe(PRESET_SEEDS.mint);
  });
});
