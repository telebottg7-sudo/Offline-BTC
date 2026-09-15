import { getDb } from '../db';
import crypto from 'crypto';

export async function getCategories() {
  const db = getDb();
  return db.all('SELECT * FROM categories ORDER BY name ASC');
}

export async function createCategory(data: any) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.run(
    'INSERT INTO categories (id, name, description, icon_name) VALUES (?, ?, ?, ?)',
    [id, data.name, data.description, data.icon_name]
  );
  return db.get('SELECT * FROM categories WHERE id = ?', id);
}

export async function updateCategory(id: string, data: any) {
  const db = getDb();
  await db.run(
    'UPDATE categories SET name = ?, description = ?, icon_name = ? WHERE id = ?',
    [data.name, data.description, data.icon_name, id]
  );
  return db.get('SELECT * FROM categories WHERE id = ?', id);
}

export async function deleteCategory(id: string) {
  const db = getDb();
  await db.run('DELETE FROM categories WHERE id = ?', id);
}
