<script setup lang="ts">
    import { computed } from 'vue';
    import { Link, Check, X } from 'lucide-vue-next';
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
        class="bg-bg-secondary/40 border-border/40 rounded-lg border p-3.5 text-xs"
        :aria-label="`Интерпретация по тегу: ${interpretation.tag}`"
    >
        <header class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-text-primary m-0 flex items-center gap-1.5 text-sm font-bold">
                <Link class="inline h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{{ getSymbolTitle }}</span>
            </h3>

            <div class="flex items-center gap-2">
                <div
                    v-if="
                        interpretation.isAccurate !== undefined &&
                        interpretation.isAccurate !== null
                    "
                    class="flex items-center gap-1 text-[10px]"
                    role="status"
                    :aria-label="
                        interpretation.isAccurate ? 'Статус: Подтверждено' : 'Статус: Не совпало'
                    "
                >
                    <component
                        :is="interpretation.isAccurate ? Check : X"
                        class="h-3 w-3 shrink-0"
                        aria-hidden="true"
                    />
                    <span>{{ interpretation.isAccurate ? 'Подтверждено' : 'Не совпало' }}</span>
                </div>

                <AppTag :aria-label="`Источник интерпретации: ${interpretation.source.title}`">
                    {{ interpretation.source.title }}
                </AppTag>
            </div>
        </header>

        <p class="text-text-mute mt-1.5 leading-relaxed">
            {{ interpretation.meaning }}
        </p>
    </article>
</template>
