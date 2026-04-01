import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import type { AppUser } from '../lib/types';
import { INITIAL_CATEGORIES, INITIAL_USERS } from '../constants';

const APP_URL = 'https://contentlibrary-green.vercel.app';

interface AdminStats {
  activeUsers: number;
  totalWatched: number;
  totalFavorites: number;
  newThisMonth: number;
}

interface AdminViewProps {
  onBack: () => void;
  onDataRefresh: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack, onDataRefresh }) => {
  const [tab, setTab] = useState<'users' | 'seed' | 'install'>('users');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [creationSuccess, setCreationSuccess] = useState<{ email: string; name: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, watchedRes, favRes] = await Promise.all([
        supabase.from('permissions').select('*').order('full_name'),
        supabase.from('user_video_progress').select('id', { count: 'exact' }).eq('watched', true),
        supabase.from('user_favorites').select('id', { count: 'exact' }),
      ]);

      if (usersRes.data) setUsers(usersRes.data.map((u: any) => ({
        email: u.email,
        name: u.full_name,
        isAdmin: !!u.is_admin,
        status: u.status,
        id: u.id,
      })) as AppUser[]);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const activeUsers = usersRes.data?.filter((u: any) => u.status === 'active').length || 0;
      const newThisMonth = usersRes.data?.filter((u: any) => new Date(u.created_at) >= startOfMonth).length || 0;

      setStats({
        activeUsers,
        totalWatched: watchedRes.count || 0,
        totalFavorites: favRes.count || 0,
        newThisMonth,
      });
    } catch (e) {
      console.error('Admin load error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleBlock = async (user: AppUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setIsLoading(true);
    try {
      await supabase.from('permissions').update({ status: newStatus }).eq('email', user.email);
      setUsers(prev => prev.map(u => u.email === user.email ? { ...u, status: newStatus } : u));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מנוי זה?')) return;
    setIsLoading(true);
    try {
      await supabase.from('permissions').delete().eq('email', email);
      setUsers(prev => prev.filter(u => u.email !== email));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const email = newEmail.toLowerCase().trim();
    const name = newName.trim();
    try {
      const { error: authError } = await supabase.auth.signUp({
        email, password: '123456', options: { data: { full_name: name } }
      });
      if (authError && !authError.message.includes('already registered')) throw authError;

      await supabase.from('permissions').upsert(
        { email, full_name: name, is_admin: false, status: 'active' },
        { onConflict: 'email' }
      );
      setCreationSuccess({ email, name });
      setNewEmail(''); setNewName('');
      loadData();
    } catch (err: any) {
      alert('שגיאה: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async () => {
    const emails = bulkEmails.split(/[\n,]/).map(e => e.trim().toLowerCase()).filter(e => e.includes('@'));
    if (!emails.length) return alert('נא להזין אימיילים תקינים');
    setIsLoading(true);
    try {
      await supabase.from('permissions').upsert(
        emails.map(email => ({ email, full_name: email.split('@')[0], is_admin: false, status: 'active' })),
        { onConflict: 'email' }
      );
      alert(`יובאו ${emails.length} משתמשים בהצלחה!`);
      setBulkEmails('');
      loadData();
    } catch (err: any) {
      alert('ייבוא נכשל: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('לסנכרן את כל התכנים המקומיים למסד הנתונים?')) return;
    setIsLoading(true);
    try {
      for (const cat of INITIAL_CATEGORIES) {
        await supabase.from('categories').upsert({
          id: cat.id, title: cat.title, emoji: cat.emoji,
          description: cat.description, isComingSoon: !!cat.isComingSoon
        });
        if (cat.videos?.length) {
          await supabase.from('videos').upsert(cat.videos.map(v => ({
            id: v.id, category_id: cat.id, title: v.title,
            vimeoId: v.vimeoId, description: v.description,
            thumbnailUrl: v.thumbnailUrl, duration: v.duration,
            bulletPoints: v.bulletPoints, resources: v.resources,
          })));
        }
      }
      for (const user of INITIAL_USERS) {
        await supabase.from('permissions').upsert(
          { email: user.email.toLowerCase(), full_name: user.name, is_admin: user.isAdmin, status: user.status },
          { onConflict: 'email' }
        );
      }
      alert('סנכרון הושלם בהצלחה!');
      onDataRefresh();
    } catch (err: any) {
      alert('שגיאה: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const kpiCards = [
    {
      label: 'משתמשים פעילים', value: stats?.activeUsers ?? '—',
      icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>),
      accent: 'border-blue-500/30 text-blue-400',
    },
    {
      label: 'סה"כ צפיות', value: stats?.totalWatched ?? '—',
      icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>),
      accent: 'border-orange-500/30 text-orange-400',
    },
    {
      label: 'מועדפים', value: stats?.totalFavorites ?? '—',
      icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>),
      accent: 'border-red-500/30 text-red-400',
    },
    {
      label: 'חדשים החודש', value: stats?.newThisMonth ?? '—',
      icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>),
      accent: 'border-emerald-500/30 text-emerald-400',
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl text-right animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="glass-elevated px-5 py-2.5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:border-orange-600/30 transition-all active:scale-95 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          חזרה
        </button>
        <h2 className="text-4xl font-['Bebas_Neue'] tracking-wide uppercase text-orange-gradient">לוח ניהול</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpiCards.map(card => (
          <div key={card.label} className={`warm-card p-6 rounded-[30px] text-center border-t-2 ${card.accent.split(' ')[0]}`}>
            <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-white/5 border flex items-center justify-center ${card.accent}`}>
              {card.icon}
            </div>
            <div className="text-4xl font-['Bebas_Neue'] text-white mb-1">{card.value}</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{card.label}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-6">
        <button
          onClick={loadData}
          disabled={isLoading}
          className="text-[10px] text-orange-500 font-black uppercase tracking-widest border border-orange-600/20 px-4 py-2 rounded-xl hover:bg-orange-600/10 transition-all disabled:opacity-50"
        >
          {isLoading ? 'טוען...' : '↻ רענן נתונים'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-8">
        <div className="glass rounded-2xl p-1 flex gap-1">
          <button
            onClick={() => setTab('users')}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${tab === 'users' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-white'}`}
          >
            ניהול מנויים
          </button>
          <button
            onClick={() => setTab('seed')}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${tab === 'seed' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-white'}`}
          >
            סנכרון תכנים
          </button>
          <button
            onClick={() => setTab('install')}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${tab === 'install' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-white'}`}
          >
            התקנה
          </button>
        </div>
      </div>

      {tab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2 glass p-8 rounded-[40px] overflow-hidden">
            <h3 className="section-label mb-6">
              רשימת מנויים ({users.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="text-gray-600 text-[10px] uppercase border-b border-white/5 font-black tracking-widest">
                  <tr>
                    <th className="pb-4 pr-2">שם</th>
                    <th className="pb-4">אימייל</th>
                    <th className="pb-4">מצב</th>
                    <th className="pb-4 text-left pl-2">ניהול</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.email} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-2 font-bold text-white text-xs">{u.name || '—'}</td>
                      <td className="py-4 text-zinc-500 font-mono text-[11px]">{u.email}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}>
                          {u.status === 'active' ? 'פעיל' : 'חסום'}
                        </span>
                      </td>
                      <td className="py-4 text-left pl-2 space-x-reverse space-x-3">
                        {u.email !== 'leviorel@gmail.com' && (
                          <>
                            <button onClick={() => handleToggleBlock(u)} className={`text-[10px] font-bold uppercase transition-colors ${u.status === 'active' ? 'text-orange-500 hover:text-orange-400' : 'text-emerald-500 hover:text-emerald-400'}`}>
                              {u.status === 'active' ? 'חסימה' : 'שחרור'}
                            </button>
                            <button onClick={() => handleDeleteUser(u.email)} className="text-red-500/40 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-bold uppercase transition-all px-2 py-0.5 rounded-lg">
                              מחיקה
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bulk Import */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <h4 className="section-label mb-3">ייבוא מהיר</h4>
              <p className="text-gray-500 text-xs mb-3 font-medium">אימיילים מופרדים בשורה חדשה או פסיק</p>
              <textarea
                value={bulkEmails}
                onChange={e => setBulkEmails(e.target.value)}
                placeholder="email1@gmail.com&#10;email2@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all h-24 mb-3 font-mono resize-none"
              />
              <button onClick={handleBulkImport} disabled={isLoading || !bulkEmails.trim()} className="bg-white/5 hover:bg-orange-600 hover:text-white text-orange-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-orange-600/20 disabled:opacity-40">
                ייבוא רשימה
              </button>
            </div>
          </div>

          {/* Add User */}
          <div className="orange-border-card p-8 rounded-[40px]">
            <h3 className="text-2xl font-['Bebas_Neue'] mb-8 text-white tracking-wide uppercase">הוספת לקוח</h3>
            {creationSuccess ? (
              <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-[30px] animate-scale-in">
                <p className="text-green-500 font-black text-xs uppercase tracking-widest text-center mb-4">המשתמש נוסף!</p>
                <div className="bg-black/40 p-5 rounded-2xl space-y-2 text-center">
                  <div className="font-mono text-xs text-white break-all">{creationSuccess.email}</div>
                  <div className="font-black text-lg text-orange-500">סיסמה: 123456</div>
                  <p className="text-[9px] text-gray-400 italic">ניתן להתחבר מיידית</p>
                </div>
                <button onClick={() => setCreationSuccess(null)} className="w-full mt-6 bg-orange-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all">
                  הוספת לקוח נוסף
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddUser} className="space-y-4">
                <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="שם מלא" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600" />
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" placeholder="אימייל" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600" />
                <button type="submit" disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-2xl mt-4 shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-60">
                  {isLoading ? 'מאשר...' : 'אישור ופתיחת גישה'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {tab === 'seed' && (
        <div className="glass p-10 rounded-[40px] text-center max-w-lg mx-auto">
          <div className="text-5xl mb-6">🔄</div>
          <h3 className="text-xl font-black text-white mb-4 italic uppercase">סנכרון תכנים</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            פעולה זו תסנכרן את כל הקטגוריות, השיעורים, והמשתמשים הראשוניים למסד הנתונים. ניתן לביצוע פעם אחת בהתחלה.
          </p>
          <button
            onClick={handleSeed}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-500 text-white font-black px-10 py-4 rounded-2xl uppercase tracking-widest text-sm transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 active:scale-95"
          >
            {isLoading ? 'מסנכרן...' : 'סנכרן תכנים למסד הנתונים'}
          </button>
        </div>
      )}

      {tab === 'install' && (
        <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
          {/* QR Code card */}
          <div className="glass p-10 rounded-[40px] text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-black text-white mb-2 italic uppercase tracking-tighter">התקנת האפליקציה</h3>
            <p className="text-gray-500 text-xs mb-8 font-medium">סרוק את הברקוד עם הטלפון להתקנה מיידית</p>
            <div className="bg-white p-5 rounded-[24px] inline-block shadow-2xl mb-6">
              <QRCodeSVG value={APP_URL} size={200} level="H" />
            </div>
            <p className="text-gray-600 text-[10px] font-mono break-all">{APP_URL}</p>
          </div>

          {/* iOS instructions */}
          <div className="glass p-6 rounded-[30px]" dir="rtl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-xl">🍎</div>
              <h4 className="font-black text-white text-sm uppercase tracking-widest">iPhone / iPad</h4>
            </div>
            <ol className="space-y-2 text-gray-400 text-xs font-medium">
              <li className="flex gap-2"><span className="text-orange-500 font-black">1.</span> פתח את הקישור בדפדפן Safari</li>
              <li className="flex gap-2"><span className="text-orange-500 font-black">2.</span> לחץ על כפתור השיתוף <span className="text-white">⬆</span> בתחתית המסך</li>
              <li className="flex gap-2"><span className="text-orange-500 font-black">3.</span> בחר <span className="text-white font-black">"הוסף למסך הבית"</span></li>
              <li className="flex gap-2"><span className="text-orange-500 font-black">4.</span> לחץ <span className="text-white font-black">הוסף</span> — האפליקציה מותקנת!</li>
            </ol>
          </div>

          {/* Android instructions */}
          <div className="glass p-6 rounded-[30px]" dir="rtl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-xl">🤖</div>
              <h4 className="font-black text-white text-sm uppercase tracking-widest">Android</h4>
            </div>
            <ol className="space-y-2 text-gray-400 text-xs font-medium">
              <li className="flex gap-2"><span className="text-orange-500 font-black">1.</span> פתח את הקישור בדפדפן Chrome</li>
              <li className="flex gap-2"><span className="text-orange-500 font-black">2.</span> תופיע הודעה <span className="text-white font-black">"הוסף למסך הבית"</span> אוטומטית</li>
              <li className="flex gap-2"><span className="text-orange-500 font-black">3.</span> לחץ <span className="text-white font-black">התקן</span> — זהו!</li>
            </ol>
            <p className="text-gray-600 text-[10px] mt-3">אם לא הופיעה הודעה: תפריט ⋮ → הוסף למסך הבית</p>
          </div>
        </div>
      )}
    </div>
  );
};
