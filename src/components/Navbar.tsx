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
    <>
      {/* Desktop top navbar */}
      <nav
        className="border-b border-white/5 px-6 py-4 hidden sm:flex justify-between items-center sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-3xl shadow-sm shadow-black/40 relative"
        dir="rtl"
      >
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/25 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-orange-600/20 ring-2 ring-orange-600/40 ring-offset-2 ring-offset-[#050505]">
            {user.name?.charAt(0) || 'א'}
          </div>
          <div className="text-right">
            <div className="text-sm font-black italic leading-none mb-0.5">{user.name}</div>
            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-gradient">
              {user.isAdmin ? 'מנהל מערכת' : 'לקוח פרימיום'}
            </div>
          </div>
        </div>

        <div className="flex gap-6 md:gap-10 items-center">
          <button
            onClick={() => onNavigate(View.DASHBOARD)}
            className={`text-[12px] font-bold uppercase tracking-widest transition-all pb-1 relative ${
              currentView === View.DASHBOARD
                ? 'text-white after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-orange-600 after:rounded-full'
                : 'text-zinc-600 hover:text-white'
            }`}
          >
            ספרייה
          </button>
          {user.isAdmin && (
            <button
              onClick={() => onNavigate(View.ADMIN)}
              className={`text-[12px] font-bold uppercase tracking-widest transition-all pb-1 relative ${
                currentView === View.ADMIN
                  ? 'text-white after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-orange-600 after:rounded-full'
                  : 'text-zinc-600 hover:text-white'
              }`}
            >
              ניהול
            </button>
          )}
          <button
            onClick={onLogout}
            className="text-[10px] font-bold text-zinc-700 hover:text-red-400 transition-all uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl hover:border-red-500/20 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            יציאה
          </button>
        </div>
      </nav>

      {/* Mobile top bar (compact) */}
      <div
        className="sm:hidden sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-3xl border-b border-white/5 shadow-sm shadow-black/40 px-4 flex justify-between items-center"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: '12px' }}
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-orange-600/20 ring-2 ring-orange-600/40 ring-offset-2 ring-offset-[#050505]">
            {user.name?.charAt(0) || 'א'}
          </div>
          <div>
            <div className="text-xs font-black italic leading-none">{user.name}</div>
            <div className="text-[8px] text-orange-500 font-black uppercase tracking-widest">
              {user.isAdmin ? 'מנהל מערכת' : 'לקוח פרימיום'}
            </div>
          </div>
        </div>
        <div className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] font-['Bebas_Neue'] text-base">
          {currentView === View.DASHBOARD ? 'ספרייה' : currentView === View.ADMIN ? 'ניהול' : 'שיעור'}
        </div>
      </div>

      {/* Mobile bottom navigation bar */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[#050505]/95 backdrop-blur-3xl border-t border-white/8 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] flex justify-around items-center px-2 pt-2"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        dir="rtl"
      >
        {/* Library */}
        <button
          onClick={() => onNavigate(View.DASHBOARD)}
          className={`flex flex-col items-center gap-1.5 px-5 py-1.5 rounded-2xl transition-all ${
            currentView === View.DASHBOARD ? 'text-orange-500 bg-orange-600/15' : 'text-zinc-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentView === View.DASHBOARD ? 2.5 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">ספרייה</span>
        </button>

        {/* Admin (only for admins) */}
        {user.isAdmin && (
          <button
            onClick={() => onNavigate(View.ADMIN)}
            className={`flex flex-col items-center gap-1.5 px-5 py-1.5 rounded-2xl transition-all ${
              currentView === View.ADMIN ? 'text-orange-500 bg-orange-600/15' : 'text-zinc-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={currentView === View.ADMIN ? 2.5 : 1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">ניהול</span>
          </button>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1.5 px-5 py-1.5 rounded-2xl transition-all text-zinc-600 hover:text-red-400"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">יציאה</span>
        </button>
      </nav>
    </>
  );
};
