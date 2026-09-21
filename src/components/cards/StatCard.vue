<!-- src/components/stats/StatCard.vue -->
<template>
    <article
        class="dream-card flex flex-col items-center justify-center gap-1 p-4 text-center"
        role="region"
        :aria-labelledby="titleId"
    >
        <div
            class="text-accent text-xl font-bold tracking-tight md:text-2xl 2xl:text-4xl"
            aria-live="polite"
            aria-atomic="true"
        >
            <slot name="value">{{ value }}</slot>
        </div>

        <div :id="titleId" class="text-text-mute text-[12px] font-medium sm:text-sm">
            <slot name="label">{{ label }}</slot>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { useId } from 'vue';

    interface Props {
        value?: string | number;
        label?: string;
    }

    defineProps<Props>();

    const titleId = useId();
</script>
