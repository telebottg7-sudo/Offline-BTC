import { getDb } from './db';
import { initialSchemaMigration } from './schema';
import fs from 'fs';
import path from 'path';

async function seedInitialDataMigration(db: any) {
  // Check if products already exist
  const existing = await db.get('SELECT COUNT(*) as count FROM products');
  if (existing && existing.count > 0) {
    console.log('Database already has product records, skipping seed.');
    return;
  }

  // Look for seed_data.json in possible locations (development, production app bundle, or resources)
  const possiblePaths = [
    path.join(process.cwd(), 'database_data', 'seed_data.json'),
    process.resourcesPath ? path.join(process.resourcesPath, 'database_data', 'seed_data.json') : '',
    process.resourcesPath ? path.join(process.resourcesPath, 'seed_data.json') : '',
    path.join(__dirname, '..', '..', 'database_data', 'seed_data.json'),
    path.join(__dirname, '..', 'database_data', 'seed_data.json')
  ].filter(Boolean);

  let seedFilePath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      seedFilePath = p;
      break;
    }
  }

  if (!seedFilePath) {
    console.log('No seed_data.json found. Skipping initial data seed.');
    return;
  }

  console.log(`Loading initial data from: ${seedFilePath}`);
  try {
    const raw = fs.readFileSync(seedFilePath, 'utf-8');
    const data = JSON.parse(raw);

    const tables = [
      'company_details',
      'units',
      'categories',
      'customers',
      'products',
      'purchases',
      'invoices',
      'invoice_items'
    ];

    await db.exec('PRAGMA foreign_keys = OFF;');
    await db.exec('BEGIN TRANSACTION;');

    let totalImported = 0;
    for (const table of tables) {
      const rows = data[table];
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          const cols = Object.keys(row);
          const placeholders = cols.map(() => '?').join(', ');
          const values = Object.values(row).map((v: any) => {
            if (typeof v === 'boolean') return v ? 1 : 0;
            if (v === undefined) return null;
            return v;
          });

          await db.run(
            `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`,
            values
          );
          totalImported++;
        }
      }
    }

    await db.exec('COMMIT;');
    await db.exec('PRAGMA foreign_keys = ON;');
    console.log(`Successfully seeded ${totalImported} records from Supabase backup.`);
  } catch (err) {
    await db.exec('ROLLBACK;').catch(() => {});
    await db.exec('PRAGMA foreign_keys = ON;').catch(() => {});
    console.error('Error seeding initial data:', err);
  }
}

export async function runMigrations() {
  const db = getDb();

  // Create migrations table if it doesn't exist to track schema versions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrations: Array<{ name: string; up: (db: any) => Promise<void> }> = [
    { name: '001_initial_schema', up: initialSchemaMigration },
    { name: '002_seed_initial_data', up: seedInitialDataMigration }
  ];

  for (const migration of migrations) {
    const row = await db.get('SELECT id FROM _migrations WHERE name = ?', migration.name);
    
    if (!row) {
      console.log(`Running migration: ${migration.name}`);
      try {
        await migration.up(db);
        await db.run('INSERT INTO _migrations (name) VALUES (?)', migration.name);
        console.log(`Migration ${migration.name} completed.`);
      } catch (error) {
        console.error(`Migration ${migration.name} failed:`, error);
        throw error;
      }
    }
  }
}
