import type { InterpretationWrite } from '@/services/schemas/interpretation.schema';

export const initialInterpretationsSeed: (InterpretationWrite & { id: string })[] = [
    // ==========================================
    // ВОДА (voda)
    // ==========================================
    {
        id: 'interp-voda-miller-clean',
        symbolTag: 'voda',
        sourceId: 'miller',
        aspectId: 'voda-chistaya',
        meanings: [
            'Чистая и прозрачная вода сулит радость, финансовое благополучие и получение приятных известий.',
            'Пить чистую воду — к исполнению самых смелых надежд и укреплению здоровья.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-voda-miller-dirty',
        symbolTag: 'voda',
        sourceId: 'miller',
        aspectId: 'voda-mutnaya',
        meanings: [
            'Грязная или мутная вода предупреждает об опасности, печали и вероятных ошибках в суждениях.',
            'Упасть в мутную воду — знак того, что вы совершите горькие ошибки, о которых будете сожалеть.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-voda-freud-general',
        symbolTag: 'voda',
        sourceId: 'freud',
        aspectId: null,
        meanings: [
            'Символизирует зачатие, процесс рождения и сексуальное влечение.',
            'Погружение в воду или купание отражает подсознательное желание иметь детей или вернуться в материнскую утробу.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-voda-jung-stream',
        symbolTag: 'voda',
        sourceId: 'jung',
        aspectId: 'voda-potok',
        meanings: [
            'Бурный поток символизирует вторжение неосознанных психических сил, угрожающих захлестнуть Эго.',
            'Необходимость пройти через очищающий катарсис и принять свои скрытые эмоции.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-voda-vanga-clean',
        symbolTag: 'voda',
        sourceId: 'vanga',
        aspectId: 'voda-chistaya',
        meanings: ['Знамение обновления, прощения прошлых грехов и душевного очищения.'],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-voda-veles-dirty',
        symbolTag: 'voda',
        sourceId: 'veles',
        aspectId: 'voda-mutnaya',
        meanings: ['К болезни, сплетням за спиной или бытовым ссорам с близкими.'],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // ОГОНЬ (ogon)
    // ==========================================
    {
        id: 'interp-ogon-miller-hearth',
        symbolTag: 'ogon',
        sourceId: 'miller',
        aspectId: 'ogon-ochag',
        meanings: ['Уютный огонь в очаге сулит долгожданный мир в доме, гармонию в семье и тепло.'],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-ogon-freud-general',
        symbolTag: 'ogon',
        sourceId: 'freud',
        aspectId: null,
        meanings: ['Символ вырывающейся из-под контроля пылкой страсти и полового влечения.'],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-ogon-jung-fire',
        symbolTag: 'ogon',
        sourceId: 'jung',
        aspectId: 'ogon-pozhar',
        meanings: [
            'Огонь как сила трансмутации: уничтожение устаревших установок для высвобождения новой психической энергии.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-ogon-vanga-fire',
        symbolTag: 'ogon',
        sourceId: 'vanga',
        aspectId: 'ogon-pozhar',
        meanings: [
            'Предупреждение о суровых испытаниях, конфликтах или кардинальных переменах в жизни.',
        ],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // ЗМЕЯ (zmeya)
    // ==========================================
    {
        id: 'interp-zmeya-freud-general',
        symbolTag: 'zmeya',
        sourceId: 'freud',
        aspectId: null,
        meanings: [
            'Фаллический символ. Олицетворяет сексуальную силу, страх перед интимностью или искушение.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-zmeya-jung-sleeping',
        symbolTag: 'zmeya',
        sourceId: 'jung',
        aspectId: 'zmeya-spashhaja',
        meanings: [
            'Архетип глубинной древней мудрости и автономной нервной системы.',
            'Предупреждение интуиции о процессах, происходящих в бессознательном.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-zmeya-miller-bite',
        symbolTag: 'zmeya',
        sourceId: 'miller',
        aspectId: 'zmeya-ukus',
        meanings: [
            'Вы поддадитесь злым проискам, а тайные враги попытаются навредить вашей репутации.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-zmeya-aesop-general',
        symbolTag: 'zmeya',
        sourceId: 'aesop',
        aspectId: null,
        meanings: [
            'Символ коварства и неблагодарности («пригреть змею на груди»). Опасайтесь предательства.',
        ],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // ДОМ (dom)
    // ==========================================
    {
        id: 'interp-dom-loff-new',
        symbolTag: 'dom',
        sourceId: 'loff',
        aspectId: 'dom-novyj',
        meanings: [
            'Отражает перестройку жизненных приоритетов, стремление к безопасности и перемены в самовосприятии.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-dom-freud-secret-room',
        symbolTag: 'dom',
        sourceId: 'freud',
        aspectId: 'dom-tawnaya-komnata',
        meanings: [
            'Скрытые сексуальные фантазии или вытесненные воспоминания, к которым начинает открываться доступ.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-dom-jung-old',
        symbolTag: 'dom',
        sourceId: 'jung',
        aspectId: 'dom-staryj',
        meanings: [
            'Обращение к архаичным пластам личности, незавершённым детским комплексам и заброшенным частям Эго.',
        ],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // ЗЕРКАЛО (zerkalo)
    // ==========================================
    {
        id: 'interp-zerkalo-aesop-broken',
        symbolTag: 'zerkalo',
        sourceId: 'aesop',
        aspectId: 'zerkalo-razbitoe',
        meanings: [
            'Крах надежд, период душевного смятения и неприятностей («семь лет несчастий»).',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-zerkalo-jung-clean',
        symbolTag: 'zerkalo',
        sourceId: 'jung',
        aspectId: 'zerkalo-chistoe',
        meanings: [
            'Встреча со своей Тенью и истинным «Я». Отражение объективной реальности без эго-иллюзий.',
        ],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // ПОЛЁТ (polet)
    // ==========================================
    {
        id: 'interp-polet-loff-easy',
        symbolTag: 'polet',
        sourceId: 'loff',
        aspectId: 'polet-legkij',
        meanings: [
            'Чувство контроля над своей жизнью, разрешение давних трудностей и высокий эмоциональный ресурс.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-polet-miller-hard',
        symbolTag: 'polet',
        sourceId: 'miller',
        aspectId: 'polet-tjazhelyj',
        meanings: [
            'Предвещает трудности в делах, временную неуверенность в своих силах или семейные разногласия.',
        ],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // ДОРОГА (doroga)
    // ==========================================
    {
        id: 'interp-doroga-veles-straight',
        symbolTag: 'doroga',
        sourceId: 'veles',
        aspectId: 'doroga-pryamaya',
        meanings: ['Удача в делах, легкая жизнь и быстрое достижение поставленных целей.'],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-doroga-loff-fork',
        symbolTag: 'doroga',
        sourceId: 'loff',
        aspectId: 'doroga-razvilka',
        meanings: [
            'Символ экзистенциального выбора. Необходимость принять важное решение вопреки сомнениям.',
        ],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // СМЕРТЬ (smerth)
    // ==========================================
    {
        id: 'interp-smerth-jung-general',
        symbolTag: 'smerth',
        sourceId: 'jung',
        aspectId: null,
        meanings: [
            'Символическое умирание старой структуры Эго ради рождения обновленной личности (этап индивидуации).',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-smerth-vanga-general',
        symbolTag: 'smerth',
        sourceId: 'vanga',
        aspectId: null,
        meanings: [
            'Знамение долгой жизни для того, кто приснился мёртвым, либо знак кардинальной трансформации судьбы.',
        ],
        isCustom: false,
        isVerified: true,
    },

    // ==========================================
    // КЛЮЧ (klyuch)
    // ==========================================
    {
        id: 'interp-klyuch-aesop-general',
        symbolTag: 'klyuch',
        sourceId: 'aesop',
        aspectId: null,
        meanings: [
            'Нахождение ответа на запутанную задачу («ключ к разгадке») или обретение доверия.',
        ],
        isCustom: false,
        isVerified: true,
    },
    {
        id: 'interp-klyuch-freud-general',
        symbolTag: 'klyuch',
        sourceId: 'freud',
        aspectId: null,
        meanings: [
            'Мужской фаллический символ. Поиск ключа к замку отражает желание решить психосексуальный конфликт.',
        ],
        isCustom: false,
        isVerified: true,
    },
];
