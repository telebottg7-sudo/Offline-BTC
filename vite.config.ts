import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // We only enable the electron plugin if explicitly requested via env var.
    // This allows the AI Studio web preview to continue working without crashing
    // the dev server by attempting to launch a GUI in a headless container.
    const isElectron = process.env.ELECTRON === 'true';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      plugins: [
        react(),
        isElectron && electron({
          main: {
            entry: 'electron/main.ts',
          },
          preload: {
            input: path.join(__dirname, 'electron/preload.ts'),
          },
          renderer: process.env.NODE_ENV === 'test' ? undefined : {},
        }),
      ].filter(Boolean),
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
