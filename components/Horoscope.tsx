import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ZODIAC_SIGNS, generateHoroscope } from '../constants';
import { ZodiacSign } from '../types';
import { db, doc, getDoc } from '../services/firebase';

interface HoroscopeProps {
  date: Date;
}

interface AIHoroscopeResult {
  prediction: string;
  luckyColor: string;
  luckyNumber: string;
  remedy: string;
  mood: string;
}

const Horoscope: React.FC<HoroscopeProps> = ({ date }) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<AIHoroscopeResult | null>(null);
  const [sourceType, setSourceType] = useState<'cache' | 'db' | 'live'>('live');

  // Effect to trigger AI fetch when a sign is selected
  useEffect(() => {
    if (selectedSign) {
      fetchAIHoroscope(selectedSign);
    }
  }, [selectedSign, date]);

  const fetchAIHoroscope = async (sign: ZodiacSign) => {
    // 1. Generate Keys
    // Important: We use local date string to ensure consistency across timezones for the "daily" key
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`; // YYYY-MM-DD
    
    const localCacheKey = `celestial_horoscope_${sign.id}_${dateKey}`;
    
    // 2. LEVEL 1: Check Local Storage (Browser Cache)
    const cachedResult = localStorage.getItem(localCacheKey);

    if (cachedResult) {
      console.log(`✨ Serving ${sign.name} from Browser Cache`);
      try {
        setAiData(JSON.parse(cachedResult));
        setSourceType('cache');
        return; 
      } catch (e) {
        localStorage.removeItem(localCacheKey);
      }
    }

    setLoading(true);
    setAiData(null);
    setSourceType('live');

    try {
      // 3. LEVEL 2: Check Firebase (Global Community Cache)
      if (db) {
        try {
          // We store all 12 signs in a single document for the day: 'horoscopes/YYYY-MM-DD'
          const docRef = doc(db, "daily_horoscopes", dateKey);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const signData = data[sign.id]; // Access specific sign data

            if (signData) {
              console.log(`🔥 Serving ${sign.name} from Firebase Global DB`);
              setAiData(signData);
              setSourceType('db');
              // Save to local cache for next time
              localStorage.setItem(localCacheKey, JSON.stringify(signData));
              setLoading(false);
              return;
            }
          }
        } catch (dbError) {
          console.warn("Firebase fetch failed, falling back to live API", dbError);
        }
      }

      // 4. LEVEL 3: Live Generation (Fallback)
      if (!process.env.API_KEY) {
        throw new Error("API Key missing");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      
      const prompt = `Act as an expert Vedic Astrologer. Generate a daily horoscope for ${sign.name} for the date ${dateString}.
      
      Return ONLY a JSON object with the following specific fields:
      {
        "prediction": "A concise, spiritual, and practical prediction (max 60 words).",
        "luckyColor": "A single color name",
        "luckyNumber": "A single number",
        "remedy": "A short, actionable Vedic remedy (max 6 words)",
        "mood": "One word to describe the day's energy"
      }
      Do not include markdown code blocks. Just the raw JSON string.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        const parsedData = JSON.parse(text);
        
        // Save to Local Cache
        localStorage.setItem(localCacheKey, JSON.stringify(parsedData));
        
        // Note: We DO NOT write to Firebase from here to secure the DB. 
        // Only the Admin Panel writes to the Global DB.
        
        setAiData(parsedData);
      } else {
        throw new Error("Empty response");
      }

    } catch (error) {
      console.error("Horoscope Fetch Error:", error);
      // Fallback to static data if API fails
      const fallbackData = {
        prediction: generateHoroscope(sign.name, date),
        luckyColor: "Golden",
        luckyNumber: "9",
        remedy: "Chant Om",
        mood: "Peaceful"
      };
      setAiData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const renderSignList = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
      {ZODIAC_SIGNS.map((sign) => (
        <button
          key={sign.id}
          onClick={() => setSelectedSign(sign)}
          className="glass-panel p-4 rounded-xl flex flex-col items-center gap-3 hover:bg-white/5 transition-all group border border-transparent hover:border-divine-gold/50"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-space-dark to-black flex items-center justify-center border border-white/10 group-hover:border-divine-gold/50 shadow-lg transition-transform group-hover:scale-110">
            <i className={`fa-solid ${sign.icon} text-xl text-divine-amber`}></i>
          </div>
          <div className="text-center">
            <h4 className="font-serif font-bold text-white group-hover:text-divine-gold">{sign.name}</h4>
            <span className="text-[10px] text-gray-500">{sign.dateRange}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderPrediction = (sign: ZodiacSign) => {
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setSelectedSign(null)}
          className="flex items-center text-gray-400 hover:text-divine-gold text-sm mb-4 transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Signs
        </button>

        <div className="glass-panel p-8 rounded-xl border border-divine-gold/30 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
          
          {/* Background Icon Watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <i className={`fa-solid ${sign.icon} text-9xl text-divine-gold`}></i>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-6">
               <div className="relative">
                 <div className="w-16 h-16 rounded-full border-4 border-divine-gold/30 border-t-divine-gold animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <i className="fa-solid fa-star text-divine-gold/50 text-xs animate-pulse"></i>
                 </div>
               </div>
               <p className="font-serif text-divine-gold text-lg animate-pulse tracking-widest">CONSULTING THE STARS...</p>
            </div>
          ) : aiData ? (
            <div className="relative z-10 animate-fade-in-up">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-divine-gold to-divine-amber flex items-center justify-center text-space-black text-2xl shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                    <i className={`fa-solid ${sign.icon}`}></i>
                 </div>
                 <div>
                   <div className="flex items-center gap-3">
                     <h2 className="text-3xl font-serif text-white">{sign.name}</h2>
                     {sourceType !== 'live' && (
                       <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${sourceType === 'db' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-white/10 border-white/5 text-gray-400'}`} title={sourceType === 'db' ? "Fetched from Global Database" : "Fetched from Local Cache"}>
                         <i className={`fa-solid ${sourceType === 'db' ? 'fa-globe' : 'fa-bolt'} mr-1`}></i> {sourceType === 'db' ? 'Global' : 'Instant'}
                       </span>
                     )}
                   </div>
                   <p className="text-divine-gold text-sm font-medium">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                 </div>
              </div>

              <p className="font-sans text-gray-200 leading-relaxed text-lg mb-8 border-l-2 border-divine-gold/50 pl-4 italic">
                "{aiData.prediction}"
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6">
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Lucky Color</span>
                  <span className="text-divine-amber font-medium">{aiData.luckyColor}</span>
                </div>
                 <div className="text-center p-3 rounded-lg bg-white/5">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Lucky No</span>
                  <span className="text-divine-amber font-medium">{aiData.luckyNumber}</span>
                </div>
                 <div className="text-center p-3 rounded-lg bg-white/5">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Remedy</span>
                  <span className="text-divine-amber font-medium text-sm">{aiData.remedy}</span>
                </div>
                 <div className="text-center p-3 rounded-lg bg-white/5">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Mood</span>
                  <span className="text-divine-amber font-medium">{aiData.mood}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button className="p-3 rounded-full bg-white/5 hover:bg-divine-gold/20 text-divine-gold transition-colors" title="Listen to prediction">
                  <i className="fa-solid fa-volume-high"></i>
                </button>
                <button className="p-3 rounded-full bg-white/5 hover:bg-divine-gold/20 text-divine-gold transition-colors" title="Share prediction">
                  <i className="fa-solid fa-share-nodes"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-400">
              <p>Failed to align with the cosmos. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {!selectedSign && (
        <header className="mb-8">
           <h2 className="text-3xl font-serif text-divine-gold">Daily Horoscope</h2>
           <p className="text-gray-400 font-sans">
             AI-Powered Predictions for <span className="text-white">{date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>. Select your Rashi.
           </p>
        </header>
      )}
      {selectedSign ? renderPrediction(selectedSign) : renderSignList()}
    </div>
  );
};

export default Horoscope;