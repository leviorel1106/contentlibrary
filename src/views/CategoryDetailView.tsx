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
          <span className="section-label mb-2">
            {category.emoji} צופה כעת
          </span>
          <h2 className="text-5xl sm:text-6xl font-['Bebas_Neue'] tracking-wide text-orange-gradient">{category.title}</h2>
        </div>
        <button
          onClick={onBack}
          className="glass-elevated px-5 py-2.5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:border-orange-600/30 transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          חזרה
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Video + Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Player */}
          <div className="aspect-[9/16] sm:aspect-video rounded-[40px] overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 shadow-black/60 shadow-[0_0_80px_rgba(234,88,12,0.1)]">
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
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                      </svg>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">השיעור יתעדכן בקרוב</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video info card */}
          <div className="glass p-8 rounded-[40px] text-right border-t-2 border-orange-600/25">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                {/* Watched toggle */}
                <button
                  onClick={() => onToggleWatched(activeVideo.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all min-h-[44px] hover:scale-[1.02] active:scale-[0.98] ${
                    watched.has(activeVideo.id)
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-white/5 text-zinc-500 border border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  {watched.has(activeVideo.id) ? (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {watched.has(activeVideo.id) ? 'נצפה' : 'סמן כנצפה'}
                </button>
                {/* Favorite toggle */}
                <button
                  onClick={() => onToggleFavorite(activeVideo.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all min-h-[44px] hover:scale-[1.02] active:scale-[0.98] ${
                    favorites.has(activeVideo.id)
                      ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                      : 'bg-white/5 text-zinc-500 border border-white/10 hover:border-red-500/30'
                  }`}
                >
                  {favorites.has(activeVideo.id) ? (
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )}
                  {favorites.has(activeVideo.id) ? 'מועדף' : 'הוסף'}
                </button>
              </div>
            </div>

            <h3 className="text-3xl font-['Bebas_Neue'] mb-4 text-white tracking-wide">{activeVideo.title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm font-light">
              {activeVideo.description || 'צפו בשיעור המלא והקפידו על התרגול.'}
            </p>

          </div>
        </div>

        {/* Lesson List */}
        <div className="lg:col-span-4 text-right">
          <div className="glass p-6 rounded-[35px] border border-white/5 max-h-[350px] lg:max-h-[600px] overflow-y-auto no-scrollbar">
            <h4 className="font-['Bebas_Neue'] text-sm text-orange-500 mb-6 uppercase border-r-4 border-orange-600 pr-3 tracking-[0.2em]">
              תוכנית הלימודים
            </h4>
            <div className="space-y-3">
              {category.videos?.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => onSelectVideo(v)}
                  className={`w-full p-4 rounded-2xl text-right border transition-all flex items-center gap-3 group ${
                    activeVideo.id === v.id
                      ? 'border-orange-600/50 bg-orange-600/10 shadow-lg shadow-orange-600/5 border-r-4 border-r-orange-600'
                      : 'border-white/5 hover:bg-white/5'
                  }`}
                >
                  <span className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all ${
                    watched.has(v.id)
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : activeVideo.id === v.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-white/5 text-zinc-500'
                  }`}>
                    {watched.has(v.id) ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : idx + 1}
                  </span>
                  <div className="flex-1 text-right min-w-0">
                    <span className={`text-xs font-bold block truncate ${activeVideo.id === v.id ? 'text-white' : 'text-gray-400'}`}>
                      {v.title}
                    </span>
                    {favorites.has(v.id) && (
                      <span className="text-[9px] text-red-400 font-bold flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                        מועדף
                      </span>
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
