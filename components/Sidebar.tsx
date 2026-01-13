
import React from 'react';
import { Role } from '../types';

interface Props {
  role: Role;
  activeTab: string;
  onSelect: (tab: string) => void;
  t: (key: any) => string;
  onLogout: () => void;
}

const Sidebar: React.FC<Props> = ({ role, activeTab, onSelect, t, onLogout }) => {
  const adminLinks = [
    { id: 'dashboard', label: 'Approval Queue', icon: '📊' },
    { id: 'registration', label: 'Manage Workers', icon: '👷' },
    { id: 'reports', label: 'Payroll Reports', icon: '💰' },
    { id: 'settings', label: 'Cloud Config', icon: '⚙️' },
  ];

  const userLinks = [
    { id: 'dashboard', label: 'Shift Control', icon: '🏠' },
    { id: 'attendance', label: 'My Logs', icon: '🕒' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'status', label: 'Payslip', icon: '📄' },
  ];

  const links = role === Role.ADMIN ? adminLinks : userLinks;

  return (
    <div className="w-full md:w-80 bg-slate-900 text-slate-300 flex flex-col h-auto md:h-screen no-print shadow-2xl z-20 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
      
      <div className="p-10 border-b border-slate-800 flex items-center space-x-4 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-xl shadow-blue-500/20 font-black">S</div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter">SWM PRO</h2>
          <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] mt-0.5">Cloud Native</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-8 space-y-3 relative z-10">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onSelect(link.id)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.25rem] transition-all duration-500 group relative ${
              activeTab === link.id 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 -translate-y-1' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {activeTab === link.id && (
              <span className="absolute left-0 w-1.5 h-6 bg-white rounded-full"></span>
            )}
            <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
            <span className="font-bold tracking-tight">{link.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-800 relative z-10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-6 py-4 text-rose-400 hover:bg-rose-500/10 rounded-[1.25rem] transition-all font-black text-sm uppercase tracking-widest"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
