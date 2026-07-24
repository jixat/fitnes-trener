import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, Clock, Flame, Activity, ShieldCheck, Zap } from 'lucide-react';
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
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
          Упражнение • {workout.level}
        </span>
        <h2 className="text-xl font-bold text-white mt-0.5">
          {workout.title}
        </h2>
      </div>

      {/* Main Video / Photo Box */}
      <div className="relative rounded-md overflow-hidden bg-[#161b22] border border-[#30363d] group">
        <div
          className="w-full h-64 relative flex flex-col items-center justify-center transition-all duration-300 bg-[#0d1117]"
        >
          {isPlaying && workout.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${workout.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${workout.youtubeId}&controls=0`}
              title={workout.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full object-cover pointer-events-auto"
            ></iframe>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-[#c9d1d9] p-6 w-full h-full">
              <div className="absolute inset-0 opacity-10 pointer-events-none" />
              
              <div className="p-4 rounded-full bg-[#21262d] border border-[#30363d] mb-3">
                <Activity className="w-10 h-10 text-[#c9d1d9]" strokeWidth={1.5} />
              </div>

              <span className="text-[10px] font-bold px-3 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#8b949e] flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#8b949e]" strokeWidth={1.5} />
                Нажмите Play для видео
              </span>
            </div>
          )}

          <button
            onClick={() => {
              triggerHaptic('light');
              setIsPlaying(!isPlaying);
            }}
            className="absolute bottom-4 right-4 p-2 rounded-md bg-[#21262d]/80 backdrop-blur-sm hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] active:scale-95 transition-all z-20"
          >
            {isPlaying ? <Pause className="w-4 h-4" strokeWidth={1.5} /> : <Play className="w-4 h-4 fill-current" strokeWidth={1.5} />}
          </button>

          <div className="absolute top-4 left-4 px-2 py-1 rounded-md bg-[#21262d]/80 backdrop-blur-sm border border-[#30363d] text-[10px] font-bold text-[#8b949e] flex items-center gap-1.5 z-20">
            <span className={`w-1.5 h-1.5 rounded-full bg-[#238636] ${isPlaying ? 'animate-ping' : ''}`} />
            <span>HD ВИДЕО</span>
          </div>
        </div>

        <div className="w-full bg-[#0d1117] h-1 relative overflow-hidden border-t border-[#30363d]">
          <div
            className={`h-full bg-[#2f81f7] transition-all duration-300 ${isPlaying ? 'w-full animate-pulse' : 'w-1/2'}`}
          />
        </div>
      </div>

      {/* Target Muscle Badges */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {workout.targetMuscles.map((muscle, idx) => (
          <span
            key={idx}
            className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#21262d] text-[#c9d1d9] border border-[#30363d]"
          >
            {muscle}
          </span>
        ))}
      </div>

      {/* Quick Specs Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#161b22] p-2.5 rounded-md text-center border border-[#30363d]">
          <div className="text-[10px] font-bold text-[#8b949e]">ПОДХОДЫ</div>
          <div className="text-sm font-bold text-white mt-0.5">{totalSets}</div>
        </div>

        <div className="bg-[#161b22] p-2.5 rounded-md text-center border border-[#30363d]">
          <div className="text-[10px] font-bold text-[#8b949e]">ПОВТОРЕНИЯ</div>
          <div className="text-sm font-bold text-white mt-0.5">{workout.defaultReps}</div>
        </div>

        <div className="bg-[#161b22] p-2.5 rounded-md text-center border border-[#30363d]">
          <div className="text-[10px] font-bold text-[#8b949e]">ОТДЫХ</div>
          <div className="text-sm font-bold text-white mt-0.5">{workout.restSeconds} сек</div>
        </div>
      </div>

      {/* Interactive Sets Checklist */}
      <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] space-y-3">
        <div className="flex justify-between items-center px-1 border-b border-[#30363d] pb-2">
          <span className="text-xs font-bold text-[#c9d1d9]">
            Выполнение подходов
          </span>
          <span className="text-xs font-bold text-[#8b949e]">
            {completedSets.length} / {totalSets}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: totalSets }).map((_, idx) => {
            const isDone = completedSets.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleToggleSet(idx)}
                className={`p-2.5 rounded-md flex items-center justify-between transition-all duration-200 border ${
                  isDone
                    ? 'bg-[#238636]/10 border-[#238636] text-[#c9d1d9]'
                    : 'bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#8b949e]'
                } active:scale-95`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold border ${isDone ? 'bg-[#238636] border-[#2ea043] text-white' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold">Подход {idx + 1}</span>
                </div>
                {isDone ? (
                  <Check className="w-4 h-4 text-[#3fb950]" strokeWidth={1.5} />
                ) : (
                  <span className="text-[10px] text-[#8b949e]">{workout.defaultReps} повт.</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Local Rest Timer inside ExerciseCard */}
        <div className="pt-2">
          {restTimeLeft > 0 ? (
            <div className="w-full p-4 rounded-md bg-[#21262d] border border-[#30363d] text-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider mb-1">Время отдыха</span>
                <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">
                  {formatTime(restTimeLeft)}
                </span>
                <button 
                  onClick={() => {
                    setRestTimeLeft(0);
                    if (timerRef.current) clearInterval(timerRef.current);
                  }}
                  className="mt-3 px-3 py-1.5 rounded-md bg-[#0d1117] border border-[#30363d] text-[10px] text-[#8b949e] hover:text-[#c9d1d9] active:scale-95 transition-all"
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
              className="w-full py-2.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs border border-[#2ea043] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Таймер отдыха ({workout.restSeconds} с)</span>
            </button>
          )}
        </div>
      </div>

      {/* Description & Execution Steps */}
      <div className="bg-[#161b22] p-5 rounded-md border border-[#30363d] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8b949e]" strokeWidth={1.5} />
          Техника выполнения
        </h3>
        <p className="text-xs text-[#c9d1d9] leading-relaxed">
          {workout.description}
        </p>

        <ol className="space-y-2 pt-2 border-t border-[#30363d]">
          {workout.steps.map((step, index) => (
            <li key={index} className="text-xs text-[#c9d1d9] flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-md bg-[#21262d] text-[#8b949e] font-bold flex items-center justify-center text-[9px] shrink-0 mt-0.5 border border-[#30363d]">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {workout.proTips && (
          <div className="p-3 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-xs flex items-start gap-2">
            <Zap className="w-4 h-4 text-[#e3b341] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <strong className="font-bold text-white">Совет тренера:</strong> {workout.proTips}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
