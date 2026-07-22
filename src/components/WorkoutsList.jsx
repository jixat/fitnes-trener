import React, { useState } from 'react';
import { Search, Flame, Clock, Dumbbell, ChevronRight, Filter, Target, Activity } from 'lucide-react';
import { WORKOUTS_DATA, CATEGORIES, MUSCLE_GROUPS, WORKOUT_PLANS } from '../data/workoutsData';
import { useTelegram } from '../hooks/useTelegram';

export function WorkoutsList({ onSelectExercise, onSelectPlan }) {
  const { triggerHaptic } = useTelegram();
  const [activeTab, setActiveTab] = useState('exercises'); // 'exercises' or 'plans'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkouts = WORKOUTS_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      item.subcategory === selectedCategory;
      
    const matchesMuscle = 
      selectedMuscle === 'all' || 
      item.targetMuscles.includes(selectedMuscle);
      
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesCategory && matchesMuscle && matchesSearch;
  });

  const filteredPlans = WORKOUT_PLANS.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-12">
      {/* Tabs Selector */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('exercises');
          }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'exercises'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> Упражнения
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('plans');
          }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'plans'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Планы
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={activeTab === 'exercises' ? "Поиск упражнений..." : "Поиск планов..."}
          className="w-full pl-10 pr-4 py-3 rounded-2xl glass-panel text-sm text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {activeTab === 'exercises' && (
        <>
          {/* Category Pills Slider */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md'
                      : 'glass-panel text-slate-300 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Muscle Groups Slider */}
          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
            <div className="flex items-center gap-1 text-slate-400 pr-2 border-r border-white/10 shrink-0">
              <Target className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Мышцы</span>
            </div>
            {MUSCLE_GROUPS.map((muscle) => {
              const isActive = selectedMuscle === muscle.id;
              return (
                <button
                  key={muscle.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedMuscle(muscle.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                  }`}
                >
                  {muscle.label}
                </button>
              );
            })}
          </div>

          {/* Workouts List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Доступные упражнения ({filteredWorkouts.length})
              </span>
            </div>

            {filteredWorkouts.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-3xl border border-white/10 space-y-2">
                <Filter className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="text-sm font-bold text-white">Упражнения не найдены</div>
                <p className="text-xs text-slate-400">Попробуйте изменить категорию или фильтры</p>
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() => {
                    triggerHaptic('medium');
                    onSelectExercise(workout);
                  }}
                  className="w-full glass-card p-4 rounded-3xl text-left border border-white/10 hover:border-blue-500/40 transition-all duration-200 active:scale-[0.98] flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5 flex-1 pr-2">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shrink-0"
                      style={{ background: workout.imageBg || 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                    >
                      <Dumbbell className="w-6 h-6" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                        {workout.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-400" />
                          {workout.duration}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {workout.calories}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-wrap pt-0.5">
                        {workout.targetMuscles.slice(0, 2).map((m, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1 shrink-0" />
                </button>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Готовые программы ({filteredPlans.length})
            </span>
          </div>

          {filteredPlans.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-3xl border border-white/10 space-y-2">
              <Filter className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">Планы не найдены</div>
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  triggerHaptic('medium');
                  onSelectPlan?.(plan);
                }}
                className="w-full relative overflow-hidden glass-card p-5 rounded-3xl text-left border border-white/10 hover:border-emerald-500/40 transition-all duration-200 active:scale-[0.98] group"
              >
                <div 
                  className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
                  style={{ background: plan.imageBg }}
                />
                
                <div className="relative z-10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2 inline-block">
                        {plan.level}
                      </span>
                      <h4 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                        {plan.title}
                      </h4>
                    </div>
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
                      style={{ background: plan.imageBg }}
                    >
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-1 border-t border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {plan.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {plan.calories}
                    </span>
                    <span className="flex items-center gap-1.5 ml-auto text-emerald-400 group-hover:translate-x-1 transition-transform">
                      {plan.exercises.length} упр. <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
