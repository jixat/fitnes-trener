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
            className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-slate-900/95 border-r border-white/10 z-50 flex flex-col justify-between p-5 shadow-2xl backdrop-blur-2xl"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/20">
                    {user?.first_name ? user.first_name[0] : 'Ф'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {user?.first_name || 'Атлет'}
                    </h3>
                    <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> PRO Тренер
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title label matching sketch */}
              <div className="my-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Главное меню
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-3">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 border ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/20 border-blue-500/50 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 border-white/5 text-slate-300'
                      } active:scale-[0.98]`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-md`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white capitalize leading-snug">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-400">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-blue-400 translate-x-1' : 'text-slate-500'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Motivation Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 text-center">
              <div className="flex justify-center mb-1.5 text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-white">Твой прогресс сегодня</div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Выполнено 3 подхода • 120 ккал
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
