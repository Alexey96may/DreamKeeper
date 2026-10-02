<script setup lang="ts">
    import { computed } from 'vue';
    import { Link, Check } from 'lucide-vue-next';
    import type { DreamInterpretationRefWithSource } from '@/types/Dream';
    import { useSymbolStore } from '@/stores/modules/useSymbolStore';

    const props = defineProps<{
        interpretation: DreamInterpretationRefWithSource;
    }>();

    const symbolStore = useSymbolStore();

    const getSymbolTitle = computed(() => {
        if (!props.interpretation.tag) return '';
        return (
            symbolStore.getSymbolByTag(props.interpretation.tag)?.title || props.interpretation.tag
        );
    });
</script>

<template>
    <article
        class="group bg-bg-secondary/40 border-border-primary/60 hover:border-border-primary relative overflow-hidden rounded-md border p-4 transition-all duration-200 lg:rounded-lg"
        :class="{
            'from-success-bg/40 via-bg-secondary/40 to-success-bg/20 border-success-border/40 bg-gradient-to-br shadow-sm':
                interpretation.isAccurate,
        }"
        :aria-label="`Интерпретация по тегу: ${interpretation.tag}`"
    >
        <!-- Фоновый индикатор точности (водяной знак) -->
        <div
            v-if="interpretation.isAccurate"
            class="text-success-text pointer-events-none absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] opacity-5 transition-transform select-none group-hover:scale-105"
            role="status"
            aria-label="Статус: Подтверждено"
        >
            <component :is="Check" class="h-28 w-28 shrink-0 stroke-[2]" aria-hidden="true" />
        </div>

        <!-- Шапка карточки: Заголовок и Источник -->
        <header
            class="relative z-10 mb-4 flex flex-col flex-wrap items-center justify-between gap-4 sm:flex-row sm:items-start"
        >
            <h4 class="text-text-primary flex items-center gap-2 font-semibold tracking-tight">
                <span
                    class="bg-bg-tertiary text-text-mute border-border-primary/50 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border lg:rounded-lg"
                >
                    <Link class="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span class="text-base">{{ getSymbolTitle }}</span>
            </h4>

            <span
                v-if="interpretation.source?.title"
                class="bg-bg-tertiary/50 border-border-primary/50 text-text-tertiary max-w-[180px] shrink-0 truncate rounded-full border px-3 py-1 text-xs font-medium shadow-xs"
                :aria-label="`Источник интерпретации: ${interpretation.source.title}`"
            >
                {{ interpretation.source.title }}
            </span>
        </header>

        <!-- Основной текст интерпретации -->
        <p class="text-text-mute relative z-10 text-sm leading-relaxed">
            {{ interpretation.meaning }}
        </p>
    </article>
</template>
