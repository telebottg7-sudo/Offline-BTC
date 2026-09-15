import { getDb } from '../db';

export async function getCombinedReport(startDate: string, endDate: string, type: string, limit: number, offset: number) {
  const db = getDb();
  let query = `
    WITH combined AS (
      SELECT
          ii.id AS transaction_id,
          i.invoice_date AS transaction_date,
          'Sale' AS transaction_type,
          i.invoice_number AS reference_number,
          p.name AS product_name,
          -ii.quantity AS quantity_change
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      JOIN products p ON ii.product_id = p.id
      WHERE (? = 'all' OR ? = 'sale')
        AND i.invoice_date BETWEEN ? AND ?
      
      UNION ALL
      
      SELECT
          pu.id AS transaction_id,
          pu.purchase_date AS transaction_date,
          'Purchase' AS transaction_type,
          pu.reference_invoice AS reference_number,
          p.name AS product_name,
          pu.quantity AS quantity_change
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      WHERE (? = 'all' OR ? = 'purchase')
        AND pu.purchase_date BETWEEN ? AND ?
    )
    SELECT * FROM combined
    ORDER BY transaction_date DESC, product_name ASC
    LIMIT ? OFFSET ?
  `;

  return db.all(query, [type, type, startDate, endDate, type, type, startDate, endDate, limit, offset]);
}

export async function getCombinedReportCount(startDate: string, endDate: string, type: string) {
  const db = getDb();
  let query = `
    WITH combined AS (
      SELECT ii.id
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      WHERE (? = 'all' OR ? = 'sale')
        AND i.invoice_date BETWEEN ? AND ?
      UNION ALL
      SELECT pu.id
      FROM purchases pu
      WHERE (? = 'all' OR ? = 'purchase')
        AND pu.purchase_date BETWEEN ? AND ?
    )
    SELECT COUNT(*) as total FROM combined
  `;
  const row = await db.get(query, [type, type, startDate, endDate, type, type, startDate, endDate]);
  return row ? row.total : 0;
}

export async function exportCombinedReport(startDate: string, endDate: string, type: string) {
  const db = getDb();
  let query = `
    WITH combined AS (
      SELECT
          i.invoice_date AS transaction_date,
          'Sale' AS transaction_type,
          i.invoice_number AS reference_number,
          p.name AS product_name,
          -ii.quantity AS quantity_change
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      JOIN products p ON ii.product_id = p.id
      WHERE (? = 'all' OR ? = 'sale')
        AND i.invoice_date BETWEEN ? AND ?
      
      UNION ALL
      
      SELECT
          pu.purchase_date AS transaction_date,
          'Purchase' AS transaction_type,
          pu.reference_invoice AS reference_number,
          p.name AS product_name,
          pu.quantity AS quantity_change
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      WHERE (? = 'all' OR ? = 'purchase')
        AND pu.purchase_date BETWEEN ? AND ?
    )
    SELECT * FROM combined
    ORDER BY transaction_date DESC, product_name ASC
  `;

  return db.all(query, [type, type, startDate, endDate, type, type, startDate, endDate]);
}

export async function getProductStockReport(productId: string) {
  const db = getDb();
  const rows = await db.all(`
    SELECT ii.*, i.invoice_number, i.invoice_date, c.name as customer_name
    FROM invoice_items ii
    JOIN invoices i ON ii.invoice_id = i.id
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE ii.product_id = ?
    ORDER BY i.invoice_date DESC
  `, productId);
  
  return rows.map(r => ({
    ...r,
    invoices: {
      invoice_number: r.invoice_number,
      invoice_date: r.invoice_date,
      customers: r.customer_name ? { name: r.customer_name } : null
    }
  }));
}
