export type DreamCategory =
    | 'lucid' // Осознанный (ОС)
    | 'nightmare' // Кошмар
    | 'prophetic'; // Вещий / Сбывшийся

// --- Детали по категориям ---

export interface LucidDetails {
    controlLevel?: number; // 1-10 (Уровень контроля)
    trigger?: 'reality_check' | 'anomaly' | 'spontaneous' | 'other';
}

export interface NightmareDetails {
    fearLevel?: number; // 1-10
    copingMechanism?: string; // Как завершился / справился
    hasPhysicalResponse?: boolean; // Физическая реакция организма
}

export interface PropheticDetails {
    expectedByDate?: string; // Ожидаемый срок сбытия (дедлайн)
    isFulfilled?: boolean; // Сбылся / Не сбылся
    fulfilledDate?: string; // Дата факта
    fulfillmentNotes?: string; // Что именно произошло
}

// --- Общий контейнер деталей ---

export interface DreamCategoryDetails {
    lucid?: LucidDetails;
    nightmare?: NightmareDetails;
    prophetic?: PropheticDetails;
}

// 2. Особые события во сне
export type DreamPhenomenon =
    | 'death' // Смерть во сне
    | 'flying' // Полёт
    | 'falling' // Падение
    | 'nested_dream' // Ложное пробуждение
    | 'paralysis'; // Сонный паралич

export interface ParalysisDetails {
    timing?: 'falling_asleep' | 'waking_up';
    hallucinations?: Array<'auditory' | 'visual' | 'tactile' | 'presence'>;
}

export interface NestedDreamDetails {
    nestingLevels?: number;
}

export interface DeathDetails {
    /** Причина / контекст смерти */
    cause?: 'fall' | 'attack_or_murder' | 'disaster' | 'execution' | 'peaceful' | 'other';

    /** Что произошло СРАЗУ ПОСЛЕ смерти во сне */
    aftermath?:
        | 'woke_up' // Мгновенно проснулся (испуг / скачок пульса)
        | 'became_ghost' // Стал призраком / духом (переход в disembodied)
        | 'reincarnated' // Переродился / возродился в новом теле
        | 'black_void' // Попал в темноту / тишину, но продолжал спать
        | 'scene_shift'; // Сюжет просто сменился на другой
}

export interface FlyingDetails {
    /** Характер / стиль полёта */
    type?:
        | 'effortless' // Естественный / Легкий (как птица или супергерой)
        | 'swimming' // Гребля руками (как в воде / с давлением)
        | 'apparatus' // С помощью предмета (крылья, ранец, метла, транспорт)
        | 'levitation' // Набор высоты / парение на месте
        | 'uncontrollable'; // Неконтролируемый (уносит ветром / сложно снизиться)

    /** Высота полёта */
    altitude?: 'low' | 'cloud_level' | 'space';
}

export interface FallingDetails {
    /** Откуда / Контекст падения */
    origin?: 'building_or_cliff' | 'sky_or_void' | 'abyss' | 'stumbling';

    /** Чем закончилось падение */
    outcome?:
        | 'hypnic_jerk' // Вздрогнул всей тушкой и проснулся (физический отклик)
        | 'landed_safe' // Мягко приземлился / приземлился без повреждений
        | 'impact' // Удар о землю (с развитием сюжета или переходом в death)
        | 'woke_before_impact' // Проснулся за секунду до удара
        | 'turned_into_flight'; // Падение переросло в полёт (взлетел)
}

export interface DreamPhenomenaDetails {
    paralysis?: ParalysisDetails;
    nestedDream?: NestedDreamDetails;
    death?: DeathDetails;
    flying?: FlyingDetails;
    falling?: FallingDetails;
}

export type TimeOfDay =
    | 'night' // Ночной (основной ночной сон)
    | 'morning' // Утренний (досыпание / сон под утро)
    | 'day' // Дневной (сиеста / дневной сон / nap)
    | 'evening' // Вечерний
    | 'unknown';

export interface TimeOfDayOption {
    value: TimeOfDay;
    label: string;
    description?: string;
    // Обрати внимание: тут просто string (например, имя иконки или путь),
    // чтобы не тащить Vue/Lucide зависимости в чистые типы.
    iconName?: string;
}

export interface DreamCategoryOption {
    value: DreamCategory;
    label: string;
    description: string;
    iconName?: string;
}

export interface DreamPhenomenonOption {
    value: DreamPhenomenon;
    label: string;
    description: string;
    iconName?: string;
}

// Визуальный стиль
export type VisualStyle =
    | 'color' // Цветной
    | 'vivid' // Яркий / Неоновый / Насыщенный
    | 'monochrome' // Чёрно-белый / Сепия
    | 'blurred' // Размытый / Туманный
    | 'dark'; // Тёмный / Сумеречный

// Точка зрения (Перспектива)
export type Perspective =
    | 'first_person' // От первого лица (своими глазами)
    | 'third_person' // От третьего лица (со стороны)
    | 'shifting'; // Менялась в процессе

export type ParticipantRole =
    | 'protagonist' // Главный герой (активно участвую, сюжет вокруг меня)
    | 'observer' // Зритель / Наблюдатель (нахожусь там, но просто смотрю)
    | 'victim' // Жертва / Ведомый (со мной что-то делают, нет контроля)
    | 'shapeshifter' // Другая личность / Существо (я — не я, а другой человек/животное/персонаж)
    | 'camera_operator' // Оператор / Режиссер (взаимодействую с миром через «съемку», фиксирую кадры)
    | 'disembodied'; // Бестелесный дух / Оператор (меня физически нет в пространстве сна, просто визуал)

// Сенсорные ощущения (Органы чувств)
export type SensoryAspect =
    | 'sounds' // Звуки / Музыка
    | 'smells' // Запахи
    | 'tactile' // Прикосновения / Текстуры
    | 'temperature' // Тепло / Холод
    | 'taste' // Вкус
    | 'pain' // Физическая боль
    | 'kinesthetic' // Перегрузки / Вращение / Вестибулярные ощущения
    | 'breathing' // Дыхание / Одышка / Задушье
    | 'speech_voice' // Голос / Немота / Речь
    | 'vision_anomaly'; // Зрительные аномалии / Искажения

export interface DreamInterpretationRef {
    interpretationId?: number; // ID из таблицы interpretations в IndexedDB
    tag: string; // Тег для быстрого поиска ("часы")
    meaning: string; // Зафиксированный текст (чтобы если сонник отредактируют, контекст сна не поплыл)
    sourceId: string; // 'miller' | 'custom' | 'ai'
    isAccurate?: boolean | null; // Отметка сновидца: "Сбылось/Похоже на правду"
}

export type DreamRelationType =
    | 'recurring_instance' // Повторяющийся сюжет / Паттерн
    | 'continuation' // Прямое продолжение
    | 'prequel' // Предыстория
    | 'similar_theme' // Похожая тема или мотив
    | 'same_location' // Та же локация / Мир сна
    | 'reference'; // Упоминание / Пересечение персонажей или предметов

export interface RelatedDreamRef {
    /**
     * ID связанного сна в IndexedDB.
     * Если undefined — значит, связь с событием/сном из прошлого, которого нет в базе.
     */
    dreamId?: number;

    /** Тип связи */
    relationType: DreamRelationType;

    /**
     * Дополнительный контекст:
     * 1. Если dreamId указан — примечание к связи (например, "Тот же поезд, но другого цвета")
     * 2. Если dreamId нет — описание прошлого паттерна (например, "Снится регулярно с 2018 года")
     */
    note?: string;
}

export interface RelationTypeOption {
    value: DreamRelationType;
    label: string;
    description: string;
    iconName?: string;
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
    categoryDetails?: DreamCategoryDetails;

    phenomena?: DreamPhenomenon[];
    phenomenaDetails?: DreamPhenomenaDetails;

    // --- Оценки ---
    quality?: number; // Качество сна (1-10)
    clarity?: number; // Яркость/Ясность (1-10)
    moodAfter?: number; // Настроение после (1-10)

    // --- Свойства сна ---
    timeOfDay?: TimeOfDay;
    visualStyle?: VisualStyle; // Визуальный стиль
    perspective?: Perspective; // Точка зрения (1-е / 3-е лицо)
    roles?: ParticipantRole[]; // 👈 Массив ролей (было role?: ParticipantRole)
    sensations?: SensoryAspect[];

    // --- Аналитика (Arrays) ---
    characters?: string[];
    locations?: string[];
    objects?: string[];
    emotions?: string[];

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
