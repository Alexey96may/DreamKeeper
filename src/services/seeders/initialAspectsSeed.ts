import type { AspectWrite } from '@/services/schemas/aspect.schema';

export const initialAspectsSeed: (AspectWrite & { id: string })[] = [
    // --- ВОДА (voda) ---
    {
        id: 'voda-chistaya',
        symbolTag: 'voda',
        title: 'Чистая и прозрачная вода',
        description: 'Ясность мыслей, душевный покой, эмоциональное обновление и гармония.',
    },
    {
        id: 'voda-mutnaya',
        symbolTag: 'voda',
        title: 'Грязная или мутная вода',
        description:
            'Смутные чувства, тревога, заблуждения, сомнительные интриги или эмоциональный застой.',
    },
    {
        id: 'voda-potok',
        symbolTag: 'voda',
        title: 'Бурный поток / наводнение',
        description:
            'Захлёстывающие эмоции, выходящие из-под контроля обстоятельства или сильная страсть.',
    },

    // --- ОГОНЬ (ogon) ---
    {
        id: 'ogon-ochag',
        symbolTag: 'ogon',
        title: 'Уютный огонь / свеча',
        description: 'Тепло, домашний очаг, вдохновение, безопасность и духовный свет.',
    },
    {
        id: 'ogon-pozhar',
        symbolTag: 'ogon',
        title: 'Разрушительный пожар',
        description:
            'Вспышка гнева, сильный стресс, эмоциональное выгорание или радикальная трансформация.',
    },

    // --- ЗМЕЯ (zmeya) ---
    {
        id: 'zmeya-ukus',
        symbolTag: 'zmeya',
        title: 'Укус змеи',
        description:
            'Неожиданное предательство, внезапный болезненный опыт или проявление скрытого негатива.',
    },
    {
        id: 'zmeya-spashhaja',
        symbolTag: 'zmeya',
        title: 'Свернувшаяся или спящая змея',
        description: 'Скрытый потенциал, затаившаяся мудрость или интуитивное предостережение.',
    },

    // --- ДОМ (dom) ---
    {
        id: 'dom-staryj',
        symbolTag: 'dom',
        title: 'Старый или заброшенный дом',
        description: 'Прошлый опыт, вытесненные воспоминания, устаревшие жизненные установки.',
    },
    {
        id: 'dom-novyj',
        symbolTag: 'dom',
        title: 'Новый или строящийся дом',
        description: 'Этап обновления личности, новые проекты, расширение возможностей.',
    },
    {
        id: 'dom-tawnaya-komnata',
        symbolTag: 'dom',
        title: 'Незнакомая / потайная комната',
        description: 'Открытие новых талантов, неосознанные грани характера или скрытые ресурсы.',
    },

    // --- ЗЕРКАЛО (zerkalo) ---
    {
        id: 'zerkalo-razbitoe',
        symbolTag: 'zerkalo',
        title: 'Разбитое зеркало',
        description: 'Кризис самоидентичности, крах иллюзий, искажённое восприятие себя.',
    },
    {
        id: 'zerkalo-chistoe',
        symbolTag: 'zerkalo',
        title: 'Отражение в зеркале',
        description:
            'Готовность взглянуть правде в глаза, анализ собственных поступков и самопознание.',
    },

    // --- ПОЛЁТ (polet) ---
    {
        id: 'polet-legkij',
        symbolTag: 'polet',
        title: 'Контролируемый лёгкий полёт',
        description: 'Освобождение от проблем, духовный и творческий подъём, уверенность в себе.',
    },
    {
        id: 'polet-tjazhelyj',
        symbolTag: 'polet',
        title: 'Полёт с трудом / падение с высоты',
        description:
            'Препятствия на пути к цели, неуверенность в своих силах, завышенные ожидания.',
    },

    // --- ДОРОГА (doroga) ---
    {
        id: 'doroga-pryamaya',
        symbolTag: 'doroga',
        title: 'Прямая и ровная дорога',
        description: 'Ясная жизненная цель, уверенное движение вперёд без серьезных препятствий.',
    },
    {
        id: 'doroga-razvilka',
        symbolTag: 'doroga',
        title: 'Перекрёсток / развилка',
        description: 'Необходимость сделать важный жизненный выбор, сомнения в правильности пути.',
    },
];
