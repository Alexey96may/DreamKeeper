// src/seeds/initialInterpretationsSeed.ts

import type { Interpretation } from '@/types/Interpretation/Interpretation';

export const initialInterpretationsSeed: Interpretation[] = [
    // --- Психоанализ (Юнг) ---
    {
        id: 1,
        tag: 'море',
        title: 'Море / Бескрайние воды',
        meaning:
            'Символ коллективного бессознательного, глубин психики и скрытых эмоций. Спокойное море указывает на гармонию с Тенью, бушующее — на эмоциональный конфликт.',
        sourceId: 'jung',
        authorId: 'c_g_jung',
        category: 'location',
        rating: 4.9,
        likesCount: 1420,
        useCount: 38,
        isCustom: false,
        isVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 2,
        tag: 'старик',
        title: 'Мудрый старик / Учитель',
        meaning:
            'Архетип Мудреца (Духа). Появление этого персонажа указывает на внутреннюю интуицию, готовность принять важное решение или поиск жизненного ориентира.',
        sourceId: 'jung',
        authorId: 'c_g_jung',
        category: 'character',
        rating: 4.8,
        likesCount: 890,
        useCount: 19,
        isCustom: false,
        isVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
    },

    // --- Эзотерический сонник (Миллер) ---
    {
        id: 3,
        tag: 'часы',
        title: 'Часы / Настенные или наручные',
        meaning:
            'Видеть во сне часы — предвестье того, что вы рискуете упустить важный шанс из-за спешки или неверного распределения времени. Слышать бой — к неожиданным известиям.',
        sourceId: 'miller',
        authorId: 'gustavus_miller',
        category: 'object',
        rating: 3.5,
        likesCount: 310,
        useCount: 14,
        isCustom: false,
        isVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 4,
        tag: 'полет',
        title: 'Полет над землей',
        meaning:
            'Парить высоко в небе — к успешному преодолению препятствий и исполнению желаний. Если при полете вы падаете вниз — символ временных трудностей в делах.',
        sourceId: 'miller',
        authorId: 'gustavus_miller',
        category: 'action',
        rating: 3.8,
        likesCount: 520,
        useCount: 27,
        isCustom: false,
        isVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
    },

    // --- AI Аналитика (Нейросеть) ---
    {
        id: 5,
        tag: 'затмение',
        title: 'Солнечное / Лунное затмение',
        meaning:
            'Контекстуальный символ временной потери ясности, перезагрузки жизненного этапа или сокрытия важного факта от самого себя. Часто снится в моменты смены профессии или переезда.',
        sourceId: 'ai_assistant',
        authorId: 'gemini_ai',
        category: 'nature',
        rating: 4.6,
        likesCount: 205,
        useCount: 8,
        isCustom: false,
        isVerified: true,
        createdAt: '2026-02-15T10:00:00Z',
    },

    // --- Пользовательский закрытый источник (Личные заметки) ---
    {
        id: 6,
        tag: 'калебас',
        title: 'Калебас / Сосуд для мате',
        meaning:
            'Мой персональный символ фокусировки, приватного пространства, погружения в работу и восстановления энергии после долгого дня.',
        sourceId: 'custom_alexey',
        authorId: 'usr_alexey_123',
        category: 'object',
        rating: 5.0,
        likesCount: 1,
        useCount: 5,
        isCustom: true,
        isVerified: false,
        createdAt: '2026-05-10T14:30:00Z',
        updatedAt: '2026-08-01T11:00:00Z',
    },

    // --- Совместный источник (Семейный сонник) ---
    {
        id: 7,
        tag: 'маяк',
        title: 'Маяк на утесе',
        meaning:
            'Семейная примета: маяк всегда снится к долгожданному письму, завершению сложного ремонта или разрешению затянувшегося вопроса.',
        sourceId: 'family_symbols',
        authorId: 'usr_lena_456',
        category: 'location',
        rating: 4.7,
        likesCount: 2,
        useCount: 3,
        isCustom: true,
        isVerified: false,
        createdAt: '2026-06-20T09:15:00Z',
    },
];
