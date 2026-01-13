
import React from 'react';
import { User } from '../types';

interface Props {
  user: User;
  t: (key: any) => string;
}

const Header: React.FC<Props> = ({ user, t }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-6 flex justify-between items-center no-print sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter">
          {t('welcome')}, <span className="text-blue-600">{user.name.split(' ')[0]}</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{user.role} • {user.project}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-black text-slate-800">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
          <p className="text-[10px] text-slate-400 font-bold">SYSTEM ACTIVE</p>
        </div>
        <div className="w-12 h-12 bg-slate-50 border-2 border-white shadow-sm rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg ring-4 ring-blue-50">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;
