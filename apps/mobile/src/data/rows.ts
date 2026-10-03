export type Row = Record<string, unknown>;

export function str(row: Row, key: string): string {
  const value = row[key];
  return typeof value === 'string' ? value : value == null ? '' : String(value);
}

export function strOrNull(row: Row, key: string): string | null {
  const value = row[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export function num(row: Row, key: string): number {
  const value = row[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
