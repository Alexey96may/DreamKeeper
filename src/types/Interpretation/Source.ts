export type SourceType = 'custom' | 'system' | 'author' | 'ai';

export type SourceCategory =
    | 'psychology' // Психоанализ и психология (Юнг, Фрейд)
    | 'esoteric' // Традиционные сонники / Эзотерика (Миллер, Нострадамус)
    | 'personal' // Личный опыт и субъективные ассоциации
    | 'ai_analysis' // Аналитика от ИИ / Нейросети
    | 'cultural'; // Культурные и мифологические архетипы

// Уровни приватности источника
export type SourceVisibility = 'private' | 'shared' | 'public';

export interface Source {
    id: string; // 'custom_user_1', 'miller', 'freud', 'community_metal_symbols'
    title: string; // "Мои ассоциации", "Сонник Миллера"
    description: string; // Описание сонника
    rating: number; // 1.0 - 5.0 (Средний рейтинг доверия / полезности)
    type: SourceType;
    category: SourceCategory;

    // --- Информация об авторе и владельце ---
    authorId?: string; // ID автора методологии/книги ('c_g_jung', 'sigmund_freud')
    authorName?: string; // Имя автора ("Карл Густав Юнг", "Густавус Миллер")
    ownerId?: string; // ID создателя записи в системе (например, 'usr_alexey_123')

    // --- Права доступа и совместная работа (ACL) ---
    visibility: SourceVisibility; // 'private' | 'shared' | 'public'
    isEditable: boolean; // Флаг текущего права редактирования для кликабельности в UI
    editorIds?: string[]; // Список ID юзеров, имеющих доступ к редактированию статей
    readerIds?: string[]; // Список ID юзеров, имеющих доступ на чтение (если visibility = 'shared')

    // --- Метрики сообщества и статистика ---
    usersCount: number; // Количество пользователей, использующих этот источник
    interpretationsCount?: number; // Сколько всего терминов/статей в этом соннике
    likesCount?: number; // Сколько человек добавили источник в Избранное

    // --- Даты и Метаданные ---
    createdAt: string; // ISO DateTime ('2026-08-09T14:00:00Z')
    updatedAt: string; // ISO DateTime ('2026-08-09T15:30:00Z')
    iconName?: string; // Иконка для UI (Lucide icon name)
}
