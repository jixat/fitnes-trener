import React, { useState } from 'react';
import { Calculator, Flame, Droplets, Utensils, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export function CalorieCalculator() {
  const { triggerHaptic } = useTelegram();

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(178);
  const [activity, setActivity] = useState(1.375); // 1.2, 1.375, 1.55, 1.725
  const [goal, setGoal] = useState('maintain'); // 'loss', 'maintain', 'gain'

  const [waterGlasses, setWaterGlasses] = useState(4); // max 10 glasses (250ml each)

  // Mifflin-St Jeor BMR Equation
  const bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

  let targetCalories = tdee;
  if (goal === 'loss') targetCalories = Math.round(tdee * 0.85);
  if (goal === 'gain') targetCalories = Math.round(tdee * 1.15);

  // Macro calculations
  // Protein: 2g / kg for gain/loss, 1.8g for maintain
  const proteinGrams = Math.round(weight * (goal === 'gain' || goal === 'loss' ? 2.0 : 1.8));
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbsGrams = Math.round((targetCalories - proteinGrams * 4 - fatGrams * 9) / 4);

  const handleAddWater = () => {
    if (waterGlasses < 10) {
      triggerHaptic('light');
      setWaterGlasses(waterGlasses + 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5 pb-12">
      {/* Header Badge */}
      <div className="text-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
          Питание & Метаболизм
        </span>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Калькулятор Калорий
        </h2>
      </div>

      {/* Input Parameters Form */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
        {/* Gender selector */}
        <div className="flex p-1 rounded-2xl bg-slate-900/60 border border-white/10">
          <button
            onClick={() => {
              triggerHaptic('light');
              setGender('male');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              gender === 'male' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            👨 Мужской
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setGender('female');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              gender === 'female' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            👩 Женский
          </button>
        </div>

        {/* Sliders: Age, Weight, Height */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>Возраст</span>
              <span className="text-purple-400">{age} лет</span>
            </div>
            <input
              type="range"
              min="14"
              max="80"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>Вес</span>
              <span className="text-purple-400">{weight} кг</span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>Рост</span>
              <span className="text-purple-400">{height} см</span>
            </div>
            <input
              type="range"
              min="140"
              max="210"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2"
            />
          </div>
        </div>

        {/* Goal Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Цель тренировок</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'loss', label: 'Похудение (-15%)', color: 'from-amber-600 to-orange-600' },
              { id: 'maintain', label: 'Форма (100%)', color: 'from-blue-600 to-indigo-600' },
              { id: 'gain', label: 'Набор (+15%)', color: 'from-emerald-600 to-teal-600' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic('light');
                  setGoal(item.id);
                }}
                className={`p-2.5 rounded-2xl text-[11px] font-bold border transition-all ${
                  goal === item.id
                    ? `bg-gradient-to-tr ${item.color} text-white border-white/30 shadow-md`
                    : 'bg-slate-800/40 text-slate-400 border-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Result Dashboard Card */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 text-center relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-slate-900/40 shadow-2xl">
        <div className="flex justify-center mb-1 text-purple-400">
          <Flame className="w-8 h-8 animate-bounce" />
        </div>
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Суточная норма калорий
        </span>
        <div className="text-4xl font-black text-white tracking-tight mt-1">
          {targetCalories} <span className="text-base font-bold text-purple-400">ккал/день</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Базовый метаболизм (BMR): {Math.round(bmr)} ккал
        </p>

        {/* Macros Grid */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
            <div className="text-[10px] font-bold text-blue-400 uppercase">БЕЛКИ</div>
            <div className="text-base font-extrabold text-white mt-0.5">{proteinGrams} г</div>
            <div className="text-[10px] text-slate-400">{proteinGrams * 4} ккал</div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-[10px] font-bold text-amber-400 uppercase">ЖИРЫ</div>
            <div className="text-base font-extrabold text-white mt-0.5">{fatGrams} г</div>
            <div className="text-[10px] text-slate-400">{fatGrams * 9} ккал</div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-[10px] font-bold text-emerald-400 uppercase">УГЛЕВОДЫ</div>
            <div className="text-base font-extrabold text-white mt-0.5">{carbsGrams} г</div>
            <div className="text-[10px] text-slate-400">{carbsGrams * 4} ккал</div>
          </div>
        </div>
      </div>

      {/* Water Tracker Card */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Трекер воды (250мл / стакан)</span>
          </div>
          <span className="text-xs font-bold text-blue-400">
            {waterGlasses * 250} / 2500 мл
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isFull = idx < waterGlasses;
            return (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic('light');
                  setWaterGlasses(idx + 1);
                }}
                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                  isFull
                    ? 'bg-blue-600/40 border-blue-400 text-blue-200'
                    : 'bg-slate-800/40 border-white/5 text-slate-600'
                }`}
              >
                <Droplets className={`w-4 h-4 ${isFull ? 'fill-blue-400 text-blue-400' : ''}`} />
                <span className="text-[9px]">{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
