import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const [projectId, setProjectId] = useState<string>('Checking...');
  const [configError, setConfigError] = useState<boolean>(false);

  useEffect(() => {
    // Read the Project ID from the environment to confirm .env is loaded
    const id = process.env.VITE_FIREBASE_PROJECT_ID;
    
    // Check if .env is missing or empty
    if (!id || id.trim() === '') {
        setProjectId('MISSING_ENV_FILE');
        setConfigError(true);
    } else {
        setProjectId(id);
        setConfigError(false);
    }
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background with glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-divine-gold/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Configuration Doctor Modal - Appears if .env is missing */}
      {configError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
              <div className="bg-gray-900 border-2 border-red-500 rounded-xl max-w-lg w-full p-8 text-left shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-pulse-slow">
                  <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation"></i> Configuration Missing
                  </h2>
                  <p className="text-gray-300 mb-4">
                      The application cannot find your <strong>.env</strong> file. This usually means the server was started from the wrong folder.
                  </p>
                  
                  <div className="bg-black/50 p-4 rounded border border-gray-700 font-mono text-sm text-gray-400 mb-6">
                      <p className="text-white mb-2 font-bold">Try this in your Terminal:</p>
                      <ol className="list-decimal list-inside space-y-2">
                          <li>Stop server (<span className="text-red-400">Ctrl + C</span>).</li>
                          <li>Go to Downloads: <br/><span className="text-green-400 pl-4">cd Downloads</span></li>
                          <li>Go to Folder (use quotes!): <br/><span className="text-green-400 pl-4">cd "celestialai (1)"</span></li>
                          <li>Start again: <span className="text-yellow-500">npm run dev</span></li>
                      </ol>
                  </div>
                  
                  <button 
                    onClick={() => setConfigError(false)}
                    className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded font-bold transition-colors"
                  >
                      I Understand, Continue Anyway
                  </button>
              </div>
          </div>
      )}

      {/* Content */}
      <div className="z-10 max-w-4xl space-y-8 animate-fade-in-up">
        <div className="mb-6 inline-block">
          <i className="fa-solid fa-star-of-david text-6xl text-divine-gold animate-pulse-slow"></i>
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-divine-gold via-divine-glow to-white tracking-wider">
          CELESTIAL<span className="font-light text-white">AI</span>
        </h1>
        
        <p className="font-sans text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Where Ancient Vedic Wisdom meets Modern Artificial Intelligence.
          <br />
          <span className="text-divine-gold/80 text-base mt-2 block">
            Daily Horoscope • Kundli Matching • AI Spiritual Guide
          </span>
        </p>

        <div className="pt-8">
          <button 
            onClick={onEnter}
            className="group relative px-10 py-4 bg-divine-gold text-space-black rounded-full font-serif font-bold text-lg tracking-widest overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:shadow-[0_0_50px_rgba(217,119,6,0.6)] transition-all"
          >
            <span className="relative z-10">ENTER THE COSMOS</span>
            <div className="absolute inset-0 bg-white/30 transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      {/* Feature Grid Mini */}
      <div className="absolute bottom-0 w-full glass-panel border-t border-divine-gold/10 p-6 hidden md:flex justify-between items-center text-sm text-gray-400 font-sans">
         <div className="flex gap-12">
            <div className="flex items-center gap-2">
            <i className="fa-solid fa-microphone text-divine-gold"></i> Live AI Panditji
            </div>
            <div className="flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-divine-gold"></i> Precision Panchang
            </div>
            <div className="flex items-center gap-2">
            <i className="fa-solid fa-heart text-divine-gold"></i> Kundli Matching
            </div>
         </div>
         
         {/* System ID Indicator - Helps verify .env loading */}
         <div className="text-[10px] font-mono text-gray-600 border border-gray-800 px-2 py-1 rounded bg-black/40">
             SYSTEM ID: <span className={configError ? "text-red-500 font-bold animate-pulse" : "text-emerald-500"}>{projectId}</span>
         </div>
      </div>
    </div>
  );
};

export default Landing;