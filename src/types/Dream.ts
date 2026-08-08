export type DreamCategory =
    | 'normal' // Осознанный (ОС)
    | 'lucid' // Осознанный (ОС)
    | 'nightmare' // Кошмар
    | 'prophetic' // Вещий / Сбывшийся
    | 'false_awakening' // Ложное пробуждение
    | 'paralysis' // Сонный паралич
    | 'recurring'; // Повторяющийся сон

export type TimeOfDay = 'night' | 'nap' | 'morning';
// Визуальный стиль
export type VisualStyle = 'color' | 'monochrome' | 'vivid' | 'blurred';
// Ощущения во сне
export type SensoryAspect = 'sounds' | 'smells' | 'tactile' | 'taste' | 'pain';

export interface DreamInterpretationRef {
    symbol: string;
    meaning: string;
    source?: 'custom' | 'base_guide';
}

export interface RelatedDreamRef {
    dreamId: number;
    relationType?: 'continuation' | 'prequel' | 'similar_theme' | 'same_location' | 'reference';
    // continuation — продолжение
    // prequel — предыстория
    // similar_theme — похожая тема/сюжет
    // same_location — та же локация
    // reference — просто упоминание/ссылка
}

export interface Dream {
    // --- Обязательные (MVP) ---
    id: number;
    date: string;
    title: string; // Уникальный
    description: string;
    createdAt: string;
    updatedAt: string;

    categories: DreamCategory[];

    // --- Оценки ---
    quality?: number; // Качество сна (1-10)
    clarity?: number; // Яркость/Ясность (1-10)
    lucidityLevel?: number; // Уровень осознанности (0-10) *Зависимость от категории lucid!
    moodAfter?: number; // Настроение после (1-10)

    // --- Свойства сна ---
    timeOfDay?: TimeOfDay;
    isColor?: boolean; // Цветной или ЧБ
    sensations?: SensoryAspect[];

    // --- Аналитика (Arrays) ---
    characters?: string[];
    locations?: string[];
    objects?: string[];
    emotions?: string[];
    tags?: string[];

    // --- Интерпретация ---
    interpretations?: DreamInterpretationRef[];
    personalNotes?: string;

    relatedDreams?: RelatedDreamRef[];
    PreSleepContext?: string;

    isFavorite?: boolean;
    isPinned?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
    isDraft?: boolean;
    isPrivate?: boolean;

    //На будущее

    //Длительности
    // startTime?: string;
    // endTime?: string;
    // duration?: number;

    // audioUrl?: string; + voiceNote
    // galley?: string[]; + photoNote (AI)
    // isFulfilled + fulfilledDate *Зависимость от категории prophetic!
    // isNSFW?: boolean / containsTriggerWarnings?: boolean — Пометка чувствительного контента (кошмары, эротические сны, насильственные сюжеты).
}

export type DreamWrite = Omit<Dream, 'id' | 'createdAt' | 'updatedAt'>;
