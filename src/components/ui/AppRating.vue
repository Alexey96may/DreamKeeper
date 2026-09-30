<script setup lang="ts">
    withDefaults(
        defineProps<{
            label?: string;
            value: number | string;
            max?: number;
            isFiltering?: boolean;
            isInFilter?: boolean;
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
    <div class="flex flex-col items-center justify-between gap-2.5 md:gap-2">
        <span v-if="label" class="text-text-muted block text-[10px] sm:text-xs lg:text-sm">
            {{ label }}
        </span>

        <button
            type="button"
            class="focus-visible:ring-accent/50 inline-flex w-fit cursor-auto items-baseline gap-1 rounded-md border bg-transparent text-xs font-bold transition-all duration-200 hover:text-inherit focus-visible:ring-2 focus-visible:outline-none sm:text-sm md:rounded-lg lg:text-lg"
            :class="[
                isFiltering
                    ? 'border-accent bg-accent/20 text-accent hover:text-accent! cursor-pointer px-2 py-0.5 shadow-sm md:px-2.5 md:py-1'
                    : isInFilter
                      ? 'border-accent/60 bg-bg-secondary text-text-primary hover:border-accent hover:bg-accent/10 animate-pulse cursor-pointer px-2 py-0.5 shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.15)] md:px-2.5 md:py-1'
                      : 'text-text-primary hover:text-accent border-transparent px-1.5 py-0.5 md:px-2 md:py-1',
            ]"
            :aria-label="`Фильтровать по критерию «${label}» со значением ${value} из ${max}`"
            @click="$emit('filter')"
        >
            {{ value }}/{{ max }}
        </button>
    </div>
</template>
