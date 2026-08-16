import * as v from 'valibot';

export const SourceTypeSchema = v.picklist(['custom', 'system', 'author', 'ai']);
export const SourceCategorySchema = v.picklist([
    'psychology',
    'esoteric',
    'personal',
    'ai_analysis',
    'cultural',
]);
export const SourceVisibilitySchema = v.picklist(['private', 'shared', 'public']);

export const InterprSourceWriteSchema = v.object({
    title: v.pipe(
        v.string('Заголовок должен быть строкой'),
        v.nonEmpty('Укажите название источника'),
        v.maxLength(100, 'Название слишком длинное'),
    ),
    description: v.pipe(
        v.string('Описание должно быть строкой'),
        v.maxLength(1000, 'Описание слишком длинное'),
    ),
    rating: v.optional(
        v.pipe(
            v.number('Рейтинг должен быть числом'),
            v.minValue(1, 'Минимальный рейтинг: 1'),
            v.maxValue(5, 'Максимальный рейтинг: 5'),
        ),
    ),
    type: SourceTypeSchema,
    category: SourceCategorySchema,
    authorId: v.optional(v.string()),
    authorName: v.optional(v.string()),
    ownerId: v.optional(v.string()),
    visibility: v.optional(SourceVisibilitySchema),
    isEditable: v.optional(v.boolean()),
    editorIds: v.optional(v.array(v.string())),
    readerIds: v.optional(v.array(v.string())),
    usersCount: v.optional(v.number()),
    interpretationsCount: v.optional(v.number()),
    likesCount: v.optional(v.number()),
    iconName: v.optional(v.string()),
});

export const InterprSourceUpdateSchema = v.partial(InterprSourceWriteSchema);

export type InterprSourceWrite = v.InferOutput<typeof InterprSourceWriteSchema>;
