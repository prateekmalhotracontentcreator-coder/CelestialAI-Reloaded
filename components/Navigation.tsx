import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: ViewState.HOROSCOPE, label: 'Horoscope', icon: 'fa-star' },
    { id: ViewState.BLOG, label: 'Insights', icon: 'fa-book-open' }, // Added Blog
    { id: ViewState.PANDITJI, label: 'AI Panditji', icon: 'fa-om', special: true },
    { id: ViewState.KUNDLI, label: 'Kundli', icon: 'fa-scroll' },
    { id: ViewState.ADMIN, label: 'Admin', icon: 'fa-user-cog' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-panel border-r border-divine-gold/20 z-50">
        <div className="p-6 text-center border-b border-divine-gold/20">
          <h1 className="font-serif text-2xl text-divine-gold font-bold tracking-widest cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
            CELESTIAL<span className="text-white">AI</span>
          </h1>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                currentView === item.id 
                  ? 'bg-divine-gold/20 text-divine-gold border border-divine-gold/30 shadow-[0_0_15px_rgba(217,119,6,0.15)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg ${item.special ? 'text-divine-amber animate-pulse' : ''} group-hover:scale-110 transition-transform`}></i>
              <span className="font-sans font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-divine-gold/20 text-xs text-gray-500 text-center font-sans">
          &copy; 2025 CelestialAI
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-divine-gold/20 z-50 flex justify-around items-center px-2 py-3 pb-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              currentView === item.id ? 'text-divine-gold' : 'text-gray-500'
            }`}
          >
            <div className={`text-xl ${currentView === item.id ? 'transform -translate-y-1' : ''} transition-transform`}>
               <i className={`fa-solid ${item.icon} ${item.special ? 'text-divine-amber' : ''}`}></i>
            </div>
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;