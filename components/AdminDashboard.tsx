
import React, { useState } from 'react';
import { useStore, AppData, SINGLE_FILE_BACKEND } from '../store';
import { User, Role, Status } from '../types';

interface Props {
  activeTab: string;
  user: User;
  t: (key: any) => string;
  appData: AppData;
}

const AdminDashboard: React.FC<Props> = ({ activeTab, user, t, appData }) => {
  const store = useStore();
  
  // Settings State
  const [scriptUrl, setScriptUrl] = useState(appData.config?.googleScriptUrl || '');
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  // Registration State
  const [newUser, setNewUser] = useState({
    userId: '',
    name: '',
    passportIc: '',
    password: '',
    basicSalary: '',
    role: Role.WORKER,
    project: appData.projects[0]?.name || ''
  });

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleSaveSettings = async () => {
    setIsTesting(true);
    setSaveSuccess(false);
    await store.update({ config: { ...appData.config, googleScriptUrl: scriptUrl } });
    setIsTesting(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.userId || !newUser.name) return alert("সব ঘর পূরণ করুন!");
    
    const existing = appData.users.find(u => u.userId.toString() === newUser.userId.toString());
    if (existing) return alert("এই আইডি অলরেডি আছে!");

    const userToAdd: User = {
      id: Date.now().toString(),
      userId: newUser.userId,
      name: newUser.name,
      passportIc: newUser.passportIc,
      password: newUser.password || '1234',
      basicSalary: Number(newUser.basicSalary) || 0,
      role: newUser.role,
      project: newUser.project,
      isFrozen: false
    };

    await store.update({ users: [...appData.users, userToAdd] });
    setNewUser({ userId: '', name: '', passportIc: '', password: '', basicSalary: '', role: Role.WORKER, project: appData.projects[0]?.name || '' });
    alert("সফলভাবে যোগ করা হয়েছে! ✅");
  };

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Workforce" value={appData.users.length} icon="👷" color="bg-blue-600" />
          <StatCard title="Approvals" value={appData.attendance.filter(a => a.status === Status.PENDING).length} icon="⏳" color="bg-amber-500" />
          <StatCard title="Expenses" value={`RM ${appData.expenses.filter(e => e.status === Status.APPROVED).reduce((a, b) => a + b.amount, 0)}`} icon="💰" color="bg-emerald-500" />
          <StatCard title="Projects" value={appData.projects.length} icon="🏗️" color="bg-indigo-600" />
        </div>

        {/* Deployment Guide Card */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] p-8">
          <h3 className="text-xl font-black text-amber-900 flex items-center gap-2">
            🚀 শ্রমিকদের জন্য লাইভ করবেন কিভাবে? (১০০% ফ্রি)
          </h3>
          <p className="text-sm text-amber-800 mt-2 font-bold leading-relaxed">
            দাদাভাই, আপনি এখন যে লিঙ্কে আছেন সেটি শুধু আপনার দেখার জন্য। শ্রমিকদের জন্য এটি লাইভ করতে নিচের ৩টি ধাপ ফলো করুন:
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
              <p className="text-xs font-black text-amber-600">ধাপ ১</p>
              <p className="text-xs font-bold mt-1">সব কোড ডাউনলোড করে একটি Github একাউন্টে আপলোড করুন।</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
              <p className="text-xs font-black text-amber-600">ধাপ ২</p>
              <p className="text-xs font-bold mt-1">Vercel.com এ গিয়ে Github দিয়ে লগইন করে এই প্রজেক্টটি সিলেক্ট করুন।</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
              <p className="text-xs font-black text-amber-600">ধাপ ৩</p>
              <p className="text-xs font-bold mt-1">Vercel আপনাকে একটি ছোট লিঙ্ক দিবে (যেমন: my-app.vercel.app), ওইটা সবাই ব্যবহার করতে পারবে।</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'registration') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 h-fit">
          <h2 className="text-xl font-black mb-6 uppercase">নতুন শ্রমিক যোগ করুন</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <InputGroup label="ইউজার আইডি" value={newUser.userId} onChange={(v: string) => setNewUser({...newUser, userId: v})} />
            <InputGroup label="পুরো নাম" value={newUser.name} onChange={(v: string) => setNewUser({...newUser, name: v})} />
            <InputGroup label="বেতন (RM)" type="number" value={newUser.basicSalary} onChange={(v: string) => setNewUser({...newUser, basicSalary: v})} />
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
              যোগ করুন ✅
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b font-black">শ্রমিক তালিকা ({appData.users.length})</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                <tr><th className="px-8 py-4">ID</th><th className="px-8 py-4">Name</th><th className="px-8 py-4">Project</th></tr>
              </thead>
              <tbody>
                {appData.users.map(u => (
                  <tr key={u.id} className="border-b border-slate-50">
                    <td className="px-8 py-4 font-black">{u.userId}</td>
                    <td className="px-8 py-4 font-bold">{u.name}</td>
                    <td className="px-8 py-4 text-xs font-bold text-blue-600">{u.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
          <h2 className="text-2xl font-black uppercase">App Share Link</h2>
          <p className="text-slate-400 text-sm mt-2 font-bold">এটি আপনার টেম্পোরারি লিঙ্ক (শ্রমিকদের জন্য নয়):</p>
          <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full bg-slate-800 p-5 rounded-2xl font-mono text-[10px] break-all text-blue-400 border border-slate-700">
              {window.location.href}
            </div>
            <button onClick={handleCopyLink} className={`px-10 py-5 rounded-2xl font-black transition-all ${copyStatus ? 'bg-emerald-500' : 'bg-blue-600'}`}>
              {copyStatus ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 className="text-xl font-black mb-6">Cloud Settings (Google Script)</h3>
          <InputGroup label="Web App URL" value={scriptUrl} onChange={setScriptUrl} />
          <button onClick={handleSaveSettings} className="w-full mt-4 bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl">
            {isTesting ? 'SAVING...' : 'SAVE CONFIGURATION'}
          </button>
        </div>
      </div>
    );
  }

  return <div className="p-10 text-center font-bold text-slate-300">Loading Section...</div>;
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-50">
    <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center text-xl mb-4 shadow-lg`}>{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

const InputGroup = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">{label}</label>
    <input type={type} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default AdminDashboard;
