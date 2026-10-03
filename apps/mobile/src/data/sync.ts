import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { UpdateType, type PowerSyncBackendConnector } from '@powersync/common';
import * as SecureStore from 'expo-secure-store';
import { database } from './db';

const CONFIG_KEY = 'gymaxxing.sync-config';

export interface SyncConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  powersyncUrl: string;
}

let client: SupabaseClient | null = null;

export async function readSyncConfig(): Promise<SyncConfig | null> {
  const raw = await SecureStore.getItemAsync(CONFIG_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as SyncConfig;
  if (!parsed.supabaseUrl || !parsed.supabaseAnonKey || !parsed.powersyncUrl) return null;
  return parsed;
}

export async function writeSyncConfig(config: SyncConfig | null): Promise<void> {
  client = null;
  if (!config) {
    await SecureStore.deleteItemAsync(CONFIG_KEY);
    return;
  }
  await SecureStore.setItemAsync(CONFIG_KEY, JSON.stringify(config));
}

function supabase(): SupabaseClient | null {
  return client;
}

async function clientFor(config: SyncConfig): Promise<SupabaseClient> {
  client ??= createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}

export async function signIn(email: string, password: string): Promise<void> {
  const config = await readSyncConfig();
  if (!config) throw new Error('Add the server addresses first.');
  const { error } = await clientFor(config).then((api) => api.auth.signInWithPassword({ email, password }));
  if (error) throw error;
}

export async function signUp(email: string, password: string): Promise<void> {
  const config = await readSyncConfig();
  if (!config) throw new Error('Add the server addresses first.');
  const { error } = await clientFor(config).then((api) => api.auth.signUp({ email, password }));
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  await supabase()?.auth.signOut();
  await database.disconnect();
}

export async function hasSession(): Promise<boolean> {
  const config = await readSyncConfig();
  if (!config) return false;
  const { data } = await clientFor(config).then((api) => api.auth.getSession());
  return Boolean(data.session);
}

const connector: PowerSyncBackendConnector = {
  async fetchCredentials() {
    const config = await readSyncConfig();
    if (!config) return null;
    const api = await clientFor(config);
    const { data, error } = await api.auth.getSession();
    if (error) throw error;
    if (!data.session) return null;
    return {
      endpoint: config.powersyncUrl,
      token: data.session.access_token,
      expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000) : undefined,
    };
  },
  async uploadData(db) {
    const config = await readSyncConfig();
    if (!config) return;
    const api = await clientFor(config);
    const { data } = await api.auth.getUser();
    const userId = data.user?.id;
    if (!userId) throw new Error('Sign in again before syncing.');
    const batch = await db.getCrudBatch();
    if (!batch) return;
    for (const op of batch.crud) {
      const table = api.from(op.table);
      if (op.op === UpdateType.PUT) {
        const { error } = await table.upsert({ ...op.opData, id: op.id, user_id: userId });
        if (error) throw error;
      } else if (op.op === UpdateType.PATCH) {
        const { error } = await table.update({ ...op.opData, user_id: userId }).eq('id', op.id);
        if (error) throw error;
      } else if (op.op === UpdateType.DELETE) {
        const { error } = await table.delete().eq('id', op.id);
        if (error) throw error;
      }
    }
    await batch.complete();
  },
};

export async function connectCloud(): Promise<void> {
  const signedIn = await hasSession();
  if (!signedIn) return;
  await database.connect(connector);
}

export async function disconnectCloud(): Promise<void> {
  await database.disconnect();
}
