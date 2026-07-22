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
import { Dumbbell, Timer, Bot, Calculator, ArrowLeft, PlayCircle } from 'lucide-react';

export default function App() {
  const { triggerHaptic } = useTelegram();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts'); // 'workouts', 'timer', 'ai', 'calculator'
  
  // View states
  const [currentView, setCurrentView] = useState('list'); // 'list', 'exercise', 'plan'
  const [selectedExercise, setSelectedExercise] = useState(WORKOUTS_DATA[0]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [restTimerSec, setRestTimerSec] = useState(60);
  const [timerTrigger, setTimerTrigger] = useState(0);

  const getHeaderTitle = () => {
    if (activeTab === 'workouts') {
      if (currentView === 'exercise') return selectedExercise?.title || 'Упражнение';
      if (currentView === 'plan') return selectedPlan?.title || 'План тренировки';
      return 'Каталог Тренировок';
    }
    if (activeTab === 'timer') return 'Таймер Отдыха';
    if (activeTab === 'ai') return 'ИИ Помощник';
    if (activeTab === 'calculator') return 'Калькулятор Калорий';
    return 'Фитнес Тренер';
  };

  const handleSelectExercise = (workout) => {
    setSelectedExercise(workout);
    setCurrentView('exercise');
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentView('plan');
  };

  const handleStartRestTimer = (seconds) => {
    setRestTimerSec(seconds || 60);
    setTimerTrigger(Date.now()); // Force timer restart
    setActiveTab('timer');
  };

  // Render Plan View
  const renderPlanView = () => {
    if (!selectedPlan) return null;
    return (
      <div className="space-y-4 pb-12">
        <div className="text-center pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            План тренировки • {selectedPlan.level}
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            {selectedPlan.title}
          </h2>
          <p className="text-xs text-slate-400 mt-2">{selectedPlan.description}</p>
        </div>

        <div className="space-y-3">
          {selectedPlan.exercises.map((planEx, idx) => {
            const exercise = WORKOUTS_DATA.find(ex => ex.id === planEx.id);
            if (!exercise) return null;
            return (
              <div key={idx} className="glass-panel p-4 rounded-3xl border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30 shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{exercise.title}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {planEx.sets} подхода по {planEx.reps}
                  </div>
                </div>
                <button
                  onClick={() => handleSelectExercise(exercise)}
                  className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-slate-300"
                >
                  <PlayCircle className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        title={getHeaderTitle()}
        activeTab={activeTab}
      />

      {/* Slide-out Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          if (tabId === 'workouts') {
            setCurrentView('list');
          }
        }}
      />

      {/* Main Content Router View */}
      <main className="flex-1 px-4 pt-4 max-w-md mx-auto w-full">
        <div className={activeTab === 'workouts' ? 'block' : 'hidden'}>
          {/* View Switcher Bar (Back button) */}
          {currentView !== 'list' && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  if (currentView === 'exercise' && selectedPlan) {
                    setCurrentView('list'); 
                  } else {
                    setCurrentView('list');
                  }
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> К списку
              </button>
            </div>
          )}

          {currentView === 'list' && (
            <WorkoutsList 
              onSelectExercise={handleSelectExercise} 
              onSelectPlan={handleSelectPlan}
            />
          )}
          
          {currentView === 'exercise' && (
            <ExerciseCard
              workout={selectedExercise}
              onStartRestTimer={handleStartRestTimer}
            />
          )}

          {currentView === 'plan' && renderPlanView()}
        </div>

        <div className={activeTab === 'timer' ? 'block' : 'hidden'}>
          <WorkoutTimer 
            initialSeconds={restTimerSec} 
            timerTrigger={timerTrigger}
            onTimerComplete={() => setActiveTab('workouts')}
          />
        </div>

        <div className={activeTab === 'ai' ? 'block' : 'hidden'}>
          <AICoachChat />
        </div>

        <div className={activeTab === 'calculator' ? 'block' : 'hidden'}>
          <CalorieCalculator />
        </div>
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
