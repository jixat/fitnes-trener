import React, { useState } from 'react';
import { Search, Flame, Clock, Dumbbell, ChevronRight, Filter } from 'lucide-react';
import { WORKOUTS_DATA, CATEGORIES } from '../data/workoutsData';
import { useTelegram } from '../hooks/useTelegram';

export function WorkoutsList({ onSelectExercise }) {
  const { triggerHaptic } = useTelegram();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkouts = WORKOUTS_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      item.subcategory === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-12">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск упражнений или мышц..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl glass-panel text-sm text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-blue-500/50"
        />
      </div>

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
            <p className="text-xs text-slate-400">Попробуйте изменить категорию или поисковый запрос</p>
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
                {/* Visual Icon */}
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
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
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
    </div>
  );
}
