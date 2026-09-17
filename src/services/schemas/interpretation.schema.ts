import * as v from 'valibot';

export const InterpretationWriteSchema = v.object({
    symbolTag: v.pipe(v.string(), v.minLength(1, 'Тег символа обязателен')),
    sourceId: v.pipe(v.string(), v.minLength(1, 'Идентификатор источника обязателен')),
    aspectId: v.optional(v.nullable(v.string()), null),
    meanings: v.pipe(
        v.array(
            v.pipe(v.string(), v.trim(), v.minLength(1, 'Текст толкования не может быть пустым')),
        ),
        v.minLength(1, 'Укажите хотя бы одно значение толкования'),
    ),
    isCustom: v.optional(v.boolean(), true),
    isVerified: v.optional(v.boolean()),
});

export const InterpretationUpdateSchema = v.partial(InterpretationWriteSchema);

export const InterpretationSchema = v.object({
    ...InterpretationWriteSchema.entries,
    id: v.pipe(v.string(), v.minLength(1)),
    createdAt: v.pipe(v.string(), v.isoDateTime('Некорректный формат ISO даты')),
    updatedAt: v.optional(v.pipe(v.string(), v.isoDateTime())),
});

export type InterpretationWrite = v.InferOutput<typeof InterpretationWriteSchema>;
export type InterpretationUpdate = v.InferOutput<typeof InterpretationUpdateSchema>;
