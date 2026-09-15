import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Schema initialization for SQLite
const createTablesSql = `
  CREATE TABLE IF NOT EXISTS company_details (
    id INTEGER PRIMARY KEY DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name TEXT,
    slogan TEXT,
    address TEXT,
    gstin TEXT,
    account_name TEXT,
    account_number TEXT,
    account_type TEXT,
    bank_name TEXT,
    ifsc_code TEXT,
    CHECK (id = 1)
  );

  CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE,
    abbreviation TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE,
    email TEXT,
    phone TEXT,
    gst_pan TEXT,
    billing_address TEXT,
    is_guest INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    hsn_code TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL,
    tax_rate REAL NOT NULL,
    unit_id TEXT,
    category_id TEXT,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_id TEXT NOT NULL,
    purchase_date TEXT NOT NULL,
    reference_invoice TEXT,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id TEXT,
    invoice_number TEXT NOT NULL UNIQUE,
    invoice_date TEXT NOT NULL,
    notes TEXT,
    total_amount REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS invoice_items (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    tax_rate REAL NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
  );
`;

const TABLES = [
  'company_details',
  'units',
  'categories',
  'customers',
  'products',
  'purchases',
  'invoices',
  'invoice_items'
];

function getLocalDbPath() {
  const customPath = process.argv.find(arg => arg.startsWith('--db='))?.split('=')[1];
  if (customPath) return customPath;

  // Check Electron's userData paths across OSes
  let appDataDir = '';
  if (process.platform === 'win32') {
    appDataDir = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'biotechcentre');
  } else if (process.platform === 'darwin') {
    appDataDir = path.join(os.homedir(), 'Library', 'Application Support', 'biotechcentre');
  } else {
    appDataDir = path.join(os.homedir(), '.config', 'biotechcentre');
  }

  const defaultElectronPath = path.join(appDataDir, 'biotechcentre.sqlite');
  if (fs.existsSync(defaultElectronPath)) {
    return defaultElectronPath;
  }

  // Fallback to local workspace directory
  return path.join(process.cwd(), 'database_data', 'biotechcentre.sqlite');
}

async function fetchSupabaseTableAll(supabaseUrl, supabaseKey, table) {
  const cleanUrl = supabaseUrl.replace(/\/$/, '');
  const allRows = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${cleanUrl}/rest/v1/${table}?select=*`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Range-Unit': 'items',
        'Range': `${offset}-${offset + pageSize - 1}`,
        'Prefer': 'count=exact'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch ${table} (HTTP ${res.status}): ${errorText}`);
    }

    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      hasMore = false;
    } else {
      allRows.push(...rows);
      if (rows.length < pageSize) {
        hasMore = false;
      } else {
        offset += pageSize;
      }
    }
  }

  return allRows;
}

async function run() {
  console.log('====================================================');
  console.log('  Supabase -> Local SQLite Data Migration Script    ');
  console.log('====================================================\n');

  const supabaseUrl = process.env.SUPABASE_URL || process.argv[2] || 'https://nftrbattvszunozvfjeu.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY || process.argv[3] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdHJiYXR0dnN6dW5venZmamV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDM2NzgsImV4cCI6MjA3NTUxOTY3OH0.Vg3pKc6q37vXl5UUPLZeBWJMifwXfan3wxhT_635Ss8';

  const dbPath = getLocalDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`Connecting to local SQLite database at:\n  ${dbPath}\n`);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable WAL & ensure schema exists
  await db.exec('PRAGMA journal_mode = WAL;');
  await db.exec('PRAGMA foreign_keys = OFF;');
  await db.exec(createTablesSql);

  let grandTotal = 0;

  for (const table of TABLES) {
    try {
      process.stdout.write(`Fetching '${table}' from Supabase... `);
      const rows = await fetchSupabaseTableAll(supabaseUrl, supabaseKey, table);
      
      if (rows.length === 0) {
        console.log(`0 records (skipped)`);
        continue;
      }

      await db.exec('BEGIN TRANSACTION;');

      let count = 0;
      for (const row of rows) {
        const columns = Object.keys(row);
        const placeholders = columns.map(() => '?').join(', ');
        const values = Object.values(row).map(v => {
          if (typeof v === 'boolean') return v ? 1 : 0;
          if (v === undefined) return null;
          return v;
        });

        const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
        await db.run(sql, values);
        count++;
      }

      await db.exec('COMMIT;');
      console.log(`✓ ${count} records imported.`);
      grandTotal += count;
    } catch (err) {
      await db.exec('ROLLBACK;').catch(() => {});
      console.error(`\nError importing ${table}:`, err.message);
    }
  }

  await db.exec('PRAGMA foreign_keys = ON;');
  await db.close();

  console.log('\n====================================================');
  console.log(` Migration complete! Total records saved: ${grandTotal}`);
  console.log(` Database stored at: ${dbPath}`);
  console.log('====================================================\n');
}

run().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
