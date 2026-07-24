export const CATEGORIES = [
  { id: 'all', label: 'Все', icon: '🔥' },
  { id: 'strength', label: 'Силовые', icon: '🏋️‍♂️' },
  { id: 'cardio', label: 'Кардио', icon: '⚡' },
  { id: 'home', label: 'Дома', icon: '🏠' },
  { id: 'gym', label: 'В зале', icon: '💪' },
  { id: 'stretching', label: 'Растяжка', icon: '🧘‍♀️' },
];

export const MUSCLE_GROUPS = [
  { id: 'all', label: 'Все мышцы' },
  { id: 'Грудные мышцы', label: 'Грудь' },
  { id: 'Спина', label: 'Спина' },
  { id: 'Ноги', label: 'Ноги' },
  { id: 'Плечи', label: 'Плечи' },
  { id: 'Руки', label: 'Руки' },
  { id: 'Пресс', label: 'Пресс' },
];

export const WORKOUT_PLANS = [
  {
    id: 'home-fullbody',
    title: 'Фулбоди для дома',
    level: 'Все уровни',
    duration: '25 мин',
    calories: '300 ккал',
    description: 'Комплексная тренировка на все группы мышц без дополнительного оборудования. Идеально для старта.',
    imageBg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    exercises: [
      { id: 'squats-home', sets: 4, reps: '15' },
      { id: 'pushups-home', sets: 3, reps: '15' },
      { id: 'lunges-home', sets: 3, reps: '12 на ногу' },
      { id: 'plank-core', sets: 3, reps: '45 сек' },
      { id: 'burpees-cardio', sets: 3, reps: '10' }
    ]
  },
  {
    id: 'gym-strength',
    title: 'Универсальный сплит (Зал)',
    level: 'Средний',
    duration: '45 мин',
    calories: '450 ккал',
    description: 'Силовая тренировка в тренажерном зале на базовые группы мышц.',
    imageBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    exercises: [
      { id: 'squats-barbell', sets: 4, reps: '10' },
      { id: 'bench-press', sets: 4, reps: '10' },
      { id: 'crunch-home', sets: 3, reps: '20' }
    ]
  }
];

export const WORKOUTS_DATA = [
  {
    id: 'squats-barbell',
    title: 'Приседания со штангой',
    category: 'gym',
    subcategory: 'strength',
    level: 'Средний',
    duration: '15 мин',
    calories: '140 ккал',
    targetMuscles: ['Ноги', 'Ягодицы', 'Кор'],
    defaultSets: 4,
    defaultReps: 12,
    restSeconds: 60,
    type: 'video',
    videoPath: '/videos/squats-barbell.mp4',
    demoType: 'squat',
    description: 'Базовое многосуставное упражнение для развития мышц нижней части тела и укрепления коленей.',
    steps: [
      'Установите штангу на трапециевидные мышцы, ноги на ширине плеч.',
      'Сделайте глубокий вдох и начните опускать таз назад, сгибая колени.',
      'Опуститесь до параллели бедер с полом или чуть ниже.',
      'На выдохе мощно поднимитесь в исходное положение, сохраняя спину прямой.'
    ],
    proTips: 'Не сводите колени внутрь при подъеме и не оторвите пятки от пола.',
    imageBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  {
    id: 'bench-press',
    title: 'Жим гантелей лежа',
    category: 'gym',
    subcategory: 'strength',
    level: 'Начинающий',
    duration: '12 мин',
    calories: '110 ккал',
    targetMuscles: ['Грудные мышцы', 'Плечи', 'Руки'],
    defaultSets: 4,
    defaultReps: 10,
    restSeconds: 60,
    type: 'video',
    videoPath: '/videos/bench-press.mp4',
    demoType: 'bench',
    description: 'Упражнение для проработки грудных мышц с увеличенной амплитудой движения по сравнению со штангой.',
    steps: [
      'Лягте на скамью, удерживая гантели над грудью на прямых руках.',
      'Плавно опустите гантели в стороны до уровня груди на вдохе.',
      'Чувствуйте растяжение грудных мышц в нижней точке.',
      'На выдохе выжмите гантели вверх по дуге до сведения над грудью.'
    ],
    proTips: 'Сведите лопатки вместе и плотно прижмите их к скамье.',
    imageBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  },
  {
    id: 'pushups-home',
    title: 'Отжимания от пола',
    category: 'home',
    subcategory: 'strength',
    level: 'Начинающий',
    duration: '10 мин',
    calories: '90 ккал',
    targetMuscles: ['Грудные мышцы', 'Руки', 'Плечи', 'Пресс'],
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 45,
    type: 'video',
    videoPath: '/videos/pushups-home.mp4',
    demoType: 'pushup',
    description: 'Классическое упражнение с собственным весом для мышц верха тела.',
    steps: [
      'Примите упор лежа, руки чуть широким хватом, тело в одну прямую линию.',
      'На вдохе согните локти под углом 45 градусов к корпусу и опуститесь грудью почти до пола.',
      'На выдохе оттолкнитесь руками от пола в исходное положение.'
    ],
    proTips: 'Не прогибайтесь в пояснице, удерживайте напряжение в прессе.',
    imageBg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
  },
  {
    id: 'squats-home',
    title: 'Воздушные приседания',
    category: 'home',
    subcategory: 'strength',
    level: 'Начинающий',
    duration: '10 мин',
    calories: '80 ккал',
    targetMuscles: ['Ноги', 'Ягодицы'],
    defaultSets: 4,
    defaultReps: 20,
    restSeconds: 45,
    type: 'video',
    videoPath: '/videos/squats-home.mp4',
    demoType: 'squat',
    description: 'Приседания с собственным весом. Отличная база для тренировок дома.',
    steps: [
      'Ноги на ширине плеч, носки чуть в стороны.',
      'Опускайтесь тазом назад, как будто садитесь на стул.',
      'Держите спину ровной, а колени в направлении носков.',
      'Вернитесь в исходное положение.'
    ],
    proTips: 'Вес тела должен быть на пятках, а не на носках.',
    imageBg: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)'
  },
  {
    id: 'lunges-home',
    title: 'Выпады на месте',
    category: 'home',
    subcategory: 'strength',
    level: 'Средний',
    duration: '12 мин',
    calories: '100 ккал',
    targetMuscles: ['Ноги', 'Ягодицы'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    type: 'video',
    videoPath: '/videos/lunges-home.mp4',
    demoType: 'lunge',
    description: 'Отличное упражнение для проработки бедер и координации.',
    steps: [
      'Сделайте широкий шаг вперед одной ногой.',
      'Опуститесь вниз так, чтобы оба колена образовали угол 90 градусов.',
      'Оттолкнитесь передней ногой и вернитесь в исходное положение.'
    ],
    proTips: 'Колено передней ноги не должно выходить за носок.',
    imageBg: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)'
  },
  {
    id: 'crunch-home',
    title: 'Скручивания на пресс',
    category: 'home',
    subcategory: 'strength',
    level: 'Начинающий',
    duration: '8 мин',
    calories: '60 ккал',
    targetMuscles: ['Пресс'],
    defaultSets: 3,
    defaultReps: 20,
    restSeconds: 30,
    type: 'video',
    videoPath: '/videos/crunch-home.mp4',
    demoType: 'crunch',
    description: 'Базовое упражнение для проработки прямой мышцы живота (кубиков).',
    steps: [
      'Лягте на спину, ноги согните в коленях, стопы на полу.',
      'Руки за головой или скрещены на груди.',
      'На выдохе оторвите лопатки от пола, сокращая мышцы пресса.',
      'Плавно вернитесь обратно.'
    ],
    proTips: 'Не тяните себя за шею руками! Работайте только прессом.',
    imageBg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'
  },
  {
    id: 'burpees-cardio',
    title: 'Берпи (Burpees)',
    category: 'cardio',
    subcategory: 'home',
    level: 'Продвинутый',
    duration: '15 мин',
    calories: '200 ккал',
    targetMuscles: ['Грудные мышцы', 'Ноги', 'Плечи', 'Сердечная мышца'],
    defaultSets: 4,
    defaultReps: 15,
    restSeconds: 45,
    type: 'video',
    videoPath: '/videos/burpees-cardio.mp4',
    demoType: 'burpee',
    description: 'Интенсивное функциональное упражнение для быстрого сжигания калорий и выносливости.',
    steps: [
      'Из положения стоя присядьте и положите ладони на пол.',
      'Выпрыгните ногами назад в планку и касанием груди коснитесь пола.',
      'Подпрыгните ногами обратно к рукам.',
      'Выпрыгните вверх с хлопком над головой.'
    ],
    proTips: 'Держите ровный темп дыхания и не останавливайтесь надолго между повторениями.',
    imageBg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
  },
  {
    id: 'plank-core',
    title: 'Планка на локтях',
    category: 'home',
    subcategory: 'strength',
    level: 'Все уровни',
    duration: '8 мин',
    calories: '60 ккал',
    targetMuscles: ['Пресс', 'Спина'],
    defaultSets: 3,
    defaultReps: '60 сек',
    restSeconds: 30,
    type: 'video',
    videoPath: '/videos/plank-core.mp4',
    demoType: 'plank',
    description: 'Статическое упражнение для укрепления глубоких мышц кора и осанки.',
    steps: [
      'Встаньте в упор на предплечья, локти строго под плечевыми суставами.',
      'Выпрямите ноги, упритесь носками в пол.',
      'Напрягите пресс и ягодицы, удерживая тело абсолютно прямым.'
    ],
    proTips: 'Не поднимайте таз высоко вверх и не проваливайтесь в пояснице.',
    imageBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
  }
];
