import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import * as v from 'valibot';

import type {
    InterprSource,
    SourceCategory,
    SourceType,
    SourceVisibility,
} from '@/types/Interpretation/Source';
import {
    InterprSourceWriteSchema,
    InterprSourceUpdateSchema,
    type InterprSourceWrite,
} from '@/services/schemas/interpretationSource.schema';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { InterpretationSourceRepository } from '@/services/repositories/InterpretationSourceRepository';
import { initialSourcesSeed } from '@/services/seeders/interpretationSourceSeeder';

export const useInterpretationSourceStore = defineStore('interpretationSource', () => {
    // ===== STATE =====
    const sources = ref<InterprSource[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<InterpretationSourceRepository | null>(null);

    const validationErrors = ref<Record<string, string>>({});

    // ===== GETTERS =====
    const totalSources = computed(() => sources.value.length);

    const publicSources = computed(() => sources.value.filter((s) => s.visibility === 'public'));

    const editableSources = computed(() => sources.value.filter((s) => s.isEditable));

    const getSourceById = (id: number): InterprSource | undefined => {
        return sources.value.find((source) => source.id === id);
    };

    const getSourcesByCategory = (category: SourceCategory): InterprSource[] => {
        return sources.value.filter((s) => s.category === category);
    };

    const getSourcesByType = (type: SourceType): InterprSource[] => {
        return sources.value.filter((s) => s.type === type);
    };

    const getSourcesByVisibility = (visibility: SourceVisibility): InterprSource[] => {
        return sources.value.filter((s) => s.visibility === visibility);
    };

    /**
     * Источники, доступные текущему пользователю (личные, расшаренные или публичные)
     */
    const getUserAccessibleSources = (userId: string): InterprSource[] => {
        return sources.value.filter((s) => {
            if (s.visibility === 'public') return true;
            if (s.ownerId === userId) return true;
            if (s.editorIds?.includes(userId)) return true;
            if (s.readerIds?.includes(userId)) return true;
            return false;
        });
    };

    const getError = (key: string) => validationErrors.value[key];
    const hasError = (key: string) => Boolean(validationErrors.value[key]);

    // ===== ACTIONS =====

    /**
     * Инициализация стора и создание репозитория.
     * Заполняет IndexedDB данными из сидера при первом запуске.
     */
    const init = async () => {
        if (repository.value) return;

        loading.value = true;
        error.value = null;

        try {
            const dataService = ServiceFactory.createService('indexeddb');
            await dataService.init();
            repository.value = new InterpretationSourceRepository(dataService);

            let allSources = await repository.value.getAll();

            // СИДЕР: Пакетная вставка при пустой БД
            if (allSources.length === 0) {
                await Promise.all(
                    initialSourcesSeed.map((seedData) => repository.value!.create(seedData)),
                );
                allSources = await repository.value.getAll();
            }

            sources.value = allSources;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка инициализации источников';
            console.error('Ошибка инициализации стора источников сновидений:', err);
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
            sources.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка загрузки источников';
            console.error('Failed to load interpretation sources:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Добавление нового источника интерпретаций с валидацией
     */
    const addSource = async (sourceData: InterprSourceWrite): Promise<InterprSource | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(InterprSourceWriteSchema, sourceData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const savedSource = await repository.value.create(
                validation.output as InterprSourceWrite,
            );

            if (savedSource) {
                sources.value.push(savedSource);
            }
            return savedSource || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка создания источника';
            console.error('Failed to add interpretation source:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Частичное обновление источника интерпретаций
     */
    const updateSource = async (
        id: number,
        sourceData: Partial<InterprSourceWrite>,
    ): Promise<InterprSource | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(InterprSourceUpdateSchema, sourceData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const updatedSource = await repository.value.update(id, validation.output);

            if (updatedSource) {
                const index = sources.value.findIndex((s) => s.id === id);
                if (index !== -1) {
                    sources.value[index] = updatedSource;
                }
                return updatedSource;
            }

            return null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка обновления источника';
            console.error('Failed to update interpretation source:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Удаление источника
     */
    const deleteSource = async (id: number): Promise<boolean> => {
        if (!repository.value) return false;

        loading.value = true;
        error.value = null;

        try {
            await repository.value.delete(id);
            sources.value = sources.value.filter((s) => s.id !== id);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка удаления источника';
            console.error('Failed to delete interpretation source:', err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Вспомогательный метод парсинга ошибок Valibot
     */
    const extractErrors = (issues: v.GenericIssue[]): Record<string, string> => {
        const fieldErrors: Record<string, string> = {};

        for (const issue of issues) {
            if (issue.path && issue.path.length > 0) {
                const pathKey = issue.path
                    .map((item) => item.key)
                    .filter((key) => key !== undefined && key !== null)
                    .join('.');

                if (pathKey && !fieldErrors[pathKey]) {
                    fieldErrors[pathKey] = issue.message;
                }
            } else {
                if (!fieldErrors['_global']) {
                    fieldErrors['_global'] = issue.message;
                }
            }
        }

        return fieldErrors;
    };

    return {
        // State
        sources,
        loading,
        error,
        validationErrors,

        // Getters
        totalSources,
        publicSources,
        editableSources,
        getSourceById,
        getSourcesByCategory,
        getSourcesByType,
        getSourcesByVisibility,
        getUserAccessibleSources,
        getError,
        hasError,

        // Actions
        init,
        loadAll,
        addSource,
        updateSource,
        deleteSource,
    };
});
