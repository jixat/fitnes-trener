import React from 'react';
import { Menu, Activity } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export function Header({ onOpenDrawer, title, activeTab }) {
  const { user, triggerHaptic } = useTelegram();

  const handleMenuClick = () => {
    triggerHaptic('light');
    onOpenDrawer();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#161b22] border-b border-[#30363d] px-4 py-3 flex items-center justify-between">
      {/* Left: Hamburger menu icon */}
      <button
        onClick={handleMenuClick}
        className="p-2.5 rounded-md bg-transparent hover:bg-[#21262d] active:scale-95 transition-all duration-200 border border-[#30363d] text-[#c9d1d9] flex items-center justify-center focus:outline-none"
        aria-label="Open side menu"
      >
        <Menu className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Center: Dynamic title */}
      <div className="flex flex-col items-center justify-center text-center px-2 flex-1 mx-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
          <Activity className="w-3 h-3" strokeWidth={1.5} />
          <span>Фитнес Тренер</span>
        </div>
        <h1 className="text-sm font-bold text-white truncate max-w-[200px] mt-0.5">
          {title || 'Каталог Тренировок'}
        </h1>
      </div>

      {/* Right: Telegram user info badge */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#238636] flex items-center justify-center text-white font-bold text-xs border border-[#2ea043]">
          {user?.first_name ? user.first_name[0].toUpperCase() : 'FT'}
        </div>
      </div>
    </header>
  );
}
