import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import * as v from 'valibot';

import { DreamWriteSchema, DreamUpdateSchema } from '@/services/schemas/dream.schema';
import type { Dream, DreamWrite, DreamInterpretationRef } from '@/types/Dream';
import type { DreamSymbol } from '@/types/Interpretation/DreamSymbol';
import type { Interpretation } from '@/types/Interpretation/Interpretation';

import { ServiceFactory } from '@/services/factories/ServiceFactory';
import { DreamRepository } from '@/services/repositories/DreamRepository';
import { generateDreamsSeed } from '@/services/seeders/dreamSeeder';
import { sanitizeDateString, isPastOrPresentDay } from '@/utils/date';

// 1. Импортируем стор символов
import { useSymbolStore } from '@/stores/modules/useSymbolStore';
import { useInterpretationStore } from '@/stores/modules/useInterpretationStore';

export const useSleepStore = defineStore('sleep', () => {
    // ===== STATE =====
    const sleeps = ref<Dream[]>([]);
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
        return sleeps.value.filter(
            (sleep: Dream) => sanitizeDateString(sleep.date) === sanitizeDateString(date),
        );
    };

    const getDreamsExpectedByDate = (): Dream[] => {
        return sleeps.value.filter((sleep: Dream) => {
            if (!sleep.categoryDetails?.prophetic?.expectedByDate) return false;

            return isPastOrPresentDay(sleep.categoryDetails.prophetic.expectedByDate);
        });
    };

    const getDreamsByMonth = (year: number, month: number): Dream[] => {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        return sleeps.value.filter((sleep: Dream) => sleep.date.startsWith(monthStr));
    };

    const getDreamById = (id: number): Dream | undefined => {
        return sleeps.value.find((sleep: Dream) => sleep.id === id);
    };

    const getDreamBySlug = async (slug: string): Promise<Dream | null> => {
        const localDream = sleeps.value.find((s) => s.slug === slug);
        if (localDream) return localDream;

        if (repository.value) {
            loading.value = true;
            try {
                const fetchedDream = await repository.value.getBySlug(slug);
                if (fetchedDream) {
                    const exists = sleeps.value.some((s) => s.id === fetchedDream.id);
                    if (!exists) sleeps.value.push(fetchedDream);
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

    // ===== HELPER ACTIONS =====

    /**
     * Автоматическое сохранение/обновление символа и интерпретации в symbolStore,
     * если sourceId === 'mine'
     */
    const syncPersonalInterpretations = async (refs: DreamInterpretationRef[]) => {
        if (!Array.isArray(refs) || refs.length === 0) return;

        const symbolStore = useSymbolStore();
        const interpretationStore = useInterpretationStore();

        for (const ref of refs) {
            if (ref.sourceId !== 'mine' || !ref.tag) continue;

            // 1. Проверяем наличие символа в реестре
            let symbol = symbolStore.getSymbolByTag(ref.tag);
            if (!symbol) {
                const newSymbol: DreamSymbol = {
                    tag: ref.tag,
                    title: ref.tag,
                    category: 'abstract',
                    createdAt: new Date().toISOString(),
                };
                symbol = (await symbolStore.addSymbol(newSymbol)) ?? undefined;
            }

            // 2. Ищем толкование по ID или по связке (symbolTag + sourceId)
            const existingInterp = ref.interpretationId
                ? interpretationStore.getInterpretationById(ref.interpretationId)
                : interpretationStore.interpretations.find(
                      (i: Interpretation) => i.symbolTag === ref.tag && i.sourceId === 'mine',
                  );

            if (existingInterp) {
                // Обновляем текст толкования в общей базе
                await interpretationStore.updateInterpretation(existingInterp.id, {
                    meanings: [ref.meaning],
                });
                ref.interpretationId = existingInterp.id;
            } else {
                // Создаем новую запись в IndexedDB и привязываем ID обратно к ссылке сна
                const createdInterp = await interpretationStore.addInterpretation({
                    symbolTag: ref.tag,
                    sourceId: 'mine',
                    meanings: [ref.meaning],
                    aspectId: null,
                    isCustom: true,
                    isVerified: false,
                });

                if (createdInterp?.id) {
                    ref.interpretationId = createdInterp.id;
                }
            }
        }
    };

    // ===== ACTIONS =====
    const init = async () => {
        if (repository.value) return;

        loading.value = true;
        error.value = null;

        try {
            const dataService = ServiceFactory.createService('indexeddb');
            await dataService.init();
            repository.value = new DreamRepository(dataService);

            let allDreams = await repository.value.getAll();

            if (allDreams.length === 0) {
                await Promise.all(
                    generateDreamsSeed(300).map((seedData) => repository.value!.create(seedData)),
                );
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
     * Добавление сна с валидацией и автосохранением 'mine' интерпретаций
     */
    const addDream = async (dreamData: DreamWrite): Promise<Dream | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const prophetic = dreamData.categoryDetails?.prophetic;
        if (prophetic && !prophetic.isFulfilled && prophetic.fulfilledDate) {
            prophetic.fulfilledDate = '';
        }

        const validation = v.safeParse(DreamWriteSchema, dreamData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const savedDream = await repository.value.create(validation.output);

            if (savedDream) {
                sleeps.value.push(savedDream);
                // 2. Синхронизируем личные интерпретации
                await syncPersonalInterpretations(validation.output.interpretations || []);
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
     * Частичное обновление сна с автосохранением 'mine' интерпретаций
     */
    const updateDream = async (
        id: number,
        dreamData: Partial<DreamWrite>,
    ): Promise<Dream | null> => {
        if (!repository.value) return null;

        loading.value = true;
        error.value = null;
        validationErrors.value = {};

        const prophetic = dreamData.categoryDetails?.prophetic;
        if (prophetic && !prophetic.isFulfilled && prophetic.fulfilledDate) {
            prophetic.fulfilledDate = '';
        }

        const validation = v.safeParse(DreamUpdateSchema, dreamData);

        if (!validation.success) {
            validationErrors.value = extractErrors(validation.issues);
            error.value = 'Пожалуйста, исправьте ошибки в форме';
            loading.value = false;
            return null;
        }

        try {
            const updatedDream = await repository.value.update(id, validation.output);

            if (updatedDream) {
                const index = sleeps.value.findIndex((s) => s.id === id);
                if (index !== -1) {
                    sleeps.value[index] = updatedDream;
                }
                // Синхронизируем личные интерпретации при обновлении
                const res1 = await syncPersonalInterpretations(
                    validation.output.interpretations || [],
                );
                console.log(res1);
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

    const clearError = (field: keyof typeof validationErrors.value) => {
        if (validationErrors.value[field]) {
            delete validationErrors.value[field];
        }
    };

    return {
        sleeps,
        loading,
        error,
        validationErrors,
        totalDreams,
        averageQuality,
        getDreamsByDate,
        getDreamsExpectedByDate,
        getDreamsByMonth,
        getDreamById,
        getMonthStats,
        getDreamsByQuality,
        getDreamBySlug,
        getError,
        hasError,
        init,
        loadAll,
        addDream,
        updateDream,
        deleteDream,
        clearError,
    };
});
