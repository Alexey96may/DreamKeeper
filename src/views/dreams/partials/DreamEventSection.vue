<template>
    <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
        <AppTagSelect
            :model-value="props.phenomena"
            @update:model-value="handleUpdatePhenomenas"
            label="Феномены и события во сне"
            @change="handlePhenomenaChange"
            :options="DREAM_PHENOMENON_OPTIONS"
            @clear-error="sleepStore.clearError('phenomena')"
            :error-message="sleepStore.validationErrors.phenomena"
        />

        <!-- Детали: ПОЛЁТ -->
        <div
            v-if="props.phenomena?.includes('flying')"
            class="border-border/60 bg-bg-secondary/50 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Детали полёта
            </h4>
            <div
                v-if="props.phenomenaDetails?.flying"
                class="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
                <AppSelect
                    :model-value="props.phenomenaDetails.flying.type"
                    @update:model-value="
                        (val) => {
                            updateDetailField('flying', 'type', val);
                        }
                    "
                    :options="FLYING_TYPE_OPTIONS"
                    label="Стиль полёта"
                    :error-message="sleepStore.validationErrors['phenomenaDetails.flying.type']"
                    @clear-error="sleepStore.clearError('phenomenaDetails.flying.type')"
                />

                <AppSelect
                    :model-value="props.phenomenaDetails.flying.altitude"
                    @update:model-value="
                        (val) => {
                            updateDetailField('flying', 'altitude', val);
                        }
                    "
                    :options="FLYING_ALTITUDE_OPTIONS"
                    label="Высота"
                    :error-message="sleepStore.validationErrors['phenomenaDetails.flying.altitude']"
                    @clear-error="sleepStore.clearError('phenomenaDetails.flying.altitude')"
                />
            </div>
        </div>

        <!-- Детали: ПАДЕНИЕ -->
        <div
            v-if="props.phenomena?.includes('falling')"
            class="border-border/60 bg-bg-secondary/50 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Детали падения
            </h4>
            <div
                v-if="props.phenomenaDetails?.falling"
                class="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
                <AppSelect
                    :model-value="props.phenomenaDetails.falling.origin"
                    @update:model-value="
                        (val) => {
                            updateDetailField('falling', 'origin', val);
                        }
                    "
                    :options="FALLING_ORIGIN_OPTIONS"
                    :error="sleepStore.getError('phenomenaDetails.falling.origin')"
                    label="Откуда падение"
                    :error-message="sleepStore.validationErrors['phenomenaDetails.falling.origin']"
                    @clear-error="sleepStore.clearError('phenomenaDetails.falling.origin')"
                />

                <AppSelect
                    :model-value="props.phenomenaDetails.falling.outcome"
                    @update:model-value="
                        (val) => {
                            updateDetailField('falling', 'outcome', val);
                        }
                    "
                    :options="FALLING_OUTCOME_OPTIONS"
                    :error="sleepStore.validationErrors.phenomenaDetails"
                    label="Чем закончилось"
                    :error-message="sleepStore.validationErrors['phenomenaDetails.falling.outcome']"
                    @clear-error="sleepStore.clearError('phenomenaDetails.falling.outcome')"
                />
            </div>
        </div>

        <!-- Детали: СМЕРТЬ -->
        <div
            v-if="props.phenomena?.includes('death')"
            class="border-border/60 bg-bg-secondary/50 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Детали смерти во сне
            </h4>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div
                    v-if="props.phenomena?.includes('death') && props.phenomenaDetails?.death"
                    class="space-y-4"
                >
                    <AppSelect
                        :model-value="props.phenomenaDetails.death.cause"
                        @update:model-value="
                            (val) => {
                                updateDetailField('death', 'cause', val);
                            }
                        "
                        :options="DEATH_CAUSE_OPTIONS"
                        label="Причина / Контекст"
                        :error-message="sleepStore.validationErrors['phenomenaDetails.death.cause']"
                        @clear-error="sleepStore.clearError('phenomenaDetails.death.cause')"
                    />

                    <AppSelect
                        :model-value="props.phenomenaDetails.death.aftermath"
                        @update:model-value="
                            (val) => {
                                updateDetailField('death', 'aftermath', val);
                            }
                        "
                        :options="DEATH_AFTERMATH_OPTIONS"
                        label="Что произошло сразу после"
                        :error-message="
                            sleepStore.validationErrors['phenomenaDetails.death.aftermath']
                        "
                        @clear-error="sleepStore.clearError('phenomenaDetails.death.aftermath')"
                    />
                </div>
            </div>
        </div>

        <!-- Детали: СОННЫЙ ПАРАЛИЧ -->
        <div
            v-if="props.phenomena?.includes('paralysis')"
            class="border-border/60 bg-bg-secondary/50 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Детали сонного паралича
            </h4>

            <AppSelect
                v-if="props.phenomenaDetails?.paralysis"
                :model-value="props.phenomenaDetails.paralysis.timing"
                @update:model-value="
                    (val) => {
                        updateDetailField('paralysis', 'timing', val);
                    }
                "
                :options="PARALYSIS_TIMING_OPTIONS"
                label="Момент возникновения"
                :error-message="sleepStore.validationErrors['phenomenaDetails.paralysis.timing']"
                @clear-error="sleepStore.clearError('phenomenaDetails.paralysis.timing')"
            />

            <AppTagSelect
                v-if="props.phenomenaDetails?.paralysis?.hallucinations"
                :modelValue="props.phenomenaDetails.paralysis.hallucinations"
                @update:modelValue="
                    (val) => {
                        if (val === null)
                            updateDetailField('paralysis', 'hallucinations', undefined);
                        if (Array.isArray(val))
                            updateDetailField('paralysis', 'hallucinations', val);
                    }
                "
                label="Галлюцинации"
                :options="PARALYSIS_HALLUCINATIONS_OPTIONS"
                :error-message="
                    sleepStore.validationErrors['phenomenaDetails.paralysis.hallucinations']
                "
                @clear-error="sleepStore.clearError('phenomenaDetails.paralysis.hallucinations')"
            />
        </div>

        <!-- Детали: ЛОЖНОЕ ПРОБУЖДЕНИЕ -->
        <div
            v-if="props.phenomena?.includes('nested_dream')"
            class="border-border/60 bg-bg-secondary/50 space-y-3 rounded-lg border p-3"
        >
            <h4 class="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Детали ложного пробуждения
            </h4>

            <AppNumberInput
                v-if="props.phenomenaDetails?.nestedDream"
                :modelValue="props.phenomenaDetails.nestedDream.nestingLevels"
                @update:modelValue="
                    (val) => {
                        updateDetailField(
                            'nestedDream',
                            'nestingLevels',
                            val === null ? undefined : val,
                        );
                    }
                "
                label="Уровень вложенности "
                hint="Сколько раз «просыпался» во сне?"
                :min="1"
                :max="1000"
                :step="1"
                :formatter="(val) => `${val} раз`"
                :error-message="
                    sleepStore.validationErrors['phenomenaDetails.nestedDream.nestingLevels']
                "
                @clearError="sleepStore.clearError('phenomenaDetails.nestedDream.nestingLevels')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useSleepStore } from '@/stores/modules/dream';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppTagSelect from '@/components/ui/AppTagSelect.vue';
    import AppNumberInput from '@/components/ui/AppNumberInput.vue';
    import { normalizeToArray } from '@/utils';
    import {
        DREAM_PHENOMENON_OPTIONS,
        DEATH_CAUSE_OPTIONS,
        DEATH_AFTERMATH_OPTIONS,
        FLYING_TYPE_OPTIONS,
        FLYING_ALTITUDE_OPTIONS,
        FALLING_ORIGIN_OPTIONS,
        FALLING_OUTCOME_OPTIONS,
        PARALYSIS_TIMING_OPTIONS,
        PARALYSIS_HALLUCINATIONS_OPTIONS,
    } from '@/constants/Dream';
    import type { DreamPhenomenon, DreamPhenomenaDetails } from '@/types/Dream';

    interface Props {
        phenomena?: DreamPhenomenon[];
        phenomenaDetails?: DreamPhenomenaDetails;
    }

    const sleepStore = useSleepStore();

    const props = withDefaults(defineProps<Props>(), {
        phenomena: () => [],
        phenomenaDetails: () => ({}),
    });

    const emit = defineEmits<{
        'update:phenomena': [value: DreamPhenomenon[]];
        'update:phenomenaDetails': [value: DreamPhenomenaDetails];
    }>();

    const handleUpdatePhenomenas = (val: DreamPhenomenon | DreamPhenomenon[] | null) => {
        emit('update:phenomena', normalizeToArray(val));
    };

    const updateDetailField = <
        K extends keyof DreamPhenomenaDetails,
        P extends keyof NonNullable<DreamPhenomenaDetails[K]>,
    >(
        phenomenaKey: K,
        field: P,
        value: NonNullable<DreamPhenomenaDetails[K]>[P],
    ) => {
        const currentpPhenomenaDetails = props.phenomenaDetails?.[phenomenaKey] ?? {};

        emit('update:phenomenaDetails', {
            ...props.phenomenaDetails,
            [phenomenaKey]: {
                ...currentpPhenomenaDetails,
                [field]: value,
            },
        });
    };

    const handlePhenomenaChange = (selectedValues: DreamPhenomenon[] | DreamPhenomenon | null) => {
        const currentList = normalizeToArray(selectedValues);
        if (currentList.length === 0) {
            emit('update:phenomenaDetails', {});
            return;
        }

        const details: DreamPhenomenaDetails = { ...props.phenomenaDetails };

        if (currentList.includes('flying') && !details.flying) {
            details.flying = { type: 'irrelevant', altitude: 'irrelevant' };
        }
        if (currentList.includes('falling') && !details.falling) {
            details.falling = { origin: 'irrelevant', outcome: 'irrelevant' };
        }
        if (currentList.includes('death') && !details.death) {
            details.death = { cause: 'irrelevant', aftermath: 'irrelevant' };
        }
        if (currentList.includes('paralysis') && !details.paralysis) {
            details.paralysis = { timing: 'irrelevant', hallucinations: [] };
        }
        if (currentList.includes('nested_dream') && !details.nestedDream) {
            details.nestedDream = { nestingLevels: 1 };
        }

        emit('update:phenomenaDetails', details);
    };
</script>
