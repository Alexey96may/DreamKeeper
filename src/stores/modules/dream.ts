import { computed, ref } from 'vue';

import { defineStore } from 'pinia';
import * as v from 'valibot';
import { DreamWriteSchema, DreamUpdateSchema } from '@/services/schemas/dream.schema';

import type { Dream, DreamWrite } from '@/types/Dream';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { DreamRepository } from '@/services/repositories/DreamRepository';
import { initialDreamsSeed } from '@/services/seeders/dreamSeeder';

export const useSleepStore = defineStore('sleep', () => {
    // ===== STATE =====
    const sleeps = ref<Dream[]>([]); //todo dreams
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<DreamRepository | null>(null);

    const validationErrors = ref<Record<string, string>>({});

    // ===== GETTERS =====
    const totalDreams = computed(() => sleeps.value.length);

    const averageQuality = computed(() => {
        if (sleeps.value.length === 0) return 0;
        const sum = sleeps.value.reduce((acc, s) => acc + (s.quality || 0), 0);
        return Number((sum / sleeps.value.length).toFixed(1));
    });

    const getDreamsByDate = (date: string): Dream[] => {
        return sleeps.value.filter((sleep: Dream) => sleep.date === date);
    };

    const getDreamsByMonth = (year: number, month: number): Dream[] => {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        return sleeps.value.filter((sleep: Dream) => sleep.date.startsWith(monthStr));
    };

    const getDreamById = (id: number): Dream | undefined => {
        return sleeps.value.find((sleep: Dream) => sleep.id === id);
    };

    /**
     * Получение сна по slug.
     * Сначала ищет в локальном реактивном состоянии,
     * а при отсутствии — запрашивает через репозиторий.
     */
    const getDreamBySlug = async (slug: string): Promise<Dream | null> => {
        // 1. Быстрый поиск в уже загруженном реактивном массиве
        const localDream = sleeps.value.find((s) => s.slug === slug);
        if (localDream) {
            return localDream;
        }

        // 2. Если в памяти нет, но репозиторий готов — ищем в IndexedDB
        if (repository.value) {
            loading.value = true;
            try {
                const fetchedDream = await repository.value.getBySlug(slug);
                if (fetchedDream) {
                    // Синхронизируем с локальным состоянием, если его там не было
                    const exists = sleeps.value.some((s) => s.id === fetchedDream.id);
                    if (!exists) {
                        sleeps.value.push(fetchedDream);
                    }
                    return fetchedDream;
                }
            } catch (err) {
                console.error(`Ошибка при получении сна по slug (${slug}):`, err);
            } finally {
                loading.value = false;
            }
        }

        return null;
    };

    const getMonthStats = (year: number, month: number) => {
        const monthDreams = getDreamsByMonth(year, month);
        if (monthDreams.length === 0) return null;

        const total = monthDreams.length;
        const avgQuality = monthDreams.reduce((acc, s) => acc + (s.quality || 0), 0) / total;

        //TODO
        const types = monthDreams.reduce(
            (acc, s) => {
                const type = s?.type || 'normal';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return {
            total,
            avgQuality: Number(avgQuality.toFixed(1)),
            types,
            dreams: monthDreams,
        };
    };

    const getError = (key: string) => validationErrors.value[key];
    const hasError = (key: string) => Boolean(validationErrors.value[key]);

    // ===== ACTIONS =====
    const init = async () => {
        if (repository.value) return;

        loading.value = true;
        error.value = null;

        try {
            // 1. Инициализируем сервис и репозиторий
            const dataService = ServiceFactory.createService('indexeddb');
            await dataService.init();
            repository.value = new DreamRepository(dataService);

            // 2. Достаем имеющиеся сны
            let allDreams = await repository.value.getAll();

            // 3. СИДЕР: Пакетная вставка, если БД пустая
            if (allDreams.length === 0) {
                // Запускаем все вставки параллельно (или используем bulkAdd, если поддерживается)
                await Promise.all(
                    initialDreamsSeed.map((seedData) => repository.value!.create(seedData)),
                );

                // Запрашиваем итоговый массив
                allDreams = await repository.value.getAll();
            }

            sleeps.value = allDreams;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка инициализации';
            console.error('Ошибка инициализации стора снов:', err);
        } finally {
            loading.value = false;
        }
    };

    const loadAll = async () => {
        if (!repository.value) return;

        loading.value = true;
        error.value = null;

        try {
            const data = await repository.value.getAll();
            sleeps.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка загрузки снов';
            console.error('Failed to load dreams:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Добавление сна с валидацией
     */
    const addDream = async (dreamData: DreamWrite): Promise<Dream | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        // 1. Валидация входных данных
        const validation = v.safeParse(DreamWriteSchema, dreamData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            // 2. Репозиторий создает запись и возвращает готовый Dream (с id, slug, createdAt, updatedAt)
            const savedDream = await repository.value.create(validation.output);

            if (savedDream) {
                sleeps.value.push(savedDream);
            }
            return savedDream || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка создания сна';
            console.error('Failed to add dream:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Частичное обновление сна с валидацией
     */
    const updateDream = async (
        id: number,
        dreamData: Partial<DreamWrite>,
    ): Promise<Dream | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        // 1. Валидируем только переданные частичные данные
        const validation = v.safeParse(DreamUpdateSchema, dreamData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            // 2. Репозиторий возвращает полностью обновленный объект Dream (с новым slug и updatedAt)
            const updatedDream = await repository.value.update(id, validation.output);

            // 3. Обновляем локальное состояние стора целиком из базы
            if (updatedDream) {
                const index = sleeps.value.findIndex((s) => s.id === id);
                if (index !== -1) {
                    sleeps.value[index] = updatedDream;
                }
                return updatedDream;
            }

            return null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка обновления сна';
            console.error('Failed to update dream:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteDream = async (id: number): Promise<boolean> => {
        if (!repository.value) return false;

        loading.value = true;
        error.value = null;

        try {
            await repository.value.delete(id);
            sleeps.value = sleeps.value.filter((s: Dream) => s.id !== id);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка удаления сна';
            console.error('Failed to delete dream:', err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const getDreamsByQuality = (minQuality: number): Dream[] => {
        return sleeps.value.filter((sleep: Dream) => (sleep.quality || 0) >= minQuality);
    };

    /**
     * Преобразует массив ошибок Valibot в объект формата { [path]: message }
     */
    const extractErrors = (issues: v.GenericIssue[]): Record<string, string> => {
        const fieldErrors: Record<string, string> = {};

        for (const issue of issues) {
            // 1. Собираем полный путь ключа через точку (например, "categoryDetails.lucid.controlLevel")
            if (issue.path && issue.path.length > 0) {
                const pathKey = issue.path
                    .map((item) => item.key)
                    .filter((key) => key !== undefined && key !== null)
                    .join('.');

                // Записываем только первую встреченную ошибку для конкретного поля
                if (pathKey && !fieldErrors[pathKey]) {
                    fieldErrors[pathKey] = issue.message;
                }
            } else {
                // 2. Если ошибка общая (не привязана к конкретному полю объекта)
                if (!fieldErrors['_global']) {
                    fieldErrors['_global'] = issue.message;
                }
            }
        }

        return fieldErrors;
    };

    const clearError = (field: keyof typeof validationErrors.value) => {
        if (validationErrors.value[field]) {
            delete validationErrors.value[field];
        }
    };

    return {
        // State
        sleeps,
        loading,
        error,
        validationErrors,

        // Getters
        totalDreams,
        averageQuality,
        getDreamsByDate,
        getDreamsByMonth,
        getDreamById,
        getMonthStats,
        getDreamsByQuality,
        getDreamBySlug,
        getError,
        hasError,

        // Actions
        init,
        loadAll,
        addDream,
        updateDream,
        deleteDream,
        clearError,
    };
});
