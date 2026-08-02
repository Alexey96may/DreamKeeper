// src/store/modules/userState.ts
import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { UserState } from '@/types/UserState';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { UserStateRepository } from '@/services/repositories/UserStateRepository';

export const useUserStateStore = defineStore('userState', () => {
    // ===== STATE =====
    const states = ref<UserState[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<UserStateRepository | null>(null);

    // ===== GETTERS =====
    const totalStates = computed(() => states.value.length);

    const getStateByDate = (date: string): UserState | undefined => {
        return states.value.find((state) => state.date === date);
    };

    const getStatesByMonth = (year: number, month: number): UserState[] => {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        return states.value.filter((state) => state.date.startsWith(monthStr));
    };

    const getAverageMood = (): number => {
        const withMood = states.value.filter((s) => s.mood !== undefined);
        if (withMood.length === 0) return 0;
        const sum = withMood.reduce((acc, s) => acc + (s.mood || 0), 0);
        return Number((sum / withMood.length).toFixed(1));
    };

    const getAverageEnergy = (): number => {
        const withEnergy = states.value.filter((s) => s.energy !== undefined);
        if (withEnergy.length === 0) return 0;
        const sum = withEnergy.reduce((acc, s) => acc + (s.energy || 0), 0);
        return Number((sum / withEnergy.length).toFixed(1));
    };

    const getMonthStats = (year: number, month: number) => {
        const monthStates = getStatesByMonth(year, month);
        if (monthStates.length === 0) return null;

        const total = monthStates.length;
        const avgMood = monthStates.reduce((acc, s) => acc + (s.mood || 0), 0) / total;
        const avgEnergy = monthStates.reduce((acc, s) => acc + (s.energy || 0), 0) / total;
        const avgFocus = monthStates.reduce((acc, s) => acc + (s.focus || 0), 0) / total;

        return {
            total,
            avgMood: Number(avgMood.toFixed(1)),
            avgEnergy: Number(avgEnergy.toFixed(1)),
            avgFocus: Number(avgFocus.toFixed(1)),
        };
    };

    // ===== ACTIONS =====
    const init = async () => {
        if (repository.value) return;

        const service = ServiceFactory.createService('indexeddb');
        await service.init();
        repository.value = new UserStateRepository(service);
        await loadAll();
    };

    const loadAll = async () => {
        if (!repository.value) return;

        loading.value = true;
        error.value = null;

        try {
            const data = await repository.value.getAll();
            states.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка загрузки состояний';
            console.error('Failed to load states:', err);
        } finally {
            loading.value = false;
        }
    };

    const addState = async (stateData: Omit<UserState, 'id'>): Promise<UserState | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;

        try {
            const newState = {
                ...stateData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const id = await repository.value.create(newState);
            const savedState = await repository.value.getById(id);
            if (savedState) {
                states.value.push(savedState);
            }
            return savedState || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка создания состояния';
            console.error('Failed to add state:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateState = async (
        id: number,
        stateData: Partial<UserState>,
    ): Promise<UserState | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;

        try {
            const updated = {
                ...stateData,
                updatedAt: new Date().toISOString(),
            };
            await repository.value.update(id, updated);

            const index = states.value.findIndex((s) => s.id === id);
            if (index !== -1) {
                states.value[index] = { ...states.value[index], ...updated };
                return states.value[index];
            }
            return null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка обновления состояния';
            console.error('Failed to update state:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteState = async (id: number): Promise<boolean> => {
        if (!repository.value) return false;

        loading.value = true;
        error.value = null;

        try {
            await repository.value.delete(id);
            states.value = states.value.filter((s) => s.id !== id);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка удаления состояния';
            console.error('Failed to delete state:', err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const updateOrCreateState = async (
        date: string,
        data: Partial<UserState>,
    ): Promise<UserState | null> => {
        const existing = getStateByDate(date);
        if (existing?.id) {
            return updateState(existing.id, { ...data, date });
        } else {
            return addState({ ...data, date } as Omit<UserState, 'id'>);
        }
    };

    return {
        // State
        states,
        loading,
        error,

        // Getters
        totalStates,
        getStateByDate,
        getStatesByMonth,
        getAverageMood,
        getAverageEnergy,
        getMonthStats,

        // Actions
        init,
        loadAll,
        addState,
        updateState,
        deleteState,
        updateOrCreateState,
    };
});
