<template>
    <section class="mt-6" :aria-label="ariaLabel">
        <TransitionGroup
            tag="ul"
            role="list"
            name="stat-fade"
            class="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
            <template v-if="items.length > 0">
                <li
                    v-for="(item, index) in items"
                    :key="item.id || index"
                    :style="{ '--delay': `${index * 0.08}s` }"
                >
                    <StatCard :value="item.value" :label="item.label" />
                </li>
            </template>

            <slot v-else />
        </TransitionGroup>
    </section>
</template>

<script setup lang="ts">
    import StatCard from '@/components/cards/StatCard.vue';
    import type { MainStatItem } from '@/types/Stats';

    interface Props {
        items?: MainStatItem[];
        ariaLabel?: string;
    }

    withDefaults(defineProps<Props>(), {
        items: () => [],
        ariaLabel: 'Статистика снов и состояния',
    });
</script>

<style scoped>
    .stat-fade-enter-active {
        transition:
            opacity 0.4s ease,
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: var(--delay, 0s);
    }

    .stat-fade-leave-active {
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    .stat-fade-enter-from {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
    }

    .stat-fade-leave-to {
        opacity: 0;
        transform: scale(0.95);
    }

    .stat-fade-move {
        transition: transform 0.4s ease;
    }
</style>
