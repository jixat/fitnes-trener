import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Timer, Bot, Calculator, X, ChevronRight, Sparkles, Trophy, Zap } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export function NavigationDrawer({ isOpen, onClose, activeTab, onSelectTab }) {
  const { user, triggerHaptic } = useTelegram();

  const MENU_ITEMS = [
    {
      id: 'workouts',
      title: 'тренировки',
      subtitle: 'Каталог и упражнения',
      icon: Dumbbell,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Каталог'
    },
    {
      id: 'timer',
      title: 'таймер',
      subtitle: 'Отдых и Табата',
      icon: Timer,
      color: 'from-amber-500 to-orange-600',
      badge: 'Интервал'
    },
    {
      id: 'ai',
      title: 'ии помощник',
      subtitle: 'Персональный тренер 24/7',
      icon: Bot,
      color: 'from-emerald-500 to-teal-600',
      badge: 'AI Smart'
    },
    {
      id: 'calculator',
      title: 'калькулятор калорий',
      subtitle: 'Расчет BMR, TDEE и БЖУ',
      icon: Calculator,
      color: 'from-purple-500 to-fuchsia-600',
      badge: 'Питание'
    }
  ];

  const handleSelect = (tabId) => {
    triggerHaptic('medium');
    onSelectTab(tabId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />

          {/* Slide-out drawer matching sketch */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-[#0d1117] border-r border-[#30363d] z-50 flex flex-col justify-between p-5 shadow-2xl"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-[#30363d]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#238636] flex items-center justify-center text-white font-bold text-lg border border-[#2ea043]">
                    {user?.first_name ? user.first_name[0] : 'Ф'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {user?.first_name || 'Атлет'}
                    </h3>
                    <span className="text-xs text-[#8b949e] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> PRO Тренер
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onClose();
                  }}
                  className="p-2 rounded-md bg-transparent hover:bg-[#21262d] border border-transparent hover:border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title label matching sketch */}
              <div className="my-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b949e] px-1">
                  Главное меню
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full text-left p-3 rounded-md flex items-center justify-between transition-all duration-200 border ${
                        isActive
                          ? 'bg-[#161b22] border-[#30363d] text-white'
                          : 'bg-transparent hover:bg-[#161b22] border-transparent text-[#c9d1d9]'
                      } active:scale-[0.98]`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-md flex items-center justify-center border ${
                            isActive
                              ? 'bg-[#238636] border-[#2ea043] text-white'
                              : 'bg-[#21262d] border-[#30363d] text-[#8b949e]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-sm font-bold capitalize leading-snug ${isActive ? 'text-white' : 'text-[#c9d1d9]'}`}>
                            {item.title}
                          </div>
                          <div className="text-[10px] text-[#8b949e]">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-[#3fb950] translate-x-1' : 'text-[#30363d]'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Motivation Card */}
            <div className="p-4 rounded-md bg-[#161b22] border border-[#30363d] text-center">
              <div className="flex justify-center mb-1 text-[#e3b341]">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Твой прогресс сегодня</div>
              <div className="text-[10px] text-[#8b949e] mt-0.5">
                Выполнено 3 подхода • 120 ккал
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
