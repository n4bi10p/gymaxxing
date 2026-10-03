import { describe, expect, it } from 'vitest';
import { backupSchema } from './models';
import { syncStatusLabel } from './syncLabel';
import { uuidv7 } from './uuid';

describe('uuidv7', () => {
  it('emits a version-7 uuid', () => {
    const id = uuidv7(1_700_000_000_000);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('orders by time', () => {
    const earlier = uuidv7(1_700_000_000_000);
    const later = uuidv7(1_700_000_100_000);
    expect(earlier < later).toBe(true);
  });
});

describe('syncStatusLabel', () => {
  it('uses the settings copy for each state', () => {
    expect(syncStatusLabel({ mode: 'local', connected: false, busy: false, hasError: false, signedIn: false, lastSyncedLabel: null })).toBe('Local only');
    expect(syncStatusLabel({ mode: 'cloud', connected: false, busy: false, hasError: false, signedIn: false, lastSyncedLabel: null })).toBe('Sync paused · sign in again');
    expect(syncStatusLabel({ mode: 'cloud', connected: false, busy: true, hasError: false, signedIn: true, lastSyncedLabel: null })).toBe('Syncing…');
    expect(syncStatusLabel({ mode: 'cloud', connected: true, busy: false, hasError: false, signedIn: true, lastSyncedLabel: '2 min ago' })).toBe('Synced · 2 min ago');
    expect(syncStatusLabel({ mode: 'cloud', connected: false, busy: false, hasError: false, signedIn: true, lastSyncedLabel: null })).toBe('Offline · saved locally, will sync later');
    expect(syncStatusLabel({ mode: 'cloud', connected: false, busy: false, hasError: true, signedIn: true, lastSyncedLabel: null })).toBe("Can't reach server");
  });
});

describe('backupSchema', () => {
  it('accepts an empty local backup', () => {
    const parsed = backupSchema.parse({
      version: 1,
      exportedAt: '2026-10-03T00:00:00.000Z',
      profile: null,
      routines: [],
      routineExercises: [],
      workouts: [],
      workoutExercises: [],
      sets: [],
      bodyMetrics: [],
    });
    expect(parsed.version).toBe(1);
  });
});
