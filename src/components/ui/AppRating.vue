<script setup lang="ts">
    withDefaults(
        defineProps<{
            label?: string;
            value: number | string;
            max?: number;
            isFiltering?: boolean;
            isInFilter?: boolean; // Добавлено для подсказки режима фильтрации
        }>(),
        {
            max: 10,
            isFiltering: false,
            isInFilter: false,
        },
    );

    defineEmits<{
        (e: 'filter'): void;
    }>();
</script>

<template>
    <div class="flex flex-col items-center">
        <span v-if="label" class="block text-xs">{{ label }}</span>

        <button
            type="button"
            class="focus-visible:ring-accent/50 inline-flex w-fit cursor-pointer items-baseline rounded-lg border bg-transparent px-2 py-0.5 text-lg font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none"
            :class="[
                isFiltering
                    ? 'border-accent bg-accent/20 text-accent shadow-sm'
                    : isInFilter
                      ? 'border-accent/60 bg-bg-secondary text-text-primary hover:border-accent hover:bg-accent/10 animate-pulse shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.15)]'
                      : 'text-text-primary hover:text-accent border-transparent',
            ]"
            :aria-label="`Фильтровать по критерию «${label}» со значением ${value} из ${max}`"
            @click="$emit('filter')"
        >
            <span>{{ value }}/{{ max }}</span>
        </button>
    </div>
</template>
