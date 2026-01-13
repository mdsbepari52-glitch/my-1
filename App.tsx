
import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Language } from './types';
import { translations } from './translations';
import { useStore, AppData, DEFAULT_ADMIN } from './store';

// Components
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import LanguageSwitcher from './components/LanguageSwitcher';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('bn');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [appData, setAppData] = useState<AppData | null>(null);
  const store = useStore();
  
  const t = (key: keyof typeof translations.en) => translations[language][key] || key;

  // ডাটা লোড করার ফাংশন
  const refreshData = useCallback(async () => {
    const local = store.getLocal();
    setAppData(local);
    
    if (local.config.googleScriptUrl) {
      try {
        const cloud = await store.getData();
        if (cloud) setAppData(cloud);
      } catch (e) {
        console.warn("Offline mode active");
      }
    }
  }, [store]);

  useEffect(() => {
    refreshData();

    // ইভেন্ট লিসেনার: স্টোর থেকে ডাটা চেঞ্জ হলে অটো আপডেট হবে
    const handleDataChange = (e: any) => {
      setAppData(e.detail);
    };

    window.addEventListener('app-data-updated', handleDataChange);
    return () => window.removeEventListener('app-data-updated', handleDataChange);
  }, [refreshData]);

  const handleLogin = async (userId: string, pass: string) => {
    if (!userId || !pass) return;
    setIsLoading(true);
    
    if (userId.trim() === '1' && pass.trim() === '8632') {
      setTimeout(() => {
        setCurrentUser(DEFAULT_ADMIN);
        setActiveTab('dashboard');
        setIsLoading(false);
      }, 400); 
      return;
    }

    try {
      const current = appData || store.getLocal();
      const user = current.users.find(u => 
        u.userId.toString() === userId.toString() && 
        u.password?.toString() === pass.toString()
      );
      
      if (!user) {
        alert("ভুল আইডি বা পাসওয়ার্ড! অ্যাডমিন হলে ১ এবং ৮৬৩২ ব্যবহার করুন।");
        setIsLoading(false);
        return;
      }
      
      const roleStr = (user.role || 'Worker').toString().toLowerCase();
      if (roleStr === 'admin' || user.userId === '1') user.role = Role.ADMIN;
      else user.role = Role.WORKER;
      
      setCurrentUser(user);
      setActiveTab('dashboard');
    } catch (err) {
      alert("সার্ভার সমস্যা। দয়া করে ১ এবং ৮৬৩২ দিয়ে লগইন করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  if (!appData) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase animate-pulse">SWM <span className="text-blue-500">PRO</span></h2>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f172a]">
        <LanguageSwitcher current={language} onSelect={setLanguage} />
        <LoginForm onLogin={handleLogin} t={t} isLoading={isLoading} />
        <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${appData.config.googleScriptUrl ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`}></span>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {appData.config.googleScriptUrl ? 'Cloud Database Connected' : 'Ready to Connect'}
              </p>
            </div>
            <p className="text-[9px] text-slate-600 font-bold uppercase italic px-4 py-1 bg-slate-800/20 rounded-full">
              SWM PRO Enterprise v2.5.0
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row overflow-hidden">
      <Sidebar role={currentUser.role} activeTab={activeTab} onSelect={setActiveTab} t={t} onLogout={() => setCurrentUser(null)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header user={currentUser} t={t} />
        {isLoading && <div className="h-1 bg-blue-600 animate-pulse w-full"></div>}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentUser.role === Role.ADMIN ? (
            <AdminDashboard activeTab={activeTab} user={currentUser} t={t} appData={appData} />
          ) : (
            <UserDashboard activeTab={activeTab} user={currentUser} t={t} appData={appData} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
