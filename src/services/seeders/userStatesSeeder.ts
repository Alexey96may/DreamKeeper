import type { UserState } from '@/types/UserState';

const sampleNotes = [
    'Отличное утро, выспался после осознанного сна.',
    'Устал на работе, высокая нагрузка и многозадачность.',
    'Тревожный сон, тяжело проснулся с утра.',
    'Продуктивный день, закрыл все основные задачи по проекту.',
    'Было трудно сфокусироваться, погода сильно влияла на тонус.',
    'Спокойный день, занимался хобби, чтением и прогулкой.',
    'Ночной кошмар немного повлиял на утренний уровень энергии.',
    'Высокая продуктивность, приток творческого вдохновения.',
    'Недосып из-за поздней работы, чувствовал себя разбитым.',
    'Отличный баланс работы и отдыха, стабильное состояние.',
    'Много физической активности, приятная усталость по вечер.',
    'День размышлений и планирования будущих задач.',
];

/**
 * Генератор расширенного набора сидер-данных для состояний пользователя
 * @param count Количество дней для генерации (по умолчанию 60)
 */
export function generateUserStates(count: number = 60): UserState[] {
    const states: UserState[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const dateObj = new Date(today);

        dateObj.setDate(today.getDate() - i);
        const dateStr = dateObj.toISOString().split('T')[0];

        // Псевдослучайные, но реалистичные значения метрик (от 1 до 10)
        const mood = Math.min(10, Math.max(1, Math.floor(Math.random() * 5) + 6));
        const energy = Math.min(10, Math.max(1, Math.floor(Math.random() * 6) + 4));
        const productivity = Math.min(10, Math.max(1, Math.floor(Math.random() * 7) + 3));
        const stress = Math.min(10, Math.max(1, Math.floor(Math.random() * 7) + 1));
        const focus = Math.min(10, Math.max(1, Math.floor(Math.random() * 6) + 4));

        const hasNote = Math.random() > 0.3;
        const notes = hasNote
            ? sampleNotes[Math.floor(Math.random() * sampleNotes.length)]
            : undefined;

        const timestamp = new Date(dateObj.setHours(8, 0, 0, 0)).toISOString();

        states.push({
            id: i + 1,
            date: dateStr,
            mood,
            energy,
            productivity,
            stress,
            focus,
            notes,
            createdAt: timestamp,
            updatedAt: timestamp,
        });
    }

    return states;
}

export const userStatesSeed: UserState[] = generateUserStates(60);
