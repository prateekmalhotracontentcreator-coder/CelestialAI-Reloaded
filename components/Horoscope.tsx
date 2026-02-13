import React, { useState } from 'react';
import { ZODIAC_SIGNS, generateHoroscope } from '../constants';
import { ZodiacSign } from '../types';

interface HoroscopeProps {
  date: Date;
}

const Horoscope: React.FC<HoroscopeProps> = ({ date }) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  const renderSignList = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {ZODIAC_SIGNS.map((sign) => (
        <button
          key={sign.id}
          onClick={() => setSelectedSign(sign)}
          className="glass-panel p-4 rounded-xl flex flex-col items-center gap-3 hover:bg-white/5 transition-all group border border-transparent hover:border-divine-gold/50"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-space-dark to-black flex items-center justify-center border border-white/10 group-hover:border-divine-gold/50 shadow-lg">
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
    // Generate prediction based on the selected sign and the app-wide selected date
    const predictionText = generateHoroscope(sign.name, date);
    
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setSelectedSign(null)}
          className="flex items-center text-gray-400 hover:text-divine-gold text-sm mb-4"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Signs
        </button>

        <div className="glass-panel p-8 rounded-xl border border-divine-gold/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <i className={`fa-solid ${sign.icon} text-9xl text-divine-gold`}></i>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-divine-gold to-divine-amber flex items-center justify-center text-space-black text-2xl shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                  <i className={`fa-solid ${sign.icon}`}></i>
               </div>
               <div>
                 <h2 className="text-3xl font-serif text-white">{sign.name}</h2>
                 <p className="text-divine-gold text-sm font-medium">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
               </div>
            </div>

            <p className="font-sans text-gray-200 leading-relaxed text-lg mb-8">
              {predictionText}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6">
              <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase">Lucky Color</span>
                <span className="text-divine-amber font-medium">Crimson Red</span>
              </div>
               <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase">Lucky No</span>
                <span className="text-divine-amber font-medium">7</span>
              </div>
               <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase">Remedy</span>
                <span className="text-divine-amber font-medium">Offer Water to Sun</span>
              </div>
               <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase">Mood</span>
                <span className="text-divine-amber font-medium">Energetic</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button className="p-3 rounded-full bg-white/5 hover:bg-divine-gold/20 text-divine-gold transition-colors" title="Listen">
                <i className="fa-solid fa-volume-high"></i>
              </button>
              <button className="p-3 rounded-full bg-white/5 hover:bg-divine-gold/20 text-divine-gold transition-colors" title="Share">
                <i className="fa-solid fa-share-nodes"></i>
              </button>
            </div>
          </div>
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
             Predictions for <span className="text-white">{date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>. Select your Rashi.
           </p>
        </header>
      )}
      {selectedSign ? renderPrediction(selectedSign) : renderSignList()}
    </div>
  );
};

export default Horoscope;