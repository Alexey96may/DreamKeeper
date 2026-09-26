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
        class="bg-bg-secondary/40 border-border/40 relative rounded-lg border p-3.5"
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

        <header class="z-10 pt-4 sm:pt-0">
            <div class="absolute top-0 right-2 translate-y-[-50%]">
                <AppTag :aria-label="`Источник интерпретации: ${interpretation.source.title}`">
                    <span class="w-full grow align-middle text-xs">{{
                        interpretation.source.title
                    }}</span>
                </AppTag>
            </div>

            <h4 class="text-text-primary m-0 flex items-center gap-1.5 font-bold">
                <Link class="inline h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {{ getSymbolTitle }}
            </h4>
        </header>

        <p class="text-text-mute relative z-10 mt-1.5 leading-relaxed">
            {{ interpretation.meaning }}
        </p>
    </article>
</template>
