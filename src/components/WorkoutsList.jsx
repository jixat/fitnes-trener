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
      <div className="flex p-1 bg-[#161b22] border border-[#30363d] rounded-md">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('exercises');
          }}
          className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'exercises'
              ? 'bg-[#21262d] text-white border border-[#30363d] shadow-sm'
              : 'text-[#8b949e] hover:text-[#c9d1d9] border border-transparent'
          }`}
        >
          <Dumbbell className="w-4 h-4" strokeWidth={1.5} /> Упражнения
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('plans');
          }}
          className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'plans'
              ? 'bg-[#21262d] text-white border border-[#30363d] shadow-sm'
              : 'text-[#8b949e] hover:text-[#c9d1d9] border border-transparent'
          }`}
        >
          <Activity className="w-4 h-4" strokeWidth={1.5} /> Планы
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={activeTab === 'exercises' ? "Поиск упражнений..." : "Поиск планов..."}
          className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#0d1117] text-sm text-[#c9d1d9] placeholder-[#8b949e] border border-[#30363d] focus:outline-none focus:border-[#58a6ff]"
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
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1f6feb] text-white border-[#1f6feb]'
                      : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'
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
            <div className="flex items-center gap-1 text-[#8b949e] pr-2 border-r border-[#30363d] shrink-0">
              <Target className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-[9px] uppercase font-bold tracking-wider">Мышцы</span>
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
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]/40'
                      : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:bg-[#21262d]'
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                Доступные упражнения ({filteredWorkouts.length})
              </span>
            </div>

            {filteredWorkouts.length === 0 ? (
              <div className="bg-[#161b22] p-8 text-center rounded-md border border-[#30363d] space-y-2">
                <Filter className="w-6 h-6 text-[#8b949e] mx-auto" strokeWidth={1.5} />
                <div className="text-sm font-bold text-white">Упражнения не найдены</div>
                <p className="text-xs text-[#8b949e]">Попробуйте изменить категорию или фильтры</p>
              </div>
            ) : (
              filteredWorkouts.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() => {
                    triggerHaptic('medium');
                    onSelectExercise(workout);
                  }}
                  className="w-full bg-[#161b22] p-3.5 rounded-md text-left border border-[#30363d] hover:border-[#58a6ff] transition-all duration-200 active:scale-[0.98] flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 flex-1 pr-2">
                    <div
                      className="flex items-center justify-center text-[#8b949e] shrink-0 w-8"
                    >
                      <Dumbbell className="w-5 h-5 group-hover:text-[#58a6ff] transition-colors" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors truncate">
                        {workout.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#8b949e] flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8b949e]" strokeWidth={1.5} />
                          {workout.duration}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#8b949e]" strokeWidth={1.5} />
                          {workout.calories}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-wrap pt-0.5">
                        {workout.targetMuscles.slice(0, 2).map((m, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#30363d] group-hover:text-[#58a6ff] transition-transform group-hover:translate-x-1 shrink-0" strokeWidth={1.5} />
                </button>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
              Готовые программы ({filteredPlans.length})
            </span>
          </div>

          {filteredPlans.length === 0 ? (
            <div className="bg-[#161b22] p-8 text-center rounded-md border border-[#30363d] space-y-2">
              <Filter className="w-6 h-6 text-[#8b949e] mx-auto" strokeWidth={1.5} />
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
                className="w-full relative overflow-hidden bg-[#161b22] p-4 rounded-md text-left border border-[#30363d] hover:border-[#238636] transition-all duration-200 active:scale-[0.98] group"
              >
                <div className="relative z-10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-[#21262d] text-[#c9d1d9] border border-[#30363d] mb-2 inline-block">
                        {plan.level}
                      </span>
                      <h4 className="text-sm font-bold text-[#c9d1d9] group-hover:text-[#3fb950] transition-colors">
                        {plan.title}
                      </h4>
                    </div>
                    <div 
                      className="flex items-center justify-center text-[#8b949e] shrink-0"
                    >
                      <Activity className="w-5 h-5 group-hover:text-[#3fb950] transition-colors" strokeWidth={1.5} />
                    </div>
                  </div>

                  <p className="text-xs text-[#8b949e] leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-bold text-[#8b949e] pt-2 border-t border-[#30363d]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8b949e]" strokeWidth={1.5} />
                      {plan.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#8b949e]" strokeWidth={1.5} />
                      {plan.calories}
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-[#8b949e] group-hover:text-[#3fb950] group-hover:translate-x-1 transition-all">
                      {plan.exercises.length} упр. <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
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
