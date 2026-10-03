import { drizzleSchema } from '@gymaxxing/schemas';
import { DrizzleAppSchema } from '@powersync/drizzle-driver';
import { PowerSyncDatabase } from '@powersync/react-native';

export const appSchema = new DrizzleAppSchema(drizzleSchema);

export const database = new PowerSyncDatabase({
  schema: appSchema,
  database: { dbFilename: 'gymaxxing.sqlite' },
});

let opening: Promise<void> | null = null;

export function openDatabase(): Promise<void> {
  opening ??= database.init();
  return opening;
}
