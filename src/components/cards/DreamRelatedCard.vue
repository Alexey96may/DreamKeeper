<script setup lang="ts">
    import type { EnrichedRelatedDream } from '@/types/Dream';
    import { DREAM_RELATION_MAP } from '@/constants/Dream';
    import { ArrowUpRight, Sparkles } from 'lucide-vue-next';

    defineProps<{
        relation: EnrichedRelatedDream;
    }>();
</script>

<template>
    <article
        class="group bg-bg-secondary/40 border-border-primary/60 hover:border-border-primary relative flex flex-col justify-between gap-2.5 rounded-md border p-4 text-xs transition-all duration-200 hover:shadow-sm lg:rounded-lg"
    >
        <!-- Верхняя строка: Тип связи и Ссылка на сон -->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <!-- Бейдж с типом связи -->
            <span
                class="bg-accent/10 text-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium tracking-wide"
            >
                <Sparkles class="h-3 w-3 shrink-0" aria-hidden="true" />
                {{ DREAM_RELATION_MAP[relation?.relationType]?.label }}
            </span>

            <!-- Ссылка на связанный сон -->
            <router-link
                v-if="relation?.slug"
                :to="`/dream/${relation?.slug}`"
                class="text-text-primary group-hover:text-accent inline-flex items-center gap-1 font-semibold transition-colors"
            >
                <span class="max-w-[200px] truncate sm:max-w-[260px]">
                    Сон «{{ relation?.title }}»
                </span>
                <ArrowUpRight
                    class="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                />
            </router-link>
        </div>

        <!-- Заметка / Краткое описание связи -->
        <div
            v-if="relation?.note"
            class="text-text-mute border-border-primary/40 bg-bg-tertiary/30 relative rounded-md border-l-2 py-1.5 pr-2.5 pl-3 leading-relaxed italic lg:rounded-lg"
        >
            «{{ relation?.note }}»
        </div>
    </article>
</template>
