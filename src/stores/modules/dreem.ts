import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { Dream, DreamWrite } from '@/types/Dream';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { DreamRepository } from '@/services/repositories/DreamRepository';
import { initialDreamsSeed } from '@/services/seeders/dreamSeeder';

export const useSleepStore = defineStore('sleep', () => {
    // ===== STATE =====
    const sleeps = ref<Dream[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<DreamRepository | null>(null);

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

    const addDream = async (dreamData: DreamWrite): Promise<Dream | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;

        try {
            // Репозиторий сам подготавливает id, slug, createdAt, updatedAt и сохраняет
            const savedDream = await repository.value.create(dreamData);

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

    const updateDream = async (id: number, dreamData: Partial<Dream>): Promise<Dream | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;

        try {
            const updated = {
                ...dreamData,
                updatedAt: new Date().toISOString(),
            };
            await repository.value.update(id, updated);

            const index = sleeps.value.findIndex((s: Dream) => s.id === id);
            if (index !== -1) {
                sleeps.value[index] = { ...sleeps.value[index], ...updated };
                return sleeps.value[index];
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

    return {
        // State
        sleeps,
        loading,
        error,

        // Getters
        totalDreams,
        averageQuality,
        getDreamsByDate,
        getDreamsByMonth,
        getDreamById,
        getMonthStats,
        getDreamsByQuality,
        getDreamBySlug,

        // Actions
        init,
        loadAll,
        addDream,
        updateDream,
        deleteDream,
    };
});
