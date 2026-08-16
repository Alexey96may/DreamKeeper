import type { InterprSource } from '@/types/Interpretation/Source';

export const initialSourcesSeed: InterprSource[] = [
    // 0. Системный дефолтный источник (для собственных ассоциаций и быстрых заметок)
    {
        id: 0,
        title: 'Собственные ассоциации / Личный опыт',
        description:
            'Индивидуальное толкование на основе личных чувств, контекста дня и субъективных смыслов.',
        rating: 5.0,
        type: 'custom',
        category: 'personal',
        visibility: 'public',
        isEditable: false,
        usersCount: 0,
        interpretationsCount: 0,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        iconName: 'Sparkles',
    },

    // 1. Системный классический психоанализ
    {
        id: 24,
        title: 'Психоанализ Фрейда',
        description:
            'Интерпретация через призму бессознательных желаний, подавленных влечений и защиты психики.',
        rating: 4.6,
        type: 'author',
        category: 'psychology',
        authorId: 's_freud',
        authorName: 'Зигмунд Фрейд',
        visibility: 'public',
        isEditable: false,
        usersCount: 9800,
        interpretationsCount: 510,
        likesCount: 2150,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-06-15T12:00:00Z',
        iconName: 'Glasses',
    },

    // 2. Классический традиционный сонник
    {
        id: 25,
        title: 'Традиционный классический сонник',
        description:
            'Свод народных примет, архетипических образов и традиционных этнографических толкований.',
        rating: 4.2,
        type: 'family',
        category: 'cultural',
        visibility: 'public',
        isEditable: false,
        usersCount: 15300,
        interpretationsCount: 1200,
        likesCount: 1840,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-06-15T12:00:00Z',
        iconName: 'BookOpen',
    },

    // 3. Системно-авторский публичный сонник Юнга
    {
        id: 23,
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

    // 4. Персональный закрытый источник пользователя
    {
        id: 33,
        title: 'Мои личные ассоциации и дневник',
        description: 'Индивидуальные значения символов, замеченные на личном опыте.',
        rating: 5.0,
        type: 'custom',
        category: 'personal',
        ownerId: 'usr_alexey_123',
        authorName: 'Алексей',
        visibility: 'private',
        isEditable: true,
        editorIds: ['usr_alexey_123'],
        usersCount: 1,
        interpretationsCount: 42,
        createdAt: '2026-02-10T10:00:00Z',
        updatedAt: '2026-08-08T18:20:00Z',
        iconName: 'UserCheck',
    },

    // 5. Совместный (Shared) сонник для группы/семьи
    {
        id: 1332,
        title: 'Семейные знаки и приметы',
        description: 'Общий сонник для обсуждения повторяющихся семейных сюжетов.',
        rating: 4.5,
        type: 'custom',
        category: 'personal',
        ownerId: 'usr_alexey_123',
        visibility: 'shared',
        isEditable: true,
        editorIds: ['usr_alexey_123', 'usr_lena_456'],
        readerIds: ['usr_alexey_123', 'usr_lena_456'],
        usersCount: 2,
        interpretationsCount: 15,
        createdAt: '2026-05-01T12:00:00Z',
        updatedAt: '2026-08-01T09:15:00Z',
        iconName: 'Users',
    },
];
