// src/constants/dream.ts

import type {
    TimeOfDay,
    TimeOfDayOption,
    DreamCategory,
    DreamCategoryOption,
    DreamPhenomenon,
    DreamPhenomenonOption,
    DreamRelationType,
    RelationTypeOption,
    VisualStyle,
    Perspective,
    ParticipantRole,
    SensoryAspect,
} from '@/types/Dream';

import { Moon, Sunrise, Sun, Sunset, HelpCircle } from 'lucide-vue-next';

// ==========================================
// 1. ВРЕМЯ СУТОК (TimeOfDay)
// ==========================================

export const TIME_OF_DAY_OPTIONS: TimeOfDayOption[] = [
    {
        value: 'night',
        label: 'Ночной',
        description: 'Основной сон в течение ночи',
    },
    {
        value: 'morning',
        label: 'Утренний',
        description: 'Сон под утро или досыпание',
    },
    {
        value: 'day',
        label: 'Дневной / Сиеста',
        description: 'Дневной перерыв или короткий сон',
    },
    {
        value: 'evening',
        label: 'Вечерний',
        description: 'Ранний сон или отдых после работы',
    },
    {
        value: 'unknown',
        label: 'Не указано',
        description: 'Запись задним числом или время не помню',
    },
];

export const TIME_OF_DAY_MAP: Record<TimeOfDay, TimeOfDayOption> = TIME_OF_DAY_OPTIONS.reduce(
    (acc, option) => {
        acc[option.value] = option;
        return acc;
    },
    {} as Record<TimeOfDay, TimeOfDayOption>,
);

export const TIME_OF_DAY_ICONS = {
    night: Moon,
    morning: Sunrise,
    day: Sun,
    evening: Sunset,
    unknown: HelpCircle,
} as const;

// ==========================================
// 2. КАТЕГОРИИ / ЖАНРЫ (DreamCategory)
// ==========================================

export const DREAM_CATEGORY_OPTIONS: DreamCategoryOption[] = [
    {
        value: 'lucid',
        label: 'Осознанный сон',
        description: 'Сновидец четко понимал, что находится во сне, и мог влиять на сюжет',
    },
    {
        value: 'nightmare',
        label: 'Кошмар',
        description: 'Сон с высокой степенью тревоги, страха или эмоционального дискомфорта',
    },
    {
        value: 'prophetic',
        label: 'Вещий / Прогностический',
        description: 'Сон с предчувствием или сюжетом, сбывшимся в реальности',
    },
];

export const DREAM_CATEGORY_MAP: Record<DreamCategory, DreamCategoryOption> =
    DREAM_CATEGORY_OPTIONS.reduce(
        (acc, option) => {
            acc[option.value] = option;
            return acc;
        },
        {} as Record<DreamCategory, DreamCategoryOption>,
    );

// ==========================================
// 3. ФЕНОМЕНЫ И СОБЫТИЯ (DreamPhenomenon)
// ==========================================

export const DREAM_PHENOMENON_OPTIONS: DreamPhenomenonOption[] = [
    {
        value: 'death',
        label: 'Смерть во сне',
        description: 'Гибель сновидца или гибель ключевого персонажа в сюжете',
    },
    {
        value: 'flying',
        label: 'Полёт',
        description: 'Парение, свободный полёт или преодоление гравитации',
    },
    {
        value: 'falling',
        label: 'Падение',
        description: 'Падение с высоты, в бездну или уход земли из-под ног',
    },
    {
        value: 'nested_dream',
        label: 'Ложное пробуждение / Сон во сне',
        description: 'Иллюзия пробуждения или погружение в дополнительный слой сна',
    },
    {
        value: 'paralysis',
        label: 'Сонный паралич',
        description: 'Состояние обездвиженности при засыпании или пробуждении',
    },
];

export const DREAM_PHENOMENON_MAP: Record<DreamPhenomenon, DreamPhenomenonOption> =
    DREAM_PHENOMENON_OPTIONS.reduce(
        (acc, option) => {
            acc[option.value] = option;
            return acc;
        },
        {} as Record<DreamPhenomenon, DreamPhenomenonOption>,
    );

// ==========================================
// 4. ДЕТАЛИ ФЕНОМЕНОВ (Селекторы для форм)
// ==========================================

/** Причины смерти во сне */
export const DEATH_CAUSE_OPTIONS = [
    { value: 'fall', label: 'Падение с высоты' },
    { value: 'attack_or_murder', label: 'Нападение / Убийство' },
    { value: 'disaster', label: 'Катастрофа / Стихия' },
    { value: 'execution', label: 'Казнь / Наказание' },
    { value: 'peaceful', label: 'Тихий / Естественный уход' },
    { value: 'other', label: 'Другое' },
] as const;

/** Послествие смерти во сне */
export const DEATH_AFTERMATH_OPTIONS = [
    { value: 'woke_up', label: 'Мгновенно проснулся' },
    { value: 'became_ghost', label: 'Стал призраком / духом' },
    { value: 'reincarnated', label: 'Переродился в новом теле' },
    { value: 'black_void', label: 'Попал в темноту / тишину' },
    { value: 'scene_shift', label: 'Сюжет сменился на другой' },
] as const;

/** Стиль полёта */
export const FLYING_TYPE_OPTIONS = [
    { value: 'effortless', label: 'Естественный / Легкий' },
    { value: 'swimming', label: 'С усилием (гребля руками)' },
    { value: 'apparatus', label: 'С помощью предмета / транспорта' },
    { value: 'levitation', label: 'Парение на месте / левитация' },
    { value: 'uncontrollable', label: 'Неконтролируемый (уносит)' },
] as const;

/** Высота полёта */
export const FLYING_ALTITUDE_OPTIONS = [
    { value: 'low', label: 'Низкая (над землёй / крышами)' },
    { value: 'cloud_level', label: 'Облака / Птичий полёт' },
    { value: 'space', label: 'Космос / Стратосфера' },
] as const;

/** Контекст падения */
export const FALLING_ORIGIN_OPTIONS = [
    { value: 'building_or_cliff', label: 'С здания или обрыва' },
    { value: 'sky_or_void', label: 'С неба / из пустоты' },
    { value: 'abyss', label: 'В бездонную яму / провал' },
    { value: 'stumbling', label: 'Оступился на ровном месте' },
] as const;

/** Исход падения */
export const FALLING_OUTCOME_OPTIONS = [
    { value: 'hypnic_jerk', label: 'Вздрогнул и проснулся (толчок)' },
    { value: 'landed_safe', label: 'Мягко приземлился' },
    { value: 'impact', label: 'Удар о землю' },
    { value: 'woke_before_impact', label: 'Проснулся за секунду до удара' },
    { value: 'turned_into_flight', label: 'Падение переросло в полёт' },
] as const;

// ==========================================
// 5. ТИПЫ СВЯЗЕЙ СНОВ (DreamRelationType)
// ==========================================

export const DREAM_RELATION_OPTIONS: RelationTypeOption[] = [
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

export const DREAM_RELATION_MAP: Record<DreamRelationType, RelationTypeOption> =
    DREAM_RELATION_OPTIONS.reduce(
        (acc, option) => {
            acc[option.value] = option;
            return acc;
        },
        {} as Record<DreamRelationType, RelationTypeOption>,
    );

// ==========================================
// 6. СВОЙСТВА ВОСПРИЯТИЯ (Стили, Камера, Ощущения)
// ==========================================

export const VISUAL_STYLE_OPTIONS: Array<{ value: VisualStyle; label: string }> = [
    { value: 'color', label: 'Цветной' },
    { value: 'vivid', label: 'Яркий / Неоновый / Насыщенный' },
    { value: 'monochrome', label: 'Чёрно-белый / Сепия' },
    { value: 'blurred', label: 'Размытый / Туманный' },
    { value: 'dark', label: 'Тёмный / Сумеречный' },
];

export const PERSPECTIVE_OPTIONS: Array<{ value: Perspective; label: string }> = [
    { value: 'first_person', label: 'От 1-го лица (своими глазами)' },
    { value: 'third_person', label: 'От 3-го лица (со стороны)' },
    { value: 'shifting', label: 'Менялась в процессе' },
];

export const PARTICIPANT_ROLE_OPTIONS: Array<{
    value: ParticipantRole;
    label: string;
    description: string;
}> = [
    {
        value: 'protagonist',
        label: 'Главный герой',
        description: 'Активно участвую, сюжет разворачивается вокруг меня',
    },
    {
        value: 'observer',
        label: 'Зритель / Наблюдатель',
        description: 'Нахожусь в пространстве сна, но просто смотрю',
    },
    {
        value: 'victim',
        label: 'Жертва / Ведомый',
        description: 'Подвергаюсь воздействию, контроль над ситуацией отсутствует',
    },
    {
        value: 'shapeshifter',
        label: 'Другая личность / Существо',
        description: 'Я — не я (другой человек, животное или персонаж)',
    },
    {
        value: 'camera_operator',
        label: 'Оператор / Режиссер',
        description: 'Фиксирую происходящее через «съемку» или настройку кадра',
    },
    {
        value: 'disembodied',
        label: 'Бестелесный дух',
        description: 'Физического тела в пространстве сна нет, чистое присутствие',
    },
];

export const SENSORY_ASPECT_OPTIONS: Array<{
    value: SensoryAspect;
    label: string;
    description?: string;
}> = [
    {
        value: 'sounds',
        label: 'Звуки / Музыка',
        description: 'Четкие речи, шолохи, громкие шумы или музыка',
    },
    {
        value: 'smells',
        label: 'Запахи',
        description: 'Ароматы, гарно, свежесть или неприятные запахи',
    },
    {
        value: 'tactile',
        label: 'Тактильные',
        description: 'Прикосновения, текстура поверхностей, объятия',
    },
    {
        value: 'temperature',
        label: 'Температура',
        description: 'Ощущение явного жара, холода или ледяного ветра',
    },
    {
        value: 'taste',
        label: 'Вкус',
        description: 'Вкус еды, напитков или сторонних предметов',
    },
    {
        value: 'pain',
        label: 'Физическая боль',
        description: 'Уколы, удары, боль от ранений или судороги',
    },
    {
        value: 'kinesthetic',
        label: 'Движение / Ускорение',
        description: 'Вестибулярные ощущения: перегрузки, вращение, невесомость',
    },
    {
        value: 'breathing',
        label: 'Дыхание / Задушье',
        description: 'Нехватка воздуха, дыхание под водой, одышка',
    },
    {
        value: 'speech_voice',
        label: 'Голос / Немота',
        description: 'Потеря голоса (невозможность крикнуть) или телепатия',
    },
    {
        value: 'vision_anomaly',
        label: 'Зрительные искажения',
        description: 'Слепота, искажения цвета, негатив или гиперреализм',
    },
];
