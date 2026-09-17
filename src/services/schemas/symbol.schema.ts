import * as v from 'valibot';

export const SymbolCategorySchema = v.picklist(
    ['character', 'location', 'object', 'action', 'nature', 'abstract'],
    'Укажите корректную категорию',
);

export const SymbolWriteSchema = v.object({
    title: v.pipe(v.string(), v.trim(), v.minLength(1, 'Название символа обязательно')),
    category: SymbolCategorySchema,
    tag: v.optional(v.pipe(v.string(), v.trim())),
    description: v.optional(v.pipe(v.string(), v.trim())),
});

export const SymbolUpdateSchema = v.partial(SymbolWriteSchema);

export const DreamSymbolSchema = v.object({
    ...SymbolWriteSchema.entries,
    tag: v.pipe(v.string(), v.minLength(1, 'Тег обязателен')),
    createdAt: v.optional(v.pipe(v.string(), v.isoDateTime())),
    updatedAt: v.optional(v.pipe(v.string(), v.isoDateTime())),
});

export type SymbolWrite = v.InferOutput<typeof SymbolWriteSchema>;
export type SymbolUpdate = v.InferOutput<typeof SymbolUpdateSchema>;
