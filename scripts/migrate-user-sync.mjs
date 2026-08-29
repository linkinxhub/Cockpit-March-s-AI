import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL;
if (!connectionString) {
  console.error('storage_not_configured');
  process.exit(2);
}

if (process.env.CONFIRM_USER_SYNC_MIGRATION !== 'APPLY') {
  console.error('migration_confirmation_required');
  console.error('Set CONFIRM_USER_SYNC_MIGRATION=APPLY to execute the versioned user-sync migrations.');
  process.exit(3);
}

const files = [
  'db/migrations/0001_user_sync_postgres.sql',
  'db/migrations/0002_notification_devices.sql',
  'db/migrations/0003_notification_timezone.sql',
];

const sql = neon(connectionString);

for (const relativePath of files) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const source = await fs.readFile(absolutePath, 'utf8');
  console.log(`Applying ${relativePath} ...`);
  await sql.query(source, []);
  console.log(`Applied ${relativePath}`);
}

const tables = await sql.query("select table_name from information_schema.tables where table_schema='public' and table_name in ('user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades') order by table_name", []);
const columns = await sql.query("select column_name from information_schema.columns where table_schema='public' and table_name='notification_preferences' and column_name in ('time_zone','utc_offset_minutes') order by column_name", []);

console.log(JSON.stringify({
  ok: true,
  tables: tables.map((row) => row.table_name),
  notificationPreferenceColumns: columns.map((row) => row.column_name),
}, null, 2));
