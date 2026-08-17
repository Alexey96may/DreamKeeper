<template>
    <div class="border-border bg-bg-primary space-y-4 rounded-xl border p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AppSelect
                :model-value="props.visualStyle"
                @update:model-value="onVisualStyleChange"
                :options="VISUAL_STYLE_OPTIONS"
                label="Визуальный стиль"
                :error-message="sleepStore.validationErrors.visualStyle"
                @clear-error="sleepStore.clearError('visualStyle')"
            />

            <AppSelect
                :model-value="props.perspective"
                @update:model-value="onPerspectiveChange"
                :options="PERSPECTIVE_OPTIONS"
                hint="Перспектива"
                label="Точка зрения"
                :error-message="sleepStore.validationErrors.perspective"
                @clear-error="sleepStore.clearError('perspective')"
            />
        </div>

        <!-- Роли -->
        <AppTagSelect
            :model-value="props.roles"
            @update:model-value="onRolesChange"
            label="Ваши роли во сне"
            :options="PARTICIPANT_ROLE_OPTIONS"
            :error-message="sleepStore.validationErrors.roles"
            @clear-error="sleepStore.clearError('roles')"
        />

        <!-- Органы чувств -->
        <AppTagSelect
            :model-value="props.sensations"
            @update:model-value="onSensationsChange"
            label="Ощущения"
            hint="Органы чувств"
            :options="SENSORY_ASPECT_OPTIONS"
            :error-message="sleepStore.validationErrors.sensations"
            @clear-error="sleepStore.clearError('sensations')"
        />
    </div>
</template>

<script setup lang="ts">
    import { useSleepStore } from '@/stores/modules/dream';
    import AppSelect from '@/components/ui/AppSelect.vue';
    import AppTagSelect from '@/components/ui/AppTagSelect.vue';
    import { normalizeToArray } from '@/utils';
    import type {
        VisualStyle,
        Perspective,
        ParticipantRole,
        SensoryAspect,
    } from '@/types/Dream/dream.styles';
    import {
        VISUAL_STYLE_OPTIONS,
        PERSPECTIVE_OPTIONS,
        PARTICIPANT_ROLE_OPTIONS,
        SENSORY_ASPECT_OPTIONS,
    } from '@/constants/Dream';

    interface Props {
        visualStyle?: VisualStyle;
        perspective?: Perspective;
        roles?: ParticipantRole[];
        sensations?: SensoryAspect[];
    }

    const props = withDefaults(defineProps<Props>(), {
        visualStyle: 'color',
        perspective: 'irrelevant',
        roles: () => [],
        sensations: () => [],
    });

    const emit = defineEmits<{
        'update:visualStyle': [value: VisualStyle];
        'update:perspective': [value: Perspective];
        'update:roles': [value: ParticipantRole[]];
        'update:sensations': [value: SensoryAspect[]];
    }>();

    const sleepStore = useSleepStore();

    const onVisualStyleChange = (val: VisualStyle) => emit('update:visualStyle', val);
    const onPerspectiveChange = (val: Perspective) => emit('update:perspective', val);
    const onRolesChange = (val: ParticipantRole | ParticipantRole[] | null) =>
        emit('update:roles', normalizeToArray(val));
    const onSensationsChange = (val: SensoryAspect | SensoryAspect[] | null) =>
        emit('update:sensations', normalizeToArray(val));
</script>
