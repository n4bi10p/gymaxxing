export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseHex(hex: string): Rgb {
  const value = hex.replace('#', '').trim();
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Invalid color: ${hex}`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function toHex({ r, g, b }: Rgb): string {
  const channel = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function linearToSrgb(channel: number): number {
  const c = Math.min(1, Math.max(0, channel));
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, v)) * 255);
}

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl);
  const m = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl);
  const s = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(a * a + b2 * b2);
  let h = (Math.atan2(b2, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;
  return {
    r: linearToSrgb(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    g: linearToSrgb(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    b: linearToSrgb(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
  };
}

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

const MAX_CHROMA = 0.12;

/** Shift lightness until text contrast against the page background reaches 4.5:1. */
export function toneForScheme(seed: string, scheme: 'dark' | 'light', background: string): string {
  const oklch = rgbToOklch(parseHex(seed));
  let l = scheme === 'dark' ? 0.82 : 0.42;
  const c = Math.min(oklch.c, MAX_CHROMA);
  const direction = scheme === 'dark' ? 0.02 : -0.02;
  for (let i = 0; i < 20; i += 1) {
    const hex = toHex(oklchToRgb({ l, c, h: oklch.h }));
    if (contrastRatio(hex, background) >= 4.5) return hex;
    const next = l + direction;
    if (next <= 0.15 || next >= 0.95) break;
    l = next;
  }
  return scheme === 'dark' ? '#F5F5F7' : '#0B0B0D';
}

export function readableOn(fill: string): string {
  return contrastRatio('#0B0B0D', fill) >= contrastRatio('#F5F5F7', fill) ? '#0B0B0D' : '#F5F5F7';
}
