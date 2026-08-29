<script setup lang="ts">
    withDefaults(
        defineProps<{
            label: string;
            value: number | string;
            max?: number;
        }>(),
        {
            max: 10,
        },
    );

    defineEmits<{
        (e: 'filter'): void;
    }>();
</script>

<template>
    <div class="flex flex-col items-center">
        <span class="text-text-mute block text-xs">{{ label }}</span>

        <button
            type="button"
            class="text-text-primary hover:text-accent focus-visible:text-accent inline-flex w-fit cursor-pointer items-baseline border-0 bg-transparent p-0 text-left text-lg font-bold transition-colors"
            :aria-label="`Фильтровать по критерию «${label}» со значением ${value} из ${max}`"
            @click="$emit('filter')"
        >
            <span>{{ value }}/{{ max }}</span>
        </button>
    </div>
</template>
