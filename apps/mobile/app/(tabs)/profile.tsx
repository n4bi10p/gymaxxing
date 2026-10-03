import { useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import Storage from 'expo-sqlite/kv-store';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { PRESET_SEEDS } from '@gymaxxing/theme';
import { syncStatusLabel } from '@gymaxxing/schemas';
import { catalogSize, exportBackup, getProfile, importBackup, saveProfile, type Profile } from '../../src/data/repository';
import { connectCloud, disconnectCloud, hasSession, readSyncConfig, signIn, signOut, signUp, writeSyncConfig } from '../../src/data/sync';
import { database } from '../../src/data/db';
import { AppText, Chip, Field, GlassButton, PrimaryButton, Row, Screen } from '../../src/ui/controls';
import { GlassSurface } from '../../src/ui/GlassSurface';
import { useAppearance , useTheme } from '../../src/ui/ThemeProvider';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const db = usePowerSync();
  const { appearance, setAppearance } = useAppearance();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<'local' | 'cloud'>(Storage.getItemSync('sync-mode') === 'cloud' ? 'cloud' : 'local');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [powerSyncUrl, setPowerSyncUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [backupText, setBackupText] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const status = database.currentStatus;
  const message =
    note ??
    syncStatusLabel({
      mode,
      connected: status.connected,
      busy: status.connecting || status.uploading || status.downloading,
      hasError: Boolean(status.downloadError || status.uploadError),
      signedIn,
      lastSyncedLabel: null,
    });

  useEffect(() => {
    void getProfile(db).then(setProfile);
    void readSyncConfig().then((config) => {
      if (!config) return;
      setSupabaseUrl(config.supabaseUrl);
      setAnonKey(config.supabaseAnonKey);
      setPowerSyncUrl(config.powersyncUrl);
    });
    void hasSession().then(setSignedIn);
  }, [db, mode]);

  const persistAppearance = (nextProfile: Profile) => {
    void saveProfile(db, nextProfile);
    setProfile(nextProfile);
  };

  return (
    <Screen title="Profile">
      <GlassSurface variant="regular" style={{ padding: theme.space.lg, gap: theme.space.xs }}>
        <AppText variant="cardTitle">{profile?.name || 'Athlete'}</AppText>
        <AppText variant="bodySmall" color={theme.color.text.secondary}>
          {profile?.goal ?? 'No goal yet'} · {catalogSize()} exercises
        </AppText>
      </GlassSurface>

      <AppText variant="sectionTitle">Appearance</AppText>
      <Row>
        <Chip label="System" selected={appearance.scheme === 'system'} onPress={() => setAppearance({ scheme: 'system' })} />
        <Chip label="Dark" selected={appearance.scheme === 'dark'} onPress={() => setAppearance({ scheme: 'dark' })} />
        <Chip label="Light" selected={appearance.scheme === 'light'} onPress={() => setAppearance({ scheme: 'light' })} />
      </Row>
      <Row>
        <Chip label="Silver" selected={appearance.accent.kind === 'silver'} onPress={() => setAppearance({ accent: { kind: 'silver' } })} />
        <Chip label="System accent" selected={appearance.accent.kind === 'system'} onPress={() => setAppearance({ accent: { kind: 'system' } })} />
        {(Object.keys(PRESET_SEEDS) as (keyof typeof PRESET_SEEDS)[]).map((id) => (
          <Chip key={id} label={id} selected={appearance.accent.kind === 'preset' && appearance.accent.id === id} onPress={() => setAppearance({ accent: { kind: 'preset', id } })} />
        ))}
      </Row>
      <Row>
        <Chip label="Glass auto" selected={appearance.glass === 'auto'} onPress={() => setAppearance({ glass: 'auto' })} />
        <Chip label="Reduced glass" selected={appearance.glass === 'reduced'} onPress={() => setAppearance({ glass: 'reduced' })} />
      </Row>

      <AppText variant="sectionTitle">Data & Sync</AppText>
      <GlassSurface variant="regular" style={{ padding: theme.space.lg, gap: theme.space.sm }}>
        <AppText color={mode === 'cloud' && signedIn ? theme.color.semantic.success : theme.color.text.secondary}>{message}</AppText>
        <Row>
          <Chip
            label="Local only"
            selected={mode === 'local'}
            onPress={() => {
              setMode('local');
              Storage.setItemSync('sync-mode', 'local');
              void disconnectCloud();
            }}
          />
          <Chip
            label="Cloud sync"
            selected={mode === 'cloud'}
            onPress={() => {
              setMode('cloud');
              Storage.setItemSync('sync-mode', 'cloud');
            }}
          />
        </Row>
        {mode === 'cloud' ? (
          <>
            <Field value={supabaseUrl} onChangeText={setSupabaseUrl} placeholder="Supabase URL" />
            <Field value={anonKey} onChangeText={setAnonKey} placeholder="Supabase anon key" />
            <Field value={powerSyncUrl} onChangeText={setPowerSyncUrl} placeholder="PowerSync URL" />
            <GlassButton
              label="Save server"
              onPress={() => {
                void writeSyncConfig({ supabaseUrl: supabaseUrl.trim(), supabaseAnonKey: anonKey.trim(), powersyncUrl: powerSyncUrl.trim() });
              }}
            />
            <Field value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
            <Field value={password} onChangeText={setPassword} placeholder="Password" />
            <Row>
              <GlassButton
                label="Sign in"
                onPress={() => {
                  void signIn(email.trim(), password)
                    .then(() => connectCloud())
                    .then(() => setSignedIn(true))
                    .catch((error: unknown) => setNote(error instanceof Error ? error.message : 'Sign in failed'));
                }}
              />
              <GlassButton label="Create account" onPress={() => void signUp(email.trim(), password).catch((error: unknown) => setNote(error instanceof Error ? error.message : 'Could not create the account'))} />
              <GlassButton label="Sign out" onPress={() => void signOut().then(() => setSignedIn(false))} />
            </Row>
          </>
        ) : null}
      </GlassSurface>

      <GlassButton
        label="Export backup"
        onPress={() => {
          void exportBackup(db).then((backup) => Share.share({ message: JSON.stringify(backup) }));
        }}
      />
      <Field value={backupText} onChangeText={setBackupText} placeholder="Paste backup JSON" />
      <GlassButton
        label="Restore backup"
        onPress={() => {
          void importBackup(db, JSON.parse(backupText))
            .then(() => setNote('Backup restored on this device.'))
            .catch(() => setNote('That backup could not be read.'));
        }}
      />
      <PrimaryButton label="Design system" onPress={() => router.push('/design-system')} />
      {profile ? (
        <GlassButton
          label={profile.unit === 'kg' ? 'Use pounds' : 'Use kilograms'}
          onPress={() => persistAppearance({ ...profile, unit: profile.unit === 'kg' ? 'lb' : 'kg' })}
        />
      ) : null}
    </Screen>
  );
}
