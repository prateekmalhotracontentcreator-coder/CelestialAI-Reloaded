# CelestialAI 🌌

**CelestialAI** is a Progressive Web App (PWA) that blends ancient Vedic Astrology with modern Generative AI. It features real-time audio conversations with an AI Panditji, precise Panchang calculations, and Kundli matching.

![Status](https://img.shields.io/badge/Status-Beta-orange)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20Gemini%202.5-blue)

## 🌟 Key Features

*   **AI Panditji (Live Audio):** Speak directly to a Vedic Sage using Gemini 2.5 Flash Native Audio. Includes real-time "Cosmic Wave" visualization.
*   **Precision Dashboard:** Solar intensity graphs, Rahu Kaal tracking, and daily Panchang based on geolocation (Delhi default).
*   **Kundli Engine:** Offline astrological matching algorithms (Guna Milan) and birth chart analysis.
*   **Cosmic Blog:** Static content engine for astrological insights.
*   **PWA Ready:** Installable on iOS and Android.

## 🚀 Deployment (Wave 1)

### 1. Prerequisites
You need a Google Cloud Project with the Gemini API enabled.
*   Get API Key: [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Variables
**Crucial:** Do not commit your API Key to GitHub.

**Local Development:**
Create a `.env` file in the root directory:
```bash
API_KEY=AIzaSyYourKeyHere...
```

**Vercel Deployment:**
1.  Push this repo to GitHub.
2.  Import project into Vercel.
3.  In **Settings > Environment Variables**, add:
    *   **Key:** `API_KEY`
    *   **Value:** `AIzaSy...`

## 🏗️ Architecture

*   **Frontend:** React 19 + TypeScript
*   **Styling:** Tailwind CSS (Glassmorphism / Space Theme)
*   **AI:** `@google/genai` SDK (Gemini 2.5 Flash)
*   **Visualization:** HTML5 Canvas (Wave Methodology)
*   **Charts:** Recharts

## 🛡️ Privacy

This app uses the Microphone for the AI interaction. Audio data is streamed to Google Gemini for processing and is not stored permanently on our servers.

---
*© 2025 CelestialAI - Om Shanti*