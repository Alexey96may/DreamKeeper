// src/store/modules/sleep.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { SleepRepository } from '@/services/repositories/SleepRepository';
import type { Dream } from '@/plugins/indexeddb';

export const useSleepStore = defineStore('sleep', () => {
    // ===== STATE =====
    const sleeps = ref<Dream[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<SleepRepository | null>(null);

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
        return sleeps.value.find((sleep: Dream | undefined) => sleep.id === id);
    };

    const getMonthStats = (year: number, month: number) => {
        const monthDreams = getDreamsByMonth(year, month);
        if (monthDreams.length === 0) return null;

        const total = monthDreams.length;
        const avgQuality = monthDreams.reduce((acc, s) => acc + (s.quality || 0), 0) / total;
        const types = monthDreams.reduce(
            (acc, s) => {
                const type = s.type || 'normal';
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

        const service = ServiceFactory.createService('indexeddb');
        await service.init();
        repository.value = new SleepRepository(service);
        await loadAll();
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

    const addDream = async (dreamData: Omit<Dream, 'id'>): Promise<Dream | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;

        try {
            const newDream = {
                ...dreamData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const id = await repository.value.create(newDream);
            const savedDream = await repository.value.getById(id);
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

        // Actions
        init,
        loadAll,
        addDream,
        updateDream,
        deleteDream,
    };
});
