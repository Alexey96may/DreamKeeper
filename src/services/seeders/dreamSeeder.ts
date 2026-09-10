import type {
    DreamWrite,
    DreamCategory,
    DreamPhenomenon,
    TimeOfDay,
    VisualStyle,
    Perspective,
    ParticipantRole,
    SensoryAspect,
} from '@/types/Dream';

export const generateDreamsSeed = (count: number): DreamWrite[] => {
    const titlePools: Record<string, string[]> = {
        lucid: [
            'Полет над неоновым мегаполисом',
            'Управление гравитацией в кристальном гроте',
            'Создание предметов силой мысли',
            'Осознанное погружение в океанские глубины',
            'Архитектура сновидения: перестройка улиц',
        ],
        nightmare: [
            'Лабиринт бесконечных коридоров',
            'Преследование в заброшенном цеху',
            'Внезапное падение с горного пика',
            'Холодный липкий страх в темной комнате',
            'Отрезанный путь к спасению',
        ],
        prophetic: [
            'Диалог у старого маяка на закате',
            'Встреча на перроне незнакомого вокзала',
            'Странное предзнаменование в старой книге',
            'Письмо из будущего на незнакомом языке',
            'Эхо разговора в пустом амфитеатре',
        ],
        default: [
            'Странное путешествие сквозь туман',
            'Утреннее затишье на пустынной станции',
            'Забытые голоса за старой стеной',
            'Медленное движение по зеркальной глади',
            'Отражения в оконном стекле поезда',
        ],
    };

    const descriptionTemplates = [
        'Ощущалось абсолютное присутствие. Пространство вокруг меня меняло форму в зависимости от мимолетных мыслей, а детали запомнились с невероятной четкостью.',
        'Вокруг царила странная тишина, прерываемая лишь редкими глухими звуками. Попытки повлиять на происходящее давали неожиданные и яркие результаты.',
        'Плотный воздух и насыщенные цветовые переливы создавали ощущение полной реальности происходящего, стирая грань между сном и бодрствованием.',
        'Каждая деталь обстановки казалась наполненной глубоким скрытым смыслом. Окружающие предметы реагировали на каждое прикосновение.',
    ];

    const charactersPool = [
        'Незнакомец в темном плаще',
        'Молчаливый попутчик',
        'Старый знакомый',
        'Женщина с часами',
        'Силуэт в дверном проеме',
        'Группа исследователей',
        'Хранитель архива',
    ];

    const locationsPool = [
        'Заброшенный город',
        'Бесконечный коридор',
        'Морское побережье',
        'Древняя библиотека',
        'Ночной перрон',
        'Кристальная пещера',
        'Пустынное плато',
        'Интерьер старого поезда',
    ];

    const objectsPool = [
        'Песочные часы',
        'Старинный фолиант',
        'Разбитое зеркало',
        'Металлический ключ',
        'Светящийся кристалл',
        'Ржавый компас',
        'Плотная ткань',
    ];

    const emotionsPool = [
        'Восторг',
        'Тревога',
        'Спокойствие',
        'Любопытство',
        'Одиночество',
        'Напряжение',
        'Умиротворение',
        'Загадочность',
    ];

    const contextsPool = [
        'Устал за рабочий день, читал книгу перед сном.',
        'Выпил вечером крепкого мате, долго не мог уснуть.',
        'Лег позже обычного после просмотра фильма.',
        'День прошел спокойно, перед сном разбирал записи.',
        'Лег спать с легкой головной болью и мыслями о проекте.',
    ];

    const timesOfDay: TimeOfDay[] = ['night', 'morning', 'day', 'evening'];
    const visualStyles: VisualStyle[] = ['color', 'vivid', 'monochrome', 'blurred', 'dark'];
    const perspectives: Perspective[] = ['first_person', 'third_person', 'shifting'];
    const allRoles: ParticipantRole[] = [
        'protagonist',
        'observer',
        'victim',
        'shapeshifter',
        'camera_operator',
        'disembodied',
    ];
    const allSensations: SensoryAspect[] = [
        'sounds',
        'smells',
        'tactile',
        'temperature',
        'taste',
        'pain',
        'kinesthetic',
        'breathing',
        'speech_voice',
        'vision_anomaly',
    ];
    const allCategories: DreamCategory[] = ['lucid', 'nightmare', 'prophetic'];
    const allPhenomena: DreamPhenomenon[] = [
        'death',
        'flying',
        'falling',
        'nested_dream',
        'paralysis',
    ];

    const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const getRandomSubarray = <T>(arr: T[], max: number = 2): T[] => {
        const count = Math.floor(Math.random() * (max + 1));
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const results: DreamWrite[] = [];
    const today = new Date();
    const dates: string[] = [];

    for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    let generatedCount = 0;
    const usedTitles = new Set<string>();

    while (generatedCount < count && dates.length > 0) {
        const dateIndex = Math.floor(Math.random() * dates.length);
        const targetDate = dates[dateIndex];

        const maxPossibleForDay = Math.min(10, count - generatedCount);
        const dreamsCountForDay = Math.floor(Math.random() * (maxPossibleForDay + 1));

        for (let i = 0; i < dreamsCountForDay && generatedCount < count; i++) {
            const categories = getRandomSubarray(allCategories, 1);
            const catKey = categories[0] || 'default';
            const pool = titlePools[catKey] || titlePools.default;

            let title = getRandomItem(pool);
            let attempts = 0;
            while (usedTitles.has(title) && attempts < 10) {
                title = `${getRandomItem(pool)} (${Math.floor(Math.random() * 1000)})`;
                attempts++;
            }
            usedTitles.add(title);

            const phenomena = getRandomSubarray(allPhenomena, 1);

            const dream: DreamWrite = {
                date: targetDate,
                title,
                description: getRandomItem(descriptionTemplates),
                categories,
                categoryDetails: categories.includes('lucid')
                    ? {
                          lucid: {
                              controlLevel: Math.floor(Math.random() * 8) + 2,
                              trigger: 'anomaly',
                          },
                      }
                    : categories.includes('nightmare')
                      ? {
                            nightmare: {
                                fearLevel: Math.floor(Math.random() * 7) + 3,
                                hasPhysicalResponse: true,
                            },
                        }
                      : categories.includes('prophetic')
                        ? { prophetic: { expectedByDate: '2026-11-01', isFulfilled: false } }
                        : undefined,
                phenomena: phenomena.length ? phenomena : undefined,
                phenomenaDetails: phenomena.includes('flying')
                    ? { flying: { type: 'effortless', altitude: 'cloud_level' } }
                    : phenomena.includes('falling')
                      ? { falling: { origin: 'building_or_cliff', outcome: 'hypnic_jerk' } }
                      : undefined,
                quality: Math.floor(Math.random() * 8) + 3,
                clarity: Math.floor(Math.random() * 7) + 4,
                moodAfter: Math.floor(Math.random() * 8) + 3,
                timeOfDay: getRandomItem(timesOfDay),
                visualStyle: getRandomItem(visualStyles),
                perspective: getRandomItem(perspectives),
                roles: getRandomSubarray(allRoles, 2),
                sensations: getRandomSubarray(allSensations, 3),
                characters: getRandomSubarray(charactersPool, 2),
                locations: getRandomSubarray(locationsPool, 2),
                objects: getRandomSubarray(objectsPool, 2),
                emotions: getRandomSubarray(emotionsPool, 3),
                preSleepContext: getRandomItem(contextsPool),
                isFavorite: Math.random() > 0.7,
                isPinned: Math.random() > 0.9,
                isArchived: false,
                isDeleted: false,
                isDraft: Math.random() > 0.85,
                isPrivate: true,
            };

            results.push(dream);
            generatedCount++;
        }

        dates.splice(dateIndex, 1);
    }

    while (generatedCount < count) {
        const randomDaysAgo = Math.floor(Math.random() * 60);
        const d = new Date(today);
        d.setDate(today.getDate() - randomDaysAgo);
        const targetDate = d.toISOString().split('T')[0];

        const title = `Сон от ${targetDate} #${Math.floor(Math.random() * 10000)}`;
        usedTitles.add(title);

        results.push({
            date: targetDate,
            title,
            description: getRandomItem(descriptionTemplates),
            categories: [],
            quality: 6,
            clarity: 7,
            moodAfter: 6,
            timeOfDay: 'night',
            visualStyle: 'color',
            perspective: 'first_person',
            roles: ['protagonist'],
            sensations: ['sounds'],
            characters: [],
            locations: ['Неизвестное место'],
            objects: [],
            emotions: ['Спокойствие'],
            isFavorite: false,
            isPinned: false,
            isArchived: false,
            isDeleted: false,
            isDraft: false,
            isPrivate: true,
        });

        generatedCount++;
    }

    return results.sort((a, b) => b.date.localeCompare(a.date));
};
