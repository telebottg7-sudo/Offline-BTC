import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || 'https://nftrbattvszunozvfjeu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdHJiYXR0dnN6dW5venZmamV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDM2NzgsImV4cCI6MjA3NTUxOTY3OH0.Vg3pKc6q37vXl5UUPLZeBWJMifwXfan3wxhT_635Ss8';

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

async function fetchAll(table) {
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

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function run() {
  console.log('Downloading all data from Supabase...');
  const outDir = path.join(process.cwd(), 'database_data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const exportData = {};
  let totalRows = 0;
  let sqlStatements = [];

  sqlStatements.push('-- Exported Supabase Data to SQLite');
  sqlStatements.push('PRAGMA foreign_keys = OFF;');
  sqlStatements.push('BEGIN TRANSACTION;\n');

  for (const table of TABLES) {
    process.stdout.write(`Fetching '${table}'... `);
    const rows = await fetchAll(table);
    exportData[table] = rows;
    totalRows += rows.length;
    console.log(`✓ ${rows.length} rows`);

    if (rows.length > 0) {
      for (const row of rows) {
        const cols = Object.keys(row);
        const colList = cols.join(', ');
        const valList = cols.map(c => escapeSqlValue(row[c])).join(', ');
        sqlStatements.push(`INSERT OR REPLACE INTO ${table} (${colList}) VALUES (${valList});`);
      }
      sqlStatements.push('');
    }
  }

  sqlStatements.push('COMMIT;');
  sqlStatements.push('PRAGMA foreign_keys = ON;\n');

  // Save JSON bundle
  const jsonPath = path.join(outDir, 'seed_data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2), 'utf-8');
  console.log(`\nSaved JSON export to: ${jsonPath}`);

  // Save SQL dump
  const sqlPath = path.join(outDir, 'import.sql');
  fs.writeFileSync(sqlPath, sqlStatements.join('\n'), 'utf-8');
  console.log(`Saved SQL dump to: ${sqlPath}`);

  console.log(`\nTotal records downloaded: ${totalRows}`);
}

run().catch(err => {
  console.error('Error downloading data:', err);
  process.exit(1);
});
