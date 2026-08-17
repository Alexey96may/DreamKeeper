<template>
    <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
        <AppTagSelect
            :model-value="props.categories ?? null"
            @update:model-value="handleUpdateCategories"
            label="Категории сна"
            @change="handleCategoryChange"
            @clear-error="sleepStore.clearError('categories')"
            :error-message="sleepStore.validationErrors.categories"
            :options="DREAM_CATEGORY_OPTIONS"
        />

        <div
            v-if="categories.includes('lucid')"
            class="border-dream-lucid/30 bg-dream-lucid/5 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-dream-lucid text-xs font-semibold">
                Параметры Осознанного Сна (Lucid)
            </h4>
            <div v-if="categoryDetails?.lucid" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AppRange
                    :modelValue="props.categoryDetails?.lucid?.controlLevel ?? 0"
                    @update:modelValue="
                        (val) => {
                            updateDetailField('lucid', 'controlLevel', val);
                        }
                    "
                    label="Уровень контроля"
                    :error-message="
                        sleepStore.validationErrors['categoryDetails.lucid.controlLevel']
                    "
                    @input="sleepStore.clearError('categoryDetails.lucid.controlLevel')"
                    :min="0"
                    :max="10"
                    :step="1"
                    :value-formatter="computedDreamValueFormatter"
                />

                <AppSelect
                    :model-value="props.categoryDetails?.lucid?.trigger ?? undefined"
                    @update:model-value="
                        (val) => {
                            updateDetailField('lucid', 'trigger', val);
                        }
                    "
                    label="Триггер осознания"
                    :error-message="sleepStore.validationErrors['categoryDetails.lucid.trigger']"
                    :options="LUCID_TRIGGER_OPTIONS"
                    @clear-error="sleepStore.clearError('categoryDetails.lucid.trigger')"
                />
            </div>
        </div>

        <!-- NIGHTMARE -->

        <div
            v-if="categories.includes('nightmare')"
            class="border-status-error/30 bg-status-error/5 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-status-error text-xs font-semibold">Параметры Кошмара (Nightmare)</h4>
            <div v-if="categoryDetails?.nightmare" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AppRange
                    :model-value="props.categoryDetails?.nightmare?.fearLevel ?? 0"
                    @update:model-value="
                        (val) => {
                            updateDetailField('nightmare', 'fearLevel', val);
                        }
                    "
                    label="Уровень страха"
                    :min="0"
                    :max="10"
                    :step="1"
                    :value-formatter="computedDreamValueFormatter"
                    :error-message="
                        sleepStore.validationErrors['categoryDetails.nightmare.fearLevel']
                    "
                    @input="sleepStore.clearError('categoryDetails.nightmare.fearLevel')"
                />

                <AppCheckbox
                    :model-value="props.categoryDetails?.nightmare?.hasPhysicalResponse ?? false"
                    @update:model-value="
                        (val) => {
                            if (typeof val === 'boolean') {
                                updateDetailField('nightmare', 'hasPhysicalResponse', val);
                            }
                        }
                    "
                    label="Физическая реакция"
                    hint="Учащённый пульс, пот, испуг?"
                    accent-color="bg-status-error border-status-error"
                    :error-message="
                        sleepStore.validationErrors['categoryDetails.nightmare.hasPhysicalResponse']
                    "
                    @change="sleepStore.clearError('categoryDetails.nightmare.hasPhysicalResponse')"
                />
            </div>

            <AppTextInput
                v-if="categoryDetails?.nightmare"
                :model-value="props.categoryDetails?.nightmare?.copingMechanism ?? ''"
                @update:model-value="
                    (val) => {
                        updateDetailField('nightmare', 'copingMechanism', val);
                    }
                "
                label="Как справился / Завершение"
                placeholder="Проснулся от крика, дал отпор..."
                :error-message="
                    sleepStore.validationErrors['categoryDetails.nightmare.copingMechanism']
                "
                @input="sleepStore.clearError('categoryDetails.nightmare.copingMechanism')"
            />
        </div>

        <!-- PROPHETIC -->
        <div
            v-if="categories.includes('prophetic')"
            class="border-dream-prophetic/30 bg-dream-prophetic/5 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-dream-prophetic text-xs font-semibold">
                Параметры Вещего Сна (Prophetic)
            </h4>
            <div v-if="categoryDetails?.prophetic" class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <AppDatePicker
                    :model-value="props.categoryDetails?.prophetic?.expectedByDate ?? undefined"
                    @update:model-value="
                        (val) => {
                            updateDetailField(
                                'prophetic',
                                'expectedByDate',
                                val === null ? undefined : val,
                            );
                        }
                    "
                    label="Ожидаемый срок"
                    hint="Укажите дату, к которой сон должен реализоваться"
                    :error-message="
                        sleepStore.validationErrors['categoryDetails.prophetic.expectedByDate']
                    "
                    @input="sleepStore.clearError('categoryDetails.prophetic.expectedByDate')"
                />

                <AppDatePicker
                    :value="props.categoryDetails?.prophetic?.fulfilledDate ?? ''"
                    @update:model-value="
                        (val) => {
                            updateDetailField(
                                'prophetic',
                                'fulfilledDate',
                                val === null ? undefined : val,
                            );
                        }
                    "
                    label="Дата исполнения"
                    hint="Укажите дату, к которой сон реализовался"
                    :error-message="
                        sleepStore.validationErrors['categoryDetails.prophetic.fulfilledDate']
                    "
                    @input="sleepStore.clearError('categoryDetails.prophetic.fulfilledDate')"
                />

                <AppCheckbox
                    :model-value="props.categoryDetails?.prophetic?.isFulfilled ?? false"
                    @update:model-value="
                        (val) => {
                            if (typeof val === 'boolean') {
                                updateDetailField('prophetic', 'isFulfilled', val);
                            }
                        }
                    "
                    label="Уже сбылся"
                    accent-color="bg-dream-prophetic border-dream-prophetic"
                    hint="Отметьте, если сон уже сбылся."
                    :error-message="
                        sleepStore.validationErrors['categoryDetails.prophetic.isFulfilled']
                    "
                    @change="sleepStore.clearError('categoryDetails.prophetic.isFulfilled')"
                />
            </div>

            <AppTextInput
                v-if="categoryDetails?.prophetic"
                :model-value="props.categoryDetails?.prophetic?.fulfillmentNotes ?? ''"
                @update:model-value="
                    (val) => {
                        updateDetailField('prophetic', 'fulfillmentNotes', val);
                    }
                "
                label="Что именно произошло в реальности"
                placeholder="Описание события в реальной жизни..."
                :error-message="
                    sleepStore.validationErrors['categoryDetails.prophetic.fulfillmentNotes']
                "
                @input="sleepStore.clearError('categoryDetails.prophetic.fulfillmentNotes')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppTagSelect from '@/components/ui/AppTagSelect.vue';
    import AppDatePicker from '@/components/ui/AppDatePicker.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import AppRange from '@/components/ui/AppRange.vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import { DREAM_CATEGORY_OPTIONS, LUCID_TRIGGER_OPTIONS } from '@/constants/Dream';
    import type { DreamCategory, DreamCategoryDetails } from '@/types/Dream/dream.categories';
    import { dreamValueFormatter } from '@/utils/formatters';
    import { normalizeToArray } from '@/utils';

    const computedDreamValueFormatter = computed(() => dreamValueFormatter);

    const sleepStore = useSleepStore();

    interface Props {
        categories?: DreamCategory[];
        categoryDetails?: DreamCategoryDetails;
    }

    const props = withDefaults(defineProps<Props>(), {
        categories: () => [],
        categoryDetails: () => ({}),
    });

    const emit = defineEmits<{
        'update:categories': [value: DreamCategory[]];
        'update:categoryDetails': [value: DreamCategoryDetails];
    }>();

    const updateDetailField = <
        K extends keyof DreamCategoryDetails,
        P extends keyof NonNullable<DreamCategoryDetails[K]>,
    >(
        categoryKey: K,
        field: P,
        value: NonNullable<DreamCategoryDetails[K]>[P],
    ) => {
        const currentCategoryDetails = props.categoryDetails?.[categoryKey] ?? {};

        emit('update:categoryDetails', {
            ...props.categoryDetails,
            [categoryKey]: {
                ...currentCategoryDetails,
                [field]: value,
            },
        });
    };

    const handleUpdateCategories = (val: DreamCategory | DreamCategory[] | null) => {
        emit('update:categories', normalizeToArray(val));
    };

    const handleCategoryChange = (selectedValues: DreamCategory[] | DreamCategory | null) => {
        const currentList = normalizeToArray(selectedValues);
        if (currentList.length === 0) {
            emit('update:categoryDetails', {});
            return;
        }

        const details: DreamCategoryDetails = { ...props.categoryDetails };

        if (currentList.includes('lucid') && !details.lucid) {
            details.lucid = { controlLevel: 0, trigger: 'irrelevant' };
        }
        if (currentList.includes('nightmare') && !details.nightmare) {
            details.nightmare = { fearLevel: 0, hasPhysicalResponse: false, copingMechanism: '' };
        }
        if (currentList.includes('prophetic') && !details.prophetic) {
            details.prophetic = { isFulfilled: false, fulfillmentNotes: '' };
        }

        emit('update:categoryDetails', details);
    };
</script>
