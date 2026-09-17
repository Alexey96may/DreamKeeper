export interface Interpretation {
    id: string; // string для взаимодействия локалки с сервером
    meanings: string[]; // Подробная трактовка символа

    // --- Связи ---
    symbolTag: string; // Ссылка на DreamSymbol.tag
    aspectId: string | null; // Ссылка на DreamAspect.id (может быть общим для всего символа, если null)
    sourceId: string; // Внешний ключ -> Source.id ('jung', 'custom_alexey', 'family_symbols')

    // --- Права и Модерация ---
    isCustom: boolean; // true — добавлено пользователем вручную
    isVerified?: boolean; // true — проверенное экспертом/модератором толкование

    // --- Даты ---
    createdAt: string; // ISO DateTime ('2026-08-09T14:00:00Z')
    updatedAt?: string; // ISO DateTime
}
