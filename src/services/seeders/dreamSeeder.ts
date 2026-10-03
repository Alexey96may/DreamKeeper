import type {
    DreamWrite,
    DreamCategory,
    DreamPhenomenon,
    TimeOfDay,
    VisualStyle,
    Perspective,
    ParticipantRole,
    SensoryAspect,
    DreamInterpretationRef,
    RelatedDreamRef,
    DreamRelationType,
} from '@/types/Dream';
import type { InterpretationWrite } from '@/services/schemas/interpretation.schema';

import { initialInterpretationsSeed } from './interpretationsSeed';

export const generateDreamsSeed = (count: number): DreamWrite[] => {
    const titlePools: Record<string, string[]> = {
        lucid: [
            'Полет над неоновым мегаполисом',
            'Управление гравитацией в кристальном гроте',
            'Создание предметов силой мысли',
            'Осознанное погружение в океанские глубины',
            'Архитектура сновидения: перестройка улиц',
            'Проход сквозь зеркальные стены замка',
            'Дыхание под водой среди биолюминесцентных коралов',
            'Контроль над временем на вершине часовой башни',
            'Превращение в птицу над ночным каньоном',
            'Рисование светом в полной темноте космоса',
        ],
        nightmare: [
            'Лабиринт бесконечных коридоров',
            'Преследование в заброшенном цеху',
            'Внезапное падение с горного пика',
            'Холодный липкий страх в темной комнате',
            'Отрезанный путь к спасению',
            'Звуки шагов за запертой дверью',
            'Потеря контроля над тормозами падающего поезда',
            'Отражение в зеркале живет своей пугающей жизнью',
            'Бесконечный подъем по крутой винтовой лестнице без конца',
            'Невозможность сдвинуться с места под тяжелым взглядом',
        ],
        prophetic: [
            'Диалог у старого маяка на закате',
            'Встреча на перроне незнакомого вокзала',
            'Странное предзнаменование в старой книге',
            'Письмо из будущего на незнакомом языке',
            'Эхо разговора в пустом амфитеатре',
            'Внезапное осознание момента из реальной жизни',
            'Силуэт в окне поезда, уносящегося в сумерки',
            'Случайно услышанная фраза, меняющая ход событий',
            'Сгорающая фотография с неизвестным лицом',
            'Старинные карманные часы, остановившиеся ровно в полночь',
        ],
        default: [
            'Странное путешествие сквозь туман',
            'Утреннее затишье на пустынной станции',
            'Забытые голоса за старой стеной',
            'Медленное движение по зеркальной глади',
            'Отражения в оконном стекле поезда',
            'Прогулка по осеннему парку с падающими листьями',
            'Поиск потерянного ключа в старом доме',
            'Беседа со старым другом на заброшенном причале',
            'Наблюдение за медленным движением облаков над горами',
            'Тихий вечер в библиотеке с пахнущими пылью фолиантами',
        ],
    };

    const descriptionTemplates = [
        'Ощущалось абсолютное присутствие. Пространство вокруг меня меняло форму в зависимости от мимолетных мыслей, а детали запомнились с невероятной четкостью.',
        'Вокруг царила странная тишина, прерываемая лишь редкими глухими звуками. Попытки повлиять на происходящее давали неожиданные и яркие результаты.',
        'Плотный воздух и насыщенные цветовые переливы создавали ощущение полной реальности происходящего, стирая грань между сном и бодрствованием.',
        'Каждая деталь обстановки казалась наполненной глубоким скрытым смыслом. Окружающие предметы реагировали на каждое прикосновение.',
        'Ощущение леденящего одиночества сменялось вспышками яркого света. Тени казались живыми и следовали за каждым движением.',
        'Всё происходило как в замедленной съемке. Звуки доносились словно из-под толщи воды, а контуры предметов расплывались при попытке сфокусироваться.',
    ];

    const charactersPool = [
        'Незнакомец в темном плаще',
        'Молчаливый попутчик',
        'Старый знакомый',
        'Женщина с часами',
        'Силуэт в дверном проеме',
        'Группа исследователей',
        'Хранитель архива',
        'Девочка со старинной игрушкой',
    ];

    const alienAuthorsPool = [
        'Зоны Пятого Сектора',
        'Наблюдатель Сириуса',
        'Контакт из туманности',
        'Внешний разум',
        'Мать',
        'Брат',
        'Архитектор пустоты',
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

    const relationTypesPool: DreamRelationType[] = [
        'recurring_instance',
        'continuation',
        'prequel',
        'similar_theme',
        'same_location',
        'reference',
    ];

    const keywordToTagMap: Record<string, string> = {
        вод: 'voda',
        океан: 'voda',
        огонь: 'ogon',
        пламень: 'ogon',
        змей: 'zmeya',
        дом: 'dom',
        здан: 'dom',
        зеркал: 'zerkalo',
        полет: 'polet',
        летел: 'polet',
        дорог: 'doroga',
        путь: 'doroga',
        станци: 'doroga',
        смерть: 'smerth',
        гибель: 'smerth',
        ключ: 'klyuch',
    };

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
    const allSensory: SensoryAspect[] = [
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

    const generateInterpretationsForDream = (text: string): DreamInterpretationRef[] => {
        const lowerText = text.toLowerCase();
        const matchedTags = new Set<string>();

        for (const [keyword, tag] of Object.entries(keywordToTagMap)) {
            if (lowerText.includes(keyword)) {
                matchedTags.add(tag);
            }
        }

        if (matchedTags.size === 0 && Math.random() > 0.6) {
            matchedTags.add(getRandomItem(Object.values(keywordToTagMap)));
        }

        const results: DreamInterpretationRef[] = [];
        matchedTags.forEach((tag) => {
            const possibleInterps: (InterpretationWrite & { id: string })[] =
                initialInterpretationsSeed.filter((item) => item.symbolTag === tag);
            if (possibleInterps.length > 0) {
                const interp = getRandomItem(possibleInterps);
                results.push({
                    id: crypto.randomUUID(),
                    interpretationId: interp.id,
                    tag: interp.symbolTag,
                    meaning: getRandomItem(interp.meanings),
                    sourceId: interp.sourceId,
                    isAccurate: Math.random() > 0.5 ? true : null,
                });
            }
        });

        return results;
    };

    const results: DreamWrite[] = [];
    const today = new Date();
    const usedTitles = new Set<string>();

    for (let generatedCount = 0; generatedCount < count; generatedCount++) {
        const randomDaysAgo = Math.floor(Math.random() * 60);
        const d = new Date(today);
        d.setDate(today.getDate() - randomDaysAgo);
        const targetDate = d.toISOString().split('T')[0];

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

        const description = getRandomItem(descriptionTemplates);
        const phenomena = getRandomSubarray(allPhenomena, 1);
        const isAlien = Math.random() < 0.15;
        const authorName = isAlien ? getRandomItem(alienAuthorsPool) : '';

        const relatedDreams: RelatedDreamRef[] = [];
        if (results.length > 0 && Math.random() > 0.6) {
            const existingIndex = Math.floor(Math.random() * results.length);
            relatedDreams.push({
                dreamId: existingIndex + 1,
                relationType: getRandomItem(relationTypesPool),
                note: Math.random() > 0.5 ? 'Перекликается с прошлым образом' : undefined,
            });
        } else if (Math.random() > 0.85) {
            relatedDreams.push({
                dreamId: undefined,
                relationType: 'recurring_instance',
                note: 'Повторяющийся сюжет из прошлых лет',
            });
        }

        const dream: DreamWrite & {
            interpretations?: DreamInterpretationRef[];
            relatedDreams?: RelatedDreamRef[];
        } = {
            date: targetDate,
            title,
            description,
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
            sensations: getRandomSubarray(allSensory, 3),
            characters: getRandomSubarray(charactersPool, 2),
            locations: getRandomSubarray(locationsPool, 2),
            objects: getRandomSubarray(objectsPool, 2),
            emotions: getRandomSubarray(emotionsPool, 3),
            isAlien,
            authorName,
            preSleepContext: getRandomItem(contextsPool),
            interpretations: generateInterpretationsForDream(`${title} ${description}`),
            relatedDreams: relatedDreams.length > 0 ? relatedDreams : undefined,
            isFavorite: Math.random() > 0.7,
            isPinned: Math.random() > 0.9,
            isArchived: false,
            isDeleted: false,
            isDraft: Math.random() > 0.85,
            isPrivate: true,
        };

        results.push(dream);
    }

    return results.sort((a, b) => b.date.localeCompare(a.date));
};
