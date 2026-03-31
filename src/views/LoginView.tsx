import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  isProcessing: boolean;
  errorMessage: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, isProcessing, errorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email.toLowerCase().trim(), password);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-right relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="glass p-10 rounded-[45px] w-full max-w-md relative z-10 shadow-2xl animate-fade-in">
        {/* Profile */}
        <div className="text-center mb-10">
          <div className="w-28 h-28 mx-auto rounded-full p-1.5 mb-8 border-2 border-orange-600 orange-glow overflow-hidden relative group">
            <img
              src="https://i.postimg.cc/6679qDD9/Gemini-Generated-Image-kgh6zckgh6zckgh6.png"
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
              alt="Orel"
            />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">אוראל לוי</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">תוכן הדרכה אקסקלוסיבי</p>
        </div>

        {!showInquiry ? (
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
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-right outline-none focus:ring-2 focus:ring-orange-600 transition-all placeholder:text-gray-600"
              />
              <input
                type="password"
                placeholder="סיסמה"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-right outline-none focus:ring-2 focus:ring-orange-600 transition-all placeholder:text-gray-600"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 mt-2 uppercase tracking-widest text-sm"
              >
                {isProcessing ? 'בודק נתונים...' : 'כניסה לספרייה'}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-white/5 text-center">
              <button
                onClick={() => setShowInquiry(true)}
                className="text-orange-500 font-black text-sm hover:text-orange-400 transition-colors"
              >
                בקשת הצטרפות ללקוחות חדשים ←
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            {inquirySuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
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
                <input type="text" placeholder="שם מלא" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:ring-2 focus:ring-orange-600 placeholder:text-gray-600" />
                <input type="email" placeholder="אימייל" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:ring-2 focus:ring-orange-600 placeholder:text-gray-600" />
                <input type="tel" placeholder="טלפון" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-right outline-none focus:ring-2 focus:ring-orange-600 placeholder:text-gray-600" />
                <button type="submit" className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg mt-4 hover:bg-orange-500 transition-all">שלח הודעה</button>
                <button type="button" onClick={() => setShowInquiry(false)} className="w-full text-gray-500 text-xs font-bold py-2 uppercase tracking-widest mt-2 hover:text-gray-400 transition-colors">ביטול</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
