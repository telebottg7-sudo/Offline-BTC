# BIOTECHCENTRE - Offline Desktop ERP & Invoicing Application

A 100% offline desktop application built with Electron, React, TypeScript, and local SQLite. No internet connection or cloud subscriptions required.

---

## 💻 How to Run & Use on Your PC

### Step 1: Install Node.js
If you haven't installed Node.js yet, download and install **Node.js (LTS version)** from [nodejs.org](https://nodejs.org/).

---

### Step 2: Install Dependencies
Open your command prompt or terminal in the application directory and run:
```bash
npm install
```

---

### Step 3: Run the Desktop App
To start the desktop application with the Electron window and local SQLite database:
```bash
npm run desktop:dev
```
- Electron will open an independent desktop application window.
- The app initializes your SQLite database (`biotechcentre.sqlite`) inside your system application data folder:
  - **Windows:** `%APPDATA%\biotechcentre\biotechcentre.sqlite`
  - **macOS:** `~/Library/Application Support/biotechcentre/biotechcentre.sqlite`
  - **Linux:** `~/.config/biotechcentre/biotechcentre.sqlite`
- All your Supabase records (invoices, products, customers, company details) are automatically seeded on first launch.

---

### Step 4: Build Executable Installers (.exe)
To package the app into a full Windows installer (`.exe`) and portable executable:
```bash
npm run desktop:dist
```
The generated installers will be in the `release/` folder.

---

## 🚀 Automated GitHub Actions Build

A GitHub Workflow is configured at `.github/workflows/build-desktop.yml`:
1. Push your repository to GitHub.
2. In your repository, navigate to the **Actions** tab.
3. Click **Build Desktop Executable Release** → **Run workflow**.
4. The workflow will automatically compile on Windows & Ubuntu and provide downloadable executable binaries (`.exe`, `.AppImage`, `.deb`) under GitHub Actions **Artifacts** or **Releases** (when pushing a version tag like `v1.0.0`).

---

## 🗄️ Database & Offline Storage Architecture

- **Engine:** Local SQLite with WAL (Write-Ahead Logging) mode and foreign key integrity.
- **Transactions:** Multi-item invoice creations and stock deductions run in atomic transactions.
- **Security:** Strict IPC isolation — renderer process communicates only through context-isolated `window.api` handlers.
- **Supabase Independence:** No external cloud network dependencies. Your business records remain private on your computer.

### Backup / Sync Tools
- `npm run supabase:download`: Downloads the latest database snapshot from Supabase into `database_data/seed_data.json` and `database_data/import.sql`.
- `npm run migrate:supabase`: Migrates remote Supabase records directly into your local SQLite database.
