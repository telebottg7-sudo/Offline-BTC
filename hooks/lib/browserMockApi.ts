// Browser fallback for window.api when running outside of Electron (e.g. web preview)
import seedData from '../../database_data/seed_data.json';

export function setupBrowserApiFallback() {
  if (typeof window === 'undefined' || window.api) {
    return;
  }

  console.log('[Browser Preview] Electron IPC not detected, initializing browser offline data store.');

  const STORAGE_KEY = 'biotechcentre_local_store_v1';
  let store: any = null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      store = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse localStorage store:', e);
  }

  if (!store || !store.products || store.products.length === 0) {
    store = {
      company_details: seedData.company_details || [],
      units: seedData.units || [],
      categories: seedData.categories || [],
      customers: seedData.customers || [],
      products: seedData.products || [],
      purchases: seedData.purchases || [],
      invoices: seedData.invoices || [],
      invoice_items: seedData.invoice_items || []
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      // quota limit fallback
    }
  }

  const saveStore = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
  };

  const getUnitAbbr = (unitId: string) => {
    const u = store.units.find((item: any) => item.id === unitId);
    return u ? u.abbreviation : '';
  };

  const getCategory = (catId: string) => {
    return store.categories.find((item: any) => item.id === catId);
  };

  window.api = {
    company: {
      get: async () => store.company_details[0] || null,
      update: async (details: any) => {
        store.company_details[0] = { ...store.company_details[0], ...details };
        saveStore();
        return store.company_details[0];
      }
    },
    units: {
      list: async () => [...store.units].sort((a: any, b: any) => a.name.localeCompare(b.name)),
      create: async (data: any) => {
        const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data };
        store.units.push(item);
        saveStore();
        return item;
      },
      update: async (id: string, data: any) => {
        const idx = store.units.findIndex((u: any) => u.id === id);
        if (idx >= 0) {
          store.units[idx] = { ...store.units[idx], ...data };
          saveStore();
          return store.units[idx];
        }
        throw new Error('Unit not found');
      }
    },
    categories: {
      list: async () => [...store.categories].sort((a: any, b: any) => a.name.localeCompare(b.name)),
      create: async (data: any) => {
        const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data };
        store.categories.push(item);
        saveStore();
        return item;
      },
      update: async (id: string, data: any) => {
        const idx = store.categories.findIndex((c: any) => c.id === id);
        if (idx >= 0) {
          store.categories[idx] = { ...store.categories[idx], ...data };
          saveStore();
          return store.categories[idx];
        }
        throw new Error('Category not found');
      },
      delete: async (id: string) => {
        store.categories = store.categories.filter((c: any) => c.id !== id);
        saveStore();
      }
    },
    customers: {
      list: async (isGuest?: boolean) => {
        let list = [...store.customers];
        if (typeof isGuest === 'boolean') {
          list = list.filter((c: any) => Boolean(c.is_guest) === isGuest);
        }
        return list.sort((a: any, b: any) => a.name.localeCompare(b.name));
      },
      get: async (id: string) => {
        const found = store.customers.find((c: any) => c.id === id);
        if (!found) throw new Error('Customer not found');
        return found;
      },
      create: async (data: any) => {
        const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data };
        store.customers.push(item);
        saveStore();
        return item;
      },
      update: async (id: string, data: any) => {
        const idx = store.customers.findIndex((c: any) => c.id === id);
        if (idx >= 0) {
          store.customers[idx] = { ...store.customers[idx], ...data };
          saveStore();
          return store.customers[idx];
        }
        throw new Error('Customer not found');
      }
    },
    products: {
      list: async () => {
        return store.products.map((p: any) => ({
          ...p,
          units: { abbreviation: getUnitAbbr(p.unit_id) },
          categories: getCategory(p.category_id)
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
      },
      get: async (id: string) => {
        const p = store.products.find((prod: any) => prod.id === id);
        if (!p) throw new Error('Product not found');
        return {
          ...p,
          units: { abbreviation: getUnitAbbr(p.unit_id) },
          categories: getCategory(p.category_id)
        };
      },
      create: async (data: any) => {
        const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data };
        store.products.push(item);
        saveStore();
        return item;
      },
      update: async (id: string, data: any) => {
        const idx = store.products.findIndex((p: any) => p.id === id);
        if (idx >= 0) {
          store.products[idx] = { ...store.products[idx], ...data };
          saveStore();
          return store.products[idx];
        }
        throw new Error('Product not found');
      }
    },
    purchases: {
      list: async () => {
        return store.purchases.map((pur: any) => {
          const prod = store.products.find((p: any) => p.id === pur.product_id);
          return {
            ...pur,
            products: prod ? { name: prod.name, unit_price: prod.unit_price } : null
          };
        }).sort((a: any, b: any) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime());
      },
      create: async (data: any) => {
        const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data };
        store.purchases.push(item);
        // update stock
        const prod = store.products.find((p: any) => p.id === data.product_id);
        if (prod) prod.stock_quantity = (prod.stock_quantity || 0) + Number(data.quantity);
        saveStore();
        return item;
      },
      update: async (id: string, data: any) => {
        const idx = store.purchases.findIndex((p: any) => p.id === id);
        if (idx >= 0) {
          store.purchases[idx] = { ...store.purchases[idx], ...data };
          saveStore();
          return store.purchases[idx];
        }
        throw new Error('Purchase not found');
      },
      delete: async (id: string) => {
        store.purchases = store.purchases.filter((p: any) => p.id !== id);
        saveStore();
      }
    },
    invoices: {
      list: async () => {
        return store.invoices.map((inv: any) => {
          const cust = store.customers.find((c: any) => c.id === inv.customer_id);
          return {
            ...inv,
            customers: cust ? { name: cust.name } : null
          };
        }).sort((a: any, b: any) => new Date(b.created_at || b.invoice_date).getTime() - new Date(a.created_at || a.invoice_date).getTime());
      },
      get: async (id: string) => {
        const inv = store.invoices.find((i: any) => i.id === id);
        if (!inv) throw new Error('Invoice not found');
        const cust = store.customers.find((c: any) => c.id === inv.customer_id);
        const items = store.invoice_items
          .filter((item: any) => item.invoice_id === id)
          .map((item: any) => {
            const prod = store.products.find((p: any) => p.id === item.product_id);
            return {
              ...item,
              products: prod ? {
                name: prod.name,
                hsn_code: prod.hsn_code,
                unit_price: prod.unit_price,
                tax_rate: prod.tax_rate,
                units: { abbreviation: getUnitAbbr(prod.unit_id) }
              } : null
            };
          });
        return {
          ...inv,
          customers: cust,
          invoice_items: items
        };
      },
      create: async (invoiceData: any, items: any[]) => {
        const invId = crypto.randomUUID();
        const newInvoice = {
          id: invId,
          created_at: new Date().toISOString(),
          ...invoiceData
        };
        store.invoices.push(newInvoice);

        for (const item of items) {
          const itemRecord = {
            id: crypto.randomUUID(),
            invoice_id: invId,
            created_at: new Date().toISOString(),
            ...item
          };
          store.invoice_items.push(itemRecord);
          // Decrease stock
          const prod = store.products.find((p: any) => p.id === item.product_id);
          if (prod) {
            prod.stock_quantity = Math.max(0, (prod.stock_quantity || 0) - Number(item.quantity));
          }
        }
        saveStore();
        return newInvoice;
      },
      update: async (id: string, invoiceData: any, items: any[]) => {
        const idx = store.invoices.findIndex((i: any) => i.id === id);
        if (idx >= 0) {
          store.invoices[idx] = { ...store.invoices[idx], ...invoiceData };
          store.invoice_items = store.invoice_items.filter((it: any) => it.invoice_id !== id);
          for (const item of items) {
            store.invoice_items.push({
              id: crypto.randomUUID(),
              invoice_id: id,
              created_at: new Date().toISOString(),
              ...item
            });
          }
          saveStore();
          return store.invoices[idx];
        }
        throw new Error('Invoice not found');
      },
      delete: async (id: string) => {
        store.invoices = store.invoices.filter((i: any) => i.id !== id);
        store.invoice_items = store.invoice_items.filter((it: any) => it.invoice_id !== id);
        saveStore();
      }
    },
    reports: {
      combined: async (start: string, end: string, type: string, limit: number, offset: number) => {
        const all = await window.api.reports.exportCombined(start, end, type);
        return all.slice(offset, offset + limit);
      },
      combinedCount: async (start: string, end: string, type: string) => {
        const all = await window.api.reports.exportCombined(start, end, type);
        return all.length;
      },
      exportCombined: async (start: string, end: string, type: string) => {
        const s = new Date(start).getTime();
        const e = new Date(end).getTime() + (24 * 60 * 60 * 1000) - 1;
        const res: any[] = [];

        if (type === 'ALL' || type === 'SALE') {
          for (const inv of store.invoices) {
            const time = new Date(inv.invoice_date).getTime();
            if (time >= s && time <= e) {
              const cust = store.customers.find((c: any) => c.id === inv.customer_id);
              res.push({
                type: 'SALE',
                date: inv.invoice_date,
                reference: inv.invoice_number,
                party_name: cust?.name || 'Walk-in Customer',
                amount: inv.total_amount || 0
              });
            }
          }
        }

        if (type === 'ALL' || type === 'PURCHASE') {
          for (const pur of store.purchases) {
            const time = new Date(pur.purchase_date).getTime();
            if (time >= s && time <= e) {
              const prod = store.products.find((p: any) => p.id === pur.product_id);
              res.push({
                type: 'PURCHASE',
                date: pur.purchase_date,
                reference: pur.reference_invoice || 'Purchase',
                party_name: prod ? `${prod.name} (Qty: ${pur.quantity})` : 'Purchase',
                amount: (pur.quantity || 0) * (prod?.unit_price || 0)
              });
            }
          }
        }

        return res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      productStock: async (productId: string) => {
        const items = store.invoice_items.filter((it: any) => it.product_id === productId);
        return items.map((it: any) => {
          const inv = store.invoices.find((i: any) => i.id === it.invoice_id);
          const cust = inv ? store.customers.find((c: any) => c.id === inv.customer_id) : null;
          return {
            ...it,
            invoices: inv ? {
              invoice_number: inv.invoice_number,
              invoice_date: inv.invoice_date,
              customers: cust ? { name: cust.name } : null
            } : null
          };
        });
      }
    },
    health: {
      ping: async () => 'pong (offline)'
    }
  };
}
