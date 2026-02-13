# CelestialAI 🌌

**CelestialAI** is a Progressive Web App (PWA) that blends ancient Vedic Astrology with modern Generative AI. It features real-time audio conversations with an AI Panditji, precise Panchang calculations, and Kundli matching.

![Status](https://img.shields.io/badge/Status-Beta-orange)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20Gemini%202.5-blue)
![Architecture](https://img.shields.io/badge/Arch-Hybrid%20Cloud-purple)

## 🌐 Live Demo
[https://celestial-ai-reloaded.vercel.app](https://celestial-ai-reloaded.vercel.app)

## 🌟 Key Features

*   **AI Panditji (Live Audio):** Speak directly to a Vedic Sage using Gemini 2.5 Flash Native Audio. Includes real-time "Cosmic Wave" visualization.
*   **Daily Horoscope Engine (Hybrid):** Implements a "Generate Once, Serve Many" architecture. 
    *   *Admin* generates daily insights via Gemini.
    *   *Users* fetch instantly from Global Cache (Firebase).
    *   *Fallback* to live AI generation if cache misses.
*   **Precision Dashboard:** Solar intensity graphs, Rahu Kaal tracking, and daily Panchang based on geolocation (Delhi default).
*   **Kundli Engine:** Offline astrological matching algorithms (Guna Milan) and birth chart analysis.
*   **PWA Ready:** Installable on iOS and Android.

## 🚀 How to Run (Troubleshooting Guide)

If you see "Other Project" in your terminal, follow these steps to switch to Celestial AI:

1.  **Stop Current Server:** Click Terminal > Press `Ctrl + C`.
2.  **Check Location:** Type `ls` (Mac) or `dir` (Windows) to see current folders.
3.  **Enter Project Folder:** Type `cd celestial-ai-pwa` (or whatever you named your folder).
4.  **Install Dependencies:** `npm install` (Only needed once).
5.  **Start Server:** `npm run dev`.

## 🚀 Deployment (Wave 2: Hybrid Cloud)

To enable the full "Global Cache" features, you need both Gemini API and Firebase Firestore.

### 1. Gemini API (The Brain)
*   Get API Key: [Google AI Studio](https://aistudio.google.com/)

### 2. Firebase Firestore (The Memory)
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a project -> Add Web App.
3.  Enable **Firestore Database** (Start in **Test Mode** for now).
4.  Enable **Authentication** -> **Google** Sign-in provider.
5.  Copy your config keys.

### 3. Environment Variables
Create a `.env` file in the root directory. **Do not commit this file.**

```bash
# Gemini API KEY
API_KEY=AIzaSy...

# Firebase Config (VITE_ prefix is required for frontend access)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
VITE_FIREBASE_APP_ID=1:123456...
```

---

*© 2025 CelestialAI - Om Shanti*