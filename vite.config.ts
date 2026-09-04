import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Plugin to prevent Vite from crashing when firebase-applet-config.json is missing during GitHub export
function firebaseConfigPlugin() {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  return {
    name: 'firebase-config-plugin',
    resolveId(id: string) {
      if (id.includes('firebase-applet-config.json')) {
        return '\0firebase-applet-config.json';
      }
    },
    load(id: string) {
      if (id === '\0firebase-applet-config.json') {
        if (fs.existsSync(configPath)) {
          return `export default ${fs.readFileSync(configPath, 'utf-8')};`;
        } else {
          return `export default {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBPobsHpRVFbi4PKiomkK-46hYr1ylhSec",
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "direct-stone-dxctm.firebaseapp.com",
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "direct-stone-dxctm",
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "direct-stone-dxctm.firebasestorage.app",
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "993642021377",
            appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:993642021377:web:98bdd8dc2f5d577e283600",
            firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-fastarc-21912eff-20ad-4387-bde5-7cb20bed357a"
          };`;
        }
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), firebaseConfigPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
