import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import * as v from 'valibot';

import type { DreamSymbol, SymbolCategory } from '@/types/Interpretation/DreamSymbol';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { DreamSymbolRepository } from '@/services/repositories/DreamSymbolRepository';
import { initialSymbolsSeed } from '@/services/seeders/initialSymbolsSeed';
import {
    SymbolWrite,
    SymbolWriteSchema,
    SymbolUpdateSchema,
} from '@/services/schemas/symbol.schema';

export const useSymbolStore = defineStore('symbol', () => {
    // ===== STATE =====
    const symbols = ref<DreamSymbol[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const repository = ref<DreamSymbolRepository | null>(null);

    const validationErrors = ref<Record<string, string>>({});

    // ===== GETTERS =====
    const totalSymbols = computed(() => symbols.value.length);

    const getSymbolByTag = (tag: string): DreamSymbol | undefined => {
        return symbols.value.find((s) => s.tag === tag);
    };

    const searchSymbols = (query: string): DreamSymbol[] => {
        const cleanQuery = query.trim().toLowerCase();
        if (!cleanQuery) return symbols.value;
        return symbols.value.filter((s) => s.title.toLowerCase().includes(cleanQuery));
    };

    const getSymbolsByCategory = (category: SymbolCategory): DreamSymbol[] => {
        return symbols.value.filter((s) => s.category === category);
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
            repository.value = new DreamSymbolRepository(dataService);

            let existing = await repository.value.getAll();

            if (existing.length === 0) {
                const now = new Date().toISOString();

                for (const seed of initialSymbolsSeed) {
                    await repository.value.create({
                        ...seed,
                        createdAt: now,
                        updatedAt: now,
                    } as DreamSymbol);
                }

                existing = await repository.value.getAll();
            }

            symbols.value = existing;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка инициализации символов';
            console.error('Failed to init symbol store:', err);
        } finally {
            loading.value = false;
        }
    };

    const slugify = (str: string) => str.toLowerCase().trim().replace(/\s+/g, '-');

    const addSymbol = async (symbolData: SymbolWrite): Promise<DreamSymbol | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(SymbolWriteSchema, symbolData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            // Гарантируем наличие tag
            const payload = {
                ...validation.output,
                tag: validation.output.tag || slugify(validation.output.title),
            };

            const saved = await repository.value.create(payload);
            if (saved) symbols.value.push(saved);
            return saved || null;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка создания символа';
            console.error('Failed to add symbol:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateSymbol = async (
        tag: string,
        symbolData: Partial<SymbolWrite>,
    ): Promise<DreamSymbol | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const validation = v.safeParse(SymbolUpdateSchema, symbolData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const updated = await repository.value.update(tag, validation.output);
            if (updated) {
                const index = symbols.value.findIndex((s) => s.tag === tag);
                if (index !== -1) symbols.value[index] = updated;
            }
            return updated;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка обновления символа';
            console.error('Failed to update symbol:', err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const deleteSymbol = async (tag: string): Promise<boolean> => {
        if (!repository.value) return false;

        loading.value = true;
        error.value = null;

        try {
            await repository.value.delete(tag);
            symbols.value = symbols.value.filter((s) => s.tag !== tag);
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Ошибка удаления символа';
            console.error('Failed to delete symbol:', err);
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
        symbols,
        loading,
        error,
        validationErrors,
        totalSymbols,
        getSymbolByTag,
        searchSymbols,
        getSymbolsByCategory,
        getError,
        hasError,
        init,
        addSymbol,
        updateSymbol,
        deleteSymbol,
    };
});
