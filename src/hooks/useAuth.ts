import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { View } from '../lib/types';
import type { AppUser } from '../lib/types';

const SUPER_ADMIN_ID = '015af6f9-fdb1-4321-b25b-584ab2002fc6';
const OWNER_EMAIL = 'leviorel@gmail.com';

async function checkAuthorization(supabaseUser: any): Promise<AppUser | null> {
  if (!supabaseUser?.id) return null;

  // Super admin by ID or email
  if (supabaseUser.id === SUPER_ADMIN_ID || supabaseUser.email?.toLowerCase() === OWNER_EMAIL) {
    return {
      email: supabaseUser.email || OWNER_EMAIL,
      name: 'אוראל לוי',
      isAdmin: true,
      status: 'active',
      id: supabaseUser.id,
    };
  }

  const email = supabaseUser.email?.toLowerCase().trim();
  if (!email) return null;

  const timeoutId = setTimeout(() => {}, 8000);
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('email, full_name, is_admin, status')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) return null;
    if (data.status !== 'active') return null;

    return {
      email: data.email,
      name: data.full_name,
      isAdmin: !!data.is_admin,
      status: data.status,
      id: supabaseUser.id,
    } as AppUser;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initStatus, setInitStatus] = useState('מתחבר למערכת...');
  const [isResetMode, setIsResetMode] = useState(false);
  const isCheckingAuth = useRef(false);

  // Safety: reset isProcessing if stuck
  useEffect(() => {
    if (!isProcessing) return;
    const timer = setTimeout(() => {
      setIsProcessing(false);
      isCheckingAuth.current = false;
    }, 6000);
    return () => clearTimeout(timer);
  }, [isProcessing]);

  // Init: check existing session
  useEffect(() => {
    let mounted = true;
    const emergencyTimer = setTimeout(() => {
      if (mounted) setIsInitializing(false);
    }, 8000);

    const run = async () => {
      try {
        setInitStatus('בודק חיבור...');
        const { data, error } = await supabase.auth.getSession();
        if (error && !error.message.includes('fetch')) throw error;

        const session = data?.session;
        if (session?.user && !isCheckingAuth.current) {
          // Remember-me check: if user opted out of persistence and this is a new browser session
          const noPersist = localStorage.getItem('orel_no_persist') === 'true';
          const hasActiveSession = sessionStorage.getItem('orel_active') === '1';
          if (noPersist && !hasActiveSession) {
            await supabase.auth.signOut();
            if (mounted) setIsInitializing(false);
            clearTimeout(emergencyTimer);
            return;
          }

          isCheckingAuth.current = true;
          setInitStatus('מאמת הרשאות...');
          const user = await checkAuthorization(session.user);
          if (mounted) {
            if (user) {
              sessionStorage.setItem('orel_active', '1');
              setCurrentUser(user);
              setCurrentView(View.DASHBOARD);
            } else {
              await supabase.auth.signOut();
              setErrorMessage('הגישה לחשבון זה נחסמה.');
            }
          }
          isCheckingAuth.current = false;
        }
      } catch (err: any) {
        if (mounted) setErrorMessage('בעיית תקשורת. נסה לרענן.');
      } finally {
        clearTimeout(emergencyTimer);
        if (mounted) setIsInitializing(false);
      }
    };

    run();
    return () => { mounted = false; };
  }, []);

  // Auth state listener
  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setIsResetMode(true);
        setCurrentView(View.LOGIN);
        setIsInitializing(false);
        return;
      }

      const isAuthEvent = ['SIGNED_IN', 'INITIAL_SESSION', 'USER_UPDATED'].includes(event);

      if (isAuthEvent && session?.user && !isCheckingAuth.current) {
        isCheckingAuth.current = true;
        setIsProcessing(true);
        try {
          const user = await checkAuthorization(session.user);
          if (mounted) {
            if (user) {
              setCurrentUser(user);
              setCurrentView(View.DASHBOARD);
              setErrorMessage(null);
            } else {
              setErrorMessage('אין הרשאת גישה פעילה לחשבון זה.');
              await supabase.auth.signOut();
            }
          }
        } finally {
          if (mounted) { setIsProcessing(false); isCheckingAuth.current = false; }
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView(View.LOGIN);
        setIsProcessing(false);
        setIsResetMode(false);
        isCheckingAuth.current = false;
        sessionStorage.removeItem('orel_active');
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('fetch')) throw new Error('נכשל בהתחברות לשרת. בדוק חיבור אינטרנט.');
        throw error;
      }
      // Store remember-me preference
      if (rememberMe) {
        localStorage.removeItem('orel_no_persist');
      } else {
        localStorage.setItem('orel_no_persist', 'true');
      }
      sessionStorage.setItem('orel_active', '1');

      if (data.session?.user && !isCheckingAuth.current) {
        const user = await checkAuthorization(data.session.user);
        if (user) {
          setCurrentUser(user);
          setCurrentView(View.DASHBOARD);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'פרטי התחברות שגויים.');
    } finally {
      setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    setIsResetMode(false);
  };

  const logout = async () => {
    setIsProcessing(true);
    try {
      await supabase.auth.signOut();
    } catch {
      setCurrentUser(null);
      setCurrentView(View.LOGIN);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    currentUser,
    currentView,
    setCurrentView,
    isInitializing,
    isProcessing,
    setIsProcessing,
    errorMessage,
    setErrorMessage,
    initStatus,
    isResetMode,
    login,
    logout,
    forgotPassword,
    updatePassword,
  };
}
