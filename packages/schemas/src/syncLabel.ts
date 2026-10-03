export interface SyncSnapshot {
  mode: 'local' | 'cloud';
  connected: boolean;
  busy: boolean;
  hasError: boolean;
  signedIn: boolean;
  lastSyncedLabel: string | null;
}

export function syncStatusLabel(snapshot: SyncSnapshot): string {
  if (snapshot.mode === 'local') return 'Local only';
  if (!snapshot.signedIn) return 'Sync paused · sign in again';
  if (snapshot.hasError && !snapshot.connected) return "Can't reach server";
  if (snapshot.busy) return 'Syncing…';
  if (snapshot.connected) return `Synced · ${snapshot.lastSyncedLabel ?? 'just now'}`;
  return 'Offline · saved locally, will sync later';
}
