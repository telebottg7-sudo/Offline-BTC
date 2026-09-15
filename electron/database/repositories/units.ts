import { getDb } from '../db';
import crypto from 'crypto';

export async function getUnits() {
  const db = getDb();
  return db.all('SELECT * FROM units ORDER BY name ASC');
}

export async function createUnit(data: any) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.run(
    'INSERT INTO units (id, name, abbreviation) VALUES (?, ?, ?)',
    [id, data.name, data.abbreviation]
  );
  return db.get('SELECT * FROM units WHERE id = ?', id);
}

export async function updateUnit(id: string, data: any) {
  const db = getDb();
  await db.run(
    'UPDATE units SET name = ?, abbreviation = ? WHERE id = ?',
    [data.name, data.abbreviation, id]
  );
  return db.get('SELECT * FROM units WHERE id = ?', id);
}
