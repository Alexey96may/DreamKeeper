import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as v from 'valibot';

import type { Interpretation } from '@/types/Interpretation/Interpretation';
import {
    InterpretationWriteSchema,
    InterpretationUpdateSchema,
    type InterpretationWrite,
} from '@/services/schemas/interpretation.schema';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { InterpretationRepository } from '@/services/repositories/InterpretationRepository';
import { initialInterpretationsSeed } from '@/services/seeders/interpretationsSeed';

export const useInterpretationStore = defineStore('interpretation', () => {
    // ===== STATE =====
    const interpretations = ref<Interpretation[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<InterpretationRepository | null>(null);

    const validationErrors = ref<Record<string, string>>({});

    // ===== GETTERS =====
    const getInterpretationById = (id: string): Interpretation | undefined => {
        return interpretations.value.find((i) => i.id === id);
    };

    const getBySymbolTag = (symbolId: string): Interpretation[] => {
        return interpretations.value.filter((i) => i.symbolTag === symbolId);
    };

    const getBySourceId = (sourceId: string): Interpretation[] => {
        return interpretations.value.filter((i) => i.sourceId === sourceId);
    };

    const getBySymbolAndSource = (
        symbolTag: string,
        sourceId: string,
    ): Interpretation | undefined => {
        return interpretations.value.find(
            (i) => i.symbolTag === symbolTag && i.sourceId === sourceId,
        );
    };

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
            repository.value = new InterpretationRepository(dataService);

            let existing = await repository.value.getAll();
            if (existing.length === 0) {
                const now = new Date().toISOString();

                for (const seed of initialInterpretationsSeed) {
                    await repository.value.create({
                        ...seed,
                        createdAt: now,
                        updatedAt: now,
                    } as Interpretation);
                }

                existing = await repository.value.getAll();
            }

            interpretations.value = existing;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка инициализации толкований';
            console.error('Failed to init interpretation store:', err);
        } finally {
            loading.value = false;
        }
    };

    const addInterpretation = async (data: InterpretationWrite): Promise<Interpretation | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(InterpretationWriteSchema, data);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const saved = await repository.value.create(validation.output as InterpretationWrite);
            if (saved) interpretations.value.push(saved);
            return saved || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка создания толкования';
            console.error('Failed to add interpretation:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateInterpretation = async (
        id: string,
        data: Partial<InterpretationWrite>,
    ): Promise<Interpretation | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(InterpretationUpdateSchema, data);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const updated = await repository.value.update(id, validation.output);
            if (updated) {
                const index = interpretations.value.findIndex((i) => i.id === id);
                if (index !== -1) interpretations.value[index] = updated;
            }
            return updated;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка обновления толкования';
            console.error('Failed to update interpretation:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteInterpretation = async (id: string): Promise<boolean> => {
        if (!repository.value) return false;

        loading.value = true;
        error.value = null;

        try {
            await repository.value.delete(id);
            interpretations.value = interpretations.value.filter((i) => i.id !== id);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка удаления толкования';
            console.error('Failed to delete interpretation:', err);
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
        interpretations,
        loading,
        error,
        validationErrors,
        getInterpretationById,
        getBySymbolTag,
        getBySourceId,
        getBySymbolAndSource,
        getError,
        hasError,
        init,
        addInterpretation,
        updateInterpretation,
        deleteInterpretation,
    };
});
