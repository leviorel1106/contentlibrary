import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onForgotPassword: (email: string) => Promise<void>;
  onUpdatePassword: (newPassword: string) => Promise<void>;
  isResetMode: boolean;
  isProcessing: boolean;
  errorMessage: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onForgotPassword,
  onUpdatePassword,
  isResetMode,
  isProcessing,
  errorMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Reset password mode state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email.toLowerCase().trim(), password, rememberMe);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      await onForgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || 'שגיאה בשליחת הקישור');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError('הסיסמאות אינן תואמות');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    setResetError(null);
    setResetLoading(true);
    try {
      await onUpdatePassword(newPassword);
    } catch (err: any) {
      setResetError(err.message || 'שגיאה בעדכון הסיסמה');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] bg-grid flex items-center justify-center p-4 sm:p-6 text-right relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] right-[-15%] w-[75%] h-[75%] bg-orange-600/[0.16] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-15%] w-[60%] h-[60%] bg-orange-600/[0.09] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(234,88,12,0.04),transparent)]" />

      <div className="glass-elevated p-6 sm:p-10 rounded-[40px] sm:rounded-[48px] w-full max-w-md relative z-10 shadow-2xl animate-fade-up">
        {/* Profile */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-36 h-36 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8 relative group">
            <img
              src="/orel-profile.png"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              alt="Orel"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-['Bebas_Neue'] tracking-wide uppercase mb-1 text-orange-gradient">אוראל לוי</h1>
          <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-[0.25em]">תוכן הדרכה אקסקלוסיבי</p>
        </div>

        {/* PASSWORD RESET MODE — user came from reset email link */}
        {isResetMode && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-black text-white mb-6 text-center italic uppercase tracking-tighter">הגדרת סיסמה חדשה</h2>
            {resetError && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
                {resetError}
              </div>
            )}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="סיסמה חדשה"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600"
              />
              <input
                type="password"
                placeholder="אימות סיסמה"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600"
              />
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 active:scale-[0.98] uppercase tracking-widest text-sm"
              >
                {resetLoading ? 'שומר...' : 'שמור סיסמה חדשה'}
              </button>
            </form>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {!isResetMode && showForgot && (
          <div className="animate-fade-in">
            {forgotSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-600/15 border border-orange-600/25 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
                <h3 className="text-lg font-black text-white mb-2">הקישור נשלח!</h3>
                <p className="text-gray-500 text-sm mb-6">בדוק את המייל שלך ולחץ על הקישור לאיפוס הסיסמה.</p>
                <button
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
                  className="text-orange-500 font-bold border-b border-orange-500/30 text-sm"
                >
                  חזרה למסך הכניסה
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-black text-white mb-2 text-center italic uppercase tracking-tighter">איפוס סיסמה</h2>
                <p className="text-gray-500 text-xs text-center mb-6">הכנס את כתובת המייל שלך ונשלח קישור לאיפוס</p>
                {forgotError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
                    {forgotError}
                  </div>
                )}
                <form onSubmit={handleForgot} className="space-y-4">
                  <input
                    type="email"
                    placeholder="אימייל"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600"
                  />
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 active:scale-[0.98] uppercase tracking-widest text-sm"
                  >
                    {forgotLoading ? 'שולח...' : 'שלח קישור לאיפוס'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="w-full text-gray-500 text-xs font-bold py-2 uppercase tracking-widest hover:text-gray-400 transition-colors"
                  >
                    ביטול
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* MAIN LOGIN FORM */}
        {!isResetMode && !showForgot && !showInquiry && (
          <>
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="אימייל"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600"
              />
              <input
                type="password"
                placeholder="סיסמה"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600"
              />

              {/* Remember me + forgot password row */}
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-orange-500/70 text-xs font-bold hover:text-orange-400 transition-colors"
                >
                  שכחתי סיסמה
                </button>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-gray-500 text-xs font-bold group-hover:text-gray-400 transition-colors">זכור אותי</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                        rememberMe ? 'bg-orange-600 border-orange-600' : 'bg-transparent border-white/20 hover:border-white/40'
                      }`}
                    >
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 mt-2 uppercase tracking-widest text-sm"
              >
                {isProcessing ? 'בודק נתונים...' : 'כניסה לספרייה'}
              </button>
            </form>

            <div className="mt-8 sm:mt-10 pt-6 border-t border-white/5 text-center">
              <button
                onClick={() => setShowInquiry(true)}
                className="text-orange-500 font-black text-sm hover:text-orange-400 transition-colors"
              >
                בקשת הצטרפות ללקוחות חדשים ←
              </button>
            </div>
          </>
        )}

        {/* INQUIRY FORM */}
        {!isResetMode && showInquiry && (
          <div className="animate-fade-in">
            {inquirySuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">הפנייה התקבלה!</h3>
                <p className="text-gray-500 text-sm mb-6">ניצור איתך קשר בקרוב.</p>
                <button
                  onClick={() => { setShowInquiry(false); setInquirySuccess(false); }}
                  className="text-orange-500 font-bold border-b border-orange-500/30"
                >
                  חזרה למסך הכניסה
                </button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setInquirySuccess(true); }} className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-6 text-center italic">יצירת קשר</h2>
                <input type="text" placeholder="שם מלא" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600" />
                <input type="email" placeholder="אימייל" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600" />
                <input type="tel" placeholder="טלפון" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/15 transition-all placeholder:text-zinc-600" />
                <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 mt-4 transition-all active:scale-[0.98] uppercase tracking-widest text-sm">שלח הודעה</button>
                <button type="button" onClick={() => setShowInquiry(false)} className="w-full text-gray-500 text-xs font-bold py-2 uppercase tracking-widest mt-2 hover:text-gray-400 transition-colors">ביטול</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
