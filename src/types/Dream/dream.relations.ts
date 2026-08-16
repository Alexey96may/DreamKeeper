export interface DreamInterpretationRef {
    interpretationId?: number; // ID из таблицы interpretations в IndexedDB
    tag: string; // Тег для быстрого поиска ("часы")
    meaning: string; // Зафиксированный текст (чтобы если сонник отредактируют, контекст сна не поплыл)
    sourceId: number; //
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
