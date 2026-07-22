import React from 'react';
import { Menu, Dumbbell, User, Sparkles } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export function Header({ onOpenDrawer, title, activeTab }) {
  const { user, triggerHaptic } = useTelegram();

  const handleMenuClick = () => {
    triggerHaptic('light');
    onOpenDrawer();
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg backdrop-blur-xl">
      {/* Left: Hamburger menu icon matching sketch */}
      <button
        onClick={handleMenuClick}
        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 border border-white/10 text-white flex items-center justify-center focus:outline-none"
        aria-label="Open side menu"
      >
        <Menu className="w-6 h-6 text-blue-400" />
      </button>

      {/* Center: Dynamic title matching sketch ("наименование") */}
      <div className="flex flex-col items-center justify-center text-center px-2 flex-1 mx-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Фитнес Тренер</span>
        </div>
        <h1 className="text-base font-bold text-white truncate max-w-[200px]">
          {title || 'Каталог Тренировок'}
        </h1>
      </div>

      {/* Right: Telegram user info badge */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
          {user?.first_name ? user.first_name[0].toUpperCase() : 'FT'}
        </div>
      </div>
    </header>
  );
}
