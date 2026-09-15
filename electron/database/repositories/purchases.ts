import { getDb, runInTransaction } from '../db';
import crypto from 'crypto';

export async function getPurchases() {
  const db = getDb();
  const rows = await db.all(`
    SELECT p.*, pr.name as product_name, pr.unit_price as product_unit_price
    FROM purchases p
    JOIN products pr ON p.product_id = pr.id
    ORDER BY p.purchase_date DESC, p.created_at DESC
  `);
  return rows.map(r => ({
    ...r,
    products: { name: r.product_name, unit_price: r.product_unit_price }
  }));
}

export async function createPurchase(data: any) {
  return runInTransaction(async () => {
    const db = getDb();
    const id = crypto.randomUUID();
    
    await db.run(
      'INSERT INTO purchases (id, product_id, purchase_date, reference_invoice, quantity) VALUES (?, ?, ?, ?, ?)',
      [id, data.product_id, data.purchase_date, data.reference_invoice, data.quantity]
    );
    
    // Update stock directly (replacing PostgreSQL trigger)
    await db.run(
      'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
      [data.quantity, data.product_id]
    );
    
    return db.get('SELECT * FROM purchases WHERE id = ?', id);
  });
}

export async function updatePurchase(id: string, data: any) {
  return runInTransaction(async () => {
    const db = getDb();
    const oldPurchase = await db.get('SELECT * FROM purchases WHERE id = ?', id);
    if (!oldPurchase) throw new Error('Purchase not found');

    // Reverse old stock
    await db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [oldPurchase.quantity, oldPurchase.product_id]);

    const keys = Object.keys(data).filter(k => k !== 'id' && k !== 'created_at' && k !== 'products');
    if (keys.length > 0) {
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => data[k]);
      await db.run(`UPDATE purchases SET ${setClause} WHERE id = ?`, ...values, id);
    }

    // Apply new stock
    const newPurchase = await db.get('SELECT * FROM purchases WHERE id = ?', id);
    await db.run('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [newPurchase.quantity, newPurchase.product_id]);

    return newPurchase;
  });
}

export async function deletePurchase(id: string) {
  return runInTransaction(async () => {
    const db = getDb();
    const purchase = await db.get('SELECT * FROM purchases WHERE id = ?', id);
    if (!purchase) throw new Error('Purchase not found');
    
    // Check if deleting results in negative stock
    const product = await db.get('SELECT stock_quantity FROM products WHERE id = ?', purchase.product_id);
    if (product && (product.stock_quantity - purchase.quantity) < 0) {
       throw new Error('Cannot delete this purchase. It would result in a negative stock level.');
    }

    // Reverse stock and delete
    await db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [purchase.quantity, purchase.product_id]);
    await db.run('DELETE FROM purchases WHERE id = ?', id);
  });
}
