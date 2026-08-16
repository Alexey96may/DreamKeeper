import * as v from 'valibot';
import { Dream } from '@/types/Dream';

// ==========================================
// 1. Enums / Enums Enums (Литеральные типы)
// ==========================================

export const TimeOfDaySchema = v.union(
    [
        v.literal('night'),
        v.literal('morning'),
        v.literal('day'),
        v.literal('evening'),
        v.literal('unknown'),
    ],
    'Выберите время суток из списка',
);

export const VisualStyleSchema = v.union(
    [
        v.literal('color'),
        v.literal('vivid'),
        v.literal('monochrome'),
        v.literal('blurred'),
        v.literal('dark'),
    ],
    'Выберите визуальный стиль из списка',
);

export const PerspectiveSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('first_person'),
        v.literal('third_person'),
        v.literal('shifting'),
    ],
    'Укажите корректную перспективу',
);

export const ParticipantRoleSchema = v.union(
    [
        v.literal('protagonist'),
        v.literal('observer'),
        v.literal('victim'),
        v.literal('shapeshifter'),
        v.literal('camera_operator'),
        v.literal('disembodied'),
    ],
    'Укажите корректную роль участника',
);

export const SensoryAspectSchema = v.union(
    [
        v.literal('sounds'),
        v.literal('smells'),
        v.literal('tactile'),
        v.literal('temperature'),
        v.literal('taste'),
        v.literal('pain'),
        v.literal('kinesthetic'),
        v.literal('breathing'),
        v.literal('speech_voice'),
        v.literal('vision_anomaly'),
    ],
    'Укажите корректное сенсорное ощущение',
);

// ==========================================
// 2. Вложенные сущности: Categories & Details
// ==========================================

export const DreamCategorySchema = v.union(
    [v.literal('lucid'), v.literal('nightmare'), v.literal('prophetic')],
    'Укажите допустимую категорию сна',
);

export const LucidTriggerSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('reality_check'),
        v.literal('anomaly'),
        v.literal('spontaneous'),
        v.literal('other'),
    ],
    'Выберите корректный триггер осознания',
);

export const LucidDetailsSchema = v.object({
    controlLevel: v.optional(
        v.pipe(
            v.number('Уровень контроля должен быть числом'),
            v.integer(),
            v.minValue(0, 'Минимум 0'),
            v.maxValue(10, 'Максимум 10'),
        ),
    ),
    trigger: v.optional(LucidTriggerSchema),
});

export const NightmareDetailsSchema = v.object({
    fearLevel: v.optional(
        v.pipe(
            v.number('Уровень страха должен быть числом'),
            v.integer(),
            v.minValue(0, 'Минимум 0'),
            v.maxValue(10, 'Максимум 10'),
        ),
    ),
    copingMechanism: v.optional(v.pipe(v.string(), v.trim())),
    hasPhysicalResponse: v.optional(v.boolean('Должно быть булевым значением')),
});

export const PropheticDetailsSchema = v.object({
    expectedByDate: v.optional(v.string('Дата должна быть строкой')),
    isFulfilled: v.optional(v.boolean('Должно быть булевым значением')),
    fulfilledDate: v.optional(v.string('Дата должна быть строкой')),
    fulfillmentNotes: v.optional(v.pipe(v.string(), v.trim())),
});

export const DreamCategoryDetailsSchema = v.object({
    lucid: v.optional(LucidDetailsSchema),
    nightmare: v.optional(NightmareDetailsSchema),
    prophetic: v.optional(PropheticDetailsSchema),
});

// ==========================================
// 3. Вложенные сущности: Phenomena & Details
// ==========================================

export const DreamPhenomenonSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('death'),
        v.literal('flying'),
        v.literal('falling'),
        v.literal('nested_dream'),
        v.literal('paralysis'),
    ],
    'Укажите корректный феномен сна',
);

export const ParalysisTimingSchema = v.union(
    [v.literal('falling_asleep'), v.literal('waking_up'), v.literal('irrelevant')],
    'Укажите корректное время паралича',
);

export const ParalysisHallucinationsSchema = v.union(
    [
        v.literal('auditory'),
        v.literal('visual'),
        v.literal('tactile'),
        v.literal('presence'),
        v.literal('other'),
    ],
    'Укажите корректный тип галлюцинации',
);

export const ParalysisDetailsSchema = v.object({
    timing: v.optional(ParalysisTimingSchema),
    hallucinations: v.optional(
        v.array(ParalysisHallucinationsSchema, 'Галлюцинации должны быть массивом'),
    ),
});

export const NestedDreamDetailsSchema = v.object({
    nestingLevels: v.optional(
        v.pipe(
            v.number('Уровень вложенности должен быть числом'),
            v.integer('Значение должно быть целым числом'),
            v.minValue(1, 'Минимум 1 уровень вложенности'),
        ),
    ),
});

export const DeathCauseSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('fall'),
        v.literal('attack_or_murder'),
        v.literal('disaster'),
        v.literal('execution'),
        v.literal('peaceful'),
        v.literal('natural'),
        v.literal('illness'),
        v.literal('accident'),
        v.literal('other'),
    ],
    'Укажите корректную причину смерти',
);

export const DeathAftermathSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('woke_up'),
        v.literal('became_ghost'),
        v.literal('reincarnated'),
        v.literal('black_void'),
        v.literal('scene_shift'),
    ],
    'Укажите корректное последствие смерти',
);

export const DeathDetailsSchema = v.object({
    cause: v.optional(DeathCauseSchema),
    aftermath: v.optional(DeathAftermathSchema),
});

export const FlyingTypeSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('effortless'),
        v.literal('swimming'),
        v.literal('apparatus'),
        v.literal('levitation'),
        v.literal('uncontrollable'),
    ],
    'Укажите корректный тип полета',
);

export const FlyingAltitudeSchema = v.union(
    [v.literal('irrelevant'), v.literal('low'), v.literal('cloud_level'), v.literal('space')],
    'Укажите корректную высоту полета',
);

export const FlyingDetailsSchema = v.object({
    type: v.optional(FlyingTypeSchema),
    altitude: v.optional(FlyingAltitudeSchema),
});

export const FallingOriginSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('building_or_cliff'),
        v.literal('sky_or_void'),
        v.literal('abyss'),
        v.literal('stumbling'),
    ],
    'Укажите корректный источник падения',
);

export const FallingOutcomeSchema = v.union(
    [
        v.literal('irrelevant'),
        v.literal('hypnic_jerk'),
        v.literal('landed_safe'),
        v.literal('impact'),
        v.literal('woke_before_impact'),
        v.literal('turned_into_flight'),
    ],
    'Укажите корректный исход падения',
);

export const FallingDetailsSchema = v.object({
    origin: v.optional(FallingOriginSchema),
    outcome: v.optional(FallingOutcomeSchema),
});

export const DreamPhenomenaDetailsSchema = v.object({
    paralysis: v.optional(ParalysisDetailsSchema),
    nestedDream: v.optional(NestedDreamDetailsSchema),
    death: v.optional(DeathDetailsSchema),
    flying: v.optional(FlyingDetailsSchema),
    falling: v.optional(FallingDetailsSchema),
});

// ==========================================
// 4. Вложенные сущности: Relations & Interpretations
// ==========================================

export const DreamInterpretationRefSchema = v.object({
    interpretationId: v.optional(v.number('ID интерпретации должен быть числом')),
    tag: v.pipe(
        v.string('Тег должен быть строкой'),
        v.trim(),
        v.nonEmpty('Тег не может быть пустым'),
    ),
    meaning: v.pipe(v.string('Значение должно быть строкой'), v.trim()),
    sourceId: v.pipe(v.number('Источник должен быть числом')),
    isAccurate: v.optional(v.nullable(v.boolean('Значение должно быть булевым'))),
});

export const DreamRelationTypeSchema = v.union(
    [
        v.literal('recurring_instance'),
        v.literal('continuation'),
        v.literal('prequel'),
        v.literal('similar_theme'),
        v.literal('same_location'),
        v.literal('reference'),
    ],
    'Укажите корректный тип связи снов',
);

export const RelatedDreamRefSchema = v.object({
    dreamId: v.optional(v.number('ID связанного сна должен быть числом')),
    relationType: DreamRelationTypeSchema,
    note: v.optional(v.pipe(v.string('Заметка должна быть строкой'), v.trim())),
});

// ==========================================
// 5. Главные схемы записи (DreamWrite) и чтения (Dream)
// ==========================================

// Оценка (1-10) для reusable-валидации
const ScoreSchema = v.optional(
    v.pipe(
        v.number('Оценка должна быть числом'),
        v.integer('Оценка должна быть целым числом'),
        v.minValue(0, 'Минимальная оценка — 0'),
        v.maxValue(10, 'Максимальная оценка — 10'),
    ),
);

export const DreamWriteSchema = v.object({
    // Обязательные MVP поля
    title: v.pipe(
        v.string('Заголовок должен быть строкой'),
        v.trim(),
        v.nonEmpty('Введите заголовок сна'),
        v.minLength(3, 'Заголовок должен быть не короче 3 символов'),
    ),
    date: v.pipe(
        v.string('Дата должна быть строкой'),
        v.nonEmpty('Укажите дату сна'),
        v.isoDateTimeSecond('Дата должна быть в формате YYYY-MM-DDTHH:mm:ss'),
        v.check((dateStr) => {
            const date = new Date(dateStr);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            return date <= todayEnd;
        }, 'Дата не может быть в будущем'),
    ),
    description: v.pipe(
        v.string('Описание должно быть строкой'),
        v.trim(),
        v.nonEmpty('Введите описание сна'),
        v.minLength(3, 'Описание сна должно быть не короче 3 символов'),
    ),

    categories: v.array(DreamCategorySchema, 'Категории должны быть массивом'),
    categoryDetails: v.optional(DreamCategoryDetailsSchema),

    phenomena: v.optional(v.array(DreamPhenomenonSchema, 'Феномены должны быть массивом')),
    phenomenaDetails: v.optional(DreamPhenomenaDetailsSchema),

    // Оценки
    quality: ScoreSchema,
    clarity: ScoreSchema,
    moodAfter: ScoreSchema,

    // Свойства сна
    timeOfDay: v.optional(TimeOfDaySchema),
    visualStyle: v.optional(VisualStyleSchema),
    perspective: v.optional(PerspectiveSchema),
    roles: v.optional(v.array(ParticipantRoleSchema, 'Роли должны быть массивом')),
    sensations: v.optional(v.array(SensoryAspectSchema, 'Ощущения должны быть массивом')),

    // Аналитика
    characters: v.optional(v.array(v.pipe(v.string('Персонаж должен быть строкой'), v.trim()))),
    locations: v.optional(v.array(v.pipe(v.string('Локация должна быть строкой'), v.trim()))),
    objects: v.optional(v.array(v.pipe(v.string('Предмет должен быть строкой'), v.trim()))),
    emotions: v.optional(v.array(v.pipe(v.string('Эмоция должна быть строкой'), v.trim()))),

    // Интерпретация и связи
    interpretations: v.optional(
        v.array(DreamInterpretationRefSchema, 'Интерпретации должны быть массивом'),
    ),
    personalNotes: v.optional(v.pipe(v.string('Заметки должны быть строкой'), v.trim())),
    relatedDreams: v.optional(v.array(RelatedDreamRefSchema, 'Связанные сны должны быть массивом')),
    PreSleepContext: v.optional(v.pipe(v.string('Контекст должен быть строкой'), v.trim())),

    // Флаги
    isFavorite: v.optional(v.boolean('Флаг должен быть булевым значением')),
    isPinned: v.optional(v.boolean('Флаг должен быть булевым значением')),
    isArchived: v.optional(v.boolean('Флаг должен быть булевым значением')),
    isDeleted: v.optional(v.boolean('Флаг должен быть булевым значением')),
    isDraft: v.optional(v.boolean('Флаг должен быть булевым значением')),
    isPrivate: v.optional(v.boolean('Флаг должен быть булевым значением')),
});

// Частичная схема для вызова updateDream в сторе
export const DreamUpdateSchema = v.partial(DreamWriteSchema);

// Полная схема сна с id, slug, createdAt, updatedAt
export const DreamSchema: v.BaseSchema<unknown, Dream, v.BaseIssue<unknown>> = v.object({
    ...DreamWriteSchema.entries,
    id: v.number('ID должен быть числом'),
    slug: v.string('Слаг должен быть строкой'),
    createdAt: v.string('Дата создания должна быть строкой'),
    updatedAt: v.string('Дата обновления должна быть строкой'),
});
