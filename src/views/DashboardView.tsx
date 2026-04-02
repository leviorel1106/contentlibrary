import React, { useState, useEffect } from 'react';
import type { CategoryContent, Video, AppUser } from '../lib/types';

interface DashboardViewProps {
  user: AppUser;
  categories: CategoryContent[];
  watched: Set<string>;
  favorites: Set<string>;
  onSelectCategory: (cat: CategoryContent) => void;
  onSelectFavoriteVideo: (video: Video, cat: CategoryContent) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  categories,
  watched,
  favorites,
  onSelectCategory,
  onSelectFavoriteVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'favorites'>('library');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem('orel_streak');
    if (raw) {
      const { count, lastDate } = JSON.parse(raw);
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === today || lastDate === yesterday) setStreak(count);
    }
  }, []);

  const totalVideos = categories.reduce((s, c) => s + (c.videos?.length || 0), 0);
  const totalWatched = categories.reduce((s, c) =>
    s + (c.videos?.filter(v => watched.has(v.id)).length || 0), 0);
  const overallPct = totalVideos > 0 ? Math.round((totalWatched / totalVideos) * 100) : 0;

  const favoriteVideos: { video: Video; cat: CategoryContent }[] = [];
  categories.forEach(cat => {
    cat.videos?.forEach(v => {
      if (favorites.has(v.id)) favoriteVideos.push({ video: v, cat });
    });
  });

  const getCategoryProgress = (cat: CategoryContent) => {
    const total = cat.videos?.length || 0;
    const done = cat.videos?.filter(v => watched.has(v.id)).length || 0;
    return { total, done };
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-28 sm:pb-12 max-w-6xl text-right animate-fade-in" dir="rtl">
      {/* Hero Greeting */}
      <div className="mb-8 sm:mb-12">
        <p className="section-label mb-2">ברוך הבא</p>
        <h1 className="text-6xl sm:text-8xl font-['Bebas_Neue'] text-white tracking-wide uppercase">
          שלום, {user.name.split(' ')[0]}
        </h1>
        <p className="text-zinc-400 text-sm mt-2 font-medium">הספרייה האישית שלך מחכה לך</p>
      </div>

      {/* Progress Stats */}
      {totalVideos > 0 && (
        <div className="glass rounded-[28px] px-6 py-5 mb-8 flex justify-between items-center gap-4">
          <div className="text-center flex-shrink-0">
            <div className="text-2xl font-['Bebas_Neue'] text-orange-500">{streak}</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ימים רצוף 🔥</div>
          </div>
          <div className="w-px h-10 bg-white/10 flex-shrink-0" />
          <div className="text-center flex-shrink-0">
            <div className="text-2xl font-['Bebas_Neue'] text-white">
              {totalWatched}<span className="text-zinc-600 text-base">/{totalVideos}</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">שיעורים</div>
          </div>
          <div className="w-px h-10 bg-white/10 flex-shrink-0" />
          <div className="flex-1 text-center min-w-0">
            <div className="text-2xl font-['Bebas_Neue'] text-orange-500">{overallPct}%</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">הושלם</div>
            <div className="h-1 w-full bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-10">
        <div className="glass rounded-2xl p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'library'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            ספרייה
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            מועדפים
            {favoriteVideos.length > 0 && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${activeTab === 'favorites' ? 'bg-white/20 border-white/10' : 'bg-orange-600/15 text-orange-400 border-orange-600/20'}`}>
                {favoriteVideos.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'library' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => {
            const { total, done } = getCategoryProgress(cat);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div
                key={cat.id}
                onClick={() => { if (!cat.isComingSoon) onSelectCategory(cat); }}
                className={`warm-card p-6 pt-7 rounded-[40px] relative group ${
                  cat.isComingSoon
                    ? 'opacity-60 grayscale cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                {cat.isComingSoon && (
                  <div className="absolute top-4 left-4 bg-orange-600/15 text-orange-400 border border-orange-600/25 text-[10px] font-bold px-3 py-1 rounded-full z-20 backdrop-blur-sm">
                    בקרוב
                  </div>
                )}

                {/* Progress bar */}
                {!cat.isComingSoon && total > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[40px] overflow-hidden bg-white/8">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500 shadow-sm shadow-orange-600/50"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                {/* Category image or emoji fallback */}
                <div className="mb-5 -mx-6 -mt-7">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full aspect-square object-cover rounded-t-[40px] group-hover:brightness-110 transition-all duration-500"
                    />
                  ) : (
                    <div className="flex justify-center pt-7">
                      <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-4xl border border-white/5">
                        {cat.emoji}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold mb-2 text-white leading-snug text-center">{cat.title}</h3>
                <p className="text-xs text-gray-500 mb-5 line-clamp-2 leading-relaxed font-medium text-center">
                  {cat.description}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-sm shadow-orange-600/50 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-orange-500 font-bold flex-shrink-0">{done}/{total}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div>
          {favoriteVideos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <p className="text-zinc-400 font-bold text-lg">עדיין אין מועדפים</p>
              <p className="text-zinc-600 text-sm mt-2">לחץ על הלב ליד כל שיעור כדי להוסיף למועדפים</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteVideos.map(({ video, cat }) => (
                <div
                  key={video.id}
                  onClick={() => onSelectFavoriteVideo(video, cat)}
                  className="warm-card p-6 rounded-[30px] cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{cat.title}</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">{video.title}</h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-gray-500 font-bold">
                      {watched.has(video.id) ? '✓ נצפה' : 'לא נצפה'}
                    </span>
                    <span className="text-orange-500 text-[10px] font-black group-hover:translate-x-1 transition-transform">לצפייה ←</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};
