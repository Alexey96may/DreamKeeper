<template>
    <div>
        <AppTextInput
            :model-value="props.preSleepContext"
            @update:model-value="onFieldChange('preSleepContext', $event)"
            label="Контекст перед сном"
            placeholder="Смотрел фильм, был уставшим, пил чай..."
            :error-message="sleepStore.validationErrors.preSleepContext"
            @input="sleepStore.clearError('preSleepContext')"
        />

        <AppTextInput
            :model-value="props.personalNotes"
            @update:model-value="onFieldChange('personalNotes', $event)"
            label="Личные заметки / Анализ"
            placeholder="Мысли о том, с чем сон может быть связан..."
            :error-message="sleepStore.validationErrors.personalNotes"
            @input="sleepStore.clearError('personalNotes')"
        />
    </div>
</template>

<script setup lang="ts">
    import { useSleepStore } from '@/stores/modules/dream';
    import AppTextInput from '@/components/ui/AppTextInput.vue';
    import type { Dream } from '@/types/Dream';

    type FieldKey = 'preSleepContext' | 'personalNotes';

    interface Props {
        preSleepContext?: Dream['preSleepContext'];
        personalNotes?: Dream['personalNotes'];
    }

    const props = withDefaults(defineProps<Props>(), {
        preSleepContext: '',
        personalNotes: '',
    });

    const emit = defineEmits<{
        'update:preSleepContext': [value: Dream['preSleepContext']];
        'update:personalNotes': [value: Dream['personalNotes']];
    }>();

    const sleepStore = useSleepStore();

    const onFieldChange = (field: FieldKey, val: string) => {
        switch (field) {
            case 'preSleepContext':
                emit('update:preSleepContext', val);
                break;
            case 'personalNotes':
                emit('update:personalNotes', val);
                break;
        }
    };
</script>
