import React, { useState } from 'react';

export const AIChat: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-8 left-8 z-[100] w-14 h-14 bg-orange-600 hover:bg-orange-500 rounded-full shadow-2xl shadow-orange-600/40 flex items-center justify-center text-2xl transition-all active:scale-90 hover:scale-110"
        title="עזרה"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-28 left-8 z-[100] w-80 glass rounded-[30px] p-6 shadow-2xl animate-scale-in">
          <h4 className="text-sm font-black text-white mb-3 uppercase tracking-widest border-r-4 border-orange-600 pr-3">
            עוזר AI
          </h4>
          <p className="text-gray-400 text-xs leading-relaxed">
            יש לך שאלה על השיעורים? כתוב לנו ונחזור אליך בקרוב.
          </p>
          <textarea
            placeholder="מה תרצה לדעת?"
            className="w-full mt-4 bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-right text-white outline-none focus:border-orange-600 transition-all h-20 resize-none placeholder:text-gray-600"
          />
          <button className="w-full mt-3 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            שלח
          </button>
        </div>
      )}
    </>
  );
};
