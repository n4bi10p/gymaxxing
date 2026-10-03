# Optional cloud sync

Gymaxxing does not require an account. Cloud sync is for using the same log on two phones.

## What you run

1. Supabase (Auth, Postgres, RLS). Apply `supabase/migrations/0001_init.sql`.
2. A PowerSync service pointed at that database, with `powersync/sync-rules.yaml`.
3. In the app: Settings → Data & Sync → Cloud sync. Enter the Supabase URL, the anon key, and the PowerSync URL, then sign in.

`docker-compose.yml` starts Postgres and a PowerSync container for a local experiment. Hosted Supabase still needs its own project; point `PS_DATABASE_URI` at that database and set the PowerSync client auth (JWT from Supabase) before real use. The compose file is a starting point, not a production deployment.

## Rules

- Turning sync on uploads the rows already on the phone.
- Turning it off keeps the local copy and stops connecting. It does not delete the server.
- Photos and the AI key are not part of this schema.
- Conflicts are last write wins, using `updated_at`.

## App behavior

The client creates a PowerSync database at launch and does not call `connect()` until Cloud sync is on and a session exists. Local writes made before that stay queued and upload on the first successful connect.
