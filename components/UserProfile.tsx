import React, { useState, useEffect } from 'react';
import { auth, db, doc, getDoc, setDoc } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { UserProfile, BirthDetails } from '../types';

const UserProfileComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'membership' | 'system'>('details');
  const [healthStatus, setHealthStatus] = useState<{api: boolean, db: boolean, auth: boolean}>({
      api: !!process.env.API_KEY,
      db: !!db,
      auth: !!auth
  });

  // Local state for editing
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    name: '',
    gender: 'male',
    date: '',
    time: '',
    place: ''
  });

  // 1. Monitor Auth State
  useEffect(() => {
    // Check connection status on mount
    setHealthStatus({
        api: !!process.env.API_KEY,
        db: !!db,
        auth: !!auth
    });

    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch or Create User Profile in Firestore
  const fetchUserProfile = async (currentUser: User) => {
    if (!db) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setProfile(data);
        if (data.birthDetails) setBirthDetails(data.birthDetails);
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Seeker',
          photoURL: currentUser.photoURL || '',
          membershipTier: 'FREE',
          joinedAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!auth) {
        alert("Firebase Auth is not initialized. Please restart your server to load the .env file.");
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      alert(`Login Failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    setProfile(null);
  };

  const handleSaveDetails = async () => {
    if (!user || !db) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { birthDetails }, { merge: true });
      
      setProfile(prev => prev ? { ...prev, birthDetails } : null);
      setEditMode(false);
    } catch (e) {
      console.error("Error saving details:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user || !db) return;
    setSaving(true);
    // Simulate Payment API Call
    setTimeout(async () => {
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { membershipTier: 'PREMIUM' }, { merge: true });
            setProfile(prev => prev ? { ...prev, membershipTier: 'PREMIUM' } : null);
            alert("✨ Cosmic Upgrade Successful! You are now an Astral Voyager.");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    }, 1500);
  };

  const runDiagnostics = async () => {
      // Re-check values
      const status = {
          api: !!process.env.API_KEY,
          db: !!db,
          auth: !!auth
      };
      setHealthStatus(status);
      
      if (!status.db) {
          alert("Database connection missing. Did you restart the server after creating .env?");
          return;
      }
      alert("System Check Passed: Configuration Loaded.");
  };

  if (loading) {
    return (
        <div className="h-full flex items-center justify-center">
            <i className="fa-solid fa-circle-notch fa-spin text-divine-gold text-3xl"></i>
        </div>
    );
  }

  // --- UNAUTHENTICATED STATE ---
  if (!user) {
    return (
      <div className="p-8 max-w-md mx-auto h-full flex flex-col justify-center text-center pb-24 md:pb-8">
        <div className="glass-panel p-8 rounded-xl border border-divine-gold/30 shadow-[0_0_50px_rgba(217,119,6,0.1)] animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-divine-gold/20 flex items-center justify-center mx-auto mb-6 relative">
            <i className="fa-solid fa-user-astronaut text-4xl text-divine-gold"></i>
            <div className="absolute inset-0 border border-divine-gold/40 rounded-full animate-ping opacity-20"></div>
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Member Access</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Create your cosmic profile to save your birth chart, unlock detailed Kundli matching, and access the Astral Voyager features.
          </p>
          <button 
            onClick={handleLogin}
            disabled={!auth}
            className={`w-full py-3 font-bold rounded-lg transition-colors flex items-center justify-center gap-3 ${!auth ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white text-space-black hover:bg-gray-200'}`}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className={`w-5 h-5 ${!auth ? 'grayscale opacity-50' : ''}`} alt="Google" />
            Continue with Google
          </button>
          
          <div className="mt-8 pt-4 border-t border-white/10 text-xs text-gray-500">
             <p className="mb-2 uppercase tracking-wider">System Status</p>
             <div className="flex justify-center gap-4 mb-4">
                 <span className={healthStatus.api ? "text-green-500" : "text-red-500"} title="Gemini API Key">
                     <i className={`fa-solid ${healthStatus.api ? 'fa-check-circle' : 'fa-times-circle'}`}></i> AI
                 </span>
                 <span className={healthStatus.db ? "text-green-500" : "text-red-500"} title="Firestore Database">
                     <i className={`fa-solid ${healthStatus.db ? 'fa-check-circle' : 'fa-times-circle'}`}></i> DB
                 </span>
                 <span className={healthStatus.auth ? "text-green-500" : "text-red-500"} title="Firebase Auth">
                     <i className={`fa-solid ${healthStatus.auth ? 'fa-check-circle' : 'fa-times-circle'}`}></i> Auth
                 </span>
             </div>

             {/* HELP SECTION FOR NON-TECHNICAL USERS */}
             {(!healthStatus.db || !healthStatus.auth) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-left">
                    <p className="text-red-400 font-bold mb-2"><i className="fa-solid fa-power-off mr-1"></i> Restart Required</p>
                    <p className="text-gray-400 leading-relaxed mb-2">To load your new <code className="text-white bg-white/10 px-1 rounded">.env</code> file:</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300">
                        <li>Locate your <strong>Terminal</strong> window</li>
                        <li>Press <code className="text-white bg-white/10 px-1 rounded">Ctrl + C</code> to stop</li>
                        <li>Type <code className="text-white bg-white/10 px-1 rounded">npm run dev</code> to start</li>
                    </ol>
                </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED STATE ---
  const isPremium = profile?.membershipTier === 'PREMIUM';

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
             <img src={user.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="w-16 h-16 rounded-full border-2 border-divine-gold" />
             <div>
                 <h2 className="text-2xl font-serif text-white">{user.displayName}</h2>
                 <p className="text-sm text-gray-400">{user.email}</p>
                 <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isPremium ? 'bg-divine-gold text-space-black' : 'bg-gray-700 text-gray-300'}`}>
                    {profile?.membershipTier === 'PREMIUM' ? 'Astral Voyager' : 'Cosmic Novice'}
                 </span>
             </div>
        </div>
        <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500/30 text-red-400 text-sm rounded hover:bg-red-500/10 transition-colors"
        >
            Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
         <button 
           onClick={() => setActiveTab('details')}
           className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'details' ? 'border-divine-gold text-divine-gold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
         >
           Birth Details
         </button>
         <button 
           onClick={() => setActiveTab('membership')}
           className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'membership' ? 'border-divine-gold text-divine-gold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
         >
           Membership Plan
         </button>
         <button 
           onClick={() => setActiveTab('system')}
           className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'system' ? 'border-divine-gold text-divine-gold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
         >
           <i className="fa-solid fa-microchip mr-2"></i> System
         </button>
      </div>

      {/* Tab Content: Birth Details */}
      {activeTab === 'details' && (
        <div className="glass-panel p-6 rounded-xl border border-divine-gold/20 animate-fade-in">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-serif text-white">Your Cosmic Coordinates</h3>
             <button 
               onClick={() => setEditMode(!editMode)}
               className="text-divine-gold text-sm hover:underline"
             >
               {editMode ? 'Cancel' : 'Edit Details'}
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div>
                  <label className="block text-xs text-gray-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    disabled={!editMode}
                    value={birthDetails.name}
                    onChange={(e) => setBirthDetails({...birthDetails, name: e.target.value})}
                    className="w-full bg-space-dark border border-gray-700 rounded p-3 text-white disabled:opacity-50 disabled:border-transparent"
                    placeholder="Enter your name"
                  />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 uppercase mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    disabled={!editMode}
                    value={birthDetails.date}
                    onChange={(e) => setBirthDetails({...birthDetails, date: e.target.value})}
                    className="w-full bg-space-dark border border-gray-700 rounded p-3 text-white disabled:opacity-50 disabled:border-transparent [color-scheme:dark]"
                  />
               </div>
             </div>
             
             <div className="space-y-4">
               <div>
                  <label className="block text-xs text-gray-500 uppercase mb-1">Time of Birth</label>
                  <input 
                    type="time" 
                    disabled={!editMode}
                    value={birthDetails.time}
                    onChange={(e) => setBirthDetails({...birthDetails, time: e.target.value})}
                    className="w-full bg-space-dark border border-gray-700 rounded p-3 text-white disabled:opacity-50 disabled:border-transparent [color-scheme:dark]"
                  />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 uppercase mb-1">Place of Birth</label>
                  <input 
                    type="text" 
                    disabled={!editMode}
                    value={birthDetails.place}
                    onChange={(e) => setBirthDetails({...birthDetails, place: e.target.value})}
                    className="w-full bg-space-dark border border-gray-700 rounded p-3 text-white disabled:opacity-50 disabled:border-transparent"
                    placeholder="City, Country"
                  />
               </div>
             </div>
           </div>

           {editMode && (
             <div className="mt-8 flex justify-end">
               <button 
                 onClick={handleSaveDetails}
                 disabled={saving}
                 className="px-8 py-3 bg-divine-gold text-space-black font-bold rounded-lg hover:bg-divine-amber transition-colors"
               >
                 {saving ? 'Saving...' : 'Save Coordinates'}
               </button>
             </div>
           )}
        </div>
      )}

      {/* Tab Content: Membership */}
      {activeTab === 'membership' && (
        <div className="animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Free Plan */}
              <div className={`glass-panel p-6 rounded-xl border-2 flex flex-col ${!isPremium ? 'border-gray-500 bg-gray-800/30' : 'border-transparent opacity-60'}`}>
                 <h3 className="text-xl font-serif text-gray-300">Cosmic Novice</h3>
                 <p className="text-3xl font-bold text-white mt-2">Free</p>
                 <ul className="mt-6 space-y-3 flex-1 text-sm text-gray-400">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> Daily Horoscope</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> Basic Panchang</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> Limited AI Chat</li>
                 </ul>
                 <button disabled className="mt-6 w-full py-3 rounded-lg border border-gray-600 text-gray-500 text-sm">
                   {isPremium ? 'Downgrade' : 'Current Plan'}
                 </button>
              </div>

              {/* Premium Plan */}
              <div className={`glass-panel p-6 rounded-xl border-2 flex flex-col relative overflow-hidden ${isPremium ? 'border-divine-gold bg-divine-gold/5' : 'border-divine-gold/30'}`}>
                 {isPremium && (
                    <div className="absolute top-0 right-0 bg-divine-gold text-space-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                        Active
                    </div>
                 )}
                 <h3 className="text-xl font-serif text-divine-gold">Astral Voyager</h3>
                 <p className="text-3xl font-bold text-white mt-2">$4.99<span className="text-sm font-normal text-gray-400">/mo</span></p>
                 <ul className="mt-6 space-y-3 flex-1 text-sm text-gray-300">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-star text-divine-gold"></i> Unlimited AI Panditji</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-star text-divine-gold"></i> Detailed Kundli Matching</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-star text-divine-gold"></i> Personal Transit Reports</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-star text-divine-gold"></i> Ad-Free Experience</li>
                 </ul>
                 
                 {!isPremium ? (
                    <button 
                        onClick={handleUpgrade}
                        disabled={saving}
                        className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-divine-gold to-divine-amber text-space-black font-bold shadow-lg hover:shadow-divine-gold/20 transition-all"
                    >
                        {saving ? 'Processing...' : 'Upgrade Now'}
                    </button>
                 ) : (
                    <button disabled className="mt-6 w-full py-3 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                        Membership Active
                    </button>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Tab Content: System Health */}
      {activeTab === 'system' && (
        <div className="glass-panel p-6 rounded-xl border border-white/10 animate-fade-in space-y-4">
             <h3 className="text-xl font-serif text-white mb-4">System Diagnostics</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 rounded bg-white/5 border border-white/10">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-gray-400 text-xs uppercase">Gemini AI API</span>
                         {healthStatus.api ? <i className="fa-solid fa-check text-green-400"></i> : <i className="fa-solid fa-xmark text-red-500"></i>}
                     </div>
                     <p className="text-xs text-gray-500 font-mono break-all">{process.env.API_KEY ? 'HIDDEN_KEY_LOADED' : 'MISSING'}</p>
                 </div>
                 <div className="p-4 rounded bg-white/5 border border-white/10">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-gray-400 text-xs uppercase">Firebase DB</span>
                         {healthStatus.db ? <i className="fa-solid fa-check text-green-400"></i> : <i className="fa-solid fa-xmark text-red-500"></i>}
                     </div>
                     <p className="text-xs text-gray-500 font-mono">{db ? 'INITIALIZED' : 'NOT CONNECTED'}</p>
                 </div>
                 <div className="p-4 rounded bg-white/5 border border-white/10">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-gray-400 text-xs uppercase">Firebase Auth</span>
                         {healthStatus.auth ? <i className="fa-solid fa-check text-green-400"></i> : <i className="fa-solid fa-xmark text-red-500"></i>}
                     </div>
                     <p className="text-xs text-gray-500 font-mono">{auth ? 'READY' : 'MISSING CONFIG'}</p>
                 </div>
             </div>

             <div className="mt-4 p-4 bg-black/40 rounded font-mono text-xs text-gray-400">
                 <p className="mb-2 text-white">Environment Variable Check:</p>
                 <p>VITE_FIREBASE_PROJECT_ID: <span className="text-divine-gold">{process.env.VITE_FIREBASE_PROJECT_ID || 'undefined'}</span></p>
                 <p>VITE_FIREBASE_AUTH_DOMAIN: <span className="text-divine-gold">{process.env.VITE_FIREBASE_AUTH_DOMAIN || 'undefined'}</span></p>
             </div>
             
             <button onClick={runDiagnostics} className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                 <i className="fa-solid fa-rotate mr-2"></i> Re-Run Checks
             </button>
        </div>
      )}

    </div>
  );
};

export default UserProfileComponent;