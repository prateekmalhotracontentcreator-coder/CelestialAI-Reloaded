import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const envPath = path.resolve(process.cwd(), '.env');
  const hasEnvFile = fs.existsSync(envPath);
  
  // DIAGNOSTIC LOGGING (Appears in Terminal)
  console.log("\n\n✨ ------------------------------------------------ ✨");
  console.log("🔭 CELESTIAL AI: SYSTEM CHECK");
  console.log("📂 Working Directory:", process.cwd());
  
  if (hasEnvFile) {
      console.log("✅ .env file FOUND at:", envPath);
  } else {
      console.log("❌ .env file NOT FOUND.");
      console.log("   Expected location:", envPath);
      console.log("   Make sure you are in the correct folder!");
  }
  
  if (env.API_KEY) {
      console.log("✅ API_KEY loaded successfully!");
  } else {
      console.log("❌ API_KEY is missing in loaded environment.");
  }
  
  if (env.VITE_FIREBASE_PROJECT_ID) {
      console.log("✅ Firebase ID loaded:", env.VITE_FIREBASE_PROJECT_ID);
  } else {
      console.log("❌ Firebase Config NOT FOUND.");
  }
  console.log("✨ ------------------------------------------------ ✨\n\n");

  // Explicitly define process.env variables for the client
  const processEnvValues = {
    'process.env.API_KEY': JSON.stringify(env.API_KEY),
    'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
    'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
    'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
    'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
    'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID),
  };

  return {
    plugins: [react()],
    define: processEnvValues,
    server: {
      port: 3000
    }
  };
});