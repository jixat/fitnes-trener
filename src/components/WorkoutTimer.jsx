import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Flame, Bell, Zap, Trophy } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export function WorkoutTimer({ initialSeconds = 60, timerTrigger, onTimerComplete }) {
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
      if (timerTrigger) {
        setIsActive(true);
      }
    }
  }, [initialSeconds, timerTrigger]);

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
              setTimeout(() => {
                onTimerComplete?.();
              }, 1500); // 1.5s delay before tab switches
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
      <div className="flex p-1 rounded-md bg-[#161b22] border border-[#30363d]">
        <button
          onClick={() => {
            setPresetRest(60);
          }}
          className={`flex-1 py-2 rounded-md text-xs font-bold transition-all border ${
            mode === 'rest'
              ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] shadow-sm'
              : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          ⏱️ Отдых между подходами
        </button>
        <button
          onClick={startTabata}
          className={`flex-1 py-2 rounded-md text-xs font-bold transition-all border ${
            mode === 'tabata'
              ? 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] shadow-sm'
              : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          🔥 Табата (20с / 10с)
        </button>
      </div>

      {/* Main Circular Timer Display */}
      <div className="bg-[#161b22] p-8 rounded-md border border-[#30363d] text-center relative overflow-hidden flex flex-col items-center justify-center">

        {mode === 'tabata' && (
          <div className="mb-3 px-3 py-1 rounded-md bg-[#21262d] text-xs font-bold border border-[#30363d] text-[#e3b341] flex items-center gap-1.5">
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
              className="stroke-[#21262d]"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`transition-all duration-300 ${
                mode === 'tabata' && tabataPhase === 'work'
                  ? 'stroke-[#d29922]'
                  : 'stroke-[#238636]'
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
            <span className="text-xs text-[#8b949e] font-medium mt-1">
              {isActive ? 'Отсчет времени...' : 'Нажмите старт'}
            </span>
          </div>
        </div>

        {/* Controls: Start/Pause & Reset */}
        <div className="flex items-center justify-center gap-3 mt-4 w-full max-w-xs">
          <button
            onClick={handleReset}
            className="p-3 rounded-md bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] active:scale-95 transition-all"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleStartPause}
            className={`flex-1 py-3 rounded-md text-white font-bold text-sm flex items-center justify-center gap-2 border active:scale-95 transition-all ${
              isActive
                ? 'bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9]'
                : 'bg-[#238636] border-[#2ea043] hover:bg-[#2ea043] text-white'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Пауза
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Старт
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Fast Buttons for Rest Timer */}
      {mode === 'rest' && (
        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b949e] px-1">
            Быстрый выбор времени отдыха
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[30, 45, 60, 90].map((sec) => (
              <button
                key={sec}
                onClick={() => setPresetRest(sec)}
                className={`py-2 rounded-md text-xs font-bold transition-all border ${
                  totalSeconds === sec && mode === 'rest'
                    ? 'bg-[#238636] border-[#2ea043] text-white'
                    : 'bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#c9d1d9]'
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
