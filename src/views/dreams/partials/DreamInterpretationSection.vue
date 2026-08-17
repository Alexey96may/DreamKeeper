<template>
    <div class="border-border border-t pt-4">
        <div class="mb-3 flex items-center justify-between gap-2">
            <span class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Толкования и символы
            </span>

            <AppButton @click="addInterpretation" variant="add" :icon-left="PlusIcon">
                Добавить символ
            </AppButton>
        </div>

        <div class="space-y-3">
            <div
                v-for="(interp, idx) in list"
                :key="idx"
                class="border-border/60 bg-bg-secondary/50 relative flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start"
            >
                <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <AppTextInput
                        :model-value="interp.tag"
                        @update:model-value="updateField(idx, 'tag', $event)"
                        placeholder="Символ (напр. Вода)"
                        label="Символ"
                        :error-message="sleepStore.validationErrors[`interpretations.${idx}.tag`]"
                        @input="sleepStore.clearError(`interpretations.${idx}.tag`)"
                    />

                    <AppTextInput
                        :model-value="interp.meaning"
                        @update:model-value="updateField(idx, 'meaning', $event)"
                        placeholder="Значение / Толкование"
                        label="Толкование"
                        :error-message="
                            sleepStore.validationErrors[`interpretations.${idx}.meaning`]
                        "
                        @input="sleepStore.clearError(`interpretations.${idx}.meaning`)"
                    />

                    <AppSelect
                        :model-value="interp.sourceId"
                        @update:model-value="updateField(idx, 'sourceId', $event)"
                        :options="sourceOptions"
                        label="Источник"
                        :error-message="
                            sleepStore.validationErrors[`interpretations.${idx}.sourceId`]
                        "
                        @clear-error="sleepStore.clearError(`interpretations.${idx}.sourceId`)"
                    />

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
    import { computed } from 'vue';
    import { PlusIcon, X } from 'lucide-vue-next';
    import { useSleepStore } from '@/stores/modules/dream';
    import { useInterpretationSourceStore } from '@/stores/modules/useInterpretationSourceStore';
    import AppButton from '@/components/ui/AppButton.vue';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import type { DreamInterpretationRef } from '@/types/Dream';

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

    const list = computed({
        get: () => props.interpretations,
        set: (val) => emit('update:interpretations', val),
    });

    const updateField = <K extends keyof DreamInterpretationRef>(
        index: number,
        field: K,
        value: DreamInterpretationRef[K],
    ) => {
        const updated = props.interpretations.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        emit('update:interpretations', updated);
    };

    const addInterpretation = () => {
        emit('update:interpretations', [
            ...props.interpretations,
            { tag: '', meaning: '', sourceId: 0, isAccurate: null },
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

        return [...dynamicSources];
    });
</script>
