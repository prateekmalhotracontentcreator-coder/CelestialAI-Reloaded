import React, { useState } from 'react';
import { BirthDetails } from '../types';
import { performLocalMatchMaking, getBirthChartDetails } from '../services/vedicAstrology';

type Mode = 'chart' | 'match';

const Kundli: React.FC = () => {
  const [mode, setMode] = useState<Mode>('chart');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [person1, setPerson1] = useState<BirthDetails>({
    name: '',
    gender: 'male',
    date: '',
    time: '',
    place: 'Delhi' // Default for local calc
  });

  const [person2, setPerson2] = useState<BirthDetails>({
    name: '',
    gender: 'female',
    date: '',
    time: '',
    place: 'Delhi' // Default for local calc
  });

  const handleInputChange = (
    person: 'p1' | 'p2',
    field: keyof BirthDetails,
    value: string
  ) => {
    if (person === 'p1') {
      setPerson1((prev) => ({ ...prev, [field]: value }));
    } else {
      setPerson2((prev) => ({ ...prev, [field]: value }));
    }
  };

  const generateAnalysis = async () => {
    // Basic Validation
    if (!person1.date || !person1.time || (mode === 'match' && (!person2.date || !person2.time))) {
      alert("Please fill in all Date and Time fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate calculation delay for effect
    setTimeout(() => {
      try {
        let output = '';

        if (mode === 'chart') {
           output = getBirthChartDetails({
             name: person1.name || 'User',
             dob: person1.date,
             time: person1.time
           });
        } else {
           const matchResult = performLocalMatchMaking(
             { name: person1.name || 'Boy', dob: person1.date, time: person1.time },
             { name: person2.name || 'Girl', dob: person2.date, time: person2.time }
           );

           output = `### Match Score: ${matchResult.score} / 36\n` +
                    `**Verdict:** ${matchResult.compatibility}\n\n` +
                    `${matchResult.analysis}\n\n` +
                    `**Recommendations:**\n${matchResult.recommendations}`;
        }

        setResult(output);
      } catch (error) {
        console.error(error);
        setResult("Error calculating astrological data. Please check dates.");
      } finally {
        setLoading(false);
      }
    }, 1500); // 1.5s delay for "cosmic calculation" feel
  };

  const renderInputForm = (person: 'p1' | 'p2', title?: string) => {
    const data = person === 'p1' ? person1 : person2;
    return (
      <div className="space-y-4">
        {title && <h3 className="text-divine-gold font-serif text-lg border-b border-divine-gold/20 pb-2 mb-4">{title}</h3>}
        
        <div>
          <label className="block text-xs text-gray-500 uppercase mb-1">Full Name</label>
          <input
            type="text"
            className="w-full bg-space-dark border border-divine-gold/30 rounded p-2 text-white focus:outline-none focus:border-divine-gold transition-colors"
            value={data.name}
            onChange={(e) => handleInputChange(person, 'name', e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full bg-space-dark border border-divine-gold/30 rounded p-2 text-white focus:outline-none focus:border-divine-gold [color-scheme:dark]"
              value={data.date}
              onChange={(e) => handleInputChange(person, 'date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Time of Birth</label>
            <input
              type="time"
              className="w-full bg-space-dark border border-divine-gold/30 rounded p-2 text-white focus:outline-none focus:border-divine-gold [color-scheme:dark]"
              value={data.time}
              onChange={(e) => handleInputChange(person, 'time', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase mb-1">Place of Birth (City)</label>
          <input
            type="text"
            className="w-full bg-space-dark border border-divine-gold/30 rounded p-2 text-white focus:outline-none focus:border-divine-gold"
            value={data.place}
            onChange={(e) => handleInputChange(person, 'place', e.target.value)}
            placeholder="City"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif text-divine-gold">Vedic Kundli</h2>
          <p className="text-gray-400 font-sans">
            Deep analysis of birth charts and compatibility (Offline Mode).
          </p>
        </div>
        
        {/* Toggle Switch */}
        <div className="glass-panel p-1 rounded-lg flex">
          <button
            onClick={() => { setMode('chart'); setResult(null); }}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${mode === 'chart' ? 'bg-divine-gold text-space-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Birth Chart
          </button>
          <button
            onClick={() => { setMode('match'); setResult(null); }}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${mode === 'match' ? 'bg-divine-gold text-space-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Matchmaking
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-divine-gold/20">
            {mode === 'chart' ? (
              renderInputForm('p1')
            ) : (
              <div className="space-y-8">
                {renderInputForm('p1', 'Boy\'s Details')}
                {renderInputForm('p2', 'Girl\'s Details')}
              </div>
            )}

            <button
              onClick={generateAnalysis}
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-divine-gold to-divine-amber text-space-black font-serif font-bold tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> CALCULATING COSMIC ALIGNMENT...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-scroll"></i> {mode === 'chart' ? 'GENERATE KUNDLI' : 'CHECK COMPATIBILITY'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:h-full min-h-[400px]">
          {result ? (
            <div className="glass-panel p-8 rounded-xl border border-divine-gold/30 h-full overflow-y-auto max-h-[800px] animate-fade-in custom-scrollbar">
              <div className="text-center mb-6">
                <i className="fa-solid fa-om text-4xl text-divine-gold mb-2"></i>
                <h3 className="text-2xl font-serif text-white">
                  {mode === 'chart' ? 'Birth Chart Analysis' : 'Compatibility Report'}
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-divine-gold to-transparent mx-auto mt-4"></div>
              </div>
              
              <div className="prose prose-invert prose-gold max-w-none font-sans text-gray-300 leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-xl border border-white/5 h-full flex flex-col items-center justify-center text-center opacity-50">
               <div className="w-32 h-32 rounded-full border border-dashed border-gray-600 flex items-center justify-center mb-4">
                 <i className="fa-solid fa-star text-4xl text-gray-700"></i>
               </div>
               <p className="text-gray-500 font-sans max-w-xs">
                 {mode === 'chart' 
                   ? "Enter your birth details to reveal your planetary positions and life path." 
                   : "Enter details for both individuals to analyze their celestial compatibility."}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kundli;