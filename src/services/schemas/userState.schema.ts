import * as v from 'valibot';
import type { UserState } from '@/types/UserState';
import { isPastOrPresentDay } from '@/utils/date';

const RangeSchema = v.optional(
    v.pipe(
        v.number('Оценка должна быть числом'),
        v.integer('Оценка должна быть целым числом'),
        v.minValue(0, 'Минимальная оценка — 0'),
        v.maxValue(10, 'Максимальная оценка — 10'),
    ),
);

const RequiredRangeSchema = v.optional(
    v.pipe(
        v.number('Оценка должна быть числом'),
        v.integer('Оценка должна быть целым числом'),
        v.minValue(1, 'Минимальная оценка — 1'),
        v.maxValue(10, 'Максимальная оценка — 10'),
    ),
);

export const UserStateWriteSchema = v.object({
    date: v.pipe(
        v.string('Дата должна быть строкой'),
        v.nonEmpty('Укажите дату сна'),
        v.isoDate('Дата должна быть в формате YYYY-MM-DD'),
        v.check((dateStr) => {
            return isPastOrPresentDay(dateStr);
        }, 'Дата не может быть в будущем'),
    ),

    mood: RequiredRangeSchema,
    energy: RangeSchema,
    productivity: RangeSchema,
    stress: RangeSchema,
    focus: RangeSchema,

    notes: v.optional(
        v.pipe(
            v.string('Описание должно быть строкой'),
            v.trim(),
            v.minLength(3, 'Описание сна должно быть не короче 3 символов'),
        ),
    ),
});

// Частичная схема для вызова updateDream в сторе
export const UserStateUpdateSchema = v.partial(UserStateWriteSchema);

// Полная схема сна с id, createdAt, updatedAt
export const UserStateSchema: v.BaseSchema<unknown, UserState, v.BaseIssue<unknown>> = v.object({
    ...UserStateWriteSchema.entries,
    id: v.number('ID должен быть числом'),
    createdAt: v.string('Дата создания должна быть строкой'),
    updatedAt: v.string('Дата обновления должна быть строкой'),
});
