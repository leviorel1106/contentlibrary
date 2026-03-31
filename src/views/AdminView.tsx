import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AppUser } from '../lib/types';
import { INITIAL_CATEGORIES, INITIAL_USERS } from '../constants';

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
  const [tab, setTab] = useState<'users' | 'seed'>('users');
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
        supabase.from('permissions').select('*').order('name'),
        supabase.from('user_video_progress').select('id', { count: 'exact' }).eq('watched', true),
        supabase.from('user_favorites').select('id', { count: 'exact' }),
      ]);

      if (usersRes.data) setUsers(usersRes.data as AppUser[]);

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
        { email, name, isAdmin: false, status: 'active' },
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
        emails.map(email => ({ email, name: email.split('@')[0], isAdmin: false, status: 'active' })),
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
          { email: user.email.toLowerCase(), name: user.name, isAdmin: user.isAdmin, status: user.status },
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
    { label: 'משתמשים פעילים', value: stats?.activeUsers ?? '—', icon: '👥' },
    { label: 'סה"כ צפיות', value: stats?.totalWatched ?? '—', icon: '▶️' },
    { label: 'מועדפים', value: stats?.totalFavorites ?? '—', icon: '❤️' },
    { label: 'חדשים החודש', value: stats?.newThisMonth ?? '—', icon: '✨' },
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl text-right animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="glass px-6 py-3 rounded-2xl text-xs font-black uppercase border border-white/10 tracking-widest hover:bg-white/10 transition-all">
          ← חזרה
        </button>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">לוח ניהול</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpiCards.map(card => (
          <div key={card.label} className="glass p-6 rounded-[30px] text-center">
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-black text-white mb-1">{card.value}</div>
            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{card.label}</div>
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
      <div className="flex gap-3 mb-8 border-b border-white/5 pb-4">
        <button
          onClick={() => setTab('users')}
          className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === 'users' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}
        >
          ניהול מנויים
        </button>
        <button
          onClick={() => setTab('seed')}
          className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === 'seed' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}
        >
          סנכרון תכנים
        </button>
      </div>

      {tab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2 glass p-8 rounded-[40px] overflow-hidden">
            <h3 className="text-lg font-black mb-6 text-white italic uppercase tracking-widest border-r-4 border-orange-600 pr-3">
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
                    <tr key={u.email} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 pr-2 font-black text-white text-xs">{u.name || '—'}</td>
                      <td className="py-4 text-gray-500 font-mono text-[11px]">{u.email}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          u.status === 'active'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {u.status === 'active' ? 'פעיל' : 'חסום'}
                        </span>
                      </td>
                      <td className="py-4 text-left pl-2 space-x-reverse space-x-3">
                        {u.email !== 'leviorel@gmail.com' && (
                          <>
                            <button onClick={() => handleToggleBlock(u)} className={`text-[10px] font-black uppercase transition-colors ${u.status === 'active' ? 'text-orange-500 hover:text-orange-400' : 'text-green-500 hover:text-green-400'}`}>
                              {u.status === 'active' ? 'חסימה' : 'שחרור'}
                            </button>
                            <button onClick={() => handleDeleteUser(u.email)} className="text-red-500/30 hover:text-red-500 text-[10px] font-black uppercase transition-colors">
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
              <h4 className="text-sm font-black mb-3 text-white uppercase tracking-widest border-r-4 border-orange-600 pr-3">ייבוא מהיר</h4>
              <p className="text-gray-500 text-xs mb-3 font-medium">אימיילים מופרדים בשורה חדשה או פסיק</p>
              <textarea
                value={bulkEmails}
                onChange={e => setBulkEmails(e.target.value)}
                placeholder="email1@gmail.com&#10;email2@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-right outline-none focus:border-orange-600 transition-all h-24 mb-3 font-mono resize-none"
              />
              <button onClick={handleBulkImport} disabled={isLoading || !bulkEmails.trim()} className="bg-white/5 hover:bg-orange-600 hover:text-white text-orange-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-orange-600/20 disabled:opacity-40">
                ייבוא רשימה
              </button>
            </div>
          </div>

          {/* Add User */}
          <div className="glass p-8 rounded-[40px] border-t-4 border-orange-600">
            <h3 className="text-lg font-black mb-8 text-white italic uppercase tracking-tighter">הוספת לקוח</h3>
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
                <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="שם מלא" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-right outline-none focus:border-orange-600 transition-all placeholder:text-gray-600" />
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" placeholder="אימייל" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-right outline-none focus:border-orange-600 transition-all placeholder:text-gray-600" />
                <button type="submit" disabled={isLoading} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl mt-4 shadow-xl shadow-orange-600/10 active:scale-95 transition-all hover:bg-orange-500 uppercase tracking-widest text-xs disabled:opacity-60">
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
    </div>
  );
};
