import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const raw = localStorage.getItem('orel_streak');
  const prev = raw ? JSON.parse(raw) : { lastDate: '', count: 0 };
  if (prev.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newCount = prev.lastDate === yesterday ? prev.count + 1 : 1;
  localStorage.setItem('orel_streak', JSON.stringify({ lastDate: today, count: newCount }));
}

export function useProgress(userId: string | undefined) {
  const [watched, setWatched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('user_video_progress')
      .select('video_id')
      .eq('user_id', userId)
      .eq('watched', true)
      .then(({ data }) => {
        if (data) setWatched(new Set(data.map((r: any) => r.video_id)));
      });
  }, [userId]);

  const toggleWatched = async (videoId: string) => {
    if (!userId) return;
    const isWatched = watched.has(videoId);

    if (!isWatched) updateStreak();

    // Optimistic update
    setWatched(prev => {
      const next = new Set(prev);
      if (isWatched) next.delete(videoId);
      else next.add(videoId);
      return next;
    });

    await supabase.from('user_video_progress').upsert(
      { user_id: userId, video_id: videoId, watched: !isWatched },
      { onConflict: 'user_id,video_id' }
    );
  };

  return { watched, toggleWatched };
}
