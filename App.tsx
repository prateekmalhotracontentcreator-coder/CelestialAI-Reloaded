import React, { useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Horoscope from './components/Horoscope';
import AIPanditji from './components/AIPanditji';
import Kundli from './components/Kundli';
import Blog from './components/Blog';
import Landing from './components/Landing';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Check API Key status from environment
  const isApiConfigured = !!process.env.API_KEY;

  // Simple Router Switch
  const renderView = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return <Landing onEnter={() => setCurrentView(ViewState.DASHBOARD)} />;
      case ViewState.DASHBOARD:
        return <Dashboard date={selectedDate} setDate={setSelectedDate} />;
      case ViewState.HOROSCOPE:
        return <Horoscope date={selectedDate} />;
      case ViewState.PANDITJI:
        return <AIPanditji />;
      case ViewState.KUNDLI:
        return <Kundli />;
      case ViewState.BLOG:
        return <Blog />;
      case ViewState.ADMIN:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
             <i className="fa-solid fa-lock text-6xl mb-4 text-divine-gold/50"></i>
             <h2 className="text-2xl font-serif text-white mb-2">Admin Panel</h2>
             <p>Batch generation controls restricted to authorized personnel.</p>
          </div>
        );
      default:
        return <Dashboard date={selectedDate} setDate={setSelectedDate} />;
    }
  };

  if (currentView === ViewState.LANDING) {
    return (
      <>
        <Landing onEnter={() => setCurrentView(ViewState.DASHBOARD)} />
        <SpeedInsights />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-space-black text-gray-100 flex font-sans">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
        {/* Unified Top Header */}
        <header className="h-16 glass-panel border-b border-divine-gold/20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 backdrop-blur-md">
           
           {/* Branding (Mobile Only - Desktop has Sidebar) */}
           <div className="flex items-center">
              <div className="md:hidden">
                <h1 className="font-serif text-lg text-divine-gold font-bold tracking-widest">
                  CELESTIAL<span className="text-white">AI</span>
                </h1>
              </div>
              {/* Desktop Breadcrumb/Title Placeholder */}
              <div className="hidden md:block text-gray-400 text-sm font-medium uppercase tracking-wide">
                {currentView}
              </div>
           </div>

           {/* Top Right: API Status & User Profile */}
           <div className="flex items-center gap-4">
              {/* API Status Indicator */}
              <div 
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border tracking-widest transition-all ${
                  isApiConfigured 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
                title={isApiConfigured ? "Gemini API Connected" : "API Key Not Found in Environment"}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isApiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></div>
                {isApiConfigured ? 'COSMIC LINK ACTIVE' : 'COSMIC LINK OFFLINE'}
              </div>
              
              {/* Notifications */}
              <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-divine-gold transition-colors relative">
                <i className="fa-regular fa-bell"></i>
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-divine-gold rounded-full"></span>
              </button>

              {/* User Profile */}
              <button className="w-8 h-8 rounded-full bg-gradient-to-br from-divine-gold to-divine-amber flex items-center justify-center text-space-black font-bold shadow-lg hover:scale-105 transition-transform">
                <i className="fa-solid fa-user"></i>
              </button>
           </div>
        </header>

        {/* View Content */}
        <div className="flex-1">
          {renderView()}
        </div>
      </main>
      <SpeedInsights />
    </div>
  );
};

export default App;