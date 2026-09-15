import { ipcMain } from 'electron';
import * as company from '../database/repositories/company';
import * as units from '../database/repositories/units';
import * as categories from '../database/repositories/categories';
import * as customers from '../database/repositories/customers';
import * as products from '../database/repositories/products';
import * as purchases from '../database/repositories/purchases';
import * as invoices from '../database/repositories/invoices';
import * as reports from '../database/repositories/reports';

export function registerIpcHandlers() {
  // Company
  ipcMain.handle('company:get', () => company.getCompanyDetails());
  ipcMain.handle('company:update', (_, data) => company.updateCompanyDetails(data));
  
  // Units
  ipcMain.handle('units:list', () => units.getUnits());
  ipcMain.handle('units:create', (_, data) => units.createUnit(data));
  ipcMain.handle('units:update', (_, id, data) => units.updateUnit(id, data));

  // Categories
  ipcMain.handle('categories:list', () => categories.getCategories());
  ipcMain.handle('categories:create', (_, data) => categories.createCategory(data));
  ipcMain.handle('categories:update', (_, id, data) => categories.updateCategory(id, data));
  ipcMain.handle('categories:delete', (_, id) => categories.deleteCategory(id));

  // Customers
  ipcMain.handle('customers:list', (_, isGuest) => customers.getCustomers(isGuest));
  ipcMain.handle('customers:get', (_, id) => customers.getCustomer(id));
  ipcMain.handle('customers:create', (_, data) => customers.createCustomer(data));
  ipcMain.handle('customers:update', (_, id, data) => customers.updateCustomer(id, data));

  // Products
  ipcMain.handle('products:list', () => products.getProducts());
  ipcMain.handle('products:get', (_, id) => products.getProduct(id));
  ipcMain.handle('products:create', (_, data) => products.createProduct(data));
  ipcMain.handle('products:update', (_, id, data) => products.updateProduct(id, data));

  // Purchases
  ipcMain.handle('purchases:list', () => purchases.getPurchases());
  ipcMain.handle('purchases:create', (_, data) => purchases.createPurchase(data));
  ipcMain.handle('purchases:update', (_, id, data) => purchases.updatePurchase(id, data));
  ipcMain.handle('purchases:delete', (_, id) => purchases.deletePurchase(id));

  // Invoices
  ipcMain.handle('invoices:list', () => invoices.getInvoices());
  ipcMain.handle('invoices:get', (_, id) => invoices.getInvoice(id));
  ipcMain.handle('invoices:create', (_, invoiceData, items) => invoices.createInvoice(invoiceData, items));
  ipcMain.handle('invoices:update', (_, id, invoiceData, items) => invoices.updateInvoice(id, invoiceData, items));
  ipcMain.handle('invoices:delete', (_, id) => invoices.deleteInvoice(id));

  // Reports
  ipcMain.handle('reports:combined', (_, start, end, type, limit, offset) => reports.getCombinedReport(start, end, type, limit, offset));
  ipcMain.handle('reports:combinedCount', (_, start, end, type) => reports.getCombinedReportCount(start, end, type));
  ipcMain.handle('reports:exportCombined', (_, start, end, type) => reports.exportCombinedReport(start, end, type));
  ipcMain.handle('reports:productStock', (_, productId) => reports.getProductStockReport(productId));

  // Health
  ipcMain.handle('health:ping', () => 'pong');
}
