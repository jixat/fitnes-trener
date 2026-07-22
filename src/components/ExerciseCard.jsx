import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, Clock, Flame, Dumbbell, ShieldCheck, Zap } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export function ExerciseCard({ workout }) {
  const { triggerHaptic } = useTelegram();
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedSets, setCompletedSets] = useState([]);
  
  // Local rest timer state
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Reset state when exercise changes
    setCompletedSets([]);
    setIsPlaying(true);
    setRestTimeLeft(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [workout?.id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startLocalRestTimer = (seconds) => {
    setRestTimeLeft(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setRestTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          triggerHaptic('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!workout) return null;

  const totalSets = typeof workout.defaultSets === 'number' ? workout.defaultSets : 4;

  const handleToggleSet = (index) => {
    triggerHaptic('medium');
    if (completedSets.includes(index)) {
      setCompletedSets(completedSets.filter(i => i !== index));
    } else {
      const nextSets = [...completedSets, index];
      setCompletedSets(nextSets);

      if (nextSets.length >= totalSets) {
        triggerHaptic('success');
        setRestTimeLeft(0);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        // Start local rest timer right here inside the card
        startLocalRestTimer(workout.restSeconds || 60);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-12">
      {/* Exercise Title Header */}
      <div className="text-center pt-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
          Упражнение • {workout.level}
        </span>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          {workout.title}
        </h2>
      </div>

      {/* Main Video / Photo Box */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl group">
        <div
          className="w-full h-64 relative flex flex-col items-center justify-center p-6 transition-all duration-300"
          style={{ background: workout.imageBg || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            <div className={`p-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl mb-3 ${isPlaying ? 'animate-pulse' : ''}`}>
              <Dumbbell className={`w-14 h-14 text-white transition-transform duration-500 ${isPlaying ? 'rotate-12 scale-110' : ''}`} />
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-amber-300 flex items-center gap-1.5 shadow-md">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              {isPlaying ? 'Анимация техники (Воспроизведение)' : 'Пауза'}
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              setIsPlaying(!isPlaying);
            }}
            className="absolute bottom-4 right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-lg active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          </button>

          <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>HD ВИДЕО</span>
          </div>
        </div>

        <div className="w-full bg-slate-950/80 h-1.5 relative overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 ${isPlaying ? 'w-full animate-pulse' : 'w-1/2'}`}
          />
        </div>
      </div>

      {/* Target Muscle Badges */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {workout.targetMuscles.map((muscle, idx) => (
          <span
            key={idx}
            className="text-xs font-semibold px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20"
          >
            {muscle}
          </span>
        ))}
      </div>

      {/* Quick Specs Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="glass-card p-3 rounded-2xl text-center border border-white/10">
          <div className="text-[11px] font-semibold text-slate-400">ПОДХОДЫ</div>
          <div className="text-lg font-extrabold text-white mt-0.5">{totalSets}</div>
        </div>

        <div className="glass-card p-3 rounded-2xl text-center border border-white/10">
          <div className="text-[11px] font-semibold text-slate-400">ПОВТОРЕНИЯ</div>
          <div className="text-lg font-extrabold text-amber-400 mt-0.5">{workout.defaultReps}</div>
        </div>

        <div className="glass-card p-3 rounded-2xl text-center border border-white/10">
          <div className="text-[11px] font-semibold text-slate-400">ОТДЫХ</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{workout.restSeconds} сек</div>
        </div>
      </div>

      {/* Interactive Sets Checklist */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Выполнение подходов
          </span>
          <span className="text-xs font-semibold text-blue-400">
            {completedSets.length} из {totalSets} выполнено
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: totalSets }).map((_, idx) => {
            const isDone = completedSets.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleToggleSet(idx)}
                className={`p-3 rounded-2xl flex items-center justify-between transition-all duration-200 border ${
                  isDone
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-white/10 text-slate-300'
                } active:scale-95`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold">Подход {idx + 1}</span>
                </div>
                {isDone ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[11px] text-slate-400">{workout.defaultReps} повт.</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Local Rest Timer inside ExerciseCard */}
        <div className="pt-2">
          {restTimeLeft > 0 ? (
            <div className="w-full p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Время отдыха</span>
                <span className="text-4xl font-extrabold text-white font-mono tracking-tighter">
                  {formatTime(restTimeLeft)}
                </span>
                <button 
                  onClick={() => {
                    setRestTimeLeft(0);
                    if (timerRef.current) clearInterval(timerRef.current);
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-slate-200 active:scale-95 transition-all"
                >
                  Пропустить отдых
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                triggerHaptic('medium');
                startLocalRestTimer(workout.restSeconds || 60);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98] transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Таймер отдыха ({workout.restSeconds} с)</span>
            </button>
          )}
        </div>
      </div>

      {/* Description & Execution Steps */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Техника выполнения
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {workout.description}
        </p>

        <ol className="space-y-2 pt-2 border-t border-white/10">
          {workout.steps.map((step, index) => (
            <li key={index} className="text-xs text-slate-300 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 border border-blue-500/30">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {workout.proTips && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Совет тренера:</strong> {workout.proTips}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
