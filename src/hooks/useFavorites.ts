import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('user_favorites')
      .select('video_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) setFavorites(new Set(data.map((r: any) => r.video_id)));
      });
  }, [userId]);

  const toggleFavorite = async (videoId: string) => {
    if (!userId) return;
    const isFav = favorites.has(videoId);

    // Optimistic update
    setFavorites(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(videoId);
      else next.add(videoId);
      return next;
    });

    if (isFav) {
      await supabase.from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('video_id', videoId);
    } else {
      await supabase.from('user_favorites')
        .upsert({ user_id: userId, video_id: videoId }, { onConflict: 'user_id,video_id' });
    }
  };

  return { favorites, toggleFavorite };
}
