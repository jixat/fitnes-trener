import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Flame, Bell, Zap, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTelegram } from '../hooks/useTelegram';

export function WorkoutTimer({ initialSeconds = 60 }) {
  const { triggerHaptic } = useTelegram();
  const [mode, setMode] = useState('rest'); // 'rest' or 'tabata'
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  // Tabata state
  const [tabataRound, setTabataRound] = useState(1);
  const [tabataPhase, setTabataPhase] = useState('work'); // 'work' (20s) or 'rest' (10s)

  const timerRef = useRef(null);

  // Web Audio Beep synth sound generator
  const playBeep = (freq = 880, duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not supported:', e);
    }
  };

  useEffect(() => {
    if (initialSeconds && mode === 'rest') {
      setSecondsLeft(initialSeconds);
      setTotalSeconds(initialSeconds);
    }
  }, [initialSeconds]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timer expired!
            triggerHaptic('success');
            playBeep(1200, 0.4);

            if (mode === 'rest') {
              setIsActive(false);
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
              return 0;
            } else if (mode === 'tabata') {
              if (tabataPhase === 'work') {
                // Switch to Tabata rest (10s)
                setTabataPhase('rest');
                setTotalSeconds(10);
                return 10;
              } else {
                // Next round
                if (tabataRound >= 8) {
                  // Finish Tabata!
                  setIsActive(false);
                  confetti({ particleCount: 100, spread: 80 });
                  return 0;
                } else {
                  setTabataRound((r) => r + 1);
                  setTabataPhase('work');
                  setTotalSeconds(20);
                  return 20;
                }
              }
            }
          }

          // Countdown warning beep on 3, 2, 1
          if (prev <= 4 && prev > 1) {
            triggerHaptic('light');
            playBeep(600, 0.1);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, mode, tabataPhase, tabataRound]);

  const handleStartPause = () => {
    triggerHaptic('medium');
    setIsActive(!isActive);
  };

  const handleReset = () => {
    triggerHaptic('light');
    setIsActive(false);
    if (mode === 'rest') {
      setSecondsLeft(totalSeconds);
    } else {
      setTabataRound(1);
      setTabataPhase('work');
      setSecondsLeft(20);
      setTotalSeconds(20);
    }
  };

  const setPresetRest = (sec) => {
    triggerHaptic('light');
    setMode('rest');
    setIsActive(false);
    setTotalSeconds(sec);
    setSecondsLeft(sec);
  };

  const startTabata = () => {
    triggerHaptic('medium');
    setMode('tabata');
    setIsActive(false);
    setTabataRound(1);
    setTabataPhase('work');
    setTotalSeconds(20);
    setSecondsLeft(20);
  };

  const progressPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5 pb-12">
      {/* Header Mode Selector */}
      <div className="flex p-1 rounded-2xl glass-panel border border-white/10">
        <button
          onClick={() => {
            setPresetRest(60);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'rest'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⏱️ Отдых между подходами
        </button>
        <button
          onClick={startTabata}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'tabata'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔥 Табата (20с / 10с)
        </button>
      </div>

      {/* Main Circular Timer Display */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden flex flex-col items-center justify-center">
        {/* Background ambient glow */}
        <div
          className={`absolute w-48 h-48 rounded-full blur-3xl opacity-20 transition-all ${
            mode === 'tabata' && tabataPhase === 'work' ? 'bg-red-500' : 'bg-blue-500'
          }`}
        />

        {mode === 'tabata' && (
          <div className="mb-3 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/20 text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>
              Раунд {tabataRound} из 8 • {tabataPhase === 'work' ? 'РАБОТА 🔥' : 'ОТДЫХ ☕'}
            </span>
          </div>
        )}

        {/* SVG Circle Progress */}
        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`transition-all duration-300 ${
                mode === 'tabata' && tabataPhase === 'work'
                  ? 'stroke-amber-500'
                  : 'stroke-blue-500'
              }`}
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-extrabold text-white tracking-tighter font-mono">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1">
              {isActive ? 'Отсчет времени...' : 'Нажмите старт'}
            </span>
          </div>
        </div>

        {/* Controls: Start/Pause & Reset */}
        <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-xs">
          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 active:scale-95 transition-all"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={handleStartPause}
            className={`flex-1 py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl border border-white/20 active:scale-95 transition-all ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-white" /> Пауза
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" /> Старт
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Fast Buttons for Rest Timer */}
      {mode === 'rest' && (
        <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Быстрый выбор времени отдыха
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[30, 45, 60, 90].map((sec) => (
              <button
                key={sec}
                onClick={() => setPresetRest(sec)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  totalSeconds === sec && mode === 'rest'
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-white/5 text-slate-300'
                }`}
              >
                {sec} сек
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
