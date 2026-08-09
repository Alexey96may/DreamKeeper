import type { Source } from '@/types/Interpretation/Source';

export const initialSourcesSeed: Source[] = [
    // 1. Системный/Системно-авторский публичный сонник
    {
        id: 'jung',
        title: 'Аналитическая психология Юнга',
        description: 'Интерпретация символов через архетипы и коллективное бессознательное.',
        rating: 4.8,
        type: 'author',
        category: 'psychology',
        authorId: 'c_g_jung',
        authorName: 'Карл Густав Юнг',
        visibility: 'public',
        isEditable: false,
        usersCount: 12450,
        interpretationsCount: 380,
        likesCount: 3120,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-06-15T12:00:00Z',
        iconName: 'Brain',
    },

    // 2. Персональный закрытый источник пользователя
    {
        id: 'custom_alexey',
        title: 'Мои личные ассоциации и дневник',
        description: 'Индивидуальные значения символов, замеченные на личном опыте.',
        rating: 5.0,
        type: 'custom',
        category: 'personal',
        ownerId: 'usr_alexey_123',
        authorName: 'Алексей',
        visibility: 'private',
        isEditable: true,
        editorIds: ['usr_alexey_123'], // Ток сам владелец
        usersCount: 1,
        interpretationsCount: 42,
        createdAt: '2026-02-10T10:00:00Z',
        updatedAt: '2026-08-08T18:20:00Z',
        iconName: 'UserCheck',
    },

    // 3. Совместный (Shared) сонник для группы/семьи
    {
        id: 'family_symbols',
        title: 'Семейные знаки и приметы',
        description: 'Общий сонник для обсуждения повторяющихся семейных сюжетов.',
        rating: 4.5,
        type: 'custom',
        category: 'personal',
        ownerId: 'usr_alexey_123',
        visibility: 'shared',
        isEditable: true,
        editorIds: ['usr_alexey_123', 'usr_lena_456'], // Доступ на запись обоим
        readerIds: ['usr_alexey_123', 'usr_lena_456'],
        usersCount: 2,
        interpretationsCount: 15,
        createdAt: '2026-05-01T12:00:00Z',
        updatedAt: '2026-08-01T09:15:00Z',
        iconName: 'Users',
    },
];
