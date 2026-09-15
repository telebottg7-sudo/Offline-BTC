export const initialSchemaMigration = async (db: any) => {
  // Company Details (Singleton)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS company_details (
      id INTEGER PRIMARY KEY DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT,
      slogan TEXT,
      address TEXT,
      gstin TEXT,
      account_name TEXT,
      account_number TEXT,
      account_type TEXT,
      bank_name TEXT,
      ifsc_code TEXT,
      CHECK (id = 1)
    );
  `);

  // Customers
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      email TEXT,
      phone TEXT,
      gst_pan TEXT,
      billing_address TEXT,
      is_guest INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Units
  await db.exec(`
    CREATE TABLE IF NOT EXISTS units (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      abbreviation TEXT NOT NULL UNIQUE
    );
  `);

  // Categories
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      icon_name TEXT
    );
  `);

  // Products
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      hsn_code TEXT,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      unit_price REAL NOT NULL,
      tax_rate REAL NOT NULL,
      unit_id TEXT,
      category_id TEXT,
      FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      CHECK (stock_quantity >= 0),
      CHECK (unit_price >= 0),
      CHECK (tax_rate >= 0 AND tax_rate <= 1)
    );
  `);

  // Purchases
  await db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      product_id TEXT NOT NULL,
      purchase_date TEXT NOT NULL,
      reference_invoice TEXT,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
      CHECK (quantity > 0)
    );
  `);

  // Invoices
  await db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      customer_id TEXT,
      invoice_number TEXT NOT NULL UNIQUE,
      invoice_date TEXT NOT NULL,
      notes TEXT,
      total_amount REAL NOT NULL DEFAULT 0,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
    );
  `);

  // Invoice Items
  await db.exec(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      invoice_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      tax_rate REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
      CHECK (quantity > 0),
      CHECK (unit_price >= 0),
      CHECK (tax_rate >= 0 AND tax_rate <= 1)
    );
  `);

  // Insert default seed data for categories
  const defaultCategories = [
    ['Fertilizers', 'Nutrients for plant growth', 'Leaf'],
    ['Organic Fertilizers', 'Natural fertilizers derived from plant or animal matter', 'Sprout'],
    ['Chemical Fertilizers (Urea, DAP, NPK)', 'Synthetic fertilizers providing specific nutrients', 'FlaskConical'],
    ['Micronutrients', 'Essential elements required by plants in small quantities', 'TestTube2'],
    ['Pesticides & Crop Protection', 'Chemicals to control pests, diseases, and weeds', 'Shield'],
    ['Insecticides', 'Substances used to kill insects', 'Bug'],
    ['Fungicides', 'Biocidal chemical compounds used to kill parasitic fungi', 'SunSnow'],
    ['Herbicides', 'Substances that are toxic to plants, used to destroy unwanted vegetation', 'Ban'],
    ['Bio-Pesticides', 'Pesticides derived from natural materials like animals, plants, bacteria', 'Trees']
  ];

  for (const [name, desc, icon] of defaultCategories) {
    const id = crypto.randomUUID();
    await db.run(
      'INSERT OR IGNORE INTO categories (id, name, description, icon_name) VALUES (?, ?, ?, ?)',
      [id, name, desc, icon]
    );
  }
};
