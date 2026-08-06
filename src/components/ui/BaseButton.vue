<!-- src/components/common/BaseButton.vue -->
<template>
    <button
        :type="type"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :aria-expanded="ariaExpanded"
        :aria-controls="ariaControls"
        :aria-pressed="ariaPressed"
        :aria-disabled="disabled"
        :class="[
            'focus-visible:outline-accent flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2',
            variant === 'dream'
                ? 'dream-btn'
                : 'bg-bg-secondary text-text-primary hover:bg-bg-mute rounded-lg px-4 py-2 transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
        ]"
        v-bind="$attrs"
        @click="handleClick"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
    defineOptions({
        inheritAttrs: false,
    });

    interface Props {
        type?: 'button' | 'submit' | 'reset';
        variant?: 'dream' | 'default';
        disabled?: boolean;
        ariaLabel?: string;
        ariaExpanded?: boolean;
        ariaControls?: string;
        ariaPressed?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        type: 'button',
        variant: 'dream',
        disabled: false,
        ariaLabel: undefined,
        ariaExpanded: undefined,
        ariaControls: undefined,
        ariaPressed: undefined,
    });

    const emit = defineEmits<{
        (e: 'click', event: MouseEvent): void;
    }>();

    const handleClick = (event: MouseEvent) => {
        if (props.disabled) {
            event.preventDefault();
            return;
        }
        emit('click', event);
    };
</script>
