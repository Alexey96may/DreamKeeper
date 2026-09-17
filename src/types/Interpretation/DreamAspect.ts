export interface DreamAspect {
    id: string; // Primary Key (например: 'voda-clean')
    symbolTag: string; // Ссылка на DreamSymbol.tag
    title: string; // Название контекста на русском (например: 'Чистая вода')
    description?: string; // Опциональное пояснение контекста
    createdAt?: string;
    updatedAt?: string;
}
