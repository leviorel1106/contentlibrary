import React, { useState } from 'react';
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
    <main className="container mx-auto px-6 py-12 max-w-6xl text-right animate-fade-in" dir="rtl">
      {/* Hero Greeting */}
      <div className="mb-12">
        <p className="text-orange-500 font-black text-xs uppercase tracking-[0.3em] mb-2">ברוך הבא</p>
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
          שלום, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-2 font-medium">הספרייה האישית שלך מחכה לך</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-10 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('library')}
          className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'library'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          ספרייה
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          מועדפים
          {favoriteVideos.length > 0 && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full ${activeTab === 'favorites' ? 'bg-white/20' : 'bg-orange-600/20 text-orange-500'}`}>
              {favoriteVideos.length}
            </span>
          )}
        </button>
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
                className={`glass p-8 rounded-[40px] transition-all relative group ${
                  cat.isComingSoon
                    ? 'opacity-60 grayscale cursor-not-allowed'
                    : 'hover:border-orange-500/50 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-600/10'
                }`}
              >
                {cat.isComingSoon && (
                  <div className="absolute top-6 left-6 bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-20">
                    בקרוב
                  </div>
                )}

                {/* Progress bar */}
                {!cat.isComingSoon && total > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[40px] overflow-hidden bg-white/5">
                    <div
                      className="h-full bg-orange-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">
                  {cat.emoji}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white leading-snug">{cat.title}</h3>
                <p className="text-xs text-gray-500 mb-6 line-clamp-2 leading-relaxed font-medium">
                  {cat.description}
                </p>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-orange-600/10 text-orange-500 px-2 py-1 rounded-md">
                    {done}/{total} נצפו
                  </span>
                  {!cat.isComingSoon && (
                    <span className="text-orange-500 group-hover:translate-x-1 transition-transform">←</span>
                  )}
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
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-gray-500 font-bold">עדיין אין מועדפים</p>
              <p className="text-gray-600 text-sm mt-2">לחץ על הלב ליד כל שיעור כדי להוסיף למועדפים</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteVideos.map(({ video, cat }) => (
                <div
                  key={video.id}
                  onClick={() => onSelectFavoriteVideo(video, cat)}
                  className="glass p-6 rounded-[30px] cursor-pointer hover:border-orange-500/50 hover:-translate-y-1 transition-all group"
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
