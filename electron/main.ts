import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initDatabase } from './database/db';
import { runMigrations } from './database/migrations';
import { registerIpcHandlers } from './ipc/handlers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setup a diagnostic log file in userData directory so crashes can be inspected
function logDiagnostic(message: string, error?: any) {
  try {
    const userDataPath = app.getPath('userData');
    const logFile = path.join(userDataPath, 'app_startup.log');
    const timestamp = new Date().toISOString();
    const errorDetails = error ? (error.stack || error.message || String(error)) : '';
    const line = `[${timestamp}] ${message} ${errorDetails}\n`;
    fs.appendFileSync(logFile, line);
    console.log(message, error || '');
  } catch (e) {
    console.error('Failed to write diagnostic log:', e);
  }
}

// Global crash handlers
process.on('uncaughtException', (error) => {
  logDiagnostic('FATAL uncaughtException in main process:', error);
  dialog.showErrorBox(
    'BioTechCentre Application Error',
    `An unexpected error occurred during startup:\n\n${error.message || error}\n\nPlease check logs in %APPDATA%/BioTechCentre/app_startup.log`
  );
});

process.on('unhandledRejection', (reason) => {
  logDiagnostic('Unhandled rejection in main process:', reason);
});

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  logDiagnostic('Initializing application window...');

  // Always create and display the window immediately so the app opens reliably
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    show: false, // Prevent white flash until ready
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Display window when ready
  mainWindow.once('ready-to-show', () => {
    logDiagnostic('Window ready-to-show, making window visible.');
    mainWindow?.show();
  });

  // Track renderer errors
  mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDescription) => {
    logDiagnostic(`Failed to load page: ${errorCode} - ${errorDescription}`);
  });

  // Register IPC and Database asynchronously so database failure does not freeze window launch
  try {
    logDiagnostic('Initializing local SQLite database...');
    await initDatabase();
    logDiagnostic('Running database schema and seed migrations...');
    await runMigrations();
    logDiagnostic('Registering IPC handlers...');
    registerIpcHandlers();
    logDiagnostic('Database & IPC initialization successful.');
  } catch (error: any) {
    logDiagnostic('Database or IPC initialization error:', error);
    // Notify the user but keep the window open so it does not silently quit
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'Database Notice',
      message: 'Notice during database initialization: ' + (error?.message || error),
      detail: 'The app will continue running. Check app_startup.log for technical details.'
    });
  }

  // Load the web application bundle
  if (process.env.VITE_DEV_SERVER_URL) {
    logDiagnostic(`Loading development URL: ${process.env.VITE_DEV_SERVER_URL}`);
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Check possible locations for index.html in production / ASAR
    const candidatePaths = [
      path.join(__dirname, '../dist/index.html'),
      path.join(__dirname, 'dist/index.html'),
      path.join(app.getAppPath(), 'dist/index.html')
    ];

    const indexPath = candidatePaths.find(p => fs.existsSync(p)) || candidatePaths[0];
    logDiagnostic(`Loading production file from: ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }
}

// Single instance lock to prevent duplicate conflicting processes
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  logDiagnostic('Another instance is already running. Quitting duplicate process.');
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    logDiagnostic('Electron app ready. Calling createWindow().');
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  logDiagnostic('All windows closed. Quitting.');
  if (process.platform !== 'darwin') app.quit();
});
