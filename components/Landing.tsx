import React from 'react';
import { ViewState } from '../types';

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background with glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-divine-gold/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
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
      <div className="absolute bottom-0 w-full glass-panel border-t border-divine-gold/10 p-6 hidden md:flex justify-center gap-12 text-sm text-gray-400 font-sans">
         <div className="flex items-center gap-2">
           <i className="fa-solid fa-microphone text-divine-gold"></i> Live AI Panditji
         </div>
         <div className="flex items-center gap-2">
           <i className="fa-solid fa-chart-pie text-divine-gold"></i> Precision Panchang
         </div>
         <div className="flex items-center gap-2">
           <i className="fa-solid fa-heart text-divine-gold"></i> Kundli Matching
         </div>
         <div className="flex items-center gap-2">
           <i className="fa-solid fa-download text-divine-gold"></i> Offline Ready
         </div>
      </div>
    </div>
  );
};

export default Landing;