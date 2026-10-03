export type Unit = 'kg' | 'lb';

const LB_PER_KG = 2.2046226218;

export function convertWeight(value: number, from: Unit, to: Unit): number {
  if (!Number.isFinite(value)) return 0;
  if (from === to) return value;
  if (from === 'kg' && to === 'lb') return value * LB_PER_KG;
  return value / LB_PER_KG;
}

export function defaultIncrement(unit: Unit): number {
  return unit === 'kg' ? 2.5 : 5;
}

export function roundToIncrement(value: number, increment: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(increment) || increment <= 0) return value;
  const rounded = Math.round(value / increment) * increment;
  const decimals = increment < 1 ? 2 : increment < 10 ? 1 : 0;
  return Number(rounded.toFixed(decimals));
}

export function formatWeight(value: number, unit: Unit): string {
  const increment = unit === 'kg' ? 0.25 : 1;
  const rounded = roundToIncrement(value, increment);
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(unit === 'kg' ? 2 : 0).replace(/0$/, '').replace(/\.$/, '');
  return `${text} ${unit}`;
}
