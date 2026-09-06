// src/store/modules/userState.ts
import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import type { UserState, UserStateWrite } from '@/types/UserState';
import * as v from 'valibot';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { userStatesSeed } from '@/services/seeders/userStatesSeeder';
import { UserStateRepository } from '@/services/repositories/UserStateRepository';
import { UserStateWriteSchema, UserStateUpdateSchema } from '@/services/schemas/userState.schema';

export const useUserStateStore = defineStore('userState', () => {
    // ===== STATE =====
    const states = ref<UserState[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<UserStateRepository | null>(null);

    const validationErrors = ref<Record<string, string>>({});

    // ===== GETTERS =====
    const getError = (key: string) => validationErrors.value[key];
    const hasError = (key: string) => Boolean(validationErrors.value[key]);

    const totalStates = computed(() => states.value.length);

    const getStateByDate = (date: string): UserState | undefined => {
        if (!date) return undefined;
        const cleanArgDate = date.split('T')[0];
        return states.value.find((state) => state.date?.split('T')[0] === cleanArgDate);
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
        loading.value = true;
        error.value = null;

        try {
            const service = ServiceFactory.createService('indexeddb');
            await service.init();
            repository.value = new UserStateRepository(service);

            let allStates = await repository.value.getAll();

            if (allStates.length === 0) {
                // Запускаем все вставки параллельно (или используем bulkAdd, если поддерживается)
                await Promise.all(
                    userStatesSeed.map((seedData) => repository.value!.create(seedData)),
                );

                // Запрашиваем итоговый массив
                allStates = await repository.value.getAll();
            }

            states.value = allStates;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка инициализации';
            console.error('Ошибка инициализации стора состояний:', err);
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
            states.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка загрузки состояний';
            console.error('Failed to load states:', err);
        } finally {
            loading.value = false;
        }
    };

    const addState = async (stateData: UserStateWrite): Promise<UserState | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(UserStateWriteSchema, stateData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;

            return null;
        }

        try {
            const newState = {
                ...stateData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const savedState = await repository.value.create(newState);
            if (savedState) {
                states.value.push(savedState);
            }
            return savedState || null;
        } catch (err) {
            error.value = 'Ошибка создания состояния';
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
        validationErrors.value = {};

        const validation = v.safeParse(UserStateUpdateSchema, stateData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

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
            error.value = 'Ошибка создания состояния';
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

    const clearError = (field: keyof typeof validationErrors.value) => {
        if (validationErrors.value[field]) {
            delete validationErrors.value[field];
        }
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

    return {
        // State
        states,
        loading,
        error,
        validationErrors,

        // Getters
        totalStates,
        getStateByDate,
        getStatesByMonth,
        getAverageMood,
        getAverageEnergy,
        getMonthStats,
        getError,
        hasError,

        // Actions
        init,
        loadAll,
        addState,
        updateState,
        deleteState,
        clearError,
    };
});
