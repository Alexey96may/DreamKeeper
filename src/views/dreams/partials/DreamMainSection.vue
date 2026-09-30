<template>
    <div class="border-border-muted bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AppDatePicker
                :model-value="props.date"
                @update:model-value="onDateChange"
                label="Дата сна"
                :max-date="thisDay"
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

        <div class="flex w-full flex-col justify-between gap-3">
            <AppCheckbox
                :model-value="props.isAlien"
                @update:model-value="
                    (val) => {
                        if (typeof val === 'boolean') {
                            onIsAlienChange(val);
                        }
                    }
                "
                label="Чужой сон"
                accent-color="bg-dream-prophetic border-dream-prophetic"
                hint="Отметьте, если сон вам рассказали."
                :error-message="sleepStore.validationErrors.isAlien"
                @change="sleepStore.clearError('isAlien')"
            />

            <Transition name="expand">
                <AppTextInput
                    v-show="props.isAlien"
                    :model-value="props.authorName"
                    @update:model-value="onAuthorNameChange"
                    label="Имя автора сна"
                    placeholder="Например: Иван Иванов"
                    :error-message="sleepStore.validationErrors.authorName"
                    @input="sleepStore.clearError('authorName')"
                />
            </Transition>
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
    import { ref } from 'vue';
    import { useSleepStore } from '@/stores/modules/dream';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppDatePicker from '@/components/ui/AppDatePicker.vue';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import { TIME_OF_DAY_OPTIONS } from '@/constants/Dream';
    import AppTextarea from '@/components/ui/AppTextarea.vue';
    import AppCheckbox from '@/components/ui/AppCheckbox.vue';
    import type { TimeOfDay, Dream } from '@/types/Dream';

    const sleepStore = useSleepStore();

    interface Props {
        title?: Dream['title'];
        description?: Dream['description'];
        date?: Dream['date'];
        timeOfDay?: TimeOfDay;
        isAlien?: boolean;
        authorName?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        timeOfDay: 'night',
        title: '',
        description: '',
        date: '',
        isAlien: false,
        authorName: '',
    });

    const thisDay = ref(new Date());

    const emit = defineEmits<{
        'update:title': [value: Dream['title']];
        'update:description': [value: Dream['description']];
        'update:date': [value: Dream['date']];
        'update:timeOfDay': [value: TimeOfDay];
        'update:isAlien': [value: Dream['isAlien']];
        'update:authorName': [value: Dream['authorName']];
    }>();

    const onDateChange = (val: Dream['date'] | null) => emit('update:date', val ?? '');
    const onTimeOfDayChange = (val: TimeOfDay) => emit('update:timeOfDay', val);
    const onTitleChange = (val: Dream['title']) => emit('update:title', val);
    const onDescriptionChange = (val: Dream['description']) => emit('update:description', val);

    const onIsAlienChange = (val: Dream['isAlien']) => {
        emit('update:isAlien', val);
    };
    const onAuthorNameChange = (val: Dream['authorName']) => emit('update:authorName', val);
</script>

<style scoped>
    .expand-enter-active,
    .expand-leave-active {
        transition: all 0.3s ease;
        max-height: 500px;
        opacity: 1;
        overflow: hidden;
    }

    .expand-enter-from,
    .expand-leave-to {
        max-height: 0;
        opacity: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 0;
        margin-bottom: 0;
        border-width: 0;
    }
</style>
