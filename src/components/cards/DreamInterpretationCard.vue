<script setup lang="ts">
    import { computed } from 'vue';
    import { Link, Check } from 'lucide-vue-next';
    import { DreamInterpretationRefWithSource } from '@/types/Dream';
    import AppTag from '@/components/ui/AppTag.vue';
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
        class="bg-bg-secondary/40 border-border/40 relative overflow-hidden rounded-lg border p-3.5 text-xs"
        :class="{ 'bg-success-bg/50': interpretation.isAccurate }"
        :aria-label="`Интерпретация по тегу: ${interpretation.tag}`"
    >
        <div
            v-if="interpretation.isAccurate"
            class="text-success-text pointer-events-none absolute inset-0 flex items-center justify-end pr-2 opacity-10 select-none"
            role="status"
            aria-label="Статус: Подтверждено"
        >
            <component
                :is="Check"
                class="mx-auto h-full w-auto shrink-0 stroke-[1.5]"
                aria-hidden="true"
            />
        </div>

        <header class="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-text-primary m-0 flex items-center gap-1.5 text-sm font-bold">
                <Link class="inline h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{{ getSymbolTitle }}</span>
            </h3>

            <div class="flex items-center gap-2">
                <AppTag :aria-label="`Источник интерпретации: ${interpretation.source.title}`">
                    {{ interpretation.source.title }}
                </AppTag>
            </div>
        </header>

        <p class="text-text-mute relative z-10 mt-1.5 leading-relaxed">
            {{ interpretation.meaning }}
        </p>
    </article>
</template>
