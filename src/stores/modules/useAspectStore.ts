import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import * as v from 'valibot';

import type { DreamAspect } from '@/types/Interpretation/DreamAspect';
import {
    AspectWriteSchema,
    AspectUpdateSchema,
    type AspectWrite,
} from '@/services/schemas/aspect.schema';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { DreamAspectRepository } from '@/services/repositories/DreamAspectRepository';
import { initialAspectsSeed } from '@/services/seeders/initialAspectsSeed';

export const useAspectStore = defineStore('aspect', () => {
    // ===== STATE =====
    const aspects = ref<DreamAspect[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<DreamAspectRepository | null>(null);

    const validationErrors = ref<Record<string, string>>({});

    // ===== GETTERS =====
    const getAspectById = (id: string): DreamAspect | undefined => {
        return aspects.value.find((a) => a.id === id);
    };

    const getAspectsBySymbolTag = (symbolTag: string): DreamAspect[] => {
        return aspects.value.filter((a) => a.symbolTag === symbolTag);
    };

    const groupedBySymbol = computed(() => {
        return aspects.value.reduce<Record<string, DreamAspect[]>>((acc, aspect) => {
            const key = aspect.symbolTag || 'uncategorized';
            if (!acc[key]) acc[key] = [];
            acc[key].push(aspect);
            return acc;
        }, {});
    });

    const getError = (key: string) => validationErrors.value[key];
    const hasError = (key: string) => Boolean(validationErrors.value[key]);

    // ===== ACTIONS =====
    const init = async () => {
        if (repository.value) return;

        loading.value = true;
        error.value = null;

        try {
            const dataService = ServiceFactory.createService('indexeddb');
            await dataService.init();
            repository.value = new DreamAspectRepository(dataService);

            let existing = await repository.value.getAll();

            if (existing.length === 0) {
                const now = new Date().toISOString();

                await Promise.all(
                    initialAspectsSeed.map((seedData) =>
                        repository.value!.create({
                            ...seedData,
                            createdAt: now,
                            updatedAt: now,
                        } as DreamAspect),
                    ),
                );

                existing = await repository.value.getAll();
            }

            aspects.value = existing;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка инициализации аспектов';
            console.error('Failed to init aspect store:', err);
        } finally {
            loading.value = false;
        }
    };

    const addAspect = async (data: AspectWrite): Promise<DreamAspect | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(AspectWriteSchema, data);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const saved = await repository.value.create(validation.output as AspectWrite);
            if (saved) aspects.value.push(saved);
            return saved || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка создания аспекта';
            console.error('Failed to add aspect:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateAspect = async (
        id: string,
        data: Partial<AspectWrite>,
    ): Promise<DreamAspect | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(AspectUpdateSchema, data);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const updated = await repository.value.update(id, validation.output);
            if (updated) {
                const index = aspects.value.findIndex((a) => a.id === id);
                if (index !== -1) aspects.value[index] = updated;
            }
            return updated;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка обновления аспекта';
            console.error('Failed to update aspect:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteAspect = async (id: string): Promise<boolean> => {
        if (!repository.value) return false;

        loading.value = true;
        error.value = null;

        try {
            await repository.value.delete(id);
            aspects.value = aspects.value.filter((a) => a.id !== id);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка удаления аспекта';
            console.error('Failed to delete aspect:', err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const extractErrors = (issues: v.GenericIssue[]): Record<string, string> => {
        const fieldErrors: Record<string, string> = {};
        for (const issue of issues) {
            if (issue.path && issue.path.length > 0) {
                const pathKey = issue.path
                    .map((item) => item.key)
                    .filter((key) => key !== undefined && key !== null)
                    .join('.');
                if (pathKey && !fieldErrors[pathKey]) fieldErrors[pathKey] = issue.message;
            } else if (!fieldErrors['_global']) {
                fieldErrors['_global'] = issue.message;
            }
        }
        return fieldErrors;
    };

    return {
        aspects,
        loading,
        error,
        validationErrors,
        getAspectById,
        getAspectsBySymbolTag,
        groupedBySymbol,
        getError,
        hasError,
        init,
        addAspect,
        updateAspect,
        deleteAspect,
    };
});
