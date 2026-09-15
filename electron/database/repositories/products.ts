import { getDb } from '../db';
import crypto from 'crypto';

function mapProductRow(row: any) {
  return {
    ...row,
    units: row.unit_abbreviation ? { abbreviation: row.unit_abbreviation } : null,
    categories: row.category_name ? { name: row.category_name, icon_name: row.category_icon } : null,
  };
}

export async function getProducts() {
  const db = getDb();
  const rows = await db.all(`
    SELECT p.*, u.abbreviation as unit_abbreviation, c.name as category_name, c.icon_name as category_icon
    FROM products p
    LEFT JOIN units u ON p.unit_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.name ASC
  `);
  return rows.map(mapProductRow);
}

export async function getProduct(id: string) {
  const db = getDb();
  const row = await db.get(`
    SELECT p.*, u.abbreviation as unit_abbreviation, c.name as category_name, c.icon_name as category_icon
    FROM products p
    LEFT JOIN units u ON p.unit_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, id);
  return row ? mapProductRow(row) : null;
}

export async function createProduct(data: any) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.run(`
    INSERT INTO products (id, name, description, hsn_code, stock_quantity, unit_price, tax_rate, unit_id, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, data.name, data.description, data.hsn_code, 
    data.stock_quantity || 0, data.unit_price, data.tax_rate, 
    data.unit_id, data.category_id
  ]);
  return getProduct(id);
}

export async function updateProduct(id: string, data: any) {
  const db = getDb();
  const keys = Object.keys(data).filter(k => k !== 'id' && k !== 'created_at' && k !== 'units' && k !== 'categories');
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => data[k]);
    await db.run(`UPDATE products SET ${setClause} WHERE id = ?`, ...values, id);
  }
  return getProduct(id);
}
