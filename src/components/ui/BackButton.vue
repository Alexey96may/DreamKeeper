<script setup lang="ts">
    import { ArrowLeft, Loader2 } from 'lucide-vue-next';

    interface Props {
        label?: string;
        ariaLabel?: string;
        disabled?: boolean;
        loading?: boolean;
        showIcon?: boolean;
        type?: 'button' | 'submit' | 'reset';
    }

    const props = withDefaults(defineProps<Props>(), {
        label: 'Назад',
        ariaLabel: 'Вернуться на предыдущую страницу',
        disabled: false,
        loading: false,
        showIcon: true,
        type: 'button',
    });

    const emit = defineEmits<{
        (e: 'click', event: MouseEvent): void;
    }>();

    const handleClick = (event: MouseEvent) => {
        if (props.disabled || props.loading) return;
        emit('click', event);
    };
</script>

<template>
    <button
        :type="type"
        :aria-label="ariaLabel"
        :aria-disabled="disabled || loading"
        :disabled="disabled || loading"
        class="text-text-mute hover:text-text-primary focus-visible:ring-accent group inline-flex items-center gap-2 rounded-md px-1 py-0.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleClick"
    >
        <slot>
            <Loader2 v-if="loading" class="h-4 w-4 animate-spin text-current" aria-hidden="true" />

            <ArrowLeft
                v-else-if="showIcon"
                class="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
            />

            <span>{{ label }}</span>
        </slot>
    </button>
</template>
