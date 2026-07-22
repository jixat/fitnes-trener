import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, Dumbbell, Apple, HeartPulse } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export function AICoachChat() {
  const { user, triggerHaptic } = useTelegram();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Привет, ${user?.first_name || 'атлет'}! 🤖 Я твой персональный ИИ-фитнес тренер. Задай любой вопрос по технике упражнений, составлению программы или спортивному питанию!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const QUICK_PROMPTS = [
    { label: '🏋️ Составь план тренировок', text: 'Составь мне план тренировок на 3 дня в неделю для набора массы.' },
    { label: '🥗 Что съесть после тренировки?', text: 'Что лучше всего съесть сразу после интенсивной тренировки?' },
    { label: '💪 Как правильно приседать?', text: 'Расскажи идеальную технику приседаний со штангой, чтобы не травмировать колени.' },
    { label: '📊 Расчет нормы белка', text: 'Как рассчитать суточную норму белка для роста мышц при весе 75 кг?' }
  ];

  const generateAIResponse = (userQuestion) => {
    const q = userQuestion.toLowerCase();

    if (q.includes('план') || q.includes('программа')) {
      return `💪 **Индивидуальная программа тренировок (3 дня в неделю)**:

1️⃣ **День 1: Грудь + Трицепс**
• Жим гантелей лежа: 4х10
• Отжимания от пола: 3х15
• Разгибания на трицепс: 3х12

2️⃣ **День 2: Спина + Бицепс**
• Подтягивания / Тяга блока: 4х8
• Тяга гантели в наклоне: 3х10
• Сгибания рук на бицепс: 3х12

3️⃣ **День 3: Ноги + Плечи**
• Приседания со штангой: 4х12
• Выпады с гантелями: 3х10 на ногу
• Жим гантелей стоя над головой: 4х10

Обязательно отдыхай 1 день между тренировками!`;
    }

    if (q.includes('съесть') || q.includes('питание') || q.includes('после')) {
      return `🥗 **Питание после тренировки (Белково-углеводное окно)**:

В течение 45 минут после нагрузки организму необходимы:
1. **Быстрый белок**: 25-30г (куриная грудка, индейка, яйца, творог или сывороточный протеин).
2. **Сложные углеводы**: 40-50г (гречка, рис, овсянка или бананы) для восполнения гликогена.

💧 Не забудь выпить 500 мл чистой воды!`;
    }

    if (q.includes('присед') || q.includes('техника')) {
      return `🎯 **Главные правила безопасных приседаний**:

1. **Стопы**: Ноги на ширине плеч, носки слегка развернуты наружу (на 15-20°).
2. **Движение**: Начинай движение с отведения таза назад, а не со сгибания коленей.
3. **Колени**: Должны двигаться строго соосно с носками, не своди их внутрь!
4. **Спина**: Сохраняй естественный прогиб в пояснице, лопатки сведены.
5. **Дыхание**: Вдох при опускании вниз, выдох — на подъеме.`;
    }

    if (q.includes('белок') || q.includes('протеин') || q.includes('расчет')) {
      return `📊 **Расчет суточной нормы белка**:

• Для **набора мышечной массы**: 1.6 – 2.2 г белка на 1 кг массы тела.
👉 *При весе 75 кг = 120 – 165 г белка в день.*

• Для **похудения и сохранения мышц**: 1.8 – 2.4 г белка на 1 кг массы тела.

💡 Источники: кура, индейка, говядина, яйца, минтай/лосось, творог, чечевица.`;
    }

    return `Спасибо за вопрос! 🎯 Для достижения лучших результатов в фитнесе следи за 3 столпами:
1. **Регулярность тренировок** (3-4 раза в неделю)
2. **Профицит или дефицит калорий** в зависимости от цели
3. **Качественный сон** (7-8 часов) для восстановления мышц.

Можешь уточнить свой вопрос или выбрать один из быстрых подсказок ниже!`;
  };

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    triggerHaptic('medium');

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      triggerHaptic('success');
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: generateAIResponse(text),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 900);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="w-full max-w-md mx-auto h-[calc(100vh-140px)] flex flex-col justify-between pb-6">
      {/* Quick Prompts Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {QUICK_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.text)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-white/5 hover:bg-white/10 text-blue-300 border border-blue-500/20 active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Messages List Container */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] p-4 rounded-3xl text-xs leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none'
                  : 'glass-panel text-slate-100 border-white/10 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line font-sans">{msg.text}</div>
              <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 pl-2">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>ИИ тренер печатает ответ...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Спроси у ИИ тренера..."
          className="flex-1 py-3 px-4 rounded-2xl glass-panel text-sm text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-blue-500/50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white disabled:opacity-40 shadow-lg active:scale-95 transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
