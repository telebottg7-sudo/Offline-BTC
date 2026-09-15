import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initDatabase() {
  if (dbInstance) return dbInstance;

  // Use the Windows application data directory (AppData/Roaming/... on Windows)
  // Fallback for tests/dev if app is not available
  const userDataPath = app ? app.getPath('userData') : path.join(process.cwd(), 'database_data');
  
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  const dbPath = path.join(userDataPath, 'biotechcentre.sqlite');

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable Write-Ahead Logging for better performance and concurrency
  await dbInstance.exec('PRAGMA journal_mode = WAL;');
  // Enable foreign keys
  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  console.log(`Database initialized at: ${dbPath}`);

  return dbInstance;
}

export function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return dbInstance;
}

export async function closeDatabase() {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}

// Transaction wrapper helper for atomic operations
export async function runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
  const db = getDb();
  await db.exec('BEGIN TRANSACTION');
  try {
    const result = await fn();
    await db.exec('COMMIT');
    return result;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}
