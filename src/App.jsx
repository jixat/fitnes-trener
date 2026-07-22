import React, { useState } from 'react';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { WorkoutsList } from './components/WorkoutsList';
import { ExerciseCard } from './components/ExerciseCard';
import { WorkoutTimer } from './components/WorkoutTimer';
import { AICoachChat } from './components/AICoachChat';
import { CalorieCalculator } from './components/CalorieCalculator';
import { WORKOUTS_DATA } from './data/workoutsData';
import { useTelegram } from './hooks/useTelegram';
import { Dumbbell, Timer, Bot, Calculator, ArrowLeft } from 'lucide-react';

export default function App() {
  const { triggerHaptic } = useTelegram();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts'); // 'workouts', 'timer', 'ai', 'calculator'
  const [selectedExercise, setSelectedExercise] = useState(WORKOUTS_DATA[0]); // Default to first exercise matching sketch
  const [isDetailView, setIsDetailView] = useState(true); // true matching sketch exercise view
  const [restTimerSec, setRestTimerSec] = useState(60);

  const getHeaderTitle = () => {
    if (activeTab === 'workouts') {
      return isDetailView ? selectedExercise?.title || 'Приседания' : 'Каталог Тренировок';
    }
    if (activeTab === 'timer') return 'Таймер Отдыха';
    if (activeTab === 'ai') return 'ИИ Помощник';
    if (activeTab === 'calculator') return 'Калькулятор Калорий';
    return 'Фитнес Тренер';
  };

  const handleSelectExercise = (workout) => {
    setSelectedExercise(workout);
    setIsDetailView(true);
  };

  const handleStartRestTimer = (seconds) => {
    setRestTimerSec(seconds || 60);
    setActiveTab('timer');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Header Bar matching sketch */}
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        title={getHeaderTitle()}
        activeTab={activeTab}
      />

      {/* Slide-out Navigation Drawer matching sketch */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          if (tabId === 'workouts') {
            setIsDetailView(true); // Default to exercise view matching sketch
          }
        }}
      />

      {/* Main Content Router View */}
      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full">
        {activeTab === 'workouts' && (
          <div>
            {/* View Switcher Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsDetailView(!isDetailView);
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 active:scale-95 transition-all"
              >
                {isDetailView ? (
                  <>
                    <ArrowLeft className="w-3.5 h-3.5" /> К списку тренировок
                  </>
                ) : (
                  <>Смотреть карточку упражнения →</>
                )}
              </button>
            </div>

            {isDetailView ? (
              <ExerciseCard
                workout={selectedExercise}
                onStartRestTimer={handleStartRestTimer}
              />
            ) : (
              <WorkoutsList onSelectExercise={handleSelectExercise} />
            )}
          </div>
        )}

        {activeTab === 'timer' && (
          <WorkoutTimer initialSeconds={restTimerSec} />
        )}

        {activeTab === 'ai' && <AICoachChat />}

        {activeTab === 'calculator' && <CalorieCalculator />}
      </main>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 z-30 px-3 py-2 flex justify-around items-center max-w-md mx-auto backdrop-blur-2xl">
        {[
          { id: 'workouts', label: 'Тренировки', icon: Dumbbell },
          { id: 'timer', label: 'Таймер', icon: Timer },
          { id: 'ai', label: 'ИИ Тренер', icon: Bot },
          { id: 'calculator', label: 'Калории', icon: Calculator }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-400 bg-blue-500/15 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
