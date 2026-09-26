<!--
/**
 * @file DreamCard.vue
 * @description Accessible search result card component for displaying individual dream entries.
 * Features keyboard navigation (Enter/Space), screen reader support via aria-labels, and active state styling.
 *
 * @example
 * <DreamCard
 *     v-for="dream in filteredDreams"
 *     :key="dream.id"
 *     :dream="dream"
 *     :is-selected="dream.slug === currentSlug"
 *     @select="goToDetail"
 * />
 */
-->

<script setup lang="ts">
    import { computed } from 'vue';
    import type { Dream } from '@/types/Dream';
    import AppSmartTime from '@/components/ui/AppSmartTime.vue';

    interface Props {
        dream: Dream;
        isSelected?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        isSelected: false,
    });

    const emit = defineEmits<{
        (e: 'select', slug: string): void;
    }>();

    const formattedDate = computed(() => {
        const d = new Date(props.dream.date);
        if (isNaN(d.getTime())) return props.dream.date;
        return d.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    });

    const ariaLabel = computed(() => {
        const titlePart = props.dream.title ? `Сон: ${props.dream.title}. ` : 'Запись сна. ';
        const datePart = `Дата: ${formattedDate.value}.`;
        return `${titlePart}${datePart}`;
    });

    const handleClick = () => {
        if (props.dream.slug) {
            emit('select', props.dream.slug);
        }
    };
</script>

<template>
    <article
        tabindex="0"
        role="button"
        :aria-label="ariaLabel"
        :class="[
            'dream-card border-border-primary cursor-pointer rounded-lg border p-4 transition duration-200 outline-none focus-visible:ring-2',
            {
                'bg-ring': isSelected,
            },
        ]"
        @click="handleClick"
        @keydown.enter.space.prevent="handleClick"
    >
        <div class="flex items-start justify-between gap-4">
            <div class="space-y-4">
                <h3
                    v-if="dream.title"
                    class="text-text-secondary bg-bg-primary inline-block text-xs"
                >
                    {{ dream.title }}
                </h3>
                <p class="text-text-primary text-sm font-medium">
                    {{ dream.description || 'Без описания' }}
                </p>

                <AppSmartTime :date="dream.date" :date-format="'do MMMM yyyy'" @click.stop />
            </div>
        </div>
    </article>
</template>
