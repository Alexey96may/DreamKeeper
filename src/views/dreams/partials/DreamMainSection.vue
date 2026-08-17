<template>
    <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AppDatePicker
                :model-value="props.date"
                @update:model-value="onDateChange"
                label="Дата сна"
                hint="Укажите дату, когда вам приснился сон"
                :error-message="sleepStore.validationErrors.date"
                @input="sleepStore.clearError('date')"
                required
            />

            <AppSelect
                id="form-time-of-day"
                :model-value="props.timeOfDay"
                @update:model-value="onTimeOfDayChange"
                label="Время суток"
                :options="TIME_OF_DAY_OPTIONS"
                placeholder="Выберите время суток"
                :error-message="sleepStore.validationErrors.timeOfDay"
                @clear-error="sleepStore.clearError('timeOfDay')"
            />
        </div>

        <AppTextInput
            :model-value="props.title"
            @update:model-value="onTitleChange"
            label="Название сна"
            placeholder="Например: Полет над древним городом..."
            :error-message="sleepStore.validationErrors.title"
            @input="sleepStore.clearError('title')"
            required
        />

        <AppTextarea
            :model-value="props.description"
            @update:model-value="onDescriptionChange"
            label="Подробное описание"
            placeholder="Запишите все подробности, пока они свежи в памяти..."
            :error-message="sleepStore.validationErrors.description"
            @input="sleepStore.clearError('description')"
            required
            :rows="5"
        />
    </div>
</template>

<script setup lang="ts">
    import { useSleepStore } from '@/stores/modules/dream';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppDatePicker from '@/components/ui/AppDatePicker.vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import { TIME_OF_DAY_OPTIONS } from '@/constants/Dream';
    import AppTextarea from '@/components/ui/AppTextarea.vue';
    import type { TimeOfDay, Dream } from '@/types/Dream';

    const sleepStore = useSleepStore();

    interface Props {
        title?: Dream['title'];
        description?: Dream['description'];
        date?: Dream['date'];
        timeOfDay?: TimeOfDay;
    }

    const props = withDefaults(defineProps<Props>(), {
        timeOfDay: 'night',
        title: '',
        description: '',
        date: '',
    });

    const emit = defineEmits<{
        'update:title': [value: Dream['title']];
        'update:description': [value: Dream['description']];
        'update:date': [value: Dream['date']];
        'update:timeOfDay': [value: TimeOfDay];
    }>();

    const onDateChange = (val: Dream['date'] | null) => emit('update:date', val ?? '');
    const onTimeOfDayChange = (val: TimeOfDay) => emit('update:timeOfDay', val);
    const onTitleChange = (val: Dream['title']) => emit('update:title', val);
    const onDescriptionChange = (val: Dream['description']) => emit('update:description', val);
</script>
