import { getDb } from '../db';

export async function getCompanyDetails() {
  const db = getDb();
  let company = await db.get('SELECT * FROM company_details WHERE id = 1');
  if (!company) {
    await db.run('INSERT INTO company_details (id, name) VALUES (1, "")');
    company = await db.get('SELECT * FROM company_details WHERE id = 1');
  }
  return company;
}

export async function updateCompanyDetails(data: any) {
  const db = getDb();
  const keys = Object.keys(data).filter(k => k !== 'id' && k !== 'created_at');
  if (keys.length === 0) return getCompanyDetails();

  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => data[k]);
  
  await db.run(`UPDATE company_details SET ${setClause} WHERE id = 1`, ...values);
  return getCompanyDetails();
}
