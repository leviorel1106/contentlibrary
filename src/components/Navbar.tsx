import React from 'react';
import { View } from '../lib/types';
import type { AppUser } from '../lib/types';

interface NavbarProps {
  user: AppUser;
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, currentView, onNavigate, onLogout }) => {
  return (
    <nav
      className="border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-2xl"
      dir="rtl"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-orange-600/20">
          {user.name?.charAt(0) || 'א'}
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm font-black italic leading-none mb-0.5">{user.name}</div>
          <div className="text-[8px] text-orange-500 font-black uppercase tracking-[0.3em]">
            {user.isAdmin ? 'מנהל מערכת' : 'לקוח פרימיום'}
          </div>
        </div>
      </div>

      <div className="flex gap-6 md:gap-10 items-center">
        <button
          onClick={() => onNavigate(View.DASHBOARD)}
          className={`text-[11px] font-black uppercase tracking-widest transition-all pb-1 border-b-2 ${
            currentView === View.DASHBOARD
              ? 'text-white border-orange-600'
              : 'text-gray-600 border-transparent hover:text-white'
          }`}
        >
          ספרייה
        </button>
        {user.isAdmin && (
          <button
            onClick={() => onNavigate(View.ADMIN)}
            className={`text-[11px] font-black uppercase tracking-widest transition-all pb-1 border-b-2 ${
              currentView === View.ADMIN
                ? 'text-white border-orange-600'
                : 'text-gray-600 border-transparent hover:text-white'
            }`}
          >
            ניהול
          </button>
        )}
        <button
          onClick={onLogout}
          className="text-[9px] font-black text-white/10 hover:text-red-500 transition-all uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl"
        >
          יציאה
        </button>
      </div>
    </nav>
  );
};
