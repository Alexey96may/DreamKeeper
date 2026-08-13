import type {
    TimeOfDay,
    DreamCategory,
    DreamPhenomenon,
    DreamRelationType,
    VisualStyle,
    Perspective,
    ParticipantRole,
    SensoryAspect,
    LucidTrigger,
    DeathCause,
    FallingOrigin,
    FlyingAltitude,
    FlyingType,
    DeathAftermath,
    FallingOutcome,
    ParalysisTiming,
    ParalysisHallucinations,
    DreamOption,
} from '@/types/Dream';

import {
    Moon,
    Sunrise,
    Sun,
    Sunset,
    HelpCircle,
    Brain,
    Skull,
    Sparkles,
    Feather,
    TrendingDown,
    DoorOpen,
    Zap,
    Palette,
    Contrast,
    CloudFog,
    UserCheck,
    Eye,
    ShieldAlert,
    UserCog,
    Video,
    Ghost,
    Volume2,
    Flower2,
    Hand,
    Thermometer,
    Utensils,
    Activity,
    Compass,
    Wind,
    MicOff,
    EyeOff,
} from 'lucide-vue-next';

// ==========================================
// 1. ВРЕМЯ СУТОК (TimeOfDay)
// ==========================================

export const TIME_OF_DAY_OPTIONS: DreamOption<TimeOfDay>[] = [
    {
        value: 'night',
        label: 'Ночной',
        description: 'Основной сон в течение ночи',
        icon: Moon,
    },
    {
        value: 'morning',
        label: 'Утренний',
        description: 'Сон под утро или досыпание',
        icon: Sunrise,
    },
    {
        value: 'day',
        label: 'Дневной / Сиеста',
        description: 'Дневной перерыв или короткий сон',
        icon: Sun,
    },
    {
        value: 'evening',
        label: 'Вечерний',
        description: 'Ранний сон или отдых после работы',
        icon: Sunset,
    },
    {
        value: 'unknown',
        label: 'Не указано',
        description: 'Запись задним числом или время не помню',
        icon: HelpCircle,
    },
];

export const TIME_OF_DAY_MAP: Record<
    TimeOfDay,
    DreamOption<TimeOfDay>
> = TIME_OF_DAY_OPTIONS.reduce(
    (acc, option) => {
        acc[option.value] = option;
        return acc;
    },
    {} as Record<TimeOfDay, DreamOption<TimeOfDay>>,
);

// ==========================================
// 2. КАТЕГОРИИ / ЖАНРЫ (DreamCategory)
// ==========================================

export const DREAM_CATEGORY_OPTIONS: DreamOption<DreamCategory>[] = [
    {
        value: 'lucid',
        label: 'Осознанный сон',
        description: 'Сновидец четко понимал, что находится во сне, и мог влиять на сюжет',
        icon: Brain,
    },
    {
        value: 'nightmare',
        label: 'Кошмар',
        description: 'Сон с высокой степенью тревоги, страха или эмоционального дискомфорта',
        icon: Skull,
    },
    {
        value: 'prophetic',
        label: 'Вещий / Прогностический',
        description: 'Сон с предчувствием или сюжетом, сбывшимся в реальности',
        icon: Sparkles,
    },
];

export const DREAM_CATEGORY_MAP: Record<
    DreamCategory,
    DreamOption<DreamCategory>
> = DREAM_CATEGORY_OPTIONS.reduce(
    (acc, option) => {
        acc[option.value] = option;
        return acc;
    },
    {} as Record<DreamCategory, DreamOption<DreamCategory>>,
);

// ==========================================
// 3. ФЕНОМЕНЫ И СОБЫТИЯ (DreamPhenomenon)
// ==========================================

export const DREAM_PHENOMENON_OPTIONS: DreamOption<DreamPhenomenon>[] = [
    {
        value: 'death',
        label: 'Смерть во сне',
        description: 'Гибель сновидца или гибель ключевого персонажа в сюжете',
        icon: Skull,
    },
    {
        value: 'flying',
        label: 'Полёт',
        description: 'Парение, свободный полёт или преодоление гравитации',
        icon: Feather,
    },
    {
        value: 'falling',
        label: 'Падение',
        description: 'Падение с высоты, в бездну или уход земли из-под ног',
        icon: TrendingDown,
    },
    {
        value: 'nested_dream',
        label: 'Ложное пробуждение / Сон во сне',
        description: 'Иллюзия пробуждения или погружение в дополнительный слой сна',
        icon: DoorOpen,
    },
    {
        value: 'paralysis',
        label: 'Сонный паралич',
        description: 'Состояние обездвиженности при засыпании или пробуждении',
        icon: Zap,
    },
];

export const DREAM_PHENOMENON_MAP: Record<
    DreamPhenomenon,
    DreamOption<DreamPhenomenon>
> = DREAM_PHENOMENON_OPTIONS.reduce(
    (acc, option) => {
        acc[option.value] = option;
        return acc;
    },
    {} as Record<DreamPhenomenon, DreamOption<DreamPhenomenon>>,
);

// ==========================================
// 4. ДЕТАЛИ ФЕНОМЕНОВ (Селекторы для форм)
// ==========================================

/** Причины смерти во сне */
export const DEATH_CAUSE_OPTIONS: DreamOption<DeathCause>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'natural', label: 'Естественная смерть / Остановка сердца' },
    { value: 'illness', label: 'Болезнь / Недомогание' },
    { value: 'fall', label: 'Падение с высоты' },
    { value: 'accident', label: 'Несчастный случай / ДТП' },
    { value: 'attack_or_murder', label: 'Нападение / Убийство' },
    { value: 'disaster', label: 'Катастрофа / Стихия' },
    { value: 'execution', label: 'Казнь / Наказание' },
    { value: 'other', label: 'Другое' },
] as const;

/** Послествие смерти во сне */
export const DEATH_AFTERMATH_OPTIONS: DreamOption<DeathAftermath>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'woke_up', label: 'Мгновенно проснулся' },
    { value: 'became_ghost', label: 'Стал призраком / духом' },
    { value: 'reincarnated', label: 'Переродился в новом теле' },
    { value: 'black_void', label: 'Попал в темноту / тишину' },
    { value: 'scene_shift', label: 'Сюжет сменился на другой' },
] as const;

/** Стиль полёта */
export const FLYING_TYPE_OPTIONS: DreamOption<FlyingType>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'effortless', label: 'Естественный / Легкий' },
    { value: 'swimming', label: 'С усилием (гребля руками)' },
    { value: 'apparatus', label: 'С помощью предмета / транспорта' },
    { value: 'levitation', label: 'Парение на месте / левитация' },
    { value: 'uncontrollable', label: 'Неконтролируемый (уносит)' },
] as const;

/** Высота полёта */
export const FLYING_ALTITUDE_OPTIONS: DreamOption<FlyingAltitude>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'low', label: 'Низкая (над землёй / крышами)' },
    { value: 'cloud_level', label: 'Облака / Птичий полёт' },
    { value: 'space', label: 'Космос / Стратосфера' },
] as const;

/** Контекст падения */
export const FALLING_ORIGIN_OPTIONS: DreamOption<FallingOrigin>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'building_or_cliff', label: 'С здания или обрыва' },
    { value: 'sky_or_void', label: 'С неба / из пустоты' },
    { value: 'abyss', label: 'В бездонную яму / провал' },
    { value: 'stumbling', label: 'Оступился на ровном месте' },
] as const;

/** Исход падения */
export const FALLING_OUTCOME_OPTIONS: DreamOption<FallingOutcome>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'hypnic_jerk', label: 'Вздрогнул и проснулся (толчок)' },
    { value: 'landed_safe', label: 'Мягко приземлился' },
    { value: 'impact', label: 'Удар о землю' },
    { value: 'woke_before_impact', label: 'Проснулся за секунду до удара' },
    { value: 'turned_into_flight', label: 'Падение переросло в полёт' },
] as const;

/** Паралич: Момент возникновения */
export const PARALYSIS_TIMING_OPTIONS: DreamOption<ParalysisTiming>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'falling_asleep', label: 'При засыпании' },
    { value: 'waking_up', label: 'При пробуждении' },
] as const;

/** Паралич: Галлюцинации */

export const PARALYSIS_HALLUCINATIONS_OPTIONS: DreamOption<ParalysisHallucinations>[] = [
    {
        value: 'auditory',
        label: 'Слуховые',
        description: 'Шумы, гул, шаги, шепот или громкие звуки',
        icon: Volume2,
    },
    {
        value: 'visual',
        label: 'Зрительные',
        description: 'Тени, силуэты, вспышки или изменения в комнате',
        icon: Eye,
    },
    {
        value: 'tactile',
        label: 'Тактильные',
        description: 'Прикосновения, давление на грудь, вибрация или удушье',
        icon: Hand,
    },
    {
        value: 'presence',
        label: 'Ощущение присутствия',
        description: 'Четкое чувство, что кто-то находится рядом в комнате',
        icon: Ghost,
    },
    {
        value: 'other',
        label: 'Другие',
        description: 'Иные специфические проявления и феномены',
        icon: HelpCircle,
    },
];

/** Осознанный Сон: Триггер */
export const LUCID_TRIGGER_OPTIONS: DreamOption<LucidTrigger>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'spontaneous', label: 'Спонтанно' },
    { value: 'reality_check', label: 'Проверка реальности (Reality Check)' },
    { value: 'anomaly', label: 'Аномалия в сюжете' },
    { value: 'other', label: 'Другое' },
];
// ==========================================
// 5. ТИПЫ СВЯЗЕЙ СНОВ (DreamRelationType)
// ==========================================

export const DREAM_RELATION_OPTIONS: DreamOption<DreamRelationType>[] = [
    {
        value: 'recurring_instance',
        label: 'Повторяющийся сюжет',
        description: 'Очередное проявление одного и того же повторяющегося сна',
    },
    {
        value: 'continuation',
        label: 'Прямое продолжение',
        description: 'Сюжет продолжается с момента, где закончился прошлый сон',
    },
    {
        value: 'prequel',
        label: 'Предыстория',
        description: 'Раскрывает события, предшествовавшие другому сну',
    },
    {
        value: 'same_location',
        label: 'Та же локация',
        description: 'Действие происходит в уже знакомом пространстве сна',
    },
    {
        value: 'similar_theme',
        label: 'Похожая тема',
        description: 'Сны объединяет общий мотив, идея или эмоциональный настрой',
    },
    {
        value: 'reference',
        label: 'Пересечение / Упоминание',
        description: 'Встречается та же деталь, предмет или персонаж',
    },
];

export const DREAM_RELATION_MAP: Record<
    DreamRelationType,
    DreamOption<DreamRelationType>
> = DREAM_RELATION_OPTIONS.reduce(
    (acc, option) => {
        acc[option.value] = option;
        return acc;
    },
    {} as Record<DreamRelationType, DreamOption<DreamRelationType>>,
);

// ==========================================
// 6. СВОЙСТВА ВОСПРИЯТИЯ (Стили, Камера, Ощущения)
// ==========================================

export const VISUAL_STYLE_OPTIONS: DreamOption<VisualStyle>[] = [
    {
        value: 'color',
        label: 'Цветной',
        description: 'Обычная естественная цветопередача',
        icon: Palette,
    },
    {
        value: 'vivid',
        label: 'Яркий / Неоновый',
        description: 'Насыщенные, неестественно яркие цвета',
        icon: Sparkles,
    },
    {
        value: 'monochrome',
        label: 'Чёрно-белый / Сепия',
        description: 'Отсутствие цвета или монохромная гамма',
        icon: Contrast,
    },
    {
        value: 'blurred',
        label: 'Размытый / Туманный',
        description: 'Расфокус, дымка или нечёткие контуры',
        icon: CloudFog,
    },
    {
        value: 'dark',
        label: 'Тёмный / Сумеречный',
        description: 'Низкая освещенность, преобладание теней',
        icon: Moon,
    },
];

export const PERSPECTIVE_OPTIONS: DreamOption<Perspective>[] = [
    { value: 'irrelevant', label: 'Не важно' },
    { value: 'first_person', label: 'От 1-го лица (своими глазами)' },
    { value: 'third_person', label: 'От 3-го лица (со стороны)' },
    { value: 'shifting', label: 'Менялась в процессе' },
];

export const PARTICIPANT_ROLE_OPTIONS: DreamOption<ParticipantRole>[] = [
    {
        value: 'protagonist',
        label: 'Главный герой',
        description: 'Активно участвую, сюжет разворачивается вокруг меня',
        icon: UserCheck,
    },
    {
        value: 'observer',
        label: 'Зритель / Наблюдатель',
        description: 'Нахожусь в пространстве сна, но просто смотрю',
        icon: Eye,
    },
    {
        value: 'victim',
        label: 'Жертва / Ведомый',
        description: 'Подвергаюсь воздействию, контроль над ситуацией отсутствует',
        icon: ShieldAlert,
    },
    {
        value: 'shapeshifter',
        label: 'Другая личность / Существо',
        description: 'Я — не я (другой человек, животное или персонаж)',
        icon: UserCog,
    },
    {
        value: 'camera_operator',
        label: 'Оператор / Режиссер',
        description: 'Фиксирую происходящее через «съемку» или настройку кадра',
        icon: Video,
    },
    {
        value: 'disembodied',
        label: 'Бестелесный дух',
        description: 'Физического тела в пространстве сна нет, чистое присутствие',
        icon: Ghost,
    },
];

export const SENSORY_ASPECT_OPTIONS: DreamOption<SensoryAspect>[] = [
    {
        value: 'sounds',
        label: 'Звуки / Музыка',
        description: 'Четкие речи, шорохи, громкие шумы или музыка',
        icon: Volume2,
    },
    {
        value: 'smells',
        label: 'Запахи',
        description: 'Ароматы, гарь, свежесть или неприятные запахи',
        icon: Flower2,
    },
    {
        value: 'tactile',
        label: 'Тактильные',
        description: 'Прикосновения, текстура поверхностей, объятия',
        icon: Hand,
    },
    {
        value: 'temperature',
        label: 'Температура',
        description: 'Ощущение явного жара, холода или ледяного ветра',
        icon: Thermometer,
    },
    {
        value: 'taste',
        label: 'Вкус',
        description: 'Вкус еды, напитков или сторонних предметов',
        icon: Utensils,
    },
    {
        value: 'pain',
        label: 'Физическая боль',
        description: 'Уколы, удары, боль от ранений или судороги',
        icon: Activity,
    },
    {
        value: 'kinesthetic',
        label: 'Движение / Ускорение',
        description: 'Вестибулярные ощущения: перегрузки, вращение, невесомость',
        icon: Compass,
    },
    {
        value: 'breathing',
        label: 'Дыхание / Удушье',
        description: 'Нехватка воздуха, дыхание под водой, одышка',
        icon: Wind,
    },
    {
        value: 'speech_voice',
        label: 'Голос / Немота',
        description: 'Потеря голоса (невозможность крикнуть) или телепатия',
        icon: MicOff,
    },
    {
        value: 'vision_anomaly',
        label: 'Зрительные искажения',
        description: 'Слепота, искажения цвета, негатив или гиперреализм',
        icon: EyeOff,
    },
];
