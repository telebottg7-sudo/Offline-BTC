import { getDb } from '../db';
import crypto from 'crypto';

export async function getCustomers(isGuest?: boolean) {
  const db = getDb();
  let query = 'SELECT * FROM customers';
  const params: any[] = [];
  if (isGuest !== undefined) {
    query += ' WHERE is_guest = ?';
    params.push(isGuest ? 1 : 0);
  }
  query += ' ORDER BY name ASC';
  return db.all(query, ...params);
}

export async function getCustomer(id: string) {
  return getDb().get('SELECT * FROM customers WHERE id = ?', id);
}

export async function createCustomer(data: any) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.run(
    'INSERT INTO customers (id, name, email, phone, gst_pan, billing_address, is_guest) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, data.name, data.email, data.phone, data.gst_pan, data.billing_address, data.is_guest ? 1 : 0]
  );
  return db.get('SELECT * FROM customers WHERE id = ?', id);
}

export async function updateCustomer(id: string, data: any) {
  const db = getDb();
  const keys = Object.keys(data).filter(k => k !== 'id' && k !== 'created_at');
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => {
      // Map boolean to integer for SQLite
      if (typeof data[k] === 'boolean') return data[k] ? 1 : 0;
      return data[k];
    });
    
    await db.run(`UPDATE customers SET ${setClause} WHERE id = ?`, ...values, id);
  }
  return db.get('SELECT * FROM customers WHERE id = ?', id);
}
