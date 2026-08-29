<script setup lang="ts">
    import type { EnrichedRelatedDream } from '@/types/Dream';
    import { DREAM_RELATION_MAP } from '@/constants/Dream';

    defineProps<{
        relation: EnrichedRelatedDream;
    }>();
</script>

<template>
    <article
        class="bg-bg-secondary/40 border-border/40 flex flex-col justify-between gap-1 rounded-lg border p-2.5 text-xs sm:flex-row sm:items-center"
    >
        <div class="flex items-center gap-2">
            <span class="text-accent font-semibold">
                {{ DREAM_RELATION_MAP[relation?.relationType]?.label }}
            </span>

            <router-link
                v-if="relation?.slug"
                :to="`/dream/${relation?.slug}`"
                class="text-text-primary font-bold hover:underline"
            >
                <span aria-hidden="true">→ </span>Сон "{{ relation?.title }}"
            </router-link>
        </div>

        <span v-if="relation?.note" class="text-text-mute italic"> "{{ relation?.note }}" </span>
    </article>
</template>
