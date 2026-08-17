<template>
    <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <AppRange
                :model-value="props.quality"
                @update:model-value="onQualityChange"
                label="Качество сна"
                hint="Состояние после сна, уровень высыпания. "
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
                :error-message="sleepStore.validationErrors.quality"
                @input="sleepStore.clearError('quality')"
            />

            <AppRange
                :model-value="props.clarity"
                @update:model-value="onClarityChange"
                label="Ясность / Яркость"
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
                :error-message="sleepStore.validationErrors.clarity"
                @input="sleepStore.clearError('clarity')"
            />

            <AppRange
                :model-value="props.moodAfter"
                @update:model-value="onMoodAfterChange"
                label="Настроение после"
                :min="0"
                :max="10"
                :step="1"
                :value-formatter="computedDreamValueFormatter"
                :error-message="sleepStore.validationErrors.moodAfter"
                @input="sleepStore.clearError('moodAfter')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import AppRange from '@/components/ui/AppRange.vue';
    import { dreamValueFormatter } from '@/utils/formatters';
    import type { Dream } from '@/types/Dream';

    interface Props {
        quality?: Dream['quality'];
        clarity?: Dream['clarity'];
        moodAfter?: Dream['moodAfter'];
    }

    const props = withDefaults(defineProps<Props>(), {
        quality: 0,
        clarity: 0,
        moodAfter: 0,
    });

    const emit = defineEmits<{
        'update:quality': [value: Dream['quality']];
        'update:clarity': [value: Dream['clarity']];
        'update:moodAfter': [value: Dream['moodAfter']];
    }>();

    const computedDreamValueFormatter = computed(() => dreamValueFormatter);

    const sleepStore = useSleepStore();

    const onQualityChange = (val: Dream['quality']) => emit('update:quality', val);
    const onClarityChange = (val: Dream['clarity']) => emit('update:clarity', val);
    const onMoodAfterChange = (val: Dream['moodAfter']) => emit('update:moodAfter', val);
</script>
