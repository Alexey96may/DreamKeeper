import * as v from 'valibot';

export const SourceTypeSchema = v.picklist(
    ['custom', 'system', 'author', 'family', 'ai'],
    'Укажите корректный тип источника',
);

export const SourceCategorySchema = v.picklist(
    ['psychology', 'esoteric', 'personal', 'ai_analysis', 'cultural'],
    'Укажите корректную категорию',
);

export const SourceVisibilitySchema = v.picklist(
    ['private', 'shared', 'public'],
    'Укажите уровень приватности',
);

export const InterprSourceWriteSchema = v.object({
    id: v.optional(v.string()),
    title: v.pipe(v.string(), v.trim(), v.minLength(1, 'Название обязательно')),
    description: v.optional(v.string(), ''),
    rating: v.optional(v.number(), 5.0),
    type: SourceTypeSchema,
    category: SourceCategorySchema,

    authorId: v.optional(v.string()),
    authorName: v.optional(v.string()),
    ownerId: v.optional(v.string()),

    visibility: v.optional(SourceVisibilitySchema, 'private'),
    isEditable: v.optional(v.boolean(), true),

    // Оставляем без дефолтов вторым аргументом, чтобы сделать их optional в типе
    editorIds: v.optional(v.array(v.string())),
    readerIds: v.optional(v.array(v.string())),
    interpretationsCount: v.optional(v.number()),
    likesCount: v.optional(v.number()),

    usersCount: v.optional(v.number(), 0),
    iconName: v.optional(v.string()),
});

export const InterprSourceUpdateSchema = v.partial(InterprSourceWriteSchema);

export const InterprSourceSchema = v.object({
    ...InterprSourceWriteSchema.entries,
    id: v.pipe(v.string(), v.minLength(1)),
    createdAt: v.pipe(v.string(), v.isoDateTime()),
    updatedAt: v.pipe(v.string(), v.isoDateTime()),
});

export type InterprSourceWrite = v.InferOutput<typeof InterprSourceWriteSchema>;
export type InterprSourceUpdate = v.InferOutput<typeof InterprSourceUpdateSchema>;
