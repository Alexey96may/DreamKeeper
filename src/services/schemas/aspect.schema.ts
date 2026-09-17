import * as v from 'valibot';

export const AspectWriteSchema = v.object({
    id: v.optional(v.pipe(v.string(), v.trim())), // Опционален при записи, если генерируется автоматически
    symbolTag: v.pipe(v.string(), v.minLength(1, 'Тег символа обязателен')),
    title: v.pipe(v.string(), v.trim(), v.minLength(1, 'Название контекста обязательно')),
    description: v.optional(v.pipe(v.string(), v.trim())),
});

export const AspectUpdateSchema = v.partial(AspectWriteSchema);

export const DreamAspectSchema = v.object({
    ...AspectWriteSchema.entries,
    id: v.pipe(v.string(), v.minLength(1, 'Идентификатор аспекта обязателен')),
    createdAt: v.optional(v.pipe(v.string(), v.isoDateTime())),
    updatedAt: v.optional(v.pipe(v.string(), v.isoDateTime())),
});

export type AspectWrite = v.InferOutput<typeof AspectWriteSchema>;
export type AspectUpdate = v.InferOutput<typeof AspectUpdateSchema>;
