import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ZODIAC_SIGNS } from '../constants';
import { db, auth, doc, setDoc } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { UserProfile } from '../types';

// ⚠️ SECURITY: REPLACE WITH YOUR GOOGLE EMAIL ADDRESS
const ADMIN_EMAILS = ['YOUR_EMAIL@gmail.com']; 

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'batch' | 'users'>('batch');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Batch State
  const [targetDate, setTargetDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  
  const [status, setStatus] = useState<string>('IDLE');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // User Management State
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Monitor Auth State
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser && currentUser.email && ADMIN_EMAILS.includes(currentUser.email)) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Fetch Users when tab changes
  useEffect(() => {
    if (activeTab === 'users' && isAuthorized && db) {
        fetchUsers();
    }
  }, [activeTab, isAuthorized]);

  const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
          const q = query(collection(db, "users"));
          const querySnapshot = await getDocs(q);
          const users: UserProfile[] = [];
          querySnapshot.forEach((doc) => {
              users.push(doc.data() as UserProfile);
          });
          // Sort by join date descending
          users.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
          setUsersList(users);
      } catch (e) {
          console.error("Error fetching users:", e);
          addLog("❌ Error fetching user list");
      } finally {
          setLoadingUsers(false);
      }
  };

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    setIsAuthorized(false);
  };

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const runBatchGeneration = async () => {
    if (!process.env.API_KEY) {
      addLog("❌ Error: API Key missing in environment");
      return;
    }
    if (!db) {
        addLog("❌ Error: Firebase not configured");
        return;
    }

    setStatus('RUNNING');
    setProgress(0);
    setLogs([]);
    addLog(`🚀 Starting Batch Generation for ${targetDate}...`);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const fullDayData: Record<string, any> = {};
    const dateObj = new Date(targetDate);
    const dateString = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    try {
      for (let i = 0; i < ZODIAC_SIGNS.length; i++) {
        const sign = ZODIAC_SIGNS[i];
        addLog(`🔮 Generating for ${sign.name}...`);
        
        const prompt = `Act as an expert Vedic Astrologer. Generate a daily horoscope for ${sign.name} for the date ${dateString}.
        Return ONLY a JSON object with: prediction, luckyColor, luckyNumber, remedy, mood.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        if (response.text) {
            fullDayData[sign.id] = JSON.parse(response.text);
            addLog(`✅ ${sign.name} Generated.`);
        } else {
            addLog(`⚠️ Empty response for ${sign.name}`);
        }

        setProgress(Math.round(((i + 1) / ZODIAC_SIGNS.length) * 100));
        await new Promise(r => setTimeout(r, 500));
      }

      addLog(`💾 Saving Batch to Firebase: daily_horoscopes/${targetDate}...`);
      
      await setDoc(doc(db, "daily_horoscopes", targetDate), fullDayData);
      
      addLog(`✨ SUCCESS! Cosmic Data for ${targetDate} is live.`);
      setStatus('COMPLETED');

    } catch (error: any) {
        console.error(error);
        addLog(`❌ Fatal Error: ${error.message}`);
        setStatus('ERROR');
    }
  };

  // Login Gate
  if (!user) {
     return (
        <div className="p-8 max-w-md mx-auto h-full flex flex-col justify-center text-center">
            <div className="glass-panel p-8 rounded-xl border border-divine-gold/30">
                <div className="w-16 h-16 rounded-full bg-divine-gold/20 flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-user-lock text-3xl text-divine-gold"></i>
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">Backend Management</h2>
                <p className="text-gray-400 text-sm mb-8">
                    Authorized Personnel Only.
                </p>
                <button 
                    onClick={handleLogin}
                    className="w-full py-3 bg-white text-space-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    Admin Login
                </button>
            </div>
        </div>
     );
  }

  // Unauthorized Gate
  if (!isAuthorized) {
    return (
        <div className="p-8 max-w-md mx-auto h-full flex flex-col justify-center text-center">
            <div className="glass-panel p-8 rounded-xl border border-red-500/30">
                <i className="fa-solid fa-ban text-5xl text-red-500 mb-6"></i>
                <h2 className="text-2xl font-serif text-white mb-2">Access Denied</h2>
                <p className="text-gray-400 text-sm mb-6">
                    The account <strong>{user.email}</strong> is not authorized to access the Cosmic Backend.
                </p>
                <div className="bg-red-500/10 p-4 rounded text-left text-xs text-red-300 font-mono mb-6 break-all border border-red-500/20">
                    <p className="mb-2 text-white font-bold opacity-50 uppercase">Update components/Admin.tsx:</p>
                    const ADMIN_EMAILS = ['{user.email}'];
                </div>
                <button 
                    onClick={handleLogout}
                    className="px-6 py-2 border border-white/20 rounded hover:bg-white/10 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
  }

  const premiumCount = usersList.filter(u => u.membershipTier === 'PREMIUM').length;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full flex flex-col pb-24 md:pb-8">
      <header className="mb-6 flex justify-between items-center border-b border-divine-gold/20 pb-4">
        <div>
            <h2 className="text-3xl font-serif text-divine-gold">Process Manager</h2>
            <p className="text-gray-400 font-sans text-xs mt-1">
            Logged in as <span className="text-white font-bold">{user.email}</span> (Admin)
            </p>
        </div>
        <button 
            onClick={handleLogout} 
            className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1 rounded-full bg-red-500/10"
        >
            EXIT
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'batch' ? 'bg-divine-gold text-space-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <i className="fa-solid fa-microchip mr-2"></i> Batch Engine
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-divine-gold text-space-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <i className="fa-solid fa-users mr-2"></i> User Overview
          </button>
      </div>

      {activeTab === 'batch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Controls */}
            <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-divine-gold/30">
                <h3 className="text-white font-bold mb-4">Daily Horoscope Generation</h3>
                
                <div className="mb-6">
                    <label className="block text-xs text-gray-500 uppercase mb-2">Target Date</label>
                    <input 
                    type="date" 
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-space-dark border border-gray-700 rounded p-2 text-white outline-none focus:border-divine-gold [color-scheme:dark]"
                    />
                </div>

                <button 
                    onClick={runBatchGeneration}
                    disabled={status === 'RUNNING'}
                    className={`w-full py-4 rounded-lg font-bold tracking-widest transition-all ${
                        status === 'RUNNING' 
                        ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                        : 'bg-divine-gold text-space-black hover:bg-divine-amber shadow-lg hover:shadow-divine-gold/20'
                    }`}
                >
                    {status === 'RUNNING' ? 'PROCESSING...' : 'START BATCH PROCESS'}
                </button>
            </div>

            {status === 'RUNNING' && (
                <div className="glass-panel p-6 rounded-xl text-center animate-pulse">
                    <div className="text-4xl text-divine-gold mb-2">{progress}%</div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-divine-gold h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Connecting to Gemini AI...</p>
                </div>
            )}
            </div>

            {/* Logs */}
            <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col h-[400px]">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 border-b border-gray-800 pb-2">Process Logs</h3>
            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 p-2 custom-scrollbar bg-black/40 rounded">
                {logs.length === 0 && <span className="text-gray-600 italic">Waiting for command...</span>}
                {logs.map((log, idx) => (
                    <div key={idx} className={`${log.includes('Error') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-green-400' : 'text-gray-300'}`}>
                        {log}
                    </div>
                ))}
            </div>
            </div>
        </div>
      )}

      {activeTab === 'users' && (
          <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-xl border border-white/10">
                      <span className="text-xs text-gray-500 uppercase">Total Users</span>
                      <p className="text-2xl font-bold text-white mt-1">{usersList.length}</p>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border border-divine-gold/20">
                      <span className="text-xs text-gray-500 uppercase">Premium Members</span>
                      <p className="text-2xl font-bold text-divine-gold mt-1">{premiumCount}</p>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border border-white/10">
                      <span className="text-xs text-gray-500 uppercase">Conversion Rate</span>
                      <p className="text-2xl font-bold text-emerald-400 mt-1">
                          {usersList.length > 0 ? ((premiumCount / usersList.length) * 100).toFixed(1) : 0}%
                      </p>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border border-white/10">
                       <span className="text-xs text-gray-500 uppercase">Database</span>
                       <p className="text-xs font-mono text-gray-300 mt-2 truncate">users</p>
                  </div>
              </div>

              {/* User Table */}
              <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                  <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                      <h3 className="text-white font-bold">Registered Seekers</h3>
                      <button onClick={fetchUsers} className="text-xs text-divine-gold hover:underline">
                          <i className="fa-solid fa-rotate mr-1"></i> Refresh
                      </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {loadingUsers ? (
                        <div className="p-8 text-center text-gray-500">
                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Loading Data...
                        </div>
                    ) : usersList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No users found in database.</div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-white/5 text-gray-300 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Name / Email</th>
                                    <th className="px-6 py-3">Joined</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Birth Info</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {usersList.map((u) => (
                                    <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                                    {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full" /> : <i className="fa-solid fa-user text-xs"></i>}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{u.displayName}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(u.joinedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.membershipTier === 'PREMIUM' ? 'bg-divine-gold text-space-black' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                                                {u.membershipTier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.birthDetails && u.birthDetails.place ? (
                                                <span className="text-emerald-400 text-xs"><i className="fa-solid fa-check"></i> Complete</span>
                                            ) : (
                                                <span className="text-gray-600 text-xs">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Admin;