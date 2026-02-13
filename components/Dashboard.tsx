import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { getPanchang } from '../constants';

interface DashboardProps {
  date: Date;
  setDate: (date: Date) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ date, setDate }) => {
  const panchang = getPanchang(date);
  const hasAbhijit = panchang.abhijitStart > 0;

  // Logic-based generation of time data for the graph
  const generateTimeData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      // Simulate sun intensity (bell curve peaking at noon)
      // Standardize sun curve: max at 12, 0 at 6 and 18
      let intensity = 0;
      if (i >= 6 && i <= 18) {
         intensity = Math.sin(((i - 6) / 12) * Math.PI) * 100;
      }
      
      data.push({
        time: `${i}:00`,
        hour: i, // Numeric value for XAxis
        intensity: Math.max(0, intensity),
      });
    }
    return data;
  };

  const timeData = generateTimeData();

  // Helper to format local date to YYYY-MM-DD for the input value
  // This avoids the toISOString() UTC conversion which causes day shift issues
  const toLocalISOString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateString = toLocalISOString(date);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const parts = e.target.value.split('-');
      // Create date at 12:00 PM local time to avoid timezone boundary issues
      const newDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
      setDate(newDate);
    }
  };

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-divine-gold">Cosmic Dashboard</h2>
          <p className="text-gray-400 font-sans">
             Celestial alignment for <span className="text-white font-semibold">{dayName}, {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>.
          </p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-lg border border-divine-gold/30 flex items-center gap-3">
            <span className="text-divine-gold text-sm font-medium uppercase tracking-wider">Select Date:</span>
            <input 
              type="date" 
              value={dateString}
              onChange={handleDateChange}
              className="bg-transparent text-white font-sans outline-none cursor-pointer [color-scheme:dark] hover:text-divine-amber transition-colors"
            />
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panchang Card */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-divine-gold/20 pb-2">
            <i className="fa-solid fa-calendar-day text-divine-amber text-xl"></i>
            <h3 className="text-xl font-serif text-white">Daily Panchang</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
             <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase">Tithi</span>
                <p className="text-lg font-medium text-divine-gold">{panchang.tithi}</p>
             </div>
             <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase">Nakshatra</span>
                <p className="text-lg font-medium text-divine-gold">{panchang.nakshatra}</p>
             </div>
             <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase">Yoga</span>
                <p className="text-lg font-medium text-divine-gold">{panchang.yoga}</p>
             </div>
             <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase">Sunrise / Sunset</span>
                <p className="text-md text-white"><i className="fa-regular fa-sun text-yellow-500 mr-2"></i>{panchang.sunrise} / {panchang.sunset}</p>
             </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between border-l-4 border-l-status-rahu">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Rahu Kaal (Avoid)</span>
              <h4 className="text-lg md:text-xl font-bold text-white mt-1">{panchang.rahuKaal}</h4>
            </div>
            <i className="fa-solid fa-ban text-status-rahu opacity-50 text-3xl self-end"></i>
          </div>
          <div className={`glass-panel p-6 rounded-xl flex flex-col justify-between border-l-4 ${hasAbhijit ? 'border-l-status-emerald' : 'border-l-gray-500'}`}>
             <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Abhijit Muhurat (Good)</span>
              <h4 className={`text-lg md:text-xl font-bold mt-1 ${hasAbhijit ? 'text-white' : 'text-gray-500'}`}>{panchang.abhijitMuhurat}</h4>
            </div>
            {hasAbhijit ? (
               <i className="fa-solid fa-check-circle text-status-emerald opacity-50 text-3xl self-end"></i>
            ) : (
               <i className="fa-solid fa-circle-xmark text-gray-500 opacity-50 text-3xl self-end"></i>
            )}
          </div>
        </div>

        {/* TimeChart */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 h-[350px] flex flex-col min-w-0">
           <div className="flex items-center justify-between mb-4 shrink-0">
             <h3 className="text-xl font-serif text-white">Solar Intensity & Timings</h3>
             <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-status-rahu/30 border border-status-rahu rounded-sm"></div> Rahu Kaal</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-status-emerald/30 border border-status-emerald rounded-sm"></div> Abhijit</span>
             </div>
           </div>
           
           <div className="w-full flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={timeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                 
                 {/* XAxis must be type='number' and dataKey must point to a number to support accurate ReferenceArea placement */}
                 <XAxis 
                   dataKey="hour" 
                   type="number" 
                   domain={[0, 24]} 
                   tickCount={13} 
                   interval={1}
                   stroke="#666" 
                   fontSize={10}
                   tickFormatter={(tick) => `${tick}:00`}
                 />
                 
                 <YAxis hide domain={[0, 110]} />
                 
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #d97706', borderRadius: '8px' }}
                    itemStyle={{ color: '#d97706' }}
                    labelFormatter={(label) => `${label}:00`}
                 />
                 
                 {/* Dynamic Rahu Kaal Zone */}
                 <ReferenceArea 
                    x1={panchang.rahuStart} 
                    x2={panchang.rahuEnd} 
                    strokeOpacity={0} 
                    fill="#ef4444" 
                    fillOpacity={0.15} 
                 />
                 
                 {/* Dynamic Abhijit Zone (Only render if valid) */}
                 {hasAbhijit && (
                    <ReferenceArea 
                        x1={panchang.abhijitStart} 
                        x2={panchang.abhijitEnd} 
                        strokeOpacity={0} 
                        fill="#10b981" 
                        fillOpacity={0.15} 
                    />
                 )}

                 <Area 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#d97706" 
                    fillOpacity={1} 
                    fill="url(#colorIntensity)" 
                    animationDuration={1500}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;