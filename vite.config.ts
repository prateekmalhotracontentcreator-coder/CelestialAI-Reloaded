import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      rollupOptions: {
        external: ['@google/genai'],
        output: {
          paths: {
            '@google/genai': 'https://esm.sh/@google/genai'
          }
        }
      }
    },
    server: {
      port: 3000
    }
  };
});