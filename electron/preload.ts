import { contextBridge, ipcRenderer } from 'electron';

// Expose secure IPC APIs to the renderer process (React)
contextBridge.exposeInMainWorld('api', {
  company: {
    get: () => ipcRenderer.invoke('company:get'),
    update: (data: any) => ipcRenderer.invoke('company:update', data),
  },
  units: {
    list: () => ipcRenderer.invoke('units:list'),
    create: (data: any) => ipcRenderer.invoke('units:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('units:update', id, data),
  },
  categories: {
    list: () => ipcRenderer.invoke('categories:list'),
    create: (data: any) => ipcRenderer.invoke('categories:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('categories:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('categories:delete', id),
  },
  customers: {
    list: (isGuest?: boolean) => ipcRenderer.invoke('customers:list', isGuest),
    get: (id: string) => ipcRenderer.invoke('customers:get', id),
    create: (data: any) => ipcRenderer.invoke('customers:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('customers:update', id, data),
  },
  products: {
    list: () => ipcRenderer.invoke('products:list'),
    get: (id: string) => ipcRenderer.invoke('products:get', id),
    create: (data: any) => ipcRenderer.invoke('products:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('products:update', id, data),
  },
  purchases: {
    list: () => ipcRenderer.invoke('purchases:list'),
    create: (data: any) => ipcRenderer.invoke('purchases:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('purchases:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('purchases:delete', id),
  },
  invoices: {
    list: () => ipcRenderer.invoke('invoices:list'),
    get: (id: string) => ipcRenderer.invoke('invoices:get', id),
    create: (invoiceData: any, items: any[]) => ipcRenderer.invoke('invoices:create', invoiceData, items),
    update: (id: string, invoiceData: any, items: any[]) => ipcRenderer.invoke('invoices:update', id, invoiceData, items),
    delete: (id: string) => ipcRenderer.invoke('invoices:delete', id),
  },
  reports: {
    combined: (start: string, end: string, type: string, limit: number, offset: number) => ipcRenderer.invoke('reports:combined', start, end, type, limit, offset),
    combinedCount: (start: string, end: string, type: string) => ipcRenderer.invoke('reports:combinedCount', start, end, type),
    exportCombined: (start: string, end: string, type: string) => ipcRenderer.invoke('reports:exportCombined', start, end, type),
    productStock: (productId: string) => ipcRenderer.invoke('reports:productStock', productId),
  },
  health: {
    ping: () => ipcRenderer.invoke('health:ping'),
  }
});

