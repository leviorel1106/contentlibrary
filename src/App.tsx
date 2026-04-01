import React, { useState, useEffect } from 'react';
import { View } from './lib/types';
import type { CategoryContent, Video } from './lib/types';
import { INITIAL_CATEGORIES } from './constants';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { useFavorites } from './hooks/useFavorites';
import { Navbar } from './components/Navbar';
import { AIChat } from './components/AIChat';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { CategoryDetailView } from './views/CategoryDetailView';
import { AdminView } from './views/AdminView';

const App: React.FC = () => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    isInitializing,
    isProcessing,
    errorMessage,
    initStatus,
    isResetMode,
    login,
    logout,
    forgotPassword,
    updatePassword,
  } = useAuth();

  const { watched, toggleWatched } = useProgress(currentUser?.id);
  const { favorites, toggleFavorite } = useFavorites(currentUser?.id);

  const [categories, setCategories] = useState<CategoryContent[]>(() => {
    try {
      const cached = localStorage.getItem('orel_categories_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return INITIAL_CATEGORIES;
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryContent | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*, videos(*)');
      if (!error && data && data.length > 0) {
        setCategories(data as any);
        localStorage.setItem('orel_categories_cache', JSON.stringify(data));
      }
    } catch { /* use local data */ }
  };

  useEffect(() => {
    if (currentUser) fetchCategories();
  }, [currentUser]);

  const handleSelectCategory = (cat: CategoryContent) => {
    setSelectedCategory(cat);
    setActiveVideo(cat.videos?.[0] || null);
    setCurrentView(View.CATEGORY_DETAIL);
  };

  const handleSelectFavoriteVideo = (video: Video, cat: CategoryContent) => {
    setSelectedCategory(cat);
    setActiveVideo(video);
    setCurrentView(View.CATEGORY_DETAIL);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-10 text-center">
        <div className="w-16 h-16 border-4 border-orange-600/10 border-t-orange-600 rounded-full animate-spin mb-8" />
        <h2 className="text-white font-black text-lg mb-2 italic tracking-tighter uppercase">מאתחל ספרייה</h2>
        <p className="text-gray-500 text-xs font-bold tracking-widest">{initStatus}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-600/30">
      {isProcessing && (
        <div className="fixed top-0 left-0 w-full h-1 z-[200] overflow-hidden">
          <div className="loading-shimmer w-full h-full bg-orange-600" />
        </div>
      )}

      {currentView !== View.LOGIN && currentUser && (
        <Navbar
          user={currentUser}
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={logout}
        />
      )}

      {currentView === View.LOGIN && (
        <LoginView
          onLogin={login}
          onForgotPassword={forgotPassword}
          onUpdatePassword={updatePassword}
          isResetMode={isResetMode}
          isProcessing={isProcessing}
          errorMessage={errorMessage}
        />
      )}

      {currentView === View.DASHBOARD && currentUser && (
        <DashboardView
          user={currentUser}
          categories={categories}
          watched={watched}
          favorites={favorites}
          onSelectCategory={handleSelectCategory}
          onSelectFavoriteVideo={handleSelectFavoriteVideo}
        />
      )}

      {currentView === View.CATEGORY_DETAIL && selectedCategory && activeVideo && (
        <CategoryDetailView
          category={selectedCategory}
          activeVideo={activeVideo}
          watched={watched}
          favorites={favorites}
          onSelectVideo={setActiveVideo}
          onToggleWatched={toggleWatched}
          onToggleFavorite={toggleFavorite}
          onBack={() => setCurrentView(View.DASHBOARD)}
        />
      )}

      {currentView === View.ADMIN && currentUser?.isAdmin && (
        <AdminView onBack={() => setCurrentView(View.DASHBOARD)} onDataRefresh={fetchCategories} />
      )}

      {currentView !== View.LOGIN && <AIChat />}
    </div>
  );
};

export default App;
