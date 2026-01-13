
import React, { useState } from 'react';

interface Props {
  onLogin: (id: string, pass: string) => void;
  t: (key: any) => string;
  isLoading?: boolean;
}

const LoginForm: React.FC<Props> = ({ onLogin, t, isLoading }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onLogin(id, pass);
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 font-black shadow-inner">
          {isLoading ? <span className="animate-spin text-xl">⚙️</span> : 'S'}
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">SWM <span className="text-blue-600">PRO</span></h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Enterprise Access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('userId')}</label>
          <input
            type="text"
            required
            placeholder="ID (e.g. 1)"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 disabled:opacity-50"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('password')}</label>
          <input
            type="password"
            required
            placeholder="Pass (e.g. 8632)"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 disabled:opacity-50"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:bg-black active:scale-95 transition-all mt-4 shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {isLoading ? '🔐 AUTHENTICATING...' : t('login')}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-slate-50 text-center">
        <div className="flex items-center justify-center space-x-2 bg-slate-50 py-2 px-4 rounded-full inline-flex mx-auto">
           <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
           <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Master Access: 1 / 8632</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
