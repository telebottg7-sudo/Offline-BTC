import { getDb, runInTransaction } from '../db';
import crypto from 'crypto';

export async function getInvoices() {
  const db = getDb();
  const rows = await db.all(`
    SELECT i.*, c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    ORDER BY i.invoice_date DESC, i.created_at DESC
  `);
  return rows.map(r => ({
    ...r,
    customers: r.customer_name ? { name: r.customer_name } : null
  }));
}

export async function getInvoice(id: string) {
  const db = getDb();
  const invoice = await db.get(`
    SELECT i.*, c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE i.id = ?
  `, id);
  
  if (!invoice) return null;

  const items = await db.all(`
    SELECT ii.*, p.name as product_name, p.hsn_code, u.abbreviation as unit_abbreviation
    FROM invoice_items ii
    JOIN products p ON ii.product_id = p.id
    LEFT JOIN units u ON p.unit_id = u.id
    WHERE ii.invoice_id = ?
  `, id);

  return {
    ...invoice,
    customers: invoice.customer_name ? { name: invoice.customer_name } : null,
    invoice_items: items.map(item => ({
      ...item,
      products: { name: item.product_name, hsn_code: item.hsn_code, units: { abbreviation: item.unit_abbreviation } }
    }))
  };
}

export async function createInvoice(invoiceData: any, items: any[]) {
  return runInTransaction(async () => {
    const db = getDb();
    const invoiceId = crypto.randomUUID();
    
    let totalAmount = 0;
    
    const processedItems = items.map(item => {
       const id = crypto.randomUUID();
       const lineTotal = item.quantity * item.unit_price * (1 + item.tax_rate);
       totalAmount += lineTotal;
       return { ...item, id };
    });

    await db.run(`
      INSERT INTO invoices (id, customer_id, invoice_number, invoice_date, notes, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [invoiceId, invoiceData.customer_id, invoiceData.invoice_number, invoiceData.invoice_date, invoiceData.notes, totalAmount]);

    for (const item of processedItems) {
       await db.run(`
         INSERT INTO invoice_items (id, invoice_id, product_id, quantity, unit_price, tax_rate)
         VALUES (?, ?, ?, ?, ?, ?)
       `, [item.id, invoiceId, item.product_id, item.quantity, item.unit_price, item.tax_rate]);
       
       // Deduct stock (replacing PostgreSQL trigger)
       await db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    return getInvoice(invoiceId);
  });
}

export async function updateInvoice(id: string, invoiceData: any, items: any[]) {
  return runInTransaction(async () => {
    const db = getDb();
    
    // Fetch old items to reverse stock
    const oldItems = await db.all('SELECT * FROM invoice_items WHERE invoice_id = ?', id);
    for (const oldItem of oldItems) {
       await db.run('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [oldItem.quantity, oldItem.product_id]);
    }
    
    // Delete old items
    await db.run('DELETE FROM invoice_items WHERE invoice_id = ?', id);

    // Compute new total and insert new items, updating stock
    let totalAmount = 0;
    for (const item of items) {
       const itemId = crypto.randomUUID();
       const lineTotal = item.quantity * item.unit_price * (1 + item.tax_rate);
       totalAmount += lineTotal;

       await db.run(`
         INSERT INTO invoice_items (id, invoice_id, product_id, quantity, unit_price, tax_rate)
         VALUES (?, ?, ?, ?, ?, ?)
       `, [itemId, id, item.product_id, item.quantity, item.unit_price, item.tax_rate]);
       
       await db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    // Update invoice
    await db.run(`
      UPDATE invoices 
      SET customer_id = ?, invoice_number = ?, invoice_date = ?, notes = ?, total_amount = ?
      WHERE id = ?
    `, [invoiceData.customer_id, invoiceData.invoice_number, invoiceData.invoice_date, invoiceData.notes, totalAmount, id]);

    return getInvoice(id);
  });
}

export async function deleteInvoice(id: string) {
  return runInTransaction(async () => {
    const db = getDb();
    // Restore stock for all items
    const items = await db.all('SELECT * FROM invoice_items WHERE invoice_id = ?', id);
    for (const item of items) {
       await db.run('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [item.quantity, item.product_id]);
    }
    
    // Delete items and invoice (Cascade handles items in SQLite, but we do it manually to be explicit since we already looped them)
    await db.run('DELETE FROM invoice_items WHERE invoice_id = ?', id);
    await db.run('DELETE FROM invoices WHERE id = ?', id);
  });
}
