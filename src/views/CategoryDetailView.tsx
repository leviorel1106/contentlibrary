import React from 'react';
import type { CategoryContent, Video } from '../lib/types';

interface CategoryDetailViewProps {
  category: CategoryContent;
  activeVideo: Video;
  watched: Set<string>;
  favorites: Set<string>;
  onSelectVideo: (v: Video) => void;
  onToggleWatched: (videoId: string) => void;
  onToggleFavorite: (videoId: string) => void;
  onBack: () => void;
}

const getVimeoEmbedUrl = (vimeoId: string | undefined) => {
  if (!vimeoId) return '';
  const baseParams = 'badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1';
  if (vimeoId.includes('/')) {
    const [id, hash] = vimeoId.split('/');
    return `https://player.vimeo.com/video/${id}?h=${hash}&${baseParams}`;
  }
  return `https://player.vimeo.com/video/${vimeoId}?${baseParams}`;
};

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  activeVideo,
  watched,
  favorites,
  onSelectVideo,
  onToggleWatched,
  onToggleFavorite,
  onBack,
}) => {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 pb-28 sm:pb-8 max-w-5xl animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-end mb-10 text-right">
        <div>
          <span className="text-orange-500 font-black text-xs uppercase mb-2 block tracking-widest">
            {category.emoji} צופה כעת
          </span>
          <h2 className="text-4xl font-black text-white italic tracking-tighter">{category.title}</h2>
        </div>
        <button
          onClick={onBack}
          className="glass px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          ← חזרה
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Video + Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Player */}
          <div className="aspect-video rounded-[40px] overflow-hidden bg-black shadow-2xl border border-white/5">
            {activeVideo.vimeoId ? (
              <iframe
                src={getVimeoEmbedUrl(activeVideo.vimeoId)}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full relative flex items-center justify-center bg-white/5">
                {activeVideo.thumbnailUrl ? (
                  <img src={activeVideo.thumbnailUrl} className="w-full h-full object-cover opacity-40" alt={activeVideo.title} referrerPolicy="no-referrer" />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-gray-400 text-sm font-medium">השיעור יתעדכן בקרוב</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video info card */}
          <div className="glass p-8 rounded-[40px] text-right">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                {/* Watched toggle */}
                <button
                  onClick={() => onToggleWatched(activeVideo.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    watched.has(activeVideo.id)
                      ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                      : 'bg-white/5 text-gray-500 border border-white/10 hover:border-green-500/30'
                  }`}
                >
                  {watched.has(activeVideo.id) ? '✓ נצפה' : '○ סמן כנצפה'}
                </button>
                {/* Favorite toggle */}
                <button
                  onClick={() => onToggleFavorite(activeVideo.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    favorites.has(activeVideo.id)
                      ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                      : 'bg-white/5 text-gray-500 border border-white/10 hover:border-red-500/30'
                  }`}
                >
                  {favorites.has(activeVideo.id) ? '❤️ מועדף' : '🤍 הוסף'}
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-black mb-4 text-white italic">{activeVideo.title}</h3>
            <p className="text-gray-400 leading-relaxed font-light">
              {activeVideo.description || 'צפו בשיעור המלא והקפידו על התרגול.'}
            </p>

            {/* Resources */}
            {activeVideo.resources && activeVideo.resources.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/5">
                {activeVideo.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                  >
                    <span>📄</span>
                    {res.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lesson List */}
        <div className="lg:col-span-4 text-right">
          <div className="glass p-6 rounded-[35px] border border-white/5 max-h-[350px] lg:max-h-[600px] overflow-y-auto no-scrollbar">
            <h4 className="text-[10px] font-black text-orange-500 mb-6 uppercase border-r-4 border-orange-600 pr-3 tracking-[0.2em]">
              תוכנית הלימודים
            </h4>
            <div className="space-y-3">
              {category.videos?.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => onSelectVideo(v)}
                  className={`w-full p-4 rounded-2xl text-right border transition-all flex items-center gap-3 group ${
                    activeVideo.id === v.id
                      ? 'border-orange-600/50 bg-orange-600/10 shadow-lg shadow-orange-600/5'
                      : 'border-white/5 hover:bg-white/5'
                  }`}
                >
                  <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all ${
                    watched.has(v.id)
                      ? 'bg-green-500/20 text-green-400'
                      : activeVideo.id === v.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-white/5 text-gray-500'
                  }`}>
                    {watched.has(v.id) ? '✓' : idx + 1}
                  </span>
                  <div className="flex-1 text-right min-w-0">
                    <span className={`text-xs font-bold block truncate ${activeVideo.id === v.id ? 'text-white' : 'text-gray-400'}`}>
                      {v.title}
                    </span>
                    {favorites.has(v.id) && (
                      <span className="text-[9px] text-red-400 font-bold">❤️ מועדף</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
