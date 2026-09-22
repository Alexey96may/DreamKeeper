<template>
    <div class="border-border-muted border-t pt-4">
        <div class="mb-3 flex items-center justify-between gap-2">
            <span class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Толкования и символы
            </span>

            <AppButton @click="addInterpretation" variant="add" :icon-left="PlusIcon">
                Добавить символ
            </AppButton>
        </div>

        <div class="space-y-3">
            <AppMultiSelect
                id="form-perspective"
                v-model="activeSources"
                label="Источники"
                :options="sourceOptions"
                placeholder="Все источники интерпретаций"
            />

            <div
                v-for="(interp, idx) in list"
                :key="idx"
                class="border-border-muted/60 bg-bg-secondary/50 relative flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start"
            >
                <div class="relative grid flex-1 grid-cols-1 gap-3">
                    <!-- Обертка с relative для позиционирования подсказок -->
                    <div class="relative">
                        <AppTextInput
                            :model-value="
                                activeRowIndex === idx && activeField === 'tag'
                                    ? searchTagQuery
                                    : getSymbolTitle(interp.tag)
                            "
                            @update:model-value="handleSymbolInput(idx, $event)"
                            @focus="handleSymbolFocus(idx, interp.tag)"
                            @blur="clearFocus"
                            placeholder="Символ (напр. Вода)"
                            label="Символ"
                            :error-message="
                                sleepStore.validationErrors[`interpretations.${idx}.tag`]
                            "
                            @input="sleepStore.clearError(`interpretations.${idx}.tag`)"
                        />

                        <ul
                            v-if="
                                activeRowIndex === idx &&
                                activeField === 'tag' &&
                                suggestedSymbols.length > 0
                            "
                            class="border-accent bg-bg-muted absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-x-visible overflow-y-auto rounded-md border shadow-lg"
                        >
                            <li
                                v-for="symbol in suggestedSymbols"
                                :key="symbol.tag"
                                @mousedown.prevent="selectSymbol(idx, symbol)"
                                class="hover:bg-accent-hover flex cursor-pointer items-center justify-between px-4 py-2 text-sm"
                            >
                                <span class="text-text-muted font-medium">
                                    {{ symbol.title }}
                                </span>
                                <span class="font-mono text-xs text-gray-400">
                                    {{ symbol.tag }}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div class="relative">
                        <AppTextarea
                            :model-value="interp.meaning"
                            @update:model-value="updateField(idx, 'meaning', $event)"
                            @focus="handleMeaningFocus(idx, interp.tag, interp.meaning)"
                            @blur="activeRowIndex = null"
                            placeholder="Значение / Толкование"
                            label="Толкование"
                            :error-message="
                                sleepStore.validationErrors[`interpretations.${idx}.meaning`]
                            "
                            @input="sleepStore.clearError(`interpretations.${idx}.meaning`)"
                            :rows="5"
                        />

                        <!-- Выпадающий список (используем @mousedown.prevent вместо @click) -->
                        <ul
                            v-if="
                                activeRowIndex === idx &&
                                activeField === 'meaning' &&
                                suggestedInterpretations.length > 0
                            "
                            class="border-accent bg-bg-muted divide-border/40 absolute top-full right-0 left-0 z-50 mt-1 max-h-60 divide-y overflow-x-visible overflow-y-auto rounded-md border shadow-lg"
                        >
                            <li
                                v-for="interpr in suggestedInterpretations"
                                :key="interpr.id"
                                class="p-2"
                            >
                                <!-- Заголовок группы (Источник) -->
                                <div
                                    class="px-2 py-1 font-mono text-xs font-semibold tracking-wider text-gray-400 uppercase"
                                >
                                    Источник: {{ interpr.sourceId }}
                                </div>

                                <!-- Внутренний список значений -->
                                <ul class="mt-1 space-y-0.5">
                                    <li
                                        v-for="(meaning, mIdx) in interpr.meanings"
                                        :key="mIdx"
                                        @mousedown.prevent="
                                            selectInterpr(idx, meaning, interpr.sourceId)
                                        "
                                        class="hover:bg-accent-hover text-text-muted flex cursor-pointer items-center justify-between rounded px-3 py-1.5 text-sm transition-colors"
                                    >
                                        <span>{{ meaning }}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div class="flex items-center pt-2 sm:pt-6">
                        <AppCheckbox
                            :model-value="interp.isAccurate"
                            @update:model-value="
                                (val) => {
                                    if (Array.isArray(val)) return;
                                    updateField(idx, 'isAccurate', val);
                                }
                            "
                            label="Сбылось"
                            hint="Подтвердилось в реальности"
                            :error-message="
                                sleepStore.validationErrors[`interpretations.${idx}.isAccurate`]
                            "
                            @change="sleepStore.clearError(`interpretations.${idx}.isAccurate`)"
                        />
                    </div>
                </div>

                <div class="flex justify-end pt-1 sm:pt-6">
                    <AppButton
                        size="xs"
                        @click="removeInterpretation(idx)"
                        variant="danger"
                        :icon-left="X"
                        title="Удалить символ"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { PlusIcon, X } from 'lucide-vue-next';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';
    import { useInterpretationStore } from '@/stores/modules/useInterpretationStore';
    import AppMultiSelect from '@/components/ui/AppMultiSelect.vue';
    import { useSymbolStore } from '@/stores/modules/useSymbolStore';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import AppTextarea from '@/components/ui/AppTextarea.vue';
    import type { DreamInterpretationRef } from '@/types/Dream';
    import type { DreamSymbol } from '@/types/Interpretation/DreamSymbol';

    interface Props {
        interpretations?: DreamInterpretationRef[];
    }

    const props = withDefaults(defineProps<Props>(), {
        interpretations: () => [],
    });

    const emit = defineEmits<{
        'update:interpretations': [value: DreamInterpretationRef[]];
    }>();

    const sleepStore = useSleepStore();
    const sourceStore = useInterpretationSourceStore();
    const interpretationStore = useInterpretationStore();
    const symbolStore = useSymbolStore();

    const list = computed({
        get: () => props.interpretations,
        set: (val) => emit('update:interpretations', val),
    });

    const activeRowIndex = ref<number | null>(null);
    const activeSources = ref<string[]>([]);
    const activeSymbol = ref<DreamSymbol | null>(null);
    const activeInterpr = ref<string | null>(null);
    const searchTagQuery = ref<string>('');
    const searchMeaningQuery = ref<string>('');

    const getSymbolTitle = (tag: string) => {
        if (!tag) return '';
        return symbolStore.getSymbolByTag(tag)?.title || tag;
    };

    const activeField = ref<'tag' | 'meaning' | null>(null);

    const clearFocus = () => {
        activeRowIndex.value = null;
        activeField.value = null;
    };

    const handleSymbolFocus = (index: number, currentTag: string) => {
        activeRowIndex.value = index;
        activeField.value = 'tag';
        searchTagQuery.value = getSymbolTitle(currentTag);
        activeSymbol.value = symbolStore.getSymbolByTag(currentTag) || null;
    };

    const handleMeaningFocus = (index: number, currentTag: string, currentMeaning: string) => {
        activeRowIndex.value = index;
        activeField.value = 'meaning';
        searchTagQuery.value = getSymbolTitle(currentTag);
        activeSymbol.value = symbolStore.getSymbolByTag(currentTag) || null;
        searchMeaningQuery.value = currentMeaning || '';
    };

    const handleSymbolInput = (index: number, val: string) => {
        searchTagQuery.value = val;
        updateField(index, 'tag', val);
    };

    const suggestedSymbols = computed(() => {
        const query = searchTagQuery.value.trim().toLowerCase();
        if (!query) return [];

        return symbolStore.searchSymbols(query).slice(0, 8);
    });

    const suggestedInterpretations = computed(() => {
        if (!activeSymbol.value) return [];

        const maxSlice = 8;

        //only Tags
        if (activeSources.value.length === 0) {
            return interpretationStore.getBySymbolTag(activeSymbol.value.tag).slice(0, maxSlice);
        }

        const result = activeSources.value.flatMap((source) => {
            const interpr = interpretationStore.getBySymbolAndSource(
                activeSymbol.value?.tag ?? '',
                source,
            );

            return interpr ? [interpr] : [];
        });

        return result.slice(0, maxSlice);
    });

    const updateInterpretation = (index: number, patch: Partial<DreamInterpretationRef>) => {
        const updated = props.interpretations.map((item, i) => {
            if (i === index) {
                return { ...item, ...patch };
            }
            return item;
        });

        console.log(updated);

        emit('update:interpretations', updated);

        if ('tag' in patch) {
            activeRowIndex.value = index;
            activeField.value = 'tag';
            searchTagQuery.value = typeof patch.tag === 'string' ? patch.tag : '';
        }
    };

    const updateField = <K extends keyof DreamInterpretationRef>(
        index: number,
        field: K,
        value: DreamInterpretationRef[K],
    ) => {
        updateInterpretation(index, { [field]: value });
    };

    const selectInterpr = (index: number, interprValue: string, sourceId: string) => {
        updateInterpretation(index, {
            sourceId,
            meaning: interprValue,
        });

        clearFocus();
        searchMeaningQuery.value = '';
        activeInterpr.value = interprValue;
    };

    const selectSymbol = (index: number, symbol: DreamSymbol) => {
        updateField(index, 'tag', symbol.tag);
        clearFocus();
        searchTagQuery.value = '';
        activeSymbol.value = symbol;
    };

    const addInterpretation = () => {
        emit('update:interpretations', [
            ...props.interpretations,
            { tag: '', meaning: '', sourceId: 'mine', isAccurate: null },
        ]);
    };

    const removeInterpretation = (index: number) => {
        emit(
            'update:interpretations',
            props.interpretations.filter((_, i) => i !== index),
        );
    };

    const sourceOptions = computed(() => {
        const dynamicSources = (sourceStore.sources || []).map((s) => ({
            value: s.id,
            label: `${s.title}${s.authorName ? ` (${s.authorName})` : ''}`,
        }));

        return dynamicSources;
    });
</script>
