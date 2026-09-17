import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Plugin to prevent Vite from crashing when firebase-applet-config.json is missing during GitHub export
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
