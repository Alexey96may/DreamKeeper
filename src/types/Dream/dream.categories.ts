export interface DreamCategoryDetails {
    lucid?: LucidDetails;
    nightmare?: NightmareDetails;
    prophetic?: PropheticDetails;
}

export type DreamCategory =
    | 'lucid' // Осознанный (ОС)
    | 'nightmare' // Кошмар
    | 'prophetic'; // Вещий / Сбывшийся

// --- Детали по категориям ---

export type LucidTrigger = 'irrelevant' | 'reality_check' | 'anomaly' | 'spontaneous' | 'other';

export interface LucidDetails {
    controlLevel?: number; // 1-10 (Уровень контроля)
    trigger?: LucidTrigger;
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
