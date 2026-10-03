import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { loadLiquidGlassView } from '@gymaxxing/native';
import { useAppearance } from './ThemeProvider';

export type GlassTier = 'A' | 'B' | 'D';

export function useGlassTier(): GlassTier {
  const { appearance } = useAppearance();
  const [reduced, setReduced] = useState(false);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceTransparencyEnabled().then((enabled) => {
      if (mounted) setReduced(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let frames = 0;
    let slow = 0;
    let last = Date.now();
    let raf = 0;
    const tick = () => {
      const now = Date.now();
      if (now - last > 32) slow += 1;
      last = now;
      frames += 1;
      if (frames >= 90) {
        if (slow > 12) setDropped(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (appearance.glass === 'reduced' || reduced || dropped) return 'D';
  if (Platform.OS === 'ios') {
    try {
      if (isLiquidGlassAvailable() && isGlassEffectAPIAvailable()) return 'A';
    } catch {
      return 'D';
    }
  }
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33 && loadLiquidGlassView()) return 'B';
  return 'D';
}
